import { sociallyFedConfig } from '../SociallyFedConfigService';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});

describe('SociallyFedConfigService', () => {
    beforeEach(() => {
        localStorageMock.clear();
        sessionStorageMock.clear();
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with default configuration when no stored config exists', async () => {
            localStorageMock.getItem.mockReturnValue(null);
            
            await sociallyFedConfig.initialize();
            const config = sociallyFedConfig.getConfig();
            
            expect(config.llmServer.endpoint).toBe('localhost');
            expect(config.llmServer.port).toBe(3001);
            expect(config.features.enableVirtueTracking).toBe(true);
            expect(config.privacy.dataSharingLevel).toBe('standard');
        });

        it('should load existing configuration from localStorage', async () => {
            const mockConfig = {
                llmServer: { endpoint: 'test-server', port: 8080 },
                features: { enableVirtueTracking: false },
                privacy: { dataSharingLevel: 'minimal' },
                analysis: { mode: 'weekly' },
                virtues: [],
                preferences: {},
                lastUpdated: Date.now(),
                version: '1.0.0'
            };
            
            localStorageMock.getItem.mockReturnValue(JSON.stringify(mockConfig));
            
            await sociallyFedConfig.initialize();
            const config = sociallyFedConfig.getConfig();
            
            expect(config.llmServer.endpoint).toBe('test-server');
            expect(config.llmServer.port).toBe(8080);
            expect(config.features.enableVirtueTracking).toBe(false);
            expect(config.privacy.dataSharingLevel).toBe('minimal');
        });
    });

    describe('feature toggles', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should update feature toggles correctly', async () => {
            await sociallyFedConfig.updateFeatureToggles({
                enableVirtueTracking: false,
                enableAIAnalysis: false
            });
            
            const config = sociallyFedConfig.getConfig();
            expect(config.features.enableVirtueTracking).toBe(false);
            expect(config.features.enableAIAnalysis).toBe(false);
            expect(config.features.enableMediaTracking).toBe(true); // Should remain default
        });

        it('should check if features are enabled', async () => {
            await sociallyFedConfig.updateFeatureToggles({
                enableVirtueTracking: true,
                enableMediaTracking: false
            });
            
            expect(sociallyFedConfig.isFeatureEnabled('enableVirtueTracking')).toBe(true);
            expect(sociallyFedConfig.isFeatureEnabled('enableMediaTracking')).toBe(false);
        });
    });

    describe('LLM server configuration', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should update LLM server configuration', async () => {
            await sociallyFedConfig.updateLLMConfig({
                endpoint: 'custom-server',
                port: 9000,
                protocol: 'https'
            });
            
            const config = sociallyFedConfig.getConfig();
            expect(config.llmServer.endpoint).toBe('custom-server');
            expect(config.llmServer.port).toBe(9000);
            expect(config.llmServer.protocol).toBe('https');
        });

        it('should generate correct LLM URL', async () => {
            await sociallyFedConfig.updateLLMConfig({
                endpoint: 'test-server',
                port: 3001,
                protocol: 'http'
            });
            
            expect(sociallyFedConfig.getLLMUrl()).toBe('http://test-server:3001');
        });
    });

    describe('privacy configuration', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should update privacy settings', async () => {
            await sociallyFedConfig.updatePrivacyConfig({
                dataSharingLevel: 'minimal',
                allowAnonymousAnalytics: false,
                allowPatternSharing: false
            });
            
            const config = sociallyFedConfig.getConfig();
            expect(config.privacy.dataSharingLevel).toBe('minimal');
            expect(config.privacy.allowAnonymousAnalytics).toBe(false);
            expect(config.privacy.allowPatternSharing).toBe(false);
        });

        it('should check data sharing permissions', async () => {
            await sociallyFedConfig.updatePrivacyConfig({
                allowPatternSharing: true,
                allowVirtueSharing: false,
                allowMediaSharing: true,
                allowAnonymousAnalytics: false
            });
            
            expect(sociallyFedConfig.isDataSharingAllowed('patterns')).toBe(true);
            expect(sociallyFedConfig.isDataSharingAllowed('virtues')).toBe(false);
            expect(sociallyFedConfig.isDataSharingAllowed('media')).toBe(true);
            expect(sociallyFedConfig.isDataSharingAllowed('analytics')).toBe(false);
        });
    });

    describe('virtue management', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should get enabled virtues', async () => {
            const enabledVirtues = sociallyFedConfig.getEnabledVirtues();
            expect(enabledVirtues.length).toBeGreaterThan(0);
            expect(enabledVirtues.every(v => v.enabled)).toBe(true);
        });

        it('should get virtue by name', async () => {
            const stoicism = sociallyFedConfig.getVirtue('stoicism');
            expect(stoicism).toBeDefined();
            expect(stoicism?.name).toBe('stoicism');
            expect(stoicism?.weight).toBe(8);
        });

        it('should update virtue', async () => {
            await sociallyFedConfig.updateVirtue('stoicism', {
                weight: 10,
                description: 'Updated description'
            });
            
            const updatedVirtue = sociallyFedConfig.getVirtue('stoicism');
            expect(updatedVirtue?.weight).toBe(10);
            expect(updatedVirtue?.description).toBe('Updated description');
        });

        it('should add custom virtue', async () => {
            const customVirtue = {
                name: 'gratitude',
                description: 'Being thankful for what we have',
                weight: 9,
                enabled: true
            };
            
            await sociallyFedConfig.addCustomVirtue(customVirtue);
            
            const addedVirtue = sociallyFedConfig.getVirtue('gratitude');
            expect(addedVirtue).toBeDefined();
            expect(addedVirtue?.name).toBe('gratitude');
            expect(addedVirtue?.weight).toBe(9);
        });

        it('should remove virtue', async () => {
            await sociallyFedConfig.removeVirtue('temperance');
            
            const removedVirtue = sociallyFedConfig.getVirtue('temperance');
            expect(removedVirtue).toBeUndefined();
        });
    });

    describe('analysis frequency', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should update analysis frequency', async () => {
            await sociallyFedConfig.updateAnalysisFrequency({
                mode: 'weekly',
                preferredTime: '21:00'
            });
            
            const config = sociallyFedConfig.getConfig();
            expect(config.analysis.mode).toBe('weekly');
            expect(config.analysis.preferredTime).toBe('21:00');
        });

        it('should check if analysis should run', async () => {
            await sociallyFedConfig.updateAnalysisFrequency({
                mode: 'manual'
            });
            
            expect(sociallyFedConfig.shouldRunAnalysis()).toBe(false);
        });
    });

    describe('configuration export/import', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should export configuration as JSON', async () => {
            const exported = sociallyFedConfig.exportConfig();
            const parsed = JSON.parse(exported);
            
            expect(parsed.version).toBe('1.0.0');
            expect(parsed.llmServer).toBeDefined();
            expect(parsed.features).toBeDefined();
            expect(parsed.privacy).toBeDefined();
        });

        it('should import valid configuration', async () => {
            const testConfig = {
                version: '1.0.0',
                llmServer: { endpoint: 'imported-server', port: 5000 },
                features: { enableVirtueTracking: false },
                privacy: { dataSharingLevel: 'comprehensive' },
                analysis: { mode: 'daily' },
                virtues: [],
                preferences: {},
                lastUpdated: Date.now()
            };
            
            const result = await sociallyFedConfig.importConfig(JSON.stringify(testConfig));
            expect(result.success).toBe(true);
            
            const config = sociallyFedConfig.getConfig();
            expect(config.llmServer.endpoint).toBe('imported-server');
            expect(config.features.enableVirtueTracking).toBe(false);
        });

        it('should reject invalid configuration', async () => {
            const invalidConfig = { invalid: 'config' };
            
            const result = await sociallyFedConfig.importConfig(JSON.stringify(invalidConfig));
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid configuration format');
        });
    });

    describe('reset functionality', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        it('should reset to defaults', async () => {
            // Modify some settings
            await sociallyFedConfig.updateFeatureToggles({
                enableVirtueTracking: false
            });
            await sociallyFedConfig.updateLLMConfig({
                endpoint: 'custom-server'
            });
            
            // Reset to defaults
            await sociallyFedConfig.resetToDefaults();
            
            const config = sociallyFedConfig.getConfig();
            expect(config.features.enableVirtueTracking).toBe(true);
            expect(config.llmServer.endpoint).toBe('localhost');
        });
    });

    describe('Media Consumption Configuration', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        test('should update media consumption configuration', async () => {
            const mediaConfig = {
                trackingMode: 'active' as const,
                moodCorrelation: true,
                productivityImpact: false,
                socialComparisonTracking: true
            };

            await sociallyFedConfig.updateMediaConsumption(mediaConfig);
            const config = sociallyFedConfig.getMediaConsumptionConfig();

            expect(config.trackingMode).toBe('active');
            expect(config.moodCorrelation).toBe(true);
            expect(config.productivityImpact).toBe(false);
            expect(config.socialComparisonTracking).toBe(true);
        });

        test('should add social media platform', async () => {
            const platformConfig = {
                enabled: true,
                dailyLimit: 30,
                weeklyLimit: 210,
                notifications: true,
                blockAfterLimit: true
            };

            await sociallyFedConfig.addSocialMediaPlatform('instagram', platformConfig);
            const config = sociallyFedConfig.getMediaConsumptionConfig();

            expect(config.platforms.instagram).toEqual(platformConfig);
            expect(sociallyFedConfig.isSocialMediaPlatformEnabled('instagram')).toBe(true);
            expect(sociallyFedConfig.getSocialMediaDailyLimit('instagram')).toBe(30);
        });

        test('should remove social media platform', async () => {
            // First add a platform
            await sociallyFedConfig.addSocialMediaPlatform('twitter', {
                enabled: true,
                dailyLimit: 20,
                weeklyLimit: 140,
                notifications: false,
                blockAfterLimit: false
            });

            // Then remove it
            await sociallyFedConfig.removeSocialMediaPlatform('twitter');
            const config = sociallyFedConfig.getMediaConsumptionConfig();

            expect(config.platforms.twitter).toBeUndefined();
            expect(sociallyFedConfig.isSocialMediaPlatformEnabled('twitter')).toBe(false);
        });

        test('should update pyramid level configuration', async () => {
            const updates = {
                enabled: true,
                dailyLimit: 45,
                preferredTime: '19:00',
                autoBlock: true
            };

            await sociallyFedConfig.updatePyramidLevel('servedContent', updates);
            const config = sociallyFedConfig.getPyramidLevelConfig('servedContent');

            expect(config.enabled).toBe(true);
            expect(config.dailyLimit).toBe(45);
            expect(config.preferredTime).toBe('19:00');
            expect(config.autoBlock).toBe(true);
        });
    });

    describe('Stoic Virtues Configuration', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        test('should update stoic virtues configuration', async () => {
            const stoicConfig = {
                morningReflection: true,
                eveningReview: false,
                obstacleJournaling: true,
                gratitudePractice: true,
                mementoMori: false,
                amorFati: true
            };

            await sociallyFedConfig.updateStoicVirtues(stoicConfig);
            const config = sociallyFedConfig.getStoicVirtueConfig();

            expect(config.morningReflection).toBe(true);
            expect(config.eveningReview).toBe(false);
            expect(config.obstacleJournaling).toBe(true);
            expect(config.gratitudePractice).toBe(true);
            expect(config.mementoMori).toBe(false);
            expect(config.amorFati).toBe(true);
        });

        test('should update individual stoic virtue', async () => {
            const updates = {
                enabled: true,
                weight: 9,
                dailyPrompt: "What courageous action did you take today?",
                weeklyReflection: true,
                challengeTracking: true
            };

            await sociallyFedConfig.updateStoicVirtue('courage', updates);
            const config = sociallyFedConfig.getStoicVirtueConfig();

            expect(config.virtues.courage.enabled).toBe(true);
            expect(config.virtues.courage.weight).toBe(9);
            expect(config.virtues.courage.dailyPrompt).toBe("What courageous action did you take today?");
            expect(config.virtues.courage.weeklyReflection).toBe(true);
            expect(config.virtues.courage.challengeTracking).toBe(true);
        });

        test('should get enabled stoic virtues', () => {
            const enabledVirtues = sociallyFedConfig.getEnabledStoicVirtues();
            
            // Should return array of enabled virtue names
            expect(Array.isArray(enabledVirtues)).toBe(true);
            expect(enabledVirtues.every(virtue => ['courage', 'wisdom', 'justice', 'temperance'].includes(virtue))).toBe(true);
        });

        test('should check if stoic virtue is enabled', () => {
            expect(sociallyFedConfig.isStoicVirtueEnabled('courage')).toBe(true);
            expect(sociallyFedConfig.isStoicVirtueEnabled('wisdom')).toBe(true);
        });

        test('should get stoic virtue weight', () => {
            expect(sociallyFedConfig.getStoicVirtueWeight('courage')).toBe(8);
            expect(sociallyFedConfig.getStoicVirtueWeight('wisdom')).toBe(8);
            expect(sociallyFedConfig.getStoicVirtueWeight('justice')).toBe(7);
            expect(sociallyFedConfig.getStoicVirtueWeight('temperance')).toBe(6);
        });
    });

    describe('Cybernetic Configuration', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        test('should update cybernetic configuration', async () => {
            const cyberneticConfig = {
                autoAdjustment: false,
                learningRate: 0.3,
                adaptationThreshold: 0.8,
                feedbackSensitivity: 'high' as const
            };

            await sociallyFedConfig.updateCybernetics(cyberneticConfig);
            const config = sociallyFedConfig.getCyberneticConfig();

            expect(config.autoAdjustment).toBe(false);
            expect(config.learningRate).toBe(0.3);
            expect(config.adaptationThreshold).toBe(0.8);
            expect(config.feedbackSensitivity).toBe('high');
        });

        test('should update feedback loop configuration', async () => {
            const updates = {
                enabled: true,
                time: '09:00',
                moodTracking: true,
                goalProgress: false,
                habitTracking: true
            };

            await sociallyFedConfig.updateFeedbackLoop('daily', updates);
            const config = sociallyFedConfig.getCyberneticConfig();

            expect(config.feedbackLoops.daily.enabled).toBe(true);
            expect(config.feedbackLoops.daily.time).toBe('09:00');
            expect(config.feedbackLoops.daily.moodTracking).toBe(true);
            expect(config.feedbackLoops.daily.goalProgress).toBe(false);
            expect(config.feedbackLoops.daily.habitTracking).toBe(true);
        });

        test('should get enabled feedback loops', () => {
            const enabledLoops = sociallyFedConfig.getEnabledFeedbackLoops();
            
            // Should return array of enabled loop types
            expect(Array.isArray(enabledLoops)).toBe(true);
            expect(enabledLoops.every(loop => ['daily', 'weekly', 'monthly'].includes(loop))).toBe(true);
        });

        test('should check if feedback loop is enabled', () => {
            expect(sociallyFedConfig.isFeedbackLoopEnabled('daily')).toBe(true);
            expect(sociallyFedConfig.isFeedbackLoopEnabled('weekly')).toBe(true);
            expect(sociallyFedConfig.isFeedbackLoopEnabled('monthly')).toBe(true);
        });

        test('should update weekly feedback loop with day selection', async () => {
            const updates = {
                enabled: true,
                day: 'friday' as const,
                time: '17:00',
                patternAnalysis: true,
                goalReview: false,
                habitReview: true
            };

            await sociallyFedConfig.updateFeedbackLoop('weekly', updates);
            const config = sociallyFedConfig.getCyberneticConfig();

            expect(config.feedbackLoops.weekly.enabled).toBe(true);
            expect(config.feedbackLoops.weekly.day).toBe('friday');
            expect(config.feedbackLoops.weekly.time).toBe('17:00');
            expect(config.feedbackLoops.weekly.patternAnalysis).toBe(true);
            expect(config.feedbackLoops.weekly.goalReview).toBe(false);
            expect(config.feedbackLoops.weekly.habitReview).toBe(true);
        });

        test('should update monthly feedback loop with day number', async () => {
            const updates = {
                enabled: true,
                day: 20,
                time: '14:00',
                trendAnalysis: true,
                goalAdjustment: false,
                systemOptimization: true
            };

            await sociallyFedConfig.updateFeedbackLoop('monthly', updates);
            const config = sociallyFedConfig.getCyberneticConfig();

            expect(config.feedbackLoops.monthly.enabled).toBe(true);
            expect(config.feedbackLoops.monthly.day).toBe(20);
            expect(config.feedbackLoops.monthly.time).toBe('14:00');
            expect(config.feedbackLoops.monthly.trendAnalysis).toBe(true);
            expect(config.feedbackLoops.monthly.goalAdjustment).toBe(false);
            expect(config.feedbackLoops.monthly.systemOptimization).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        beforeEach(async () => {
            await sociallyFedConfig.initialize();
        });

        test('should maintain all configurations after reset', async () => {
            // Set up various configurations
            await sociallyFedConfig.updateMediaConsumption({ trackingMode: 'intervention' });
            await sociallyFedConfig.updateStoicVirtue('courage', { weight: 10 });
            await sociallyFedConfig.updateCybernetics({ learningRate: 0.9 });

            // Verify configurations are set
            expect(sociallyFedConfig.getMediaConsumptionConfig().trackingMode).toBe('intervention');
            expect(sociallyFedConfig.getStoicVirtueConfig().virtues.courage.weight).toBe(10);
            expect(sociallyFedConfig.getCyberneticConfig().learningRate).toBe(0.9);

            // Reset to defaults
            await sociallyFedConfig.resetToDefaults();

            // Verify configurations are reset
            expect(sociallyFedConfig.getMediaConsumptionConfig().trackingMode).toBe('passive');
            expect(sociallyFedConfig.getStoicVirtueConfig().virtues.courage.weight).toBe(8);
            expect(sociallyFedConfig.getCyberneticConfig().learningRate).toBe(0.5);
        });

        test('should handle complex configuration updates', async () => {
            // Update multiple configurations simultaneously
            await sociallyFedConfig.updateConfig({
                mediaConsumption: {
                    trackingMode: 'active',
                    moodCorrelation: true
                } as any,
                stoicVirtues: {
                    morningReflection: true,
                    eveningReview: true
                } as any,
                cybernetics: {
                    autoAdjustment: true,
                    feedbackSensitivity: 'high'
                } as any
            });

            const config = sociallyFedConfig.getConfig();

            expect(config.mediaConsumption.trackingMode).toBe('active');
            expect(config.mediaConsumption.moodCorrelation).toBe(true);
            expect(config.stoicVirtues.morningReflection).toBe(true);
            expect(config.stoicVirtues.eveningReview).toBe(true);
            expect(config.cybernetics.autoAdjustment).toBe(true);
            expect(config.cybernetics.feedbackSensitivity).toBe('high');
        });

        test('should validate configuration integrity', () => {
            const config = sociallyFedConfig.getConfig();

            // Check that all required properties exist
            expect(config.mediaConsumption).toBeDefined();
            expect(config.stoicVirtues).toBeDefined();
            expect(config.cybernetics).toBeDefined();

            // Check media consumption structure
            expect(config.mediaConsumption.platforms).toBeDefined();
            expect(config.mediaConsumption.pyramidLevels).toBeDefined();
            expect(config.mediaConsumption.trackingMode).toBeDefined();

            // Check stoic virtues structure
            expect(config.stoicVirtues.virtues).toBeDefined();
            expect(config.stoicVirtues.virtues.courage).toBeDefined();
            expect(config.stoicVirtues.virtues.wisdom).toBeDefined();
            expect(config.stoicVirtues.virtues.justice).toBeDefined();
            expect(config.stoicVirtues.virtues.temperance).toBeDefined();

            // Check cybernetics structure
            expect(config.cybernetics.feedbackLoops).toBeDefined();
            expect(config.cybernetics.feedbackLoops.daily).toBeDefined();
            expect(config.cybernetics.feedbackLoops.weekly).toBeDefined();
            expect(config.cybernetics.feedbackLoops.monthly).toBeDefined();
            expect(config.cybernetics.goalTypes).toBeDefined();
        });
    });
}); 