import { Log } from "../../db";

export interface DataOption {
    value: string;
    description: string;
    getEntryAttribute: (entry: Log) => any;
}

// Original Baseline data options
export const originalDataOptions: DataOption[] = [
    {
        value: "timestamp",
        description: "Timestamp",
        getEntryAttribute: entry => entry.timestamp
    },
    {
        value: "journal",
        description: "Journal Text",
        getEntryAttribute: entry => entry.journal
    },
    {
        value: "mood",
        description: "Mood Score",
        getEntryAttribute: entry => entry.mood
    },
    {
        value: "average",
        description: "Below/At/Above Average",
        getEntryAttribute: entry => entry.average
    },
    {
        value: "zone",
        description: "Time Zone",
        getEntryAttribute: entry => entry.zone
    },
    {
        value: "song",
        description: "Attached Song",
        getEntryAttribute: entry => entry.song ?? null
    },
    {
        value: "files",
        description: "File Paths",
        getEntryAttribute: entry => entry.files
    },
];

// SociallyFed data options
export const sociallyFedDataOptions: DataOption[] = [
    // Virtue Alignment
    {
        value: "virtueAlignment.stoicism",
        description: "Stoicism Score (1-10)",
        getEntryAttribute: entry => entry.virtueAlignment?.stoicism ?? null
    },
    {
        value: "virtueAlignment.courage",
        description: "Courage Score (1-10)",
        getEntryAttribute: entry => entry.virtueAlignment?.courage ?? null
    },
    {
        value: "virtueAlignment.wisdom",
        description: "Wisdom Score (1-10)",
        getEntryAttribute: entry => entry.virtueAlignment?.wisdom ?? null
    },
    {
        value: "virtueAlignment.justice",
        description: "Justice Score (1-10)",
        getEntryAttribute: entry => entry.virtueAlignment?.justice ?? null
    },
    {
        value: "virtueAlignment.temperance",
        description: "Temperance Score (1-10)",
        getEntryAttribute: entry => entry.virtueAlignment?.temperance ?? null
    },
    {
        value: "virtueAlignment.dailyContext",
        description: "Daily Context",
        getEntryAttribute: entry => entry.virtueAlignment?.dailyContext ?? null
    },
    {
        value: "virtueAlignment.focusVirtue",
        description: "Focus Virtue",
        getEntryAttribute: entry => entry.virtueAlignment?.focusVirtue ?? null
    },

    // Media Consumption (SociallyFed Pyramid)
    {
        value: "mediaConsumption.servedContent",
        description: "Served Content (Level 1, minutes)",
        getEntryAttribute: entry => entry.mediaConsumption?.servedContent ?? null
    },
    {
        value: "mediaConsumption.casualBrowsing",
        description: "Casual Browsing (Level 2, minutes)",
        getEntryAttribute: entry => entry.mediaConsumption?.casualBrowsing ?? null
    },
    {
        value: "mediaConsumption.intentionalContent",
        description: "Intentional Content (Level 3, minutes)",
        getEntryAttribute: entry => entry.mediaConsumption?.intentionalContent ?? null
    },
    {
        value: "mediaConsumption.creation",
        description: "Content Creation (Level 4, minutes)",
        getEntryAttribute: entry => entry.mediaConsumption?.creation ?? null
    },
    {
        value: "mediaConsumption.deepFocus",
        description: "Deep Focus (Level 5, minutes)",
        getEntryAttribute: entry => entry.mediaConsumption?.deepFocus ?? null
    },
    {
        value: "mediaConsumption.timeOfDay",
        description: "Time of Day",
        getEntryAttribute: entry => entry.mediaConsumption?.timeOfDay ?? null
    },
    {
        value: "mediaConsumption.triggers",
        description: "Media Triggers",
        getEntryAttribute: entry => entry.mediaConsumption?.triggers?.join(", ") ?? null
    },
    {
        value: "mediaConsumption.moodBefore",
        description: "Mood Before Media (1-10)",
        getEntryAttribute: entry => entry.mediaConsumption?.moodBefore ?? null
    },
    {
        value: "mediaConsumption.moodAfter",
        description: "Mood After Media (1-10)",
        getEntryAttribute: entry => entry.mediaConsumption?.moodAfter ?? null
    },

    // Patterns (Enhanced)
    {
        value: "patterns.emotionalTriggers",
        description: "Emotional Triggers",
        getEntryAttribute: entry => entry.patterns?.emotionalTriggers?.join(", ") ?? null
    },
    {
        value: "patterns.copingStrategies",
        description: "Coping Strategies",
        getEntryAttribute: entry => entry.patterns?.copingStrategies?.join(", ") ?? null
    },
    {
        value: "patterns.socialContexts",
        description: "Social Contexts",
        getEntryAttribute: entry => entry.patterns?.socialContexts?.join(", ") ?? null
    },
    {
        value: "patterns.aiGenerated",
        description: "AI Generated Patterns",
        getEntryAttribute: entry => entry.patterns?.aiGenerated?.join(", ") ?? null
    },
    {
        value: "patterns.userNoted",
        description: "User Noted Patterns",
        getEntryAttribute: entry => entry.patterns?.userNoted?.join(", ") ?? null
    },
    {
        value: "patterns.confidence",
        description: "Pattern Confidence (0-1)",
        getEntryAttribute: entry => entry.patterns?.confidence ?? null
    },
    {
        value: "patterns.category",
        description: "Pattern Category",
        getEntryAttribute: entry => entry.patterns?.category ?? null
    },
    {
        value: "patterns.actionable",
        description: "Pattern Actionable",
        getEntryAttribute: entry => entry.patterns?.actionable ?? null
    },
    {
        value: "patterns.correlations",
        description: "Pattern Correlations",
        getEntryAttribute: entry => entry.patterns?.correlations?.map(c => `${c.pattern}:${c.strength}`).join(", ") ?? null
    },

    // Cybernetics
    {
        value: "cybernetics.goalProgress",
        description: "Goal Progress (%)",
        getEntryAttribute: entry => entry.cybernetics?.goalProgress ?? null
    },
    {
        value: "cybernetics.feedbackLoops",
        description: "Feedback Loops",
        getEntryAttribute: entry => entry.cybernetics?.feedbackLoops?.join(", ") ?? null
    },
    {
        value: "cybernetics.adjustments",
        description: "Adjustments Made",
        getEntryAttribute: entry => entry.cybernetics?.adjustments?.join(", ") ?? null
    },

    // Prompt Metadata
    {
        value: "promptMetadata.category",
        description: "Prompt Category",
        getEntryAttribute: entry => entry.promptMetadata?.category ?? null
    },
    {
        value: "promptMetadata.subcategory",
        description: "Prompt Subcategory",
        getEntryAttribute: entry => entry.promptMetadata?.subcategory ?? null
    },
    {
        value: "promptMetadata.aiGenerated",
        description: "AI Generated",
        getEntryAttribute: entry => entry.promptMetadata?.aiGenerated ?? null
    },
    {
        value: "promptMetadata.userConfirmed",
        description: "User Confirmed",
        getEntryAttribute: entry => entry.promptMetadata?.userConfirmed ?? null
    }
];

// Organize export options by category
export const exportCategories = {
    baseline: {
        title: "Core Journal Data",
        options: originalDataOptions
    },
    virtues: {
        title: "Virtue Alignment (Enhanced)",
        options: sociallyFedDataOptions.filter(opt => opt.value.startsWith("virtueAlignment"))
    },
    media: {
        title: "Media Consumption (SociallyFed Pyramid)",
        options: sociallyFedDataOptions.filter(opt => opt.value.startsWith("mediaConsumption"))
    },
    patterns: {
        title: "Pattern Recognition (Enhanced)",
        options: sociallyFedDataOptions.filter(opt => opt.value.startsWith("patterns"))
    },
    cybernetics: {
        title: "Cybernetic Feedback",
        options: sociallyFedDataOptions.filter(opt => opt.value.startsWith("cybernetics"))
    },
    prompts: {
        title: "Prompt Metadata",
        options: sociallyFedDataOptions.filter(opt => opt.value.startsWith("promptMetadata"))
    }
};

// Combine with existing options
export const dataOptionsObjArr: DataOption[] = [
    ...originalDataOptions, // existing Baseline options
    ...sociallyFedDataOptions
];