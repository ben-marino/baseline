import { useState, useEffect, useCallback } from 'react';
import { llmService, LLMInsights } from '../services/LLMService';
import { Log } from '../db';
import ldb from '../db';

interface UseLLMInsightsOptions {
    autoInitialize?: boolean;
    dataType?: 'journal' | 'patterns' | 'virtues' | 'media';
    maxLogs?: number;
}

interface LLMInsightsState {
    insights: LLMInsights | null;
    loading: boolean;
    error: string | null;
    connected: boolean;
    lastUpdated: number | null;
}

export const useLLMInsights = (options: UseLLMInsightsOptions = {}) => {
    const {
        autoInitialize = true,
        dataType = 'journal',
        maxLogs = 100
    } = options;

    const [state, setState] = useState<LLMInsightsState>({
        insights: null,
        loading: false,
        error: null,
        connected: false,
        lastUpdated: null
    });

    // Initialize LLM service
    useEffect(() => {
        if (autoInitialize) {
            initializeLLM();
        }

        return () => {
            // Cleanup on unmount
            llmService.destroy();
        };
    }, [autoInitialize]);

    const initializeLLM = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const connected = await llmService.initialize();
            setState(prev => ({ 
                ...prev, 
                connected, 
                loading: false,
                error: connected ? null : 'LLM server not available'
            }));
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to initialize LLM service'
            }));
        }
    }, []);

    // Get insights for specific data type
    const getInsights = useCallback(async (customDataType?: 'journal' | 'patterns' | 'virtues' | 'media') => {
        const targetDataType = customDataType || dataType;
        
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Get logs from database
            const logs = await ldb.logs.toArray();
            
            // Sort by timestamp (newest first) and limit
            const recentLogs = logs
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, maxLogs);

            // Get insights from LLM service
            const insights = await llmService.analyzeJournalData(recentLogs, targetDataType);
            
            setState(prev => ({
                ...prev,
                insights,
                loading: false,
                lastUpdated: Date.now(),
                error: insights ? null : 'Failed to get insights'
            }));

            return insights;
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to get insights'
            }));
            return null;
        }
    }, [dataType, maxLogs]);

    // Refresh insights
    const refreshInsights = useCallback(() => {
        return getInsights();
    }, [getInsights]);

    // Get connection status
    const getConnectionStatus = useCallback(() => {
        return llmService.getConnectionStatus();
    }, []);

    // Manual health check
    const checkHealth = useCallback(async () => {
        const healthy = await llmService.checkHealth();
        setState(prev => ({ ...prev, connected: healthy }));
        return healthy;
    }, []);

    // Get insights for all data types
    const getAllInsights = useCallback(async () => {
        const dataTypes: Array<'journal' | 'patterns' | 'virtues' | 'media'> = ['journal', 'patterns', 'virtues', 'media'];
        const results: Record<string, LLMInsights | null> = {};

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            for (const type of dataTypes) {
                const insights = await getInsights(type);
                results[type] = insights;
            }

            setState(prev => ({
                ...prev,
                loading: false,
                lastUpdated: Date.now()
            }));

            return results;
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to get all insights'
            }));
            return null;
        }
    }, [getInsights]);

    // Auto-refresh insights when new data is available
    useEffect(() => {
        if (!state.connected) return;

        const checkForNewData = async () => {
            const logs = await ldb.logs.toArray();
            const latestLog = logs.sort((a, b) => b.timestamp - a.timestamp)[0];
            
            if (latestLog && (!state.lastUpdated || latestLog.timestamp > state.lastUpdated)) {
                // New data available, refresh insights
                await getInsights();
            }
        };

        // Check every 5 minutes for new data
        const interval = setInterval(checkForNewData, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, [state.connected, state.lastUpdated, getInsights]);

    return {
        // State
        insights: state.insights,
        loading: state.loading,
        error: state.error,
        connected: state.connected,
        lastUpdated: state.lastUpdated,

        // Actions
        getInsights,
        refreshInsights,
        getAllInsights,
        getConnectionStatus,
        checkHealth,
        initializeLLM,

        // Utilities
        hasInsights: !!state.insights,
        isReady: state.connected && !state.loading
    };
};

// Specialized hooks for different data types
export const useJournalInsights = () => useLLMInsights({ dataType: 'journal' });
export const usePatternInsights = () => useLLMInsights({ dataType: 'patterns' });
export const useVirtueInsights = () => useLLMInsights({ dataType: 'virtues' });
export const useMediaInsights = () => useLLMInsights({ dataType: 'media' }); 