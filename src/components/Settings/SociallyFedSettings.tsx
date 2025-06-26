import { IonAccordion, IonAccordionGroup, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRadio, IonRadioGroup, IonRange, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTextarea, IonToggle } from "@ionic/react";
import { add, remove, settings, shield, analytics, time, heart, server, phonePortrait, school, refresh } from "ionicons/icons";
import { useEffect, useState } from "react";
import { sociallyFedConfig, LLMServerConfig, PrivacyConfig, FeatureToggles, AnalysisFrequency, VirtueDefinition, MediaConsumptionConfig, StoicVirtueConfig, CyberneticConfig } from "../../services/SociallyFedConfigService";
import { toast } from "../../helpers";
import "./SociallyFedSettings.css";

const SociallyFedSettings = () => {
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
                                onUpdate={(llmConfig: LLMServerConfig) => updateConfig({ llmServer: llmConfig })}
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
                                onUpdate={(privacyConfig: PrivacyConfig) => updateConfig({ privacy: privacyConfig })}
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
                                onUpdate={(mediaConfig: MediaConsumptionConfig) => updateConfig({ mediaConsumption: mediaConfig })}
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
                                onUpdate={(stoicConfig: StoicVirtueConfig) => updateConfig({ stoicVirtues: stoicConfig })}
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
                                onUpdate={(cyberneticConfig: CyberneticConfig) => updateConfig({ cybernetics: cyberneticConfig })}
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
                                onUpdate={(featureToggles: FeatureToggles) => updateConfig({ features: featureToggles })}
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
                                onUpdate={(analysisConfig: AnalysisFrequency) => updateConfig({ analysis: analysisConfig })}
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
                                onUpdate={(virtues: VirtueDefinition[]) => updateConfig({ virtues })}
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

// LLM Server Settings Component
const LLMServerSettings = ({ 
    config, 
    validation, 
    onUpdate, 
    onValidate 
}: { 
    config: LLMServerConfig; 
    validation: { valid: boolean; error?: string } | null;
    onUpdate: (config: LLMServerConfig) => void;
    onValidate: () => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<LLMServerConfig>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>LLM Server Configuration</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Server Endpoint</IonLabel>
                        <IonInput
                            value={localConfig.endpoint}
                            onIonInput={(e) => handleUpdate({ endpoint: e.detail.value || 'localhost' })}
                            placeholder="localhost"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Port</IonLabel>
                        <IonInput
                            type="number"
                            value={localConfig.port}
                            onIonInput={(e) => handleUpdate({ port: parseInt(e.detail.value || '8000') })}
                            placeholder="8000"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Protocol</IonLabel>
                        <IonSelect
                            value={localConfig.protocol}
                            onIonChange={(e) => handleUpdate({ protocol: e.detail.value })}
                        >
                            <IonSelectOption value="http">HTTP</IonSelectOption>
                            <IonSelectOption value="https">HTTPS</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonButton 
                            expand="block" 
                            onClick={onValidate}
                            disabled={validation?.error === 'Validating...'}
                        >
                            {validation?.error === 'Validating...' ? <IonSpinner name="crescent" /> : 'Test Connection'}
                        </IonButton>
                    </IonItem>

                    {validation && (
                        <IonItem>
                            <IonText color={validation.valid ? 'success' : 'danger'}>
                                {validation.valid ? '✓ Connection successful' : `✗ ${validation.error}`}
                            </IonText>
                        </IonItem>
                    )}
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Privacy Settings Component
const PrivacySettings = ({ 
    config, 
    onUpdate 
}: { 
    config: PrivacyConfig; 
    onUpdate: (config: PrivacyConfig) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<PrivacyConfig>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Privacy & Data Sharing</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <IonItem>
                        <IonLabel>Allow Anonymous Analytics</IonLabel>
                        <IonToggle
                            checked={localConfig.allowAnonymousAnalytics}
                            onIonChange={(e) => handleUpdate({ allowAnonymousAnalytics: e.detail.checked })}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Allow Pattern Sharing</IonLabel>
                        <IonToggle
                            checked={localConfig.allowPatternSharing}
                            onIonChange={(e) => handleUpdate({ allowPatternSharing: e.detail.checked })}
                        />
                    </IonItem>
                </IonList>
            </IonCardContent>
        </IonCard>
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

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Media Consumption & SociallyFed Pyramid</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
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

                    <IonItem>
                        <IonLabel>Mood Correlation</IonLabel>
                        <IonToggle
                            checked={localConfig.moodCorrelation}
                            onIonChange={(e) => handleUpdate({ moodCorrelation: e.detail.checked })}
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

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Stoic Virtues & Practices</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
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

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Cybernetic Feedback Loops</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
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
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Feature Toggles Settings Component
const FeatureTogglesSettings = ({ 
    config, 
    onUpdate 
}: { 
    config: FeatureToggles; 
    onUpdate: (config: FeatureToggles) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<FeatureToggles>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Feature Toggles</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <IonItem>
                        <IonLabel>Enable Virtue Tracking</IonLabel>
                        <IonToggle
                            checked={localConfig.enableVirtueTracking}
                            onIonChange={(e) => handleUpdate({ enableVirtueTracking: e.detail.checked })}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Enable Media Tracking</IonLabel>
                        <IonToggle
                            checked={localConfig.enableMediaTracking}
                            onIonChange={(e) => handleUpdate({ enableMediaTracking: e.detail.checked })}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Enable AI Analysis</IonLabel>
                        <IonToggle
                            checked={localConfig.enableAIAnalysis}
                            onIonChange={(e) => handleUpdate({ enableAIAnalysis: e.detail.checked })}
                        />
                    </IonItem>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Analysis Frequency Settings Component
const AnalysisFrequencySettings = ({ 
    config, 
    onUpdate 
}: { 
    config: AnalysisFrequency; 
    onUpdate: (config: AnalysisFrequency) => void;
}) => {
    const [localConfig, setLocalConfig] = useState(config);

    const handleUpdate = (updates: Partial<AnalysisFrequency>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onUpdate(newConfig);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Analysis Schedule</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Analysis Frequency</IonLabel>
                        <IonSelect
                            value={localConfig.mode}
                            onIonChange={(e) => handleUpdate({ mode: e.detail.value })}
                        >
                            <IonSelectOption value="daily">Daily</IonSelectOption>
                            <IonSelectOption value="weekly">Weekly</IonSelectOption>
                            <IonSelectOption value="manual">Manual Only</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

// Virtue Definitions Settings Component
const VirtueDefinitionsSettings = ({ 
    virtues, 
    onUpdate 
}: { 
    virtues: VirtueDefinition[]; 
    onUpdate: (virtues: VirtueDefinition[]) => void;
}) => {
    const [localVirtues, setLocalVirtues] = useState(virtues);

    const handleUpdate = (updatedVirtues: VirtueDefinition[]) => {
        setLocalVirtues(updatedVirtues);
        onUpdate(updatedVirtues);
    };

    const addVirtue = () => {
        const newVirtue: VirtueDefinition = {
            name: '',
            description: '',
            weight: 5,
            enabled: true
        };
        handleUpdate([...localVirtues, newVirtue]);
    };

    const removeVirtue = (index: number) => {
        const updatedVirtues = localVirtues.filter((_, i) => i !== index);
        handleUpdate(updatedVirtues);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Virtue Definitions</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {localVirtues.map((virtue, index) => (
                        <IonItem key={index}>
                            <div className="virtue-item">
                                <IonCheckbox
                                    checked={virtue.enabled}
                                    onIonChange={(e) => {
                                        const updatedVirtues = [...localVirtues];
                                        updatedVirtues[index] = { ...virtue, enabled: e.detail.checked };
                                        handleUpdate(updatedVirtues);
                                    }}
                                />
                                <IonInput
                                    value={virtue.name}
                                    onIonInput={(e) => {
                                        const updatedVirtues = [...localVirtues];
                                        updatedVirtues[index] = { ...virtue, name: e.detail.value || '' };
                                        handleUpdate(updatedVirtues);
                                    }}
                                    placeholder="Virtue name"
                                />
                                <IonButton
                                    fill="clear"
                                    size="small"
                                    onClick={() => removeVirtue(index)}
                                >
                                    <IonIcon icon={remove} />
                                </IonButton>
                            </div>
                        </IonItem>
                    ))}
                    
                    <IonButton
                        expand="block"
                        fill="outline"
                        onClick={addVirtue}
                    >
                        <IonIcon icon={add} slot="start" />
                        Add Custom Virtue
                    </IonButton>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

export default SociallyFedSettings; 