import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import SociallyFedSettings from "../components/Settings/SociallyFedSettings";

const SociallyFedSettingsPage = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>SociallyFed Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <SociallyFedSettings />
            </IonContent>
        </IonPage>
    );
};

export default SociallyFedSettingsPage; 