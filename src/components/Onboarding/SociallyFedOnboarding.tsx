import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonProgressBar, IonRange, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, IonSpinner, IonAlert } from "@ionic/react";
import { arrowBack, arrowForward, checkmark, close, heart, refresh, school, server, shield, time, trophy } from "ionicons/icons";
import { useEffect, useState } from "react";
import { sociallyFedConfig } from "../../services/SociallyFedConfigService";
import { toast } from "../../helpers";
import "./SociallyFedOnboarding.css";

interface OnboardingStep {
    id: string;
    title: string;
    subtitle: string;
    component: React.ReactNode;
    required: boolean;
}

const SociallyFedOnboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(sociallyFedConfig.getConfig());
    const [llmTestResult, setLlmTestResult] = useState<{ success: boolean; message: string } | null>(null);

    // Onboarding data
    const [selectedVirtues, setSelectedVirtues] = useState({
        courage: { enabled: true, weight: 8 },
        wisdom: { enabled: true, weight: 8 },
        justice: { enabled: true, weight: 7 },
        temperance: { enabled: true, weight: 6 }
    });

    const [mediaBaseline, setMediaBaseline] = useState({
        dailySocialMedia: 120, // minutes
        platforms: ['instagram', 'twitter', 'facebook'],
        trackingMode: 'passive' as const
    });

    const [feedbackPreferences, setFeedbackPreferences] = useState({
        dailyCheck: true,
        weeklyReview: true,
        monthlyAnalysis: true,
        sensitivity: 'medium' as const
    });

    useEffect(() => {
        initializeOnboarding();
    }, []);

    const initializeOnboarding = async () => {
        try {
            setLoading(true);
            await sociallyFedConfig.initialize();
            setConfig(sociallyFedConfig.getConfig());
        } catch (error) {
            console.error('Failed to initialize onboarding:', error);
            toast('Failed to initialize SociallyFed configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await completeOnboarding();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeOnboarding = async () => {
        try {
            setLoading(true);

            // Apply selected configurations
            await sociallyFedConfig.updateStoicVirtues({
                virtues: {
                    courage: { ...config.stoicVirtues.virtues.courage, ...selectedVirtues.courage },
                    wisdom: { ...config.stoicVirtues.virtues.wisdom, ...selectedVirtues.wisdom },
                    justice: { ...config.stoicVirtues.virtues.justice, ...selectedVirtues.justice },
                    temperance: { ...config.stoicVirtues.virtues.temperance, ...selectedVirtues.temperance }
                }
            });

            await sociallyFedConfig.updateMediaConsumption({
                trackingMode: mediaBaseline.trackingMode,
                pyramidLevels: {
                    ...config.mediaConsumption.pyramidLevels,
                    servedContent: {
                        ...config.mediaConsumption.pyramidLevels.servedContent,
                        dailyLimit: mediaBaseline.dailySocialMedia
                    }
                }
            });

            await sociallyFedConfig.updateCybernetics({
                feedbackLoops: {
                    ...config.cybernetics.feedbackLoops,
                    daily: { ...config.cybernetics.feedbackLoops.daily, enabled: feedbackPreferences.dailyCheck },
                    weekly: { ...config.cybernetics.feedbackLoops.weekly, enabled: feedbackPreferences.weeklyReview },
                    monthly: { ...config.cybernetics.feedbackLoops.monthly, enabled: feedbackPreferences.monthlyAnalysis }
                },
                feedbackSensitivity: feedbackPreferences.sensitivity
            });

            toast('SociallyFed configuration completed successfully!');
            onComplete();
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
            toast('Failed to save configuration');
        } finally {
            setLoading(false);
        }
    };

    const testLLMConnection = async () => {
        try {
            setLoading(true);
            const result = await sociallyFedConfig.validateLLMConfig(config.llmServer);
            setLlmTestResult({
                success: result.valid,
                message: result.valid ? 'LLM server connection successful!' : result.error || 'Connection failed'
            });
            
            if (result.valid) {
                toast('LLM server connection successful!');
            } else {
                toast('LLM server connection failed');
            }
        } catch (error) {
            setLlmTestResult({
                success: false,
                message: 'Failed to test connection'
            });
            toast('Failed to test LLM connection');
        } finally {
            setLoading(false);
        }
    };

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: 'Welcome to SociallyFed',
            subtitle: 'Discover mindful technology use through ancient wisdom and modern science',
            required: true,
            component: (
                <div className="onboarding-welcome">
                    <div className="welcome-header">
                        <IonIcon icon={shield} className="welcome-icon" />
                        <h2>Your Digital Wellness Journey Begins</h2>
                        <p>SociallyFed combines three powerful frameworks to help you build a healthier relationship with technology:</p>
                    </div>
                    
                    <div className="pillars-overview">
                        <div className="pillar-card">
                            <IonIcon icon={school} className="pillar-icon" />
                            <h3>Stoic Philosophy</h3>
                            <p>Cultivate wisdom, courage, justice, and temperance in your digital life</p>
                        </div>
                        
                        <div className="pillar-card">
                            <IonIcon icon={refresh} className="pillar-icon" />
                            <h3>Cybernetic Feedback</h3>
                            <p>Create adaptive systems that learn and optimize your digital habits</p>
                        </div>
                        
                        <div className="pillar-card">
                            <IonIcon icon={time} className="pillar-icon" />
                            <h3>SociallyFed Pyramid</h3>
                            <p>Structure your content consumption from passive browsing to deep creation</p>
                        </div>
                    </div>
                    
                    <div className="welcome-footer">
                        <p>This setup will take about 5 minutes and will help personalize your experience.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'stoic-virtues',
            title: 'Choose Your Core Virtues',
            subtitle: 'Select and prioritize the Stoic virtues that resonate with you',
            required: true,
            component: (
                <div className="onboarding-virtues">
                    <div className="virtues-intro">
                        <h3>The Four Cardinal Virtues</h3>
                        <p>These virtues guide wise decision-making and personal growth. Choose which ones to focus on and set their importance.</p>
                    </div>
                    
                    <IonList>
                        <IonItem>
                            <div className="virtue-selection">
                                <div className="virtue-header">
                                    <IonCheckbox
                                        checked={selectedVirtues.courage.enabled}
                                        onIonChange={(e) => setSelectedVirtues({
                                            ...selectedVirtues,
                                            courage: { ...selectedVirtues.courage, enabled: e.detail.checked }
                                        })}
                                    />
                                    <div className="virtue-info">
                                        <IonLabel>
                                            <h3>Courage (Fortitudo)</h3>
                                            <p>Facing fears, taking action, and persevering through challenges</p>
                                        </IonLabel>
                                    </div>
                                </div>
                                {selectedVirtues.courage.enabled && (
                                    <div className="virtue-weight">
                                        <IonLabel>Importance: {selectedVirtues.courage.weight}/10</IonLabel>
                                        <IonRange
                                            value={selectedVirtues.courage.weight}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={(e) => setSelectedVirtues({
                                                ...selectedVirtues,
                                                courage: { ...selectedVirtues.courage, weight: e.detail.value as number }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        </IonItem>

                        <IonItem>
                            <div className="virtue-selection">
                                <div className="virtue-header">
                                    <IonCheckbox
                                        checked={selectedVirtues.wisdom.enabled}
                                        onIonChange={(e) => setSelectedVirtues({
                                            ...selectedVirtues,
                                            wisdom: { ...selectedVirtues.wisdom, enabled: e.detail.checked }
                                        })}
                                    />
                                    <div className="virtue-info">
                                        <IonLabel>
                                            <h3>Wisdom (Sapientia)</h3>
                                            <p>Making thoughtful decisions, learning, and understanding</p>
                                        </IonLabel>
                                    </div>
                                </div>
                                {selectedVirtues.wisdom.enabled && (
                                    <div className="virtue-weight">
                                        <IonLabel>Importance: {selectedVirtues.wisdom.weight}/10</IonLabel>
                                        <IonRange
                                            value={selectedVirtues.wisdom.weight}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={(e) => setSelectedVirtues({
                                                ...selectedVirtues,
                                                wisdom: { ...selectedVirtues.wisdom, weight: e.detail.value as number }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        </IonItem>

                        <IonItem>
                            <div className="virtue-selection">
                                <div className="virtue-header">
                                    <IonCheckbox
                                        checked={selectedVirtues.justice.enabled}
                                        onIonChange={(e) => setSelectedVirtues({
                                            ...selectedVirtues,
                                            justice: { ...selectedVirtues.justice, enabled: e.detail.checked }
                                        })}
                                    />
                                    <div className="virtue-info">
                                        <IonLabel>
                                            <h3>Justice (Justitia)</h3>
                                            <p>Treating others fairly, acting with integrity, and contributing to community</p>
                                        </IonLabel>
                                    </div>
                                </div>
                                {selectedVirtues.justice.enabled && (
                                    <div className="virtue-weight">
                                        <IonLabel>Importance: {selectedVirtues.justice.weight}/10</IonLabel>
                                        <IonRange
                                            value={selectedVirtues.justice.weight}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={(e) => setSelectedVirtues({
                                                ...selectedVirtues,
                                                justice: { ...selectedVirtues.justice, weight: e.detail.value as number }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        </IonItem>

                        <IonItem>
                            <div className="virtue-selection">
                                <div className="virtue-header">
                                    <IonCheckbox
                                        checked={selectedVirtues.temperance.enabled}
                                        onIonChange={(e) => setSelectedVirtues({
                                            ...selectedVirtues,
                                            temperance: { ...selectedVirtues.temperance, enabled: e.detail.checked }
                                        })}
                                    />
                                    <div className="virtue-info">
                                        <IonLabel>
                                            <h3>Temperance (Temperantia)</h3>
                                            <p>Practicing self-control, moderation, and balance</p>
                                        </IonLabel>
                                    </div>
                                </div>
                                {selectedVirtues.temperance.enabled && (
                                    <div className="virtue-weight">
                                        <IonLabel>Importance: {selectedVirtues.temperance.weight}/10</IonLabel>
                                        <IonRange
                                            value={selectedVirtues.temperance.weight}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={(e) => setSelectedVirtues({
                                                ...selectedVirtues,
                                                temperance: { ...selectedVirtues.temperance, weight: e.detail.value as number }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        </IonItem>
                    </IonList>
                </div>
            )
        },
        {
            id: 'media-baseline',
            title: 'Set Your Media Baseline',
            subtitle: 'Help us understand your current digital habits to create personalized recommendations',
            required: true,
            component: (
                <div className="onboarding-media">
                    <div className="media-intro">
                        <h3>Your Digital Consumption Profile</h3>
                        <p>Understanding your current habits helps us create a personalized SociallyFed Pyramid for you.</p>
                    </div>
                    
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Daily Social Media Usage</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="time-slider">
                                <IonLabel>How many minutes do you typically spend on social media each day?</IonLabel>
                                <div className="time-display">
                                    <IonText>{mediaBaseline.dailySocialMedia} minutes</IonText>
                                    <IonText>({Math.round(mediaBaseline.dailySocialMedia / 60 * 10) / 10} hours)</IonText>
                                </div>
                                <IonRange
                                    value={mediaBaseline.dailySocialMedia}
                                    min={0}
                                    max={480}
                                    step={15}
                                    onIonChange={(e) => setMediaBaseline({
                                        ...mediaBaseline,
                                        dailySocialMedia: e.detail.value as number
                                    })}
                                />
                                <div className="time-markers">
                                    <span>0 min</span>
                                    <span>2 hours</span>
                                    <span>4 hours</span>
                                    <span>8 hours</span>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Tracking Mode</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonSelect
                                value={mediaBaseline.trackingMode}
                                onIonChange={(e) => setMediaBaseline({
                                    ...mediaBaseline,
                                    trackingMode: e.detail.value
                                })}
                            >
                                <IonSelectOption value="passive">
                                    <div className="tracking-option">
                                        <h4>Passive Monitoring</h4>
                                        <p>Track usage without notifications or interventions</p>
                                    </div>
                                </IonSelectOption>
                                <IonSelectOption value="active">
                                    <div className="tracking-option">
                                        <h4>Active Notifications</h4>
                                        <p>Receive gentle reminders when approaching limits</p>
                                    </div>
                                </IonSelectOption>
                                <IonSelectOption value="intervention">
                                    <div className="tracking-option">
                                        <h4>Smart Interventions</h4>
                                        <p>Automatic blocking and guided breaks</p>
                                    </div>
                                </IonSelectOption>
                            </IonSelect>
                        </IonCardContent>
                    </IonCard>
                </div>
            )
        },
        {
            id: 'feedback-preferences',
            title: 'Configure Feedback Loops',
            subtitle: 'Set up how often you want to reflect and receive insights',
            required: true,
            component: (
                <div className="onboarding-feedback">
                    <div className="feedback-intro">
                        <h3>Cybernetic Feedback System</h3>
                        <p>These feedback loops help you learn from your patterns and continuously improve your digital habits.</p>
                    </div>
                    
                    <IonList>
                        <IonItem>
                            <div className="feedback-option">
                                <div className="feedback-header">
                                    <IonCheckbox
                                        checked={feedbackPreferences.dailyCheck}
                                        onIonChange={(e) => setFeedbackPreferences({
                                            ...feedbackPreferences,
                                            dailyCheck: e.detail.checked
                                        })}
                                    />
                                    <div className="feedback-info">
                                        <IonLabel>
                                            <h3>Daily Check-in</h3>
                                            <p>Quick mood and goal progress review each morning</p>
                                        </IonLabel>
                                    </div>
                                </div>
                            </div>
                        </IonItem>

                        <IonItem>
                            <div className="feedback-option">
                                <div className="feedback-header">
                                    <IonCheckbox
                                        checked={feedbackPreferences.weeklyReview}
                                        onIonChange={(e) => setFeedbackPreferences({
                                            ...feedbackPreferences,
                                            weeklyReview: e.detail.checked
                                        })}
                                    />
                                    <div className="feedback-info">
                                        <IonLabel>
                                            <h3>Weekly Review</h3>
                                            <p>Pattern analysis and habit effectiveness review</p>
                                        </IonLabel>
                                    </div>
                                </div>
                            </div>
                        </IonItem>

                        <IonItem>
                            <div className="feedback-option">
                                <div className="feedback-header">
                                    <IonCheckbox
                                        checked={feedbackPreferences.monthlyAnalysis}
                                        onIonChange={(e) => setFeedbackPreferences({
                                            ...feedbackPreferences,
                                            monthlyAnalysis: e.detail.checked
                                        })}
                                    />
                                    <div className="feedback-info">
                                        <IonLabel>
                                            <h3>Monthly Analysis</h3>
                                            <p>Deep trend analysis and system optimization</p>
                                        </IonLabel>
                                    </div>
                                </div>
                            </div>
                        </IonItem>
                    </IonList>

                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Feedback Sensitivity</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonSelect
                                value={feedbackPreferences.sensitivity}
                                onIonChange={(e) => setFeedbackPreferences({
                                    ...feedbackPreferences,
                                    sensitivity: e.detail.value
                                })}
                            >
                                <IonSelectOption value="low">Low - Minimal notifications</IonSelectOption>
                                <IonSelectOption value="medium">Medium - Balanced approach</IonSelectOption>
                                <IonSelectOption value="high">High - Frequent insights</IonSelectOption>
                            </IonSelect>
                        </IonCardContent>
                    </IonCard>
                </div>
            )
        },
        {
            id: 'llm-setup',
            title: 'Local LLM Setup',
            subtitle: 'Configure your local AI server for personalized insights',
            required: false,
            component: (
                <div className="onboarding-llm">
                    <div className="llm-intro">
                        <h3>Local AI Intelligence</h3>
                        <p>SociallyFed uses a local AI server to provide personalized insights while keeping your data private.</p>
                    </div>
                    
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Server Configuration</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div className="llm-status">
                                <div className="status-indicator">
                                    <IonIcon 
                                        icon={llmTestResult?.success ? checkmark : close} 
                                        className={llmTestResult?.success ? 'status-success' : 'status-error'} 
                                    />
                                    <span>Server Status: {llmTestResult ? (llmTestResult.success ? 'Connected' : 'Disconnected') : 'Not Tested'}</span>
                                </div>
                                
                                {llmTestResult && (
                                    <div className={`test-message ${llmTestResult.success ? 'success' : 'error'}`}>
                                        {llmTestResult.message}
                                    </div>
                                )}
                                
                                <IonButton 
                                    expand="block" 
                                    onClick={testLLMConnection}
                                    disabled={loading}
                                >
                                    {loading ? <IonSpinner name="crescent" /> : 'Test Connection'}
                                </IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    <div className="llm-info">
                        <h4>Why Local AI?</h4>
                        <ul>
                            <li>Your data never leaves your device</li>
                            <li>Personalized insights based on your patterns</li>
                            <li>No external dependencies or privacy concerns</li>
                            <li>Works offline for enhanced privacy</li>
                        </ul>
                        
                        <p className="setup-note">
                            <strong>Note:</strong> You can skip this step and configure your LLM server later in the settings.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'examples',
            title: 'See It in Action',
            subtitle: 'Examples of how SociallyFed will work for you',
            required: true,
            component: (
                <div className="onboarding-examples">
                    <div className="examples-intro">
                        <h3>Your SociallyFed Experience</h3>
                        <p>Here's how your personalized configuration will work in practice.</p>
                    </div>
                    
                    <div className="example-cards">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonIcon icon={school} />
                                    Daily Stoic Reflection
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="example-content">
                                    <p><strong>Morning Prompt:</strong></p>
                                    <blockquote>
                                        "What courageous action will you take today? How can you practice wisdom in your digital interactions?"
                                    </blockquote>
                                    <p>Based on your selected virtues: <strong>Courage (8/10)</strong>, <strong>Wisdom (8/10)</strong></p>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonIcon icon={time} />
                                    Media Consumption Alert
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="example-content">
                                    <p><strong>When you reach {mediaBaseline.dailySocialMedia} minutes:</strong></p>
                                    <blockquote>
                                        "You've reached your daily social media limit. Consider switching to creation mode or taking a mindful break."
                                    </blockquote>
                                    <p>Tracking mode: <strong>{mediaBaseline.trackingMode}</strong></p>
                                </div>
                            </IonCardContent>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonIcon icon={refresh} />
                                    Weekly Feedback Loop
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="example-content">
                                    <p><strong>Every Monday at 6 PM:</strong></p>
                                    <blockquote>
                                        "This week, you practiced courage 5 times and spent 30% less time on served content. Your wisdom score increased by 15%."
                                    </blockquote>
                                    <p>Sensitivity: <strong>{feedbackPreferences.sensitivity}</strong></p>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </div>
                    
                    <div className="completion-message">
                        <IonIcon icon={trophy} className="completion-icon" />
                        <h3>You're Ready to Begin!</h3>
                        <p>Your SociallyFed configuration is complete. Start your journey toward mindful technology use and personal growth.</p>
                    </div>
                </div>
            )
        }
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;

    if (loading && currentStep === 0) {
        return (
            <IonPage>
                <IonContent className="loading-content">
                    <div className="loading-container">
                        <IonSpinner name="crescent" />
                        <p>Initializing SociallyFed...</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>SociallyFed Setup</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="onboarding-container">
                    {/* Progress Bar */}
                    <div className="progress-section">
                        <IonProgressBar value={progress / 100} />
                        <div className="progress-text">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content">
                        <div className="step-header">
                            <h2>{steps[currentStep].title}</h2>
                            <p>{steps[currentStep].subtitle}</p>
                        </div>

                        <div className="step-body">
                            {steps[currentStep].component}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="step-navigation">
                        <IonButton 
                            fill="clear" 
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            <IonIcon icon={arrowBack} slot="start" />
                            Back
                        </IonButton>

                        <IonButton 
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {currentStep === steps.length - 1 ? (
                                <>
                                    {loading ? <IonSpinner name="crescent" /> : 'Complete Setup'}
                                    <IonIcon icon={checkmark} slot="end" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <IonIcon icon={arrowForward} slot="end" />
                                </>
                            )}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SociallyFedOnboarding; 