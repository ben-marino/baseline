import Dexie from "dexie";

// SociallyFed specific interfaces for better type safety
export interface VirtueAlignment {
    stoicism: number;    // 1-10 scale
    courage: number;     // 1-10 scale
    wisdom: number;      // 1-10 scale
    justice: number;     // 1-10 scale
    temperance: number;  // 1-10 scale
    // Add context for better insights
    dailyContext?: string; // What made this day challenging/successful?
    focusVirtue?: keyof Omit<VirtueAlignment, 'dailyContext' | 'focusVirtue'>; // Which virtue was the focus today?
}

export interface MediaConsumption {
    servedContent: number;      // Level 1 (minutes)
    casualBrowsing: number;     // Level 2 (minutes)  
    intentionalContent: number; // Level 3 (minutes)
    creation: number;           // Level 4 (minutes)
    deepFocus: number;         // Level 5 (minutes)
    // Add these for better analysis
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    triggers?: string[];      // What prompted media consumption?
    moodBefore?: number;      // Mood before media session (1-10)
    moodAfter?: number;       // Mood after media session (1-10)
}

export interface Patterns {
    emotionalTriggers: string[];
    copingStrategies: string[];
    socialContexts: string[];
    // Enhanced pattern recognition
    aiGenerated: string[];
    userNoted: string[];
    confidence: number;       // 0-1
    // Add these for richer insights
    category: 'emotional' | 'behavioral' | 'media' | 'virtue' | 'temporal';
    actionable?: boolean;     // Can user act on this pattern?
    correlations?: {         // What patterns appear together?
        pattern: string;
        strength: number;      // correlation coefficient
    }[];
}

export interface Cybernetics {
    goalProgress: number;    // 0-100%
    feedbackLoops: string[];
    adjustments: string[];
}

export interface PromptMetadata {
    category: 'stoic' | 'cybernetic' | 'media-awareness' | 'baseline';
    subcategory?: string;
    aiGenerated?: boolean;
    userConfirmed?: boolean;
}

// User preferences for SociallyFed features
export interface SociallyFedPreferences {
    enableVirtueTracking: boolean;
    enableMediaTracking: boolean;
    enablePatternTracking: boolean;
    enableCybernetics: boolean;
    enableAIAnalysis: boolean;
    dataRetentionDays?: number; // How long to keep detailed data
    privacyLevel: 'minimal' | 'standard' | 'comprehensive';
}

export interface Log {
    timestamp: number;
    year: number,
    month: number,
    day: number,
    time: string,
    zone: string,
    mood: number,
    journal?: string,
    ejournal?: string,
    average: string,
    files?: string[],
    efiles?: string
    song?: string;
    audio?: string;
    addFlag?: string;
    timeLogged?: number;
    
    // SociallyFed extensions - all optional for backward compatibility
    virtueAlignment?: VirtueAlignment;
    mediaConsumption?: MediaConsumption;
    patterns?: Patterns;
    cybernetics?: Cybernetics;
    promptMetadata?: PromptMetadata;
}

// Validation functions for SociallyFed data
export const validateVirtueAlignment = (data: any): VirtueAlignment | null => {
    if (!data || typeof data !== 'object') return null;
    
    const virtues = ['stoicism', 'courage', 'wisdom', 'justice', 'temperance'];
    const result: Partial<VirtueAlignment> = {};
    
    for (const virtue of virtues) {
        const value = Number(data[virtue]);
        if (typeof value !== 'number' || isNaN(value) || value < 1 || value > 10 || value !== parseInt(value.toString())) {
            return null;
        }
        result[virtue as keyof VirtueAlignment] = value;
    }
    
    // Validate optional context fields
    if (data.dailyContext && (typeof data.dailyContext !== 'string' || data.dailyContext.length > 1000)) {
        return null;
    }
    if (data.dailyContext) {
        result.dailyContext = data.dailyContext;
    }
    
    if (data.focusVirtue && !virtues.includes(data.focusVirtue)) {
        return null;
    }
    if (data.focusVirtue) {
        result.focusVirtue = data.focusVirtue;
    }
    
    return result as VirtueAlignment;
};

export const validateMediaConsumption = (data: any): MediaConsumption | null => {
    if (!data || typeof data !== 'object') return null;
    
    const categories = ['servedContent', 'casualBrowsing', 'intentionalContent', 'creation', 'deepFocus'];
    const result: Partial<MediaConsumption> = {};
    
    for (const category of categories) {
        const value = Number(data[category]);
        if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 1440 || value !== parseInt(value.toString())) {
            return null;
        }
        result[category as keyof MediaConsumption] = value;
    }
    
    // Validate optional temporal and mood fields
    const validTimeOfDay = ['morning', 'afternoon', 'evening', 'night'];
    if (data.timeOfDay && !validTimeOfDay.includes(data.timeOfDay)) {
        return null;
    }
    if (data.timeOfDay) {
        result.timeOfDay = data.timeOfDay;
    }
    
    if (data.triggers && (!Array.isArray(data.triggers) || data.triggers.some((t: any) => typeof t !== 'string' || t.length > 200))) {
        return null;
    }
    if (data.triggers) {
        result.triggers = data.triggers;
    }
    
    if (data.moodBefore !== undefined) {
        const moodBefore = Number(data.moodBefore);
        if (typeof moodBefore !== 'number' || isNaN(moodBefore) || moodBefore < 1 || moodBefore > 10) {
            return null;
        }
        result.moodBefore = moodBefore;
    }
    
    if (data.moodAfter !== undefined) {
        const moodAfter = Number(data.moodAfter);
        if (typeof moodAfter !== 'number' || isNaN(moodAfter) || moodAfter < 1 || moodAfter > 10) {
            return null;
        }
        result.moodAfter = moodAfter;
    }
    
    return result as MediaConsumption;
};

export const validatePatterns = (data: any): Patterns | null => {
    if (!data || typeof data !== 'object') return null;
    
    const categories = ['emotionalTriggers', 'copingStrategies', 'socialContexts', 'aiGenerated', 'userNoted'];
    const result: Partial<Patterns> = {};
    
    for (const category of categories) {
        const value = data[category];
        if (!Array.isArray(value)) return null;
        
        // Validate each string in the array
        for (const item of value) {
            if (typeof item !== 'string' || item.length > 500) return null;
        }
        
        result[category as keyof Patterns] = value;
    }
    
    // Validate confidence
    const confidence = Number(data.confidence);
    if (typeof confidence !== 'number' || isNaN(confidence) || confidence < 0 || confidence > 1) {
        return null;
    }
    result.confidence = confidence;
    
    // Validate category
    const validCategories = ['emotional', 'behavioral', 'media', 'virtue', 'temporal'];
    if (!validCategories.includes(data.category)) {
        return null;
    }
    result.category = data.category;
    
    // Validate optional fields
    if (data.actionable !== undefined && typeof data.actionable !== 'boolean') {
        return null;
    }
    if (data.actionable !== undefined) {
        result.actionable = data.actionable;
    }
    
    if (data.correlations && (!Array.isArray(data.correlations) || data.correlations.some((c: any) => 
        typeof c !== 'object' || typeof c.pattern !== 'string' || typeof c.strength !== 'number' || 
        c.strength < -1 || c.strength > 1 || c.pattern.length > 500))) {
        return null;
    }
    if (data.correlations) {
        result.correlations = data.correlations;
    }
    
    return result as Patterns;
};

export const validateCybernetics = (data: any): Cybernetics | null => {
    if (!data || typeof data !== 'object') return null;
    
    // Validate goalProgress
    const goalProgress = Number(data.goalProgress);
    if (typeof goalProgress !== 'number' || isNaN(goalProgress) || goalProgress < 0 || goalProgress > 100) {
        return null;
    }
    
    // Validate arrays
    const feedbackLoops = data.feedbackLoops;
    const adjustments = data.adjustments;
    
    if (!Array.isArray(feedbackLoops) || !Array.isArray(adjustments)) return null;
    
    // Validate each string in the arrays
    for (const item of [...feedbackLoops, ...adjustments]) {
        if (typeof item !== 'string' || item.length > 500) return null;
    }
    
    return {
        goalProgress,
        feedbackLoops,
        adjustments
    };
};

export const validatePromptMetadata = (data: any): PromptMetadata | null => {
    if (!data || typeof data !== 'object') return null;
    
    const validCategories = ['stoic', 'cybernetic', 'media-awareness', 'baseline'];
    if (!validCategories.includes(data.category)) return null;
    
    const result: PromptMetadata = {
        category: data.category
    };
    
    if (data.subcategory && typeof data.subcategory === 'string' && data.subcategory.length <= 100) {
        result.subcategory = data.subcategory;
    }
    
    if (typeof data.aiGenerated === 'boolean') {
        result.aiGenerated = data.aiGenerated;
    }
    
    if (typeof data.userConfirmed === 'boolean') {
        result.userConfirmed = data.userConfirmed;
    }
    
    return result;
};

export const validateSociallyFedPreferences = (data: any): SociallyFedPreferences | null => {
    if (!data || typeof data !== 'object') return null;
    
    const requiredBooleans = ['enableVirtueTracking', 'enableMediaTracking', 'enablePatternTracking', 'enableCybernetics', 'enableAIAnalysis'];
    for (const field of requiredBooleans) {
        if (typeof data[field] !== 'boolean') return null;
    }
    
    const validPrivacyLevels = ['minimal', 'standard', 'comprehensive'];
    if (!validPrivacyLevels.includes(data.privacyLevel)) return null;
    
    const result: SociallyFedPreferences = {
        enableVirtueTracking: data.enableVirtueTracking,
        enableMediaTracking: data.enableMediaTracking,
        enablePatternTracking: data.enablePatternTracking,
        enableCybernetics: data.enableCybernetics,
        enableAIAnalysis: data.enableAIAnalysis,
        privacyLevel: data.privacyLevel
    };
    
    if (data.dataRetentionDays !== undefined) {
        const retention = Number(data.dataRetentionDays);
        if (typeof retention !== 'number' || isNaN(retention) || retention < 1 || retention > 3650) {
            return null;
        }
        result.dataRetentionDays = retention;
    }
    
    return result;
};

// Default values for SociallyFed data
export const getDefaultVirtueAlignment = (): VirtueAlignment => ({
    stoicism: 5,
    courage: 5,
    wisdom: 5,
    justice: 5,
    temperance: 5
});

export const getDefaultMediaConsumption = (): MediaConsumption => ({
    servedContent: 0,
    casualBrowsing: 0,
    intentionalContent: 0,
    creation: 0,
    deepFocus: 0
});

export const getDefaultPatterns = (): Patterns => ({
    emotionalTriggers: [],
    copingStrategies: [],
    socialContexts: [],
    aiGenerated: [],
    userNoted: [],
    confidence: 0.5,
    category: 'emotional'
});

export const getDefaultCybernetics = (): Cybernetics => ({
    goalProgress: 0,
    feedbackLoops: [],
    adjustments: []
});

export const getDefaultPromptMetadata = (): PromptMetadata => ({
    category: 'baseline'
});

export const getDefaultSociallyFedPreferences = (): SociallyFedPreferences => ({
    enableVirtueTracking: true,
    enableMediaTracking: true,
    enablePatternTracking: true,
    enableCybernetics: true,
    enableAIAnalysis: true,
    privacyLevel: 'standard'
});

interface DB extends Dexie {
    logs: Dexie.Table<Log, number>;
    sociallyFedPreferences: Dexie.Table<SociallyFedPreferences, string>;
}

const ldb = new Dexie("ldb");
ldb.version(1).stores({
    logs: `&timestamp, year, month, day, time, zone, mood, average`,
    sociallyFedPreferences: `&id`,
});

ldb.on("close", () => console.log("db was forcibly closed"));

export default ldb as DB;