import { IonAlert, IonIcon, IonSpinner, IonButton, IonItem, IonLabel } from "@ionic/react";
import { closeOutline, settings, server, chevronForward, school } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import EndSpacer from "../components/EndSpacer";
import KeyboardSpacer from "../components/KeyboardSpacer";
import PDP from "../components/Settings/PDP";
import SettingsBox from "../components/Settings/SettingsBox";
import SociallyFedSettingsBox from "../components/Settings/SociallyFedSettingsBox";
import { auth, signOutAndCleanUp } from "../firebase";
import { goBackSafely, toast } from "../helpers";
import history from "../history";
import * as Sentry from "@sentry/react";
import DebugButtons from "../components/Settings/DebugButtons";

const Settings = () => {
    const [doingAsyncTask, setDoingAsyncTask] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [user] = useAuthState(auth);
    useEffect(() => {
        if (localStorage.getItem("ekeys") && !sessionStorage.getItem("pwd")) history.replace("/unlock");
    }, []);

    return <div className="container">
        { !doingAsyncTask && <IonIcon className="top-corner x" icon={closeOutline} onClick={goBackSafely}></IonIcon> }
        { doingAsyncTask && <IonSpinner className="top-corner x loader" name="crescent" /> }
        <div className="center-journal container">
            <div className="title">Settings</div>
            <div className="br"></div>
            <div style={{"maxWidth": "600px"}}>
                <SettingsBox
                    title="Reduce Motion"
                    attr="reduceMotion"
                    description="Turn this on to disable some animations. This typically won't increase performance by any noticable amount."
                />
                <SettingsBox
                    title="Use Colorblind-Friendly Colors"
                    attr="colorblind"
                    description="Turn this on to use colorblind-friendly colors on the summary page graphs."
                />
                <SettingsBox
                    title="Skip Week In Review"
                    attr="skipWIR"
                    description="Turn this on to get the option to skip Week In Review each week. (We don't recommend turning this on — Week In Review is quite useful, and only takes a few minutes each week.)"
                />
                
                {/* SociallyFed Settings Section */}
                <div className="br"></div>
                <div className="sociallyfed-settings-section">
                    <h3 style={{ margin: "16px 0 8px 0", color: "var(--ion-color-primary)" }}>
                        <IonIcon icon={settings} style={{ marginRight: "8px" }} />
                        SociallyFed Features
                    </h3>
                    <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--ion-color-medium)" }}>
                        Configure local LLM server, privacy preferences, and SociallyFed feature toggles.
                    </p>
                    
                    {/* Quick SociallyFed Toggles */}
                    <SociallyFedSettingsBox
                        title="Virtue Tracking"
                        feature="virtue-tracking"
                        configKey="enableVirtueTracking"
                        description="Track daily virtue alignment and stoic practices."
                    />
                    <SociallyFedSettingsBox
                        title="Media Consumption Tracking"
                        feature="media-tracking"
                        configKey="enableMediaTracking"
                        description="Monitor media usage patterns and their impact on mood."
                    />
                    <SociallyFedSettingsBox
                        title="Pattern Recognition"
                        feature="pattern-tracking"
                        configKey="enablePatternTracking"
                        description="Identify behavioral patterns and correlations."
                    />
                    <SociallyFedSettingsBox
                        title="AI Analysis"
                        feature="ai-analysis"
                        configKey="enableAIAnalysis"
                        description="Enable AI-powered insights and recommendations."
                    />
                    
                    {/* SociallyFed Settings */}
                    <IonItem button onClick={() => history.push('/sociallyfed-settings')}>
                        <IonIcon icon={server} slot="start" />
                        <IonLabel>
                            <h2>SociallyFed Configuration</h2>
                            <p>Configure local LLM server and philosophical frameworks</p>
                        </IonLabel>
                        <IonIcon icon={chevronForward} slot="end" />
                    </IonItem>

                    {/* SociallyFed Onboarding */}
                    <IonItem button onClick={() => history.push('/sociallyfed-onboarding')}>
                        <IonIcon icon={school} slot="start" />
                        <IonLabel>
                            <h2>SociallyFed Setup Guide</h2>
                            <p>Complete guided setup for philosophical frameworks</p>
                        </IonLabel>
                        <IonIcon icon={chevronForward} slot="end" />
                    </IonItem>
                </div>
                
                <PDP taskBlock={setDoingAsyncTask} />
                <div className="br"></div>
                <p className="margin-bottom-0" style={{"alignSelf": "flex-start"}}>Need help? Email us at <a href="mailto:hello@getbaseline.app">hello@getbaseline.app</a>.</p>
                <p>
                    baseline is an open source, volunteer-driven project. If there's a feature you'd like to see or 
                    feedback you have for us, <a href="mailto:feedback@getbaseline.app">email us!</a> And if you'd like
                    to contribute code to baseline, <a href="https://github.com/nkalupahana/baseline" target="_blank" rel="noreferrer">check us out on GitHub</a> — we 
                    appreciate any help we can get. Finally, if you have financial resources to 
                    spare, <span className="fake-link" onClick={() => history.push("/donate")}>please donate!</span> 100% of 
                    your donation goes right back to users through the gap fund, or to help get baseline to more people.
                </p>
                <p>
                    If you'd like to delete your account, <span className="fake-link" onClick={() => setDeleteAlert(true)}>click here.</span> You'll be prompted to sign in again to confirm.
                </p>
            </div>
            <DebugButtons />
        </div>
        <IonAlert
            isOpen={deleteAlert}
            onDidDismiss={() => setDeleteAlert(false)}
            header="Are you sure?"
            message="Deleting your account will result in all of your data being irreversibly lost. This cannot be undone. You will need to sign in again to complete the deletion process."
            buttons={[
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'confirm',
                    handler: () => { 
                        sessionStorage.setItem("deleteAccount", user.uid);
                        Sentry.addBreadcrumb({
                            category: "Delete Account",
                            message: "Sign Out"
                        });
                        signOutAndCleanUp();
                        toast("Sign in again now to delete your account.");
                    }
                }
            ]}
        />
        <KeyboardSpacer />
        <EndSpacer />
    </div>;
};

export default Settings;