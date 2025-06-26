import { IonAccordion, IonAccordionGroup, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonRange, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTextarea, IonToggle } from "@ionic/react";
import { add, remove, settings, shield, analytics, time, heart, server, phonePortrait, school, refresh } from "ionicons/icons";
import { useEffect, useState } from "react";
import { sociallyFedConfig, LLMServerConfig, PrivacyConfig, FeatureToggles, AnalysisFrequency, VirtueDefinition, MediaConsumptionConfig, StoicVirtueConfig, CyberneticConfig } from "../../services/SociallyFedConfigService";
import { toast } from "../../helpers";
import "./SociallyFedSettings.css";

const SociallyFedSettingsEnhanced = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState(sociallyFedConfig.getConfig());
    const [llmValidation, setLlmValidation] = useState<{ valid: boolean; error?: string } | null>(null);

    useEffect(() => {
        initializeConfig();
    }, []);

    const initializeConfig = async () => {
        try {
            await sociallyFedConfig.initialize();
            setConfig(sociallyFedConfig.getConfig());
        } catch (error) {
            console.error('Failed to initialize SociallyFed config:', error);
            toast('Failed to load SociallyFed configuration');
        } finally {
            setLoading(false);
        }
    };

    const updateConfig = async (updates: Partial<typeof config>) => {
        try {
            setSaving(true);
            await sociallyFedConfig.updateConfig(updates);
            setConfig(sociallyFedConfig.getConfig());
            toast('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save configuration:', error);
            toast('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const validateLLMConfig = async () => {
        try {
            setLlmValidation({ valid: false, error: 'Validating...' });
            const result = await sociallyFedConfig.validateLLMConfig(config.llmServer);
            setLlmValidation(result);
            if (result.valid) {
                toast('LLM server connection successful');
            } else {
                toast(`LLM server validation failed: ${result.error}`);
            }
        } catch (error) {
            setLlmValidation({ valid: false, error: 'Validation failed' });
            toast('Failed to validate LLM server');
        }
    };

    const resetToDefaults = async () => {
        try {
            setSaving(true);
            await sociallyFedConfig.resetToDefaults();
            setConfig(sociallyFedConfig.getConfig());
            toast('Configuration reset to defaults');
        } catch (error) {
            console.error('Failed to reset configuration:', error);
            toast('Failed to reset configuration');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <IonSpinner name="crescent" />
                <p>Loading SociallyFed settings...</p>
            </div>
        );
    }

    return (
        <IonContent>
            <div className="sociallyfed-settings">
                <div className="settings-header">
                    <IonIcon icon={settings} className="header-icon" />
                    <h2>SociallyFed Configuration</h2>
                    <p>Configure your local LLM server and philosophical frameworks</p>
                </div>

                <IonAccordionGroup>
                    {/* LLM Server Configuration */}
                    <IonAccordion value="llm">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={server} slot="start" />
                            <IonLabel>LLM Server Settings</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <LLMServerSettings 
                                config={config.llmServer}
                                validation={llmValidation}
                                onUpdate={(llmConfig) => updateConfig({ llmServer: llmConfig })}
                                onValidate={validateLLMConfig}
                            />
                        </div>
                    </IonAccordion>

                    {/* Privacy Settings */}
                    <IonAccordion value="privacy">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={shield} slot="start" />
                            <IonLabel>Privacy & Data Sharing</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <PrivacySettings 
                                config={config.privacy}
                                onUpdate={(privacyConfig) => updateConfig({ privacy: privacyConfig })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Media Consumption Settings */}
                    <IonAccordion value="media">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={phonePortrait} slot="start" />
                            <IonLabel>Media Consumption & SociallyFed Pyramid</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <MediaConsumptionSettings 
                                config={config.mediaConsumption}
                                onUpdate={(mediaConfig) => updateConfig({ mediaConsumption: mediaConfig })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Stoic Virtues Settings */}
                    <IonAccordion value="stoic">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={school} slot="start" />
                            <IonLabel>Stoic Virtues & Practices</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <StoicVirtuesSettings 
                                config={config.stoicVirtues}
                                onUpdate={(stoicConfig) => updateConfig({ stoicVirtues: stoicConfig })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Cybernetic Feedback Loops */}
                    <IonAccordion value="cybernetic">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={refresh} slot="start" />
                            <IonLabel>Cybernetic Feedback Loops</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <CyberneticSettings 
                                config={config.cybernetics}
                                onUpdate={(cyberneticConfig) => updateConfig({ cybernetics: cyberneticConfig })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Feature Toggles */}
                    <IonAccordion value="features">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={analytics} slot="start" />
                            <IonLabel>Feature Toggles</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <FeatureTogglesSettings 
                                config={config.features}
                                onUpdate={(featureToggles) => updateConfig({ features: featureToggles })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Analysis Frequency */}
                    <IonAccordion value="analysis">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={time} slot="start" />
                            <IonLabel>Analysis Schedule</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <AnalysisFrequencySettings 
                                config={config.analysis}
                                onUpdate={(analysisConfig) => updateConfig({ analysis: analysisConfig })}
                            />
                        </div>
                    </IonAccordion>

                    {/* Virtue Definitions */}
                    <IonAccordion value="virtues">
                        <IonItem slot="header" color="light">
                            <IonIcon icon={heart} slot="start" />
                            <IonLabel>Virtue Definitions</IonLabel>
                        </IonItem>
                        <div slot="content">
                            <VirtueDefinitionsSettings 
                                virtues={config.virtues}
                                onUpdate={(virtues) => updateConfig({ virtues })}
                            />
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

                {/* Action Buttons */}
                <div className="settings-actions">
                    <IonButton 
                        expand="block" 
                        color="secondary" 
                        onClick={resetToDefaults}
                        disabled={saving}
                    >
                        {saving ? <IonSpinner name="crescent" /> : 'Reset to Defaults'}
                    </IonButton>
                </div>
            </div>
        </IonContent>
    );
};

// Media Consumption Settings Component
const MediaConsumptionSettings = ({ 
    config, 
    onUpdate 
}: { 
    config: MediaConsumptionConfig; 
    onUpdate: (config: MediaConsumptionConfig) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<MediaConsumptionConfig>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    const updatePyramidLevel = (level: keyof MediaConsumptionConfig['pyramidLevels'], updates: any) => {
        const newConfig = { ...localConfig };
        newConfig.pyramidLevels[level] = { ...newConfig.pyramidLevels[level], ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Media Consumption & SociallyFed Pyramid</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {/* Tracking Mode */}
                    <IonItem>
                        <IonLabel position="stacked">Tracking Mode</IonLabel>
                        <IonSelect
                            value={localConfig.trackingMode}
                            onIonChange={(e) => handleUpdate({ trackingMode: e.detail.value })}
                        >
                            <IonSelectOption value="passive">Passive - Monitor only</IonSelectOption>
                            <IonSelectOption value="active">Active - Notifications</IonSelectOption>
                            <IonSelectOption value="intervention">Intervention - Auto-block</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    {/* SociallyFed Pyramid Levels */}
                    <div className="pyramid-section">
                        <h4>SociallyFed Pyramid Levels</h4>
                        
                        {/* Served Content */}
                        <IonItem>
                            <div className="pyramid-level">
                                <div className="level-header">
                                    <IonCheckbox
                                        checked={localConfig.pyramidLevels.servedContent.enabled}
                                        onIonChange={(e) => updatePyramidLevel('servedContent', { enabled: e.detail.checked })}
                                    />
                                    <IonLabel>Served Content (Level 1)</IonLabel>
                                </div>
                                <div className="level-settings">
                                    <IonInput
                                        type="number"
                                        value={localConfig.pyramidLevels.servedContent.dailyLimit}
                                        onIonInput={(e) => updatePyramidLevel('servedContent', { dailyLimit: parseInt(e.detail.value || '60') })}
                                        placeholder="Daily limit (minutes)"
                                    />
                                    <IonInput
                                        type="time"
                                        value={localConfig.pyramidLevels.servedContent.preferredTime}
                                        onIonInput={(e) => updatePyramidLevel('servedContent', { preferredTime: e.detail.value || '20:00' })}
                                    />
                                    <IonToggle
                                        checked={localConfig.pyramidLevels.servedContent.autoBlock}
                                        onIonChange={(e) => updatePyramidLevel('servedContent', { autoBlock: e.detail.checked })}
                                    />
                                </div>
                            </div>
                        </IonItem>

                        {/* Casual Browsing */}
                        <IonItem>
                            <div className="pyramid-level">
                                <div className="level-header">
                                    <IonCheckbox
                                        checked={localConfig.pyramidLevels.casualBrowsing.enabled}
                                        onIonChange={(e) => updatePyramidLevel('casualBrowsing', { enabled: e.detail.checked })}
                                    />
                                    <IonLabel>Casual Browsing (Level 2)</IonLabel>
                                </div>
                                <div className="level-settings">
                                    <IonInput
                                        type="number"
                                        value={localConfig.pyramidLevels.casualBrowsing.dailyLimit}
                                        onIonInput={(e) => updatePyramidLevel('casualBrowsing', { dailyLimit: parseInt(e.detail.value || '30') })}
                                        placeholder="Daily limit (minutes)"
                                    />
                                    <IonInput
                                        type="time"
                                        value={localConfig.pyramidLevels.casualBrowsing.preferredTime}
                                        onIonInput={(e) => updatePyramidLevel('casualBrowsing', { preferredTime: e.detail.value || '20:00' })}
                                    />
                                    <IonToggle
                                        checked={localConfig.pyramidLevels.casualBrowsing.autoBlock}
                                        onIonChange={(e) => updatePyramidLevel('casualBrowsing', { autoBlock: e.detail.checked })}
                                    />
                                </div>
                            </div>
                        </IonItem>

                        {/* Intentional Content */}
                        <IonItem>
                            <div className="pyramid-level">
                                <div className="level-header">
                                    <IonCheckbox
                                        checked={localConfig.pyramidLevels.intentionalContent.enabled}
                                        onIonChange={(e) => updatePyramidLevel('intentionalContent', { enabled: e.detail.checked })}
                                    />
                                    <IonLabel>Intentional Content (Level 3)</IonLabel>
                                </div>
                                <div className="level-settings">
                                    <IonInput
                                        type="number"
                                        value={localConfig.pyramidLevels.intentionalContent.dailyLimit}
                                        onIonInput={(e) => updatePyramidLevel('intentionalContent', { dailyLimit: parseInt(e.detail.value || '30') })}
                                        placeholder="Daily limit (minutes)"
                                    />
                                    <IonInput
                                        type="time"
                                        value={localConfig.pyramidLevels.intentionalContent.preferredTime}
                                        onIonInput={(e) => updatePyramidLevel('intentionalContent', { preferredTime: e.detail.value || '20:00' })}
                                    />
                                    <IonToggle
                                        checked={localConfig.pyramidLevels.intentionalContent.autoBlock}
                                        onIonChange={(e) => updatePyramidLevel('intentionalContent', { autoBlock: e.detail.checked })}
                                    />
                                </div>
                            </div>
                        </IonItem>

                        {/* Creation */}
                        <IonItem>
                            <div className="pyramid-level">
                                <div className="level-header">
                                    <IonCheckbox
                                        checked={localConfig.pyramidLevels.creation.enabled}
                                        onIonChange={(e) => updatePyramidLevel('creation', { enabled: e.detail.checked })}
                                    />
                                    <IonLabel>Creation (Level 4)</IonLabel>
                                </div>
                                <div className="level-settings">
                                    <IonInput
                                        type="number"
                                        value={localConfig.pyramidLevels.creation.dailyGoal}
                                        onIonInput={(e) => updatePyramidLevel('creation', { dailyGoal: parseInt(e.detail.value || '30') })}
                                        placeholder="Daily goal (minutes)"
                                    />
                                    <IonInput
                                        type="time"
                                        value={localConfig.pyramidLevels.creation.preferredTime}
                                        onIonInput={(e) => updatePyramidLevel('creation', { preferredTime: e.detail.value || '20:00' })}
                                    />
                                    <IonToggle
                                        checked={localConfig.pyramidLevels.creation.reminders}
                                        onIonChange={(e) => updatePyramidLevel('creation', { reminders: e.detail.checked })}
                                    />
                                </div>
                            </div>
                        </IonItem>

                        {/* Deep Focus */}
                        <IonItem>
                            <div className="pyramid-level">
                                <div className="level-header">
                                    <IonCheckbox
                                        checked={localConfig.pyramidLevels.deepFocus.enabled}
                                        onIonChange={(e) => updatePyramidLevel('deepFocus', { enabled: e.detail.checked })}
                                    />
                                    <IonLabel>Deep Focus (Level 5)</IonLabel>
                                </div>
                                <div className="level-settings">
                                    <IonInput
                                        type="number"
                                        value={localConfig.pyramidLevels.deepFocus.dailyGoal}
                                        onIonInput={(e) => updatePyramidLevel('deepFocus', { dailyGoal: parseInt(e.detail.value || '30') })}
                                        placeholder="Daily goal (minutes)"
                                    />
                                    <IonInput
                                        type="time"
                                        value={localConfig.pyramidLevels.deepFocus.preferredTime}
                                        onIonInput={(e) => updatePyramidLevel('deepFocus', { preferredTime: e.detail.value || '20:00' })}
                                    />
                                    <IonToggle
                                        checked={localConfig.pyramidLevels.deepFocus.reminders}
                                        onIonChange={(e) => updatePyramidLevel('deepFocus', { reminders: e.detail.checked })}
                                    />
                                </div>
                            </div>
                        </IonItem>
                    </div>

                    {/* General Settings */}
                    <IonItem>
                        <IonLabel>Mood Correlation Tracking</IonLabel>
                        <IonToggle
                            checked={localConfig.moodCorrelation}
                            onIonChange={(e) => handleUpdate({ moodCorrelation: e.detail.checked })}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Productivity Impact Tracking</IonLabel>
                        <IonToggle
                            checked={localConfig.productivityImpact}
                            onIonChange={(e) => handleUpdate({ productivityImpact: e.detail.checked })}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Social Comparison Tracking</IonLabel>
                        <IonToggle
                            checked={localConfig.socialComparisonTracking}
                            onIonChange={(e) => handleUpdate({ socialComparisonTracking: e.detail.checked })}
                        />
                    </IonItem>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Stoic Virtues Settings Component
const StoicVirtuesSettings = ({ 
    config, 
    onUpdate 
}: { 
    config: StoicVirtueConfig; 
    onUpdate: (config: StoicVirtueConfig) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<StoicVirtueConfig>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    const updateVirtue = (virtueName: keyof StoicVirtueConfig['virtues'], updates: any) => {
        const newConfig = { ...localConfig };
        newConfig.virtues[virtueName] = { ...newConfig.virtues[virtueName], ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Stoic Virtues & Practices</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {/* Courage */}
                    <IonItem>
                        <div className="virtue-section">
                            <div className="virtue-header">
                                <IonCheckbox
                                    checked={localConfig.virtues.courage.enabled}
                                    onIonChange={(e) => updateVirtue('courage', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Courage</IonLabel>
                                <IonRange
                                    value={localConfig.virtues.courage.weight}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onIonChange={(e) => updateVirtue('courage', { weight: e.detail.value as number })}
                                />
                            </div>
                            <IonTextarea
                                value={localConfig.virtues.courage.dailyPrompt}
                                onIonInput={(e) => updateVirtue('courage', { dailyPrompt: e.detail.value || '' })}
                                placeholder="Daily reflection prompt for courage"
                                rows={2}
                            />
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.courage.weeklyReflection}
                                    onIonChange={(e) => updateVirtue('courage', { weeklyReflection: e.detail.checked })}
                                />
                                <IonLabel>Weekly Reflection</IonLabel>
                            </div>
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.courage.challengeTracking}
                                    onIonChange={(e) => updateVirtue('courage', { challengeTracking: e.detail.checked })}
                                />
                                <IonLabel>Challenge Tracking</IonLabel>
                            </div>
                        </div>
                    </IonItem>

                    {/* Wisdom */}
                    <IonItem>
                        <div className="virtue-section">
                            <div className="virtue-header">
                                <IonCheckbox
                                    checked={localConfig.virtues.wisdom.enabled}
                                    onIonChange={(e) => updateVirtue('wisdom', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Wisdom</IonLabel>
                                <IonRange
                                    value={localConfig.virtues.wisdom.weight}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onIonChange={(e) => updateVirtue('wisdom', { weight: e.detail.value as number })}
                                />
                            </div>
                            <IonTextarea
                                value={localConfig.virtues.wisdom.dailyPrompt}
                                onIonInput={(e) => updateVirtue('wisdom', { dailyPrompt: e.detail.value || '' })}
                                placeholder="Daily reflection prompt for wisdom"
                                rows={2}
                            />
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.wisdom.weeklyReflection}
                                    onIonChange={(e) => updateVirtue('wisdom', { weeklyReflection: e.detail.checked })}
                                />
                                <IonLabel>Weekly Reflection</IonLabel>
                            </div>
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.wisdom.learningTracking}
                                    onIonChange={(e) => updateVirtue('wisdom', { learningTracking: e.detail.checked })}
                                />
                                <IonLabel>Learning Tracking</IonLabel>
                            </div>
                        </div>
                    </IonItem>

                    {/* Justice */}
                    <IonItem>
                        <div className="virtue-section">
                            <div className="virtue-header">
                                <IonCheckbox
                                    checked={localConfig.virtues.justice.enabled}
                                    onIonChange={(e) => updateVirtue('justice', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Justice</IonLabel>
                                <IonRange
                                    value={localConfig.virtues.justice.weight}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onIonChange={(e) => updateVirtue('justice', { weight: e.detail.value as number })}
                                />
                            </div>
                            <IonTextarea
                                value={localConfig.virtues.justice.dailyPrompt}
                                onIonInput={(e) => updateVirtue('justice', { dailyPrompt: e.detail.value || '' })}
                                placeholder="Daily reflection prompt for justice"
                                rows={2}
                            />
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.justice.weeklyReflection}
                                    onIonChange={(e) => updateVirtue('justice', { weeklyReflection: e.detail.checked })}
                                />
                                <IonLabel>Weekly Reflection</IonLabel>
                            </div>
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.justice.relationshipTracking}
                                    onIonChange={(e) => updateVirtue('justice', { relationshipTracking: e.detail.checked })}
                                />
                                <IonLabel>Relationship Tracking</IonLabel>
                            </div>
                        </div>
                    </IonItem>

                    {/* Temperance */}
                    <IonItem>
                        <div className="virtue-section">
                            <div className="virtue-header">
                                <IonCheckbox
                                    checked={localConfig.virtues.temperance.enabled}
                                    onIonChange={(e) => updateVirtue('temperance', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Temperance</IonLabel>
                                <IonRange
                                    value={localConfig.virtues.temperance.weight}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onIonChange={(e) => updateVirtue('temperance', { weight: e.detail.value as number })}
                                />
                            </div>
                            <IonTextarea
                                value={localConfig.virtues.temperance.dailyPrompt}
                                onIonInput={(e) => updateVirtue('temperance', { dailyPrompt: e.detail.value || '' })}
                                placeholder="Daily reflection prompt for temperance"
                                rows={2}
                            />
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.temperance.weeklyReflection}
                                    onIonChange={(e) => updateVirtue('temperance', { weeklyReflection: e.detail.checked })}
                                />
                                <IonLabel>Weekly Reflection</IonLabel>
                            </div>
                            <div className="virtue-options">
                                <IonToggle
                                    checked={localConfig.virtues.temperance.moderationTracking}
                                    onIonChange={(e) => updateVirtue('temperance', { moderationTracking: e.detail.checked })}
                                />
                                <IonLabel>Moderation Tracking</IonLabel>
                            </div>
                        </div>
                    </IonItem>

                    {/* Stoic Practices */}
                    <div className="stoic-practices">
                        <h4>Stoic Practices</h4>
                        
                        <IonItem>
                            <IonLabel>Morning Reflection</IonLabel>
                            <IonToggle
                                checked={localConfig.morningReflection}
                                onIonChange={(e) => handleUpdate({ morningReflection: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Evening Review</IonLabel>
                            <IonToggle
                                checked={localConfig.eveningReview}
                                onIonChange={(e) => handleUpdate({ eveningReview: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Obstacle Journaling</IonLabel>
                            <IonToggle
                                checked={localConfig.obstacleJournaling}
                                onIonChange={(e) => handleUpdate({ obstacleJournaling: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Gratitude Practice</IonLabel>
                            <IonToggle
                                checked={localConfig.gratitudePractice}
                                onIonChange={(e) => handleUpdate({ gratitudePractice: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Memento Mori</IonLabel>
                            <IonToggle
                                checked={localConfig.mementoMori}
                                onIonChange={(e) => handleUpdate({ mementoMori: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Amor Fati</IonLabel>
                            <IonToggle
                                checked={localConfig.amorFati}
                                onIonChange={(e) => handleUpdate({ amorFati: e.detail.checked })}
                            />
                        </IonItem>
                    </div>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Cybernetic Settings Component
const CyberneticSettings = ({ 
    config, 
    onUpdate 
}: { 
    config: CyberneticConfig; 
    onUpdate: (config: CyberneticConfig) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<CyberneticConfig>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    const updateFeedbackLoop = (loopType: keyof CyberneticConfig['feedbackLoops'], updates: any) => {
        const newConfig = { ...localConfig };
        newConfig.feedbackLoops[loopType] = { ...newConfig.feedbackLoops[loopType], ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Cybernetic Feedback Loops</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {/* Daily Feedback Loop */}
                    <IonItem>
                        <div className="feedback-loop">
                            <div className="loop-header">
                                <IonCheckbox
                                    checked={localConfig.feedbackLoops.daily.enabled}
                                    onIonChange={(e) => updateFeedbackLoop('daily', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Daily Feedback Loop</IonLabel>
                            </div>
                            <div className="loop-settings">
                                <IonInput
                                    type="time"
                                    value={localConfig.feedbackLoops.daily.time}
                                    onIonInput={(e) => updateFeedbackLoop('daily', { time: e.detail.value || '08:00' })}
                                />
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.daily.moodTracking}
                                        onIonChange={(e) => updateFeedbackLoop('daily', { moodTracking: e.detail.checked })}
                                    />
                                    <IonLabel>Mood Tracking</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.daily.goalProgress}
                                        onIonChange={(e) => updateFeedbackLoop('daily', { goalProgress: e.detail.checked })}
                                    />
                                    <IonLabel>Goal Progress</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.daily.habitTracking}
                                        onIonChange={(e) => updateFeedbackLoop('daily', { habitTracking: e.detail.checked })}
                                    />
                                    <IonLabel>Habit Tracking</IonLabel>
                                </div>
                            </div>
                        </div>
                    </IonItem>

                    {/* Weekly Feedback Loop */}
                    <IonItem>
                        <div className="feedback-loop">
                            <div className="loop-header">
                                <IonCheckbox
                                    checked={localConfig.feedbackLoops.weekly.enabled}
                                    onIonChange={(e) => updateFeedbackLoop('weekly', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Weekly Feedback Loop</IonLabel>
                            </div>
                            <div className="loop-settings">
                                <IonSelect
                                    value={localConfig.feedbackLoops.weekly.day}
                                    onIonChange={(e) => updateFeedbackLoop('weekly', { day: e.detail.value })}
                                >
                                    <IonSelectOption value="monday">Monday</IonSelectOption>
                                    <IonSelectOption value="tuesday">Tuesday</IonSelectOption>
                                    <IonSelectOption value="wednesday">Wednesday</IonSelectOption>
                                    <IonSelectOption value="thursday">Thursday</IonSelectOption>
                                    <IonSelectOption value="friday">Friday</IonSelectOption>
                                    <IonSelectOption value="saturday">Saturday</IonSelectOption>
                                    <IonSelectOption value="sunday">Sunday</IonSelectOption>
                                </IonSelect>
                                <IonInput
                                    type="time"
                                    value={localConfig.feedbackLoops.weekly.time}
                                    onIonInput={(e) => updateFeedbackLoop('weekly', { time: e.detail.value || '18:00' })}
                                />
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.weekly.patternAnalysis}
                                        onIonChange={(e) => updateFeedbackLoop('weekly', { patternAnalysis: e.detail.checked })}
                                    />
                                    <IonLabel>Pattern Analysis</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.weekly.goalReview}
                                        onIonChange={(e) => updateFeedbackLoop('weekly', { goalReview: e.detail.checked })}
                                    />
                                    <IonLabel>Goal Review</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.weekly.habitReview}
                                        onIonChange={(e) => updateFeedbackLoop('weekly', { habitReview: e.detail.checked })}
                                    />
                                    <IonLabel>Habit Review</IonLabel>
                                </div>
                            </div>
                        </div>
                    </IonItem>

                    {/* Monthly Feedback Loop */}
                    <IonItem>
                        <div className="feedback-loop">
                            <div className="loop-header">
                                <IonCheckbox
                                    checked={localConfig.feedbackLoops.monthly.enabled}
                                    onIonChange={(e) => updateFeedbackLoop('monthly', { enabled: e.detail.checked })}
                                />
                                <IonLabel>Monthly Feedback Loop</IonLabel>
                            </div>
                            <div className="loop-settings">
                                <IonInput
                                    type="number"
                                    value={localConfig.feedbackLoops.monthly.day}
                                    onIonInput={(e) => updateFeedbackLoop('monthly', { day: parseInt(e.detail.value || '15') })}
                                    placeholder="Day of month (1-31)"
                                />
                                <IonInput
                                    type="time"
                                    value={localConfig.feedbackLoops.monthly.time}
                                    onIonInput={(e) => updateFeedbackLoop('monthly', { time: e.detail.value || '12:00' })}
                                />
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.monthly.trendAnalysis}
                                        onIonChange={(e) => updateFeedbackLoop('monthly', { trendAnalysis: e.detail.checked })}
                                    />
                                    <IonLabel>Trend Analysis</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.monthly.goalAdjustment}
                                        onIonChange={(e) => updateFeedbackLoop('monthly', { goalAdjustment: e.detail.checked })}
                                    />
                                    <IonLabel>Goal Adjustment</IonLabel>
                                </div>
                                <div className="loop-options">
                                    <IonToggle
                                        checked={localConfig.feedbackLoops.monthly.systemOptimization}
                                        onIonChange={(e) => updateFeedbackLoop('monthly', { systemOptimization: e.detail.checked })}
                                    />
                                    <IonLabel>System Optimization</IonLabel>
                                </div>
                            </div>
                        </div>
                    </IonItem>

                    {/* System Optimization */}
                    <div className="system-optimization">
                        <h4>System Optimization</h4>
                        
                        <IonItem>
                            <IonLabel>Auto Adjustment</IonLabel>
                            <IonToggle
                                checked={localConfig.autoAdjustment}
                                onIonChange={(e) => handleUpdate({ autoAdjustment: e.detail.checked })}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Learning Rate</IonLabel>
                            <IonRange
                                value={localConfig.learningRate}
                                min={0.1}
                                max={1.0}
                                step={0.1}
                                onIonChange={(e) => handleUpdate({ learningRate: e.detail.value as number })}
                            />
                            <IonText>{localConfig.learningRate}</IonText>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Adaptation Threshold</IonLabel>
                            <IonRange
                                value={localConfig.adaptationThreshold}
                                min={0.1}
                                max={1.0}
                                step={0.1}
                                onIonChange={(e) => handleUpdate({ adaptationThreshold: e.detail.value as number })}
                            />
                            <IonText>{localConfig.adaptationThreshold}</IonText>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Feedback Sensitivity</IonLabel>
                            <IonSelect
                                value={localConfig.feedbackSensitivity}
                                onIonChange={(e) => handleUpdate({ feedbackSensitivity: e.detail.value })}
                            >
                                <IonSelectOption value="low">Low</IonSelectOption>
                                <IonSelectOption value="medium">Medium</IonSelectOption>
                                <IonSelectOption value="high">High</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </div>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Import existing components from the original file
import { 
    LLMServerSettings, 
    PrivacySettings, 
    FeatureTogglesSettings, 
    AnalysisFrequencySettings, 
    VirtueDefinitionsSettings 
} from './SociallyFedSettings';

export default SociallyFedSettingsEnhanced; 