import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SociallyFedOnboarding from "../components/Onboarding/SociallyFedOnboarding";
import { sociallyFedConfig } from "../services/SociallyFedConfigService";
import "./SociallyFedOnboardingPage.css";

const SociallyFedOnboardingPage = () => {
    const history = useHistory();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            await sociallyFedConfig.initialize();
            const config = sociallyFedConfig.getConfig();
            
            // Check if user has completed basic onboarding
            const hasVirtues = Object.values(config.stoicVirtues.virtues).some(virtue => virtue.enabled);
            const hasMediaConfig = config.mediaConsumption.trackingMode !== 'passive' || 
                                 config.mediaConsumption.pyramidLevels.servedContent.dailyLimit !== 60;
            const hasFeedbackLoops = config.cybernetics.feedbackLoops.daily.enabled || 
                                   config.cybernetics.feedbackLoops.weekly.enabled;
            
            setHasCompletedOnboarding(hasVirtues && (hasMediaConfig || hasFeedbackLoops));
        } catch (error) {
            console.error('Failed to check onboarding status:', error);
        }
    };

    const handleOnboardingComplete = () => {
        setHasCompletedOnboarding(true);
        
        // Navigate to main app or settings
        history.replace('/settings');
    };

    const handleSkipOnboarding = () => {
        history.replace('/settings');
    };

    if (hasCompletedOnboarding) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>SociallyFed Setup</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div className="onboarding-completed">
                        <div className="completed-content">
                            <h2>Welcome Back!</h2>
                            <p>You've already completed the SociallyFed setup. You can modify your configuration in the settings.</p>
                            <button 
                                className="settings-button"
                                onClick={() => history.push('/sociallyfed-settings')}
                            >
                                Open SociallyFed Settings
                            </button>
                            <button 
                                className="skip-button"
                                onClick={handleSkipOnboarding}
                            >
                                Go to Main Settings
                            </button>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <SociallyFedOnboarding onComplete={handleOnboardingComplete} />
        </IonPage>
    );
};

export default SociallyFedOnboardingPage; 