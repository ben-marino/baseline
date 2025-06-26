import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { createMemoryHistory } from 'history';
import SociallyFedOnboarding from '../SociallyFedOnboarding';
import { sociallyFedConfig } from '../../../services/SociallyFedConfigService';

// Mock the SociallyFedConfigService
jest.mock('../../../services/SociallyFedConfigService', () => ({
    sociallyFedConfig: {
        initialize: jest.fn(),
        getConfig: jest.fn(),
        updateStoicVirtues: jest.fn(),
        updateMediaConsumption: jest.fn(),
        updateCybernetics: jest.fn(),
        validateLLMConfig: jest.fn(),
        resetToDefaults: jest.fn()
    }
}));

// Mock the toast helper
jest.mock('../../../helpers', () => ({
    toast: jest.fn()
}));

const mockSociallyFedConfig = sociallyFedConfig as jest.Mocked<typeof sociallyFedConfig>;

describe('SociallyFedOnboarding', () => {
    const mockOnComplete = jest.fn();
    const history = createMemoryHistory();

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock default configuration
        mockSociallyFedConfig.getConfig.mockReturnValue({
            llmServer: {
                endpoint: 'localhost',
                port: 8000,
                protocol: 'http' as const,
                timeout: 5000,
                retryAttempts: 3,
                healthCheckInterval: 30000
            },
            privacy: {
                dataSharingLevel: 'minimal' as const,
                allowAnonymousAnalytics: false,
                allowPatternSharing: false,
                allowVirtueSharing: false,
                allowMediaSharing: false,
                dataRetentionDays: 30,
                autoDeleteOldData: true
            },
            features: {
                enableVirtueTracking: true,
                enableMediaTracking: true,
                enablePatternTracking: true,
                enableCybernetics: true,
                enableAIAnalysis: true,
                enableLocalLLM: true,
                enableInsights: true,
                enableTrendAnalysis: true,
                enableCorrelationDetection: true
            },
            analysis: {
                mode: 'daily' as const,
                customInterval: 24,
                preferredTime: '08:00',
                timezone: 'UTC'
            },
            virtues: [],
            preferences: {
                enableVirtueTracking: true,
                enableMediaTracking: true,
                enablePatternTracking: true,
                enableCybernetics: true,
                enableAIAnalysis: true,
                dataRetentionDays: 30,
                privacyLevel: 'minimal' as const
            },
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
                trackingMode: 'passive' as const,
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
                        day: 'monday' as const,
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
                        trackingMethod: 'streak' as const,
                        reminderFrequency: 'daily' as const
                    },
                    outcome: {
                        enabled: true,
                        trackingMethod: 'progress' as const,
                        reminderFrequency: 'daily' as const
                    },
                    process: {
                        enabled: true,
                        trackingMethod: 'time' as const,
                        reminderFrequency: 'daily' as const
                    }
                },
                autoAdjustment: true,
                learningRate: 0.5,
                adaptationThreshold: 0.7,
                feedbackSensitivity: 'medium' as const
            },
            lastUpdated: Date.now(),
            version: '1.0.0'
        });
    });

    const renderOnboarding = () => {
        return render(
            <IonApp>
                <IonRouterOutlet>
                    <SociallyFedOnboarding onComplete={mockOnComplete} />
                </IonRouterOutlet>
            </IonApp>
        );
    };

    describe('Initialization', () => {
        test('should initialize SociallyFed config on mount', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                expect(mockSociallyFedConfig.initialize).toHaveBeenCalled();
            });
        });

        test('should show loading state during initialization', () => {
            mockSociallyFedConfig.initialize.mockImplementation(() => new Promise(() => {}));
            
            renderOnboarding();
            
            expect(screen.getByText('Initializing SociallyFed...')).toBeInTheDocument();
        });

        test('should handle initialization errors gracefully', async () => {
            mockSociallyFedConfig.initialize.mockRejectedValue(new Error('Init failed'));
            
            renderOnboarding();
            
            await waitFor(() => {
                expect(screen.getByText('Welcome to SociallyFed')).toBeInTheDocument();
            });
        });
    });

    describe('Welcome Step', () => {
        test('should display welcome content', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                expect(screen.getByText('Welcome to SociallyFed')).toBeInTheDocument();
                expect(screen.getByText('Discover mindful technology use through ancient wisdom and modern science')).toBeInTheDocument();
            });
        });

        test('should display three philosophical pillars', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                expect(screen.getByText('Stoic Philosophy')).toBeInTheDocument();
                expect(screen.getByText('Cybernetic Feedback')).toBeInTheDocument();
                expect(screen.getByText('SociallyFed Pyramid')).toBeInTheDocument();
            });
        });

        test('should allow navigation to next step', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton);
            });
            
            expect(screen.getByText('Choose Your Core Virtues')).toBeInTheDocument();
        });
    });

    describe('Stoic Virtues Step', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            renderOnboarding();
            
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton);
            });
        });

        test('should display all four cardinal virtues', () => {
            expect(screen.getByText('Courage (Fortitudo)')).toBeInTheDocument();
            expect(screen.getByText('Wisdom (Sapientia)')).toBeInTheDocument();
            expect(screen.getByText('Justice (Justitia)')).toBeInTheDocument();
            expect(screen.getByText('Temperance (Temperantia)')).toBeInTheDocument();
        });

        test('should allow enabling/disabling virtues', () => {
            const courageCheckbox = screen.getByLabelText(/Courage/);
            fireEvent.click(courageCheckbox);
            
            // Should show weight slider when enabled
            expect(screen.getByText('Importance: 8/10')).toBeInTheDocument();
        });

        test('should allow adjusting virtue weights', () => {
            const weightSlider = screen.getByRole('slider');
            fireEvent.change(weightSlider, { target: { value: '10' } });
            
            expect(screen.getByText('Importance: 10/10')).toBeInTheDocument();
        });

        test('should allow navigation between steps', () => {
            const backButton = screen.getByText('Back');
            fireEvent.click(backButton);
            
            expect(screen.getByText('Welcome to SociallyFed')).toBeInTheDocument();
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            expect(screen.getByText('Choose Your Core Virtues')).toBeInTheDocument();
        });
    });

    describe('Media Baseline Step', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            renderOnboarding();
            
            // Navigate to media baseline step
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton); // Welcome -> Virtues
                fireEvent.click(screen.getByText('Next')); // Virtues -> Media
            });
        });

        test('should display media consumption configuration', () => {
            expect(screen.getByText('Set Your Media Baseline')).toBeInTheDocument();
            expect(screen.getByText('Your Digital Consumption Profile')).toBeInTheDocument();
        });

        test('should allow adjusting daily social media time', () => {
            const timeSlider = screen.getByRole('slider');
            fireEvent.change(timeSlider, { target: { value: '180' } });
            
            expect(screen.getByText('180 minutes')).toBeInTheDocument();
            expect(screen.getByText('(3 hours)')).toBeInTheDocument();
        });

        test('should allow selecting tracking mode', () => {
            const trackingSelect = screen.getByRole('combobox');
            fireEvent.change(trackingSelect, { target: { value: 'active' } });
            
            expect(trackingSelect).toHaveValue('active');
        });
    });

    describe('Feedback Preferences Step', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            renderOnboarding();
            
            // Navigate to feedback step
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton); // Welcome -> Virtues
                fireEvent.click(screen.getByText('Next')); // Virtues -> Media
                fireEvent.click(screen.getByText('Next')); // Media -> Feedback
            });
        });

        test('should display feedback loop options', () => {
            expect(screen.getByText('Configure Feedback Loops')).toBeInTheDocument();
            expect(screen.getByText('Daily Check-in')).toBeInTheDocument();
            expect(screen.getByText('Weekly Review')).toBeInTheDocument();
            expect(screen.getByText('Monthly Analysis')).toBeInTheDocument();
        });

        test('should allow enabling/disabling feedback loops', () => {
            const dailyCheckbox = screen.getByLabelText(/Daily Check-in/);
            fireEvent.click(dailyCheckbox);
            
            // Should toggle the checkbox state
            expect(dailyCheckbox).not.toBeChecked();
        });

        test('should allow selecting feedback sensitivity', () => {
            const sensitivitySelect = screen.getByRole('combobox');
            fireEvent.change(sensitivitySelect, { target: { value: 'high' } });
            
            expect(sensitivitySelect).toHaveValue('high');
        });
    });

    describe('LLM Setup Step', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            renderOnboarding();
            
            // Navigate to LLM step
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton); // Welcome -> Virtues
                fireEvent.click(screen.getByText('Next')); // Virtues -> Media
                fireEvent.click(screen.getByText('Next')); // Media -> Feedback
                fireEvent.click(screen.getByText('Next')); // Feedback -> LLM
            });
        });

        test('should display LLM setup information', () => {
            expect(screen.getByText('Local LLM Setup')).toBeInTheDocument();
            expect(screen.getByText('Local AI Intelligence')).toBeInTheDocument();
        });

        test('should allow testing LLM connection', async () => {
            mockSociallyFedConfig.validateLLMConfig.mockResolvedValue({
                valid: true,
                error: undefined
            });
            
            const testButton = screen.getByText('Test Connection');
            fireEvent.click(testButton);
            
            await waitFor(() => {
                expect(mockSociallyFedConfig.validateLLMConfig).toHaveBeenCalled();
            });
        });

        test('should handle LLM connection errors', async () => {
            mockSociallyFedConfig.validateLLMConfig.mockResolvedValue({
                valid: false,
                error: 'Connection failed'
            });
            
            const testButton = screen.getByText('Test Connection');
            fireEvent.click(testButton);
            
            await waitFor(() => {
                expect(screen.getByText('Connection failed')).toBeInTheDocument();
            });
        });
    });

    describe('Examples Step', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            renderOnboarding();
            
            // Navigate to examples step
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton); // Welcome -> Virtues
                fireEvent.click(screen.getByText('Next')); // Virtues -> Media
                fireEvent.click(screen.getByText('Next')); // Media -> Feedback
                fireEvent.click(screen.getByText('Next')); // Feedback -> LLM
                fireEvent.click(screen.getByText('Next')); // LLM -> Examples
            });
        });

        test('should display personalized examples', () => {
            expect(screen.getByText('See It in Action')).toBeInTheDocument();
            expect(screen.getByText('Your SociallyFed Experience')).toBeInTheDocument();
        });

        test('should show example cards', () => {
            expect(screen.getByText('Daily Stoic Reflection')).toBeInTheDocument();
            expect(screen.getByText('Media Consumption Alert')).toBeInTheDocument();
            expect(screen.getByText('Weekly Feedback Loop')).toBeInTheDocument();
        });

        test('should display completion message', () => {
            expect(screen.getByText("You're Ready to Begin!")).toBeInTheDocument();
            expect(screen.getByText('Your SociallyFed configuration is complete.')).toBeInTheDocument();
        });
    });

    describe('Completion', () => {
        beforeEach(async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            mockSociallyFedConfig.updateStoicVirtues.mockResolvedValue();
            mockSociallyFedConfig.updateMediaConsumption.mockResolvedValue();
            mockSociallyFedConfig.updateCybernetics.mockResolvedValue();
            
            renderOnboarding();
            
            // Navigate through all steps
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton); // Welcome -> Virtues
                fireEvent.click(screen.getByText('Next')); // Virtues -> Media
                fireEvent.click(screen.getByText('Next')); // Media -> Feedback
                fireEvent.click(screen.getByText('Next')); // Feedback -> LLM
                fireEvent.click(screen.getByText('Next')); // LLM -> Examples
            });
        });

        test('should complete onboarding and call onComplete', async () => {
            const completeButton = screen.getByText('Complete Setup');
            fireEvent.click(completeButton);
            
            await waitFor(() => {
                expect(mockSociallyFedConfig.updateStoicVirtues).toHaveBeenCalled();
                expect(mockSociallyFedConfig.updateMediaConsumption).toHaveBeenCalled();
                expect(mockSociallyFedConfig.updateCybernetics).toHaveBeenCalled();
                expect(mockOnComplete).toHaveBeenCalled();
            });
        });

        test('should handle completion errors gracefully', async () => {
            mockSociallyFedConfig.updateStoicVirtues.mockRejectedValue(new Error('Update failed'));
            
            const completeButton = screen.getByText('Complete Setup');
            fireEvent.click(completeButton);
            
            await waitFor(() => {
                // Should still be on the examples step
                expect(screen.getByText('Complete Setup')).toBeInTheDocument();
            });
        });
    });

    describe('Progress Tracking', () => {
        test('should show progress bar', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
            });
        });

        test('should update progress as user navigates', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton);
                
                expect(screen.getByText('Step 2 of 6')).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        test('should allow back navigation', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton);
                
                const backButton = screen.getByText('Back');
                fireEvent.click(backButton);
                
                expect(screen.getByText('Welcome to SociallyFed')).toBeInTheDocument();
            });
        });

        test('should disable back button on first step', async () => {
            mockSociallyFedConfig.initialize.mockResolvedValue();
            
            renderOnboarding();
            
            await waitFor(() => {
                const backButton = screen.getByText('Back');
                expect(backButton).toBeDisabled();
            });
        });
    });
}); 