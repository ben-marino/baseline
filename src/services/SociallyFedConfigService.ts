import { encrypt, decrypt, parseSettings, setSettings } from "../helpers";
import { SociallyFedPreferences, getDefaultSociallyFedPreferences } from "../db";
import { toast } from "../helpers";

// SociallyFed Configuration Interfaces
export interface LLMServerConfig {
    endpoint: string;
    port: number;
    protocol: 'http' | 'https';
    timeout: number;
    retryAttempts: number;
    healthCheckInterval: number;
    authenticationToken?: string;
    encryptionKey?: string;
}

export interface PrivacyConfig {
    dataSharingLevel: 'minimal' | 'standard' | 'comprehensive';
    allowAnonymousAnalytics: boolean;
    allowPatternSharing: boolean;
    allowVirtueSharing: boolean;
    allowMediaSharing: boolean;
    dataRetentionDays: number;
    autoDeleteOldData: boolean;
}

export interface FeatureToggles {
    enableVirtueTracking: boolean;
    enableMediaTracking: boolean;
    enablePatternTracking: boolean;
    enableCybernetics: boolean;
    enableAIAnalysis: boolean;
    enableLocalLLM: boolean;
    enableInsights: boolean;
    enableTrendAnalysis: boolean;
    enableCorrelationDetection: boolean;
}

export interface AnalysisFrequency {
    mode: 'daily' | 'weekly' | 'manual' | 'custom';
    customInterval?: number; // in hours
    preferredTime?: string; // HH:MM format
    timezone?: string;
}

export interface VirtueDefinition {
    name: string;
    description: string;
    weight: number; // 1-10 scale
    customPrompt?: string;
    enabled: boolean;
}

// New interfaces for philosophical frameworks
export interface MediaConsumptionConfig {
    // Social media platform tracking
    platforms: {
        [platform: string]: {
            enabled: boolean;
            dailyLimit: number; // minutes
            weeklyLimit: number; // minutes
            notifications: boolean;
            blockAfterLimit: boolean;
        };
    };
    
    // SociallyFed Pyramid settings
    pyramidLevels: {
        servedContent: {
            enabled: boolean;
            dailyLimit: number; // minutes
            weeklyLimit: number; // minutes
            preferredTime: string; // HH:MM
            autoBlock: boolean;
        };
        casualBrowsing: {
            enabled: boolean;
            dailyLimit: number; // minutes
            weeklyLimit: number; // minutes
            preferredTime: string; // HH:MM
            autoBlock: boolean;
        };
        intentionalContent: {
            enabled: boolean;
            dailyLimit: number; // minutes
            weeklyLimit: number; // minutes
            preferredTime: string; // HH:MM
            autoBlock: boolean;
        };
        creation: {
            enabled: boolean;
            dailyGoal: number; // minutes
            weeklyGoal: number; // minutes
            preferredTime: string; // HH:MM
            reminders: boolean;
        };
        deepFocus: {
            enabled: boolean;
            dailyGoal: number; // minutes
            weeklyGoal: number; // minutes
            preferredTime: string; // HH:MM
            reminders: boolean;
        };
    };
    
    // General media settings
    trackingMode: 'passive' | 'active' | 'intervention';
    moodCorrelation: boolean;
    productivityImpact: boolean;
    socialComparisonTracking: boolean;
}

export interface StoicVirtueConfig {
    virtues: {
        courage: {
            enabled: boolean;
            weight: number; // 1-10
            dailyPrompt: string;
            weeklyReflection: boolean;
            challengeTracking: boolean;
        };
        wisdom: {
            enabled: boolean;
            weight: number; // 1-10
            dailyPrompt: string;
            weeklyReflection: boolean;
            learningTracking: boolean;
        };
        justice: {
            enabled: boolean;
            weight: number; // 1-10
            dailyPrompt: string;
            weeklyReflection: boolean;
            relationshipTracking: boolean;
        };
        temperance: {
            enabled: boolean;
            weight: number; // 1-10
            dailyPrompt: string;
            weeklyReflection: boolean;
            moderationTracking: boolean;
        };
    };
    
    // Stoic practice settings
    morningReflection: boolean;
    eveningReview: boolean;
    obstacleJournaling: boolean;
    gratitudePractice: boolean;
    mementoMori: boolean;
    amorFati: boolean;
}

export interface CyberneticConfig {
    // Feedback loop settings
    feedbackLoops: {
        daily: {
            enabled: boolean;
            time: string; // HH:MM
            questions: string[];
            moodTracking: boolean;
            goalProgress: boolean;
            habitTracking: boolean;
        };
        weekly: {
            enabled: boolean;
            day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
            time: string; // HH:MM
            questions: string[];
            patternAnalysis: boolean;
            goalReview: boolean;
            habitReview: boolean;
        };
        monthly: {
            enabled: boolean;
            day: number; // 1-31
            time: string; // HH:MM
            questions: string[];
            trendAnalysis: boolean;
            goalAdjustment: boolean;
            systemOptimization: boolean;
        };
    };
    
    // Goal types and tracking
    goalTypes: {
        habit: {
            enabled: boolean;
            trackingMethod: 'streak' | 'frequency' | 'duration';
            reminderFrequency: 'daily' | 'weekly' | 'custom';
        };
        outcome: {
            enabled: boolean;
            trackingMethod: 'progress' | 'milestone' | 'completion';
            reminderFrequency: 'daily' | 'weekly' | 'custom';
        };
        process: {
            enabled: boolean;
            trackingMethod: 'time' | 'quality' | 'consistency';
            reminderFrequency: 'daily' | 'weekly' | 'custom';
        };
    };
    
    // System optimization
    autoAdjustment: boolean;
    learningRate: number; // 0.1-1.0
    adaptationThreshold: number; // 0.1-1.0
    feedbackSensitivity: 'low' | 'medium' | 'high';
}

export interface SociallyFedConfig {
    llmServer: LLMServerConfig;
    privacy: PrivacyConfig;
    features: FeatureToggles;
    analysis: AnalysisFrequency;
    virtues: VirtueDefinition[];
    preferences: SociallyFedPreferences;
    mediaConsumption: MediaConsumptionConfig;
    stoicVirtues: StoicVirtueConfig;
    cybernetics: CyberneticConfig;
    lastUpdated: number;
    version: string;
}

// Default configurations
const DEFAULT_LLM_CONFIG: LLMServerConfig = {
    endpoint: 'localhost',
    port: 3001,
    protocol: 'http',
    timeout: 30000,
    retryAttempts: 3,
    healthCheckInterval: 60000
};

const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
    dataSharingLevel: 'standard',
    allowAnonymousAnalytics: true,
    allowPatternSharing: true,
    allowVirtueSharing: true,
    allowMediaSharing: true,
    dataRetentionDays: 365,
    autoDeleteOldData: false
};

const DEFAULT_FEATURE_TOGGLES: FeatureToggles = {
    enableVirtueTracking: true,
    enableMediaTracking: true,
    enablePatternTracking: true,
    enableCybernetics: true,
    enableAIAnalysis: true,
    enableLocalLLM: true,
    enableInsights: true,
    enableTrendAnalysis: true,
    enableCorrelationDetection: true
};

