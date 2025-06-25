import { encrypt, decrypt, checkKeys } from "../helpers";
import { Log } from "../db";
import { toast } from "../helpers";

// LLM Server Configuration
interface LLMConfig {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    healthCheckInterval: number;
}

// LLM Request/Response Types
interface LLMRequest {
    encryptedData: string;
    requestId: string;
    timestamp: number;
    dataType: 'journal' | 'patterns' | 'virtues' | 'media';
    version: string;
}

interface LLMResponse {
    requestId: string;
    success: boolean;
    encryptedInsights: string;
    error?: string;
    processingTime?: number;
    timestamp: number;
}

interface LLMInsights {
    patterns: string[];
    recommendations: string[];
    correlations: Array<{
        factor1: string;
        factor2: string;
        strength: number;
        confidence: number;
    }>;
    trends: Array<{
        metric: string;
        direction: 'increasing' | 'decreasing' | 'stable';
        confidence: number;
        timeframe: string;
    }>;
    actionableInsights: Array<{
        category: string;
        insight: string;
        action: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}

// Health Check Response
interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy' | 'offline';
    version: string;
    capabilities: string[];
    load: number;
    uptime: number;
}

class LLMService {
    private config: LLMConfig;
    private isConnected: boolean = false;
    private serverUrl: string | null = null;
    private healthCheckTimer: NodeJS.Timeout | null = null;
    private requestQueue: Array<{ request: LLMRequest; resolve: Function; reject: Function }> = [];
    private processingQueue: boolean = false;

    constructor() {
        this.config = {
            baseUrl: 'http://localhost:3001', // Default LLM server port
            timeout: 30000, // 30 seconds
            retryAttempts: 3,
            healthCheckInterval: 60000 // 1 minute
        };
    }

    /**
     * Initialize the LLM service
     */
    async initialize(): Promise<boolean> {
        try {
            // Discover local LLM server
            const discovered = await this.discoverServer();
            if (!discovered) {
                console.log('LLM server not found, service will remain offline');
                return false;
            }

            // Perform health check
            const healthy = await this.performHealthCheck();
            if (!healthy) {
                console.log('LLM server health check failed');
                return false;
            }

            // Start periodic health checks
            this.startHealthChecks();
            
            this.isConnected = true;
            console.log('LLM service initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize LLM service:', error);
            return false;
        }
    }

    /**
     * Discover local LLM server by trying common ports
     */
    private async discoverServer(): Promise<boolean> {
        const commonPorts = [3001, 3000, 8000, 8080, 5000];
        
        for (const port of commonPorts) {
            const url = `http://localhost:${port}`;
            try {
                const response = await fetch(`${url}/health`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'SociallyFed-Baseline/1.0'
                    },
                    signal: AbortSignal.timeout(5000) // 5 second timeout for discovery
                });

                if (response.ok) {
                    this.serverUrl = url;
                    console.log(`LLM server discovered at ${url}`);
                    return true;
                }
            } catch (error) {
                // Continue to next port
                continue;
            }
        }

        return false;
    }

    /**
     * Perform health check on the LLM server
     */
    private async performHealthCheck(): Promise<boolean> {
        if (!this.serverUrl) return false;

        try {
            const response = await fetch(`${this.serverUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SociallyFed-Baseline/1.0'
                },
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            const healthData: HealthCheckResponse = await response.json();
            
            if (healthData.status !== 'healthy') {
                throw new Error(`Server unhealthy: ${healthData.status}`);
            }

            console.log('LLM server health check passed');
            return true;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    /**
     * Start periodic health checks
     */
    private startHealthChecks(): void {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }

        this.healthCheckTimer = setInterval(async () => {
            const healthy = await this.performHealthCheck();
            if (!healthy && this.isConnected) {
                this.isConnected = false;
                console.log('LLM server went offline');
                toast('LLM server connection lost', 'top');
            } else if (healthy && !this.isConnected) {
                this.isConnected = true;
                console.log('LLM server reconnected');
                toast('LLM server reconnected', 'top');
                this.processQueue();
            }
        }, this.config.healthCheckInterval);
    }

    /**
     * Encrypt data before sending to LLM server
     */
    private async encryptData(data: any): Promise<string> {
        const keys = checkKeys();
        if (!keys || typeof keys !== 'object') {
            throw new Error('Encryption keys not available');
        }

        const jsonData = JSON.stringify(data);
        return encrypt(jsonData, keys);
    }

    /**
     * Decrypt data received from LLM server
     */
    private async decryptData(encryptedData: string): Promise<any> {
        const keys = checkKeys();
        if (!keys || typeof keys !== 'object') {
            throw new Error('Encryption keys not available');
        }

        const decrypted = decrypt(encryptedData, keys);
        return JSON.parse(decrypted);
    }

    /**
     * Send journal data to LLM server for analysis
     */
    async analyzeJournalData(logs: Log[], dataType: 'journal' | 'patterns' | 'virtues' | 'media'): Promise<LLMInsights | null> {
        if (!this.isConnected) {
            // Queue the request for later processing
            return new Promise((resolve, reject) => {
                this.requestQueue.push({
                    request: {
                        encryptedData: '',
                        requestId: this.generateRequestId(),
                        timestamp: Date.now(),
                        dataType,
                        version: '1.0'
                    },
                    resolve,
                    reject
                });
            });
        }

        try {
            // Prepare and encrypt the data
            const dataToSend = this.prepareDataForAnalysis(logs, dataType);
            const encryptedData = await this.encryptData(dataToSend);

            const request: LLMRequest = {
                encryptedData,
                requestId: this.generateRequestId(),
                timestamp: Date.now(),
                dataType,
                version: '1.0'
            };

            const response = await this.sendRequest(request);
            
            if (!response.success) {
                throw new Error(response.error || 'Unknown error from LLM server');
            }

            // Decrypt and return insights
            const insights = await this.decryptData(response.encryptedInsights);
            return insights as LLMInsights;

        } catch (error) {
            console.error('Failed to analyze journal data:', error);
            toast('Failed to get AI insights', 'top');
            return null;
        }
    }

    /**
     * Prepare data for LLM analysis
     */
    private prepareDataForAnalysis(logs: Log[], dataType: string): any {
        switch (dataType) {
            case 'journal':
                return logs.map(log => ({
                    timestamp: log.timestamp,
                    mood: log.mood,
                    journal: log.journal,
                    average: log.average,
                    year: log.year,
                    month: log.month,
                    day: log.day
                }));

            case 'patterns':
                return logs
                    .filter(log => log.patterns)
                    .map(log => ({
                        timestamp: log.timestamp,
                        patterns: log.patterns,
                        mood: log.mood
                    }));

            case 'virtues':
                return logs
                    .filter(log => log.virtueAlignment)
                    .map(log => ({
                        timestamp: log.timestamp,
                        virtueAlignment: log.virtueAlignment,
                        mood: log.mood
                    }));

            case 'media':
                return logs
                    .filter(log => log.mediaConsumption)
                    .map(log => ({
                        timestamp: log.timestamp,
                        mediaConsumption: log.mediaConsumption,
                        mood: log.mood
                    }));

            default:
                return logs;
        }
    }

    /**
     * Send request to LLM server
     */
    private async sendRequest(request: LLMRequest): Promise<LLMResponse> {
        if (!this.serverUrl) {
            throw new Error('LLM server not available');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(`${this.serverUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SociallyFed-Baseline/1.0',
                    'X-Request-ID': request.requestId
                },
                body: JSON.stringify(request),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result: LLMResponse = await response.json();
            return result;

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Process queued requests when server comes back online
     */
    private async processQueue(): Promise<void> {
        if (this.processingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.processingQueue = true;

        while (this.requestQueue.length > 0) {
            const { resolve, reject } = this.requestQueue.shift()!;
            
            try {
                // Note: We need to re-encrypt the data since we only stored the request metadata
                // In a real implementation, you might want to store the actual data
                resolve(null); // For now, just resolve with null
            } catch (error) {
                reject(error);
            }
        }

        this.processingQueue = false;
    }

    /**
     * Generate unique request ID
     */
    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get connection status
     */
    getConnectionStatus(): { connected: boolean; serverUrl: string | null } {
        return {
            connected: this.isConnected,
            serverUrl: this.serverUrl
        };
    }

    /**
     * Manually trigger health check
     */
    async checkHealth(): Promise<boolean> {
        return await this.performHealthCheck();
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
            this.healthCheckTimer = null;
        }
        this.requestQueue = [];
        this.isConnected = false;
    }
}

// Export singleton instance
export const llmService = new LLMService();
export type { LLMInsights, LLMConfig, HealthCheckResponse }; 