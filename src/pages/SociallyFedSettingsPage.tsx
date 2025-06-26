import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonBackButton, IonButtons } from "@ionic/react";
import SociallyFedSettings from "../components/Settings/SociallyFedSettings";
import "./SociallyFedSettingsPage.css";

const SociallyFedSettingsPage = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/settings" />
                    </IonButtons>
                    <IonTitle>SociallyFed Configuration</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <SociallyFedSettings />
            </IonContent>
        </IonPage>
    );
};

export default SociallyFedSettingsPage; 