const DEFAULT_ANALYSIS_FREQUENCY: AnalysisFrequency = {
    mode: 'daily',
    preferredTime: '20:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

const DEFAULT_VIRTUES: VirtueDefinition[] = [
    {
        name: 'stoicism',
        description: 'Maintaining inner peace and resilience in the face of challenges',
        weight: 8,
        enabled: true
    },
    {
        name: 'courage',
        description: 'Facing fears and taking action despite uncertainty',
        weight: 7,
        enabled: true
    },
    {
        name: 'wisdom',
        description: 'Making thoughtful decisions and learning from experiences',
        weight: 8,
        enabled: true
    },
    {
        name: 'justice',
        description: 'Treating others fairly and acting with integrity',
        weight: 7,
        enabled: true
    },
    {
        name: 'temperance',
        description: 'Practicing self-control and moderation',
        weight: 6,
        enabled: true
    }
];

const DEFAULT_CONFIG: SociallyFedConfig = {
    llmServer: DEFAULT_LLM_CONFIG,
    privacy: DEFAULT_PRIVACY_CONFIG,
    features: DEFAULT_FEATURE_TOGGLES,
    analysis: DEFAULT_ANALYSIS_FREQUENCY,
    virtues: DEFAULT_VIRTUES,
    preferences: getDefaultSociallyFedPreferences(),
    mediaConsumption: {
        platforms: {},
        pyramidLevels: {
            servedContent: {
                enabled: true,
                dailyLimit: 60,
                weeklyLimit: 420,
                preferredTime: '20:00',
                autoBlock: true
            },
            casualBrowsing: {
                enabled: true,
                dailyLimit: 30,
                weeklyLimit: 210,
                preferredTime: '20:00',
                autoBlock: true
            },
            intentionalContent: {
                enabled: true,
                dailyLimit: 30,
                weeklyLimit: 210,
                preferredTime: '20:00',
                autoBlock: true
            },
            creation: {
                enabled: true,
                dailyGoal: 30,
                weeklyGoal: 210,
                preferredTime: '20:00',
                reminders: true
            },
            deepFocus: {
                enabled: true,
                dailyGoal: 30,
                weeklyGoal: 210,
                preferredTime: '20:00',
                reminders: true
            }
        },
        trackingMode: 'passive',
        moodCorrelation: true,
        productivityImpact: true,
        socialComparisonTracking: true
    },
    stoicVirtues: {
        virtues: {
            courage: {
                enabled: true,
                weight: 8,
                dailyPrompt: "What was a moment today when you faced a fear or uncertainty? How did you handle it?",
                weeklyReflection: true,
                challengeTracking: true
            },
            wisdom: {
                enabled: true,
                weight: 8,
                dailyPrompt: "What was a moment today when you made a thoughtful decision or learned something new?",
                weeklyReflection: true,
                learningTracking: true
            },
            justice: {
                enabled: true,
                weight: 7,
                dailyPrompt: "What was a moment today when you treated others fairly or acted with integrity?",
                weeklyReflection: true,
                relationshipTracking: true
            },
            temperance: {
                enabled: true,
                weight: 6,
                dailyPrompt: "What was a moment today when you practiced self-control or moderation?",
                weeklyReflection: true,
                moderationTracking: true
            }
        },
        morningReflection: true,
        eveningReview: true,
        obstacleJournaling: true,
        gratitudePractice: true,
        mementoMori: true,
        amorFati: true
    },
    cybernetics: {
        feedbackLoops: {
            daily: {
                enabled: true,
                time: '08:00',
                questions: ["How did you feel today?", "What was a positive experience today?", "What was a negative experience today?"],
                moodTracking: true,
                goalProgress: true,
                habitTracking: true
            },
            weekly: {
                enabled: true,
                day: 'monday',
                time: '18:00',
                questions: ["How did you feel this week?", "What was a positive experience this week?", "What was a negative experience this week?"],
                patternAnalysis: true,
                goalReview: true,
                habitReview: true
            },
            monthly: {
                enabled: true,
                day: 15,
                time: '12:00',
                questions: ["How did you feel this month?", "What was a positive experience this month?", "What was a negative experience this month?"],
                trendAnalysis: true,
                goalAdjustment: true,
                systemOptimization: true
            }
        },
        goalTypes: {
            habit: {
                enabled: true,
                trackingMethod: 'streak',
                reminderFrequency: 'daily'
            },
            outcome: {
                enabled: true,
                trackingMethod: 'progress',
                reminderFrequency: 'daily'
            },
            process: {
                enabled: true,
                trackingMethod: 'time',
                reminderFrequency: 'daily'
            }
        },
        autoAdjustment: true,
        learningRate: 0.5,
        adaptationThreshold: 0.7,
        feedbackSensitivity: 'medium'
    },
    lastUpdated: Date.now(),
    version: '1.0.0'
};

// Validate that the server URL is local-only (localhost or local network)
function validateServerUrl(protocol: string, endpoint: string): boolean {
    // Only allow localhost, 127.0.0.1, or private IPv4 ranges
    // (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
    // Optionally allow .local domains for mDNS
    const allowedPatterns = [
        /^localhost$/i,
        /^127\.0\.0\.1$/,
        /^10(\.\d{1,3}){3}$/,
        /^192\.168(\.\d{1,3}){2}$/,
        /^172\.(1[6-9]|2\d|3[0-1])(\.\d{1,3}){2}$/,
        /^([a-zA-Z0-9-]+)\.local$/
    ];
    if (protocol !== 'http' && protocol !== 'https') return false;
    return allowedPatterns.some((re) => re.test(endpoint));
}

class SociallyFedConfigService {
    private config: SociallyFedConfig;
    private configKey = 'sociallyfed_config';
    private encryptedConfigKey = 'sociallyfed_config_encrypted';
    private isInitialized = false;

    constructor() {
        this.config = { ...DEFAULT_CONFIG };
    }

    /**
     * Initialize the configuration service
     */
    async initialize(): Promise<void> {
        try {
            await this.loadConfiguration();
            this.isInitialized = true;
            console.log('SociallyFed configuration service initialized');
        } catch (error) {
            console.error('Failed to initialize SociallyFed configuration:', error);
            // Use default configuration if loading fails
            this.config = { ...DEFAULT_CONFIG };
            this.isInitialized = true;
        }
    }

    /**
     * Load configuration from secure storage
     */
    private async loadConfiguration(): Promise<void> {
        try {
            // Try to load encrypted configuration first
            const encryptedConfig = localStorage.getItem(this.encryptedConfigKey);
            if (encryptedConfig) {
                const passphrase = sessionStorage.getItem('pwd');
                if (passphrase) {
                    const decrypted = decrypt(encryptedConfig, passphrase);
                    if (decrypted) {
                        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(decrypted) };
                        return;
                    }
                }
            }

            // Fall back to unencrypted configuration
            const configData = localStorage.getItem(this.configKey);
            if (configData) {
                const parsed = JSON.parse(configData);
                this.config = { ...DEFAULT_CONFIG, ...parsed };
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw error;
        }
    }

    /**
     * Save configuration to secure storage
     */
    private async saveConfiguration(): Promise<void> {
        try {
            this.config.lastUpdated = Date.now();
            
            // Save encrypted version if passphrase is available
            const passphrase = sessionStorage.getItem('pwd');
            if (passphrase) {
                const encrypted = encrypt(JSON.stringify(this.config), passphrase);
                localStorage.setItem(this.encryptedConfigKey, encrypted);
                // Remove unencrypted version for security
                localStorage.removeItem(this.configKey);
            } else {
                // Save unencrypted version as fallback
                localStorage.setItem(this.configKey, JSON.stringify(this.config));
                localStorage.removeItem(this.encryptedConfigKey);
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            throw error;
        }
    }

    /**
     * Get the current configuration
     */
    getConfig(): SociallyFedConfig {
        if (!this.isInitialized) {
            console.warn('Configuration service not initialized, returning default config');
        }
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    async updateConfig(updates: Partial<SociallyFedConfig>): Promise<void> {
        this.config = { ...this.config, ...updates };
        await this.saveConfiguration();
    }

    /**
     * Update LLM server configuration
     */
    async updateLLMConfig(config: Partial<LLMServerConfig>): Promise<void> {
        this.config.llmServer = { ...this.config.llmServer, ...config };
        await this.saveConfiguration();
    }

    /**
     * Update privacy configuration
     */
    async updatePrivacyConfig(config: Partial<PrivacyConfig>): Promise<void> {
        this.config.privacy = { ...this.config.privacy, ...config };
        await this.saveConfiguration();
    }

    /**
     * Update feature toggles
     */
    async updateFeatureToggles(toggles: Partial<FeatureToggles>): Promise<void> {
        this.config.features = { ...this.config.features, ...toggles };
        await this.saveConfiguration();
    }

    /**
     * Update analysis frequency
     */
    async updateAnalysisFrequency(frequency: Partial<AnalysisFrequency>): Promise<void> {
        this.config.analysis = { ...this.config.analysis, ...frequency };
        await this.saveConfiguration();
    }

    /**
     * Update virtue definitions
     */
    async updateVirtues(virtues: VirtueDefinition[]): Promise<void> {
        this.config.virtues = virtues;
        await this.saveConfiguration();
    }

    /**
     * Update a single virtue
     */
    async updateVirtue(name: string, updates: Partial<VirtueDefinition>): Promise<void> {
        const index = this.config.virtues.findIndex(v => v.name === name);
        if (index !== -1) {
            this.config.virtues[index] = { ...this.config.virtues[index], ...updates };
            await this.saveConfiguration();
        }
    }

    /**
     * Add a custom virtue
     */
    async addCustomVirtue(virtue: Omit<VirtueDefinition, 'name'> & { name: string }): Promise<void> {
        // Check if virtue already exists
        if (this.config.virtues.some(v => v.name === virtue.name)) {
            throw new Error(`Virtue "${virtue.name}" already exists`);
        }
        
        this.config.virtues.push(virtue);
        await this.saveConfiguration();
    }

    /**
     * Remove a virtue
     */
    async removeVirtue(name: string): Promise<void> {
        this.config.virtues = this.config.virtues.filter(v => v.name !== name);
        await this.saveConfiguration();
    }

    /**
     * Update preferences
     */
    async updatePreferences(preferences: Partial<SociallyFedPreferences>): Promise<void> {
        this.config.preferences = { ...this.config.preferences, ...preferences };
        await this.saveConfiguration();
    }

    /**
     * Update media consumption configuration
     */
    async updateMediaConsumption(config: Partial<MediaConsumptionConfig>): Promise<void> {
        this.config.mediaConsumption = { ...this.config.mediaConsumption, ...config };
        await this.saveConfiguration();
    }

    /**
     * Update stoic virtue configuration
     */
    async updateStoicVirtues(config: Partial<StoicVirtueConfig>): Promise<void> {
        this.config.stoicVirtues = { ...this.config.stoicVirtues, ...config };
        await this.saveConfiguration();
    }

    /**
     * Update cybernetic configuration
     */
    async updateCybernetics(config: Partial<CyberneticConfig>): Promise<void> {
        this.config.cybernetics = { ...this.config.cybernetics, ...config };
        await this.saveConfiguration();
    }

    /**
     * Add a social media platform
     */
    async addSocialMediaPlatform(platform: string, config: {
        enabled: boolean;
        dailyLimit: number;
        weeklyLimit: number;
        notifications: boolean;
        blockAfterLimit: boolean;
    }): Promise<void> {
        this.config.mediaConsumption.platforms[platform] = config;
        await this.saveConfiguration();
    }

    /**
     * Remove a social media platform
     */
    async removeSocialMediaPlatform(platform: string): Promise<void> {
        delete this.config.mediaConsumption.platforms[platform];
        await this.saveConfiguration();
    }

    /**
     * Update a specific stoic virtue
     */
    async updateStoicVirtue(virtueName: 'courage' | 'wisdom' | 'justice' | 'temperance', updates: any): Promise<void> {
        this.config.stoicVirtues.virtues[virtueName] = { ...this.config.stoicVirtues.virtues[virtueName], ...updates };
        await this.saveConfiguration();
    }

    /**
     * Update feedback loop configuration
     */
    async updateFeedbackLoop(loopType: 'daily' | 'weekly' | 'monthly', updates: any): Promise<void> {
        this.config.cybernetics.feedbackLoops[loopType] = { ...this.config.cybernetics.feedbackLoops[loopType], ...updates };
        await this.saveConfiguration();
    }

    /**
     * Get media consumption configuration
     */
    getMediaConsumptionConfig(): MediaConsumptionConfig {
        return this.config.mediaConsumption;
    }

    /**
     * Get stoic virtue configuration
     */
    getStoicVirtueConfig(): StoicVirtueConfig {
        return this.config.stoicVirtues;
    }

    /**
     * Get cybernetic configuration
     */
    getCyberneticConfig(): CyberneticConfig {
        return this.config.cybernetics;
    }

    /**
     * Check if a social media platform is enabled
     */
    isSocialMediaPlatformEnabled(platform: string): boolean {
        return this.config.mediaConsumption.platforms[platform]?.enabled || false;
    }

    /**
     * Get daily limit for a social media platform
     */
    getSocialMediaDailyLimit(platform: string): number {
        return this.config.mediaConsumption.platforms[platform]?.dailyLimit || 0;
    }

    /**
     * Check if a stoic virtue is enabled
     */
    isStoicVirtueEnabled(virtueName: 'courage' | 'wisdom' | 'justice' | 'temperance'): boolean {
        return this.config.stoicVirtues.virtues[virtueName]?.enabled || false;
    }

    /**
     * Get stoic virtue weight
     */
    getStoicVirtueWeight(virtueName: 'courage' | 'wisdom' | 'justice' | 'temperance'): number {
        return this.config.stoicVirtues.virtues[virtueName]?.weight || 5;
    }

    /**
     * Check if a feedback loop is enabled
     */
    isFeedbackLoopEnabled(loopType: 'daily' | 'weekly' | 'monthly'): boolean {
        return this.config.cybernetics.feedbackLoops[loopType]?.enabled || false;
    }

    /**
     * Get enabled stoic virtues
     */
    getEnabledStoicVirtues(): Array<'courage' | 'wisdom' | 'justice' | 'temperance'> {
        return Object.keys(this.config.stoicVirtues.virtues).filter(
            virtue => this.config.stoicVirtues.virtues[virtue as keyof StoicVirtueConfig['virtues']]?.enabled
        ) as Array<'courage' | 'wisdom' | 'justice' | 'temperance'>;
    }

    /**
     * Get enabled feedback loops
     */
    getEnabledFeedbackLoops(): Array<'daily' | 'weekly' | 'monthly'> {
        return Object.keys(this.config.cybernetics.feedbackLoops).filter(
            loop => this.config.cybernetics.feedbackLoops[loop as keyof CyberneticConfig['feedbackLoops']]?.enabled
        ) as Array<'daily' | 'weekly' | 'monthly'>;
    }

    /**
     * Get pyramid level configuration
     */
    getPyramidLevelConfig(level: 'servedContent' | 'casualBrowsing' | 'intentionalContent' | 'creation' | 'deepFocus'): any {
        return this.config.mediaConsumption.pyramidLevels[level];
    }

    /**
     * Update pyramid level configuration
     */
    async updatePyramidLevel(level: 'servedContent' | 'casualBrowsing' | 'intentionalContent' | 'creation' | 'deepFocus', updates: any): Promise<void> {
        this.config.mediaConsumption.pyramidLevels[level] = { ...this.config.mediaConsumption.pyramidLevels[level], ...updates };
        await this.saveConfiguration();
    }

    /**
     * Reset configuration to defaults
     */
    async resetToDefaults(): Promise<void> {
        this.config = { ...DEFAULT_CONFIG };
        await this.saveConfiguration();
        toast('Configuration reset to defaults');
    }

    /**
     * Validate LLM server configuration
     */
    async validateLLMConfig(config: LLMServerConfig): Promise<{ valid: boolean; error?: string }> {
        try {
            // Basic validation
            if (!config.endpoint || config.endpoint.trim() === '') {
                return { valid: false, error: 'Server endpoint is required' };
            }

            // Sanitize endpoint (remove protocol, port, path if user pasted a full URL)
            let endpoint = config.endpoint.trim();
            endpoint = endpoint.replace(/^(https?:\/\/)/, '').replace(/[:/].*$/, '');

            if (!validateServerUrl(config.protocol, endpoint)) {
                return { valid: false, error: 'Only localhost or local network addresses are allowed for security.' };
            }

            if (config.port < 1 || config.port > 65535) {
                return { valid: false, error: 'Port must be between 1 and 65535' };
            }

            if (config.timeout < 1000 || config.timeout > 300000) {
                return { valid: false, error: 'Timeout must be between 1 and 300 seconds' };
            }

            // Test connection
            const url = `${config.protocol}://${endpoint}:${config.port}/health`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SociallyFed-Baseline/1.0'
                },
                signal: AbortSignal.timeout(config.timeout)
            });

            if (!response.ok) {
                return { valid: false, error: `Server responded with status ${response.status}` };
            }

            return { valid: true };
        } catch (error) {
            return { valid: false, error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    }

    /**
     * Export configuration (for backup)
     */
    exportConfig(): string {
        return JSON.stringify(this.config, null, 2);
    }

    /**
     * Import configuration (from backup)
     */
    async importConfig(configJson: string): Promise<{ success: boolean; error?: string }> {
        try {
            const imported = JSON.parse(configJson);
            
            // Validate the imported configuration
            if (!imported.version || !imported.llmServer || !imported.privacy || !imported.features) {
                return { success: false, error: 'Invalid configuration format' };
            }

            // Merge with defaults to ensure all required fields are present
            this.config = { ...DEFAULT_CONFIG, ...imported };
            await this.saveConfiguration();
            
            return { success: true };
        } catch (error) {
            return { success: false, error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    }

    /**
     * Get configuration for specific feature
     */
    isFeatureEnabled(feature: keyof FeatureToggles): boolean {
        return this.config.features[feature];
    }

    /**
     * Get LLM server URL
     */
    getLLMUrl(): string {
        const { protocol, endpoint, port } = this.config.llmServer;
        return `${protocol}://${endpoint}:${port}`;
    }

    /**
     * Get privacy level
     */
    getPrivacyLevel(): string {
        return this.config.privacy.dataSharingLevel;
    }

    /**
     * Check if data sharing is allowed for specific type
     */
    isDataSharingAllowed(type: 'patterns' | 'virtues' | 'media' | 'analytics'): boolean {
        switch (type) {
            case 'patterns':
                return this.config.privacy.allowPatternSharing;
            case 'virtues':
                return this.config.privacy.allowVirtueSharing;
            case 'media':
                return this.config.privacy.allowMediaSharing;
            case 'analytics':
                return this.config.privacy.allowAnonymousAnalytics;
            default:
                return false;
        }
    }

    /**
     * Get enabled virtues
     */
    getEnabledVirtues(): VirtueDefinition[] {
        return this.config.virtues.filter(v => v.enabled);
    }

    /**
     * Get virtue by name
     */
    getVirtue(name: string): VirtueDefinition | undefined {
        return this.config.virtues.find(v => v.name === name);
    }

    /**
     * Get analysis schedule
     */
    getAnalysisSchedule(): AnalysisFrequency {
        return this.config.analysis;
    }

    /**
     * Check if it's time for analysis
     */
    shouldRunAnalysis(): boolean {
        const { mode, customInterval } = this.config.analysis;
        const lastRun = this.config.lastUpdated;
        const now = Date.now();

        switch (mode) {
            case 'daily':
                return now - lastRun >= 24 * 60 * 60 * 1000;
            case 'weekly':
                return now - lastRun >= 7 * 24 * 60 * 60 * 1000;
            case 'manual':
                return false;
            case 'custom':
                return customInterval ? now - lastRun >= customInterval * 60 * 60 * 1000 : false;
            default:
                return false;
        }
    }
}

// Export singleton instance
export const sociallyFedConfig = new SociallyFedConfigService(); 