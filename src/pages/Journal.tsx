import { Route } from "react-router-dom";
import StartJournal from "../components/Journal/StartJournal";
import FinishJournal from "../components/Journal/FinishJournal";
import { useEffect, useRef, useState } from "react";
import "./Container.css";
import { checkKeys, decrypt } from "../helpers";
import { signOutAndCleanUp } from "../firebase";
import * as Sentry from "@sentry/react";
import { sociallyFedConfig } from "../services/SociallyFedConfigService";
import { VirtueAlignment, MediaConsumption, getDefaultVirtueAlignment, getDefaultMediaConsumption } from "../db";

export interface SpotifySelection {
    uri: string;
    name: string;
}

// SociallyFed data interfaces
export interface EmotionalRegulation {
    techniques: string[];
    effectiveness: number;
    triggers: string[];
    copingStrategies: string[];
}

export interface GoalProgress {
    goals: Array<{
        id: string;
        name: string;
        progress: number;
        category: string;
        notes?: string;
    }>;
    overallProgress: number;
}

const getStartingText = () => {
    let text = "";
    if (localStorage.getItem("eautosave")) {
        const pwd = sessionStorage.getItem("pwd");
        if (pwd) text = decrypt(localStorage.getItem("eautosave") ?? "", pwd);
    } else {
        const autosave = localStorage.getItem("autosave");
        if (autosave) {
            text = autosave;
        }
    }

    return text;
}

const Journal = () => {
    // Standard journaling
    const [text, setText] = useState(getStartingText);
    const [files, setFiles] = useState([]);
    const [moodRead, setMoodRead] = useState(0);
    const [moodWrite, setMoodWrite] = useState(0);
    const [average, setAverage] = useState("average");
    // Editing
    const [editTimestamp, setEditTimestamp] = useState<number | null>(null);
    // Add flag
    const [addFlag, setAddFlag] = useState<string | null>(null);
    // Spotify integration
    const [song, setSong] = useState<SpotifySelection | undefined>(undefined);
    // Audio recording
    const audioChunks = useRef<Blob[]>([]);
    const [audioView, setAudioView] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    
    // SociallyFed extensions
    const [sociallyFedEnabled, setSociallyFedEnabled] = useState(false);
    const [virtueAlignment, setVirtueAlignment] = useState<VirtueAlignment>(getDefaultVirtueAlignment());
    const [mediaConsumption, setMediaConsumption] = useState<MediaConsumption>(getDefaultMediaConsumption());
    const [emotionalRegulation, setEmotionalRegulation] = useState<EmotionalRegulation>({
        techniques: [],
        effectiveness: 5,
        triggers: [],
        copingStrategies: []
    });
    const [goalProgress, setGoalProgress] = useState<GoalProgress>({
        goals: [],
        overallProgress: 0
    });
    
    useEffect(() => {
        const keys = checkKeys();
        if (!keys) {
            Sentry.addBreadcrumb({
                category: "Journal.tsx",
                message: "Sign Out"
            });
            signOutAndCleanUp();
        }
        
        // Initialize SociallyFed configuration
        const initializeSociallyFed = async () => {
            try {
                await sociallyFedConfig.initialize();
                const config = sociallyFedConfig.getConfig();
                setSociallyFedEnabled(config.features.enableVirtueTracking || config.features.enableMediaTracking);
            } catch (error) {
                console.error('Failed to initialize SociallyFed config:', error);
                setSociallyFedEnabled(false);
            }
        };
        
        initializeSociallyFed();
        
        // Get edit parameters
        const editTimestamp = localStorage.getItem("editTimestamp");
        const editAverage = localStorage.getItem("editAverage");
        const editMood = localStorage.getItem("editMood");
        if (editTimestamp && editMood && editAverage) {
            setEditTimestamp(Number(editTimestamp));
            setMoodRead(Number(editMood));
            setAverage(editAverage);
            localStorage.removeItem("editMood");
            localStorage.removeItem("editAverage");
            localStorage.removeItem("editTimestamp");
            localStorage.removeItem("autosave");
            localStorage.removeItem("eautosave");
        }

        const afl = localStorage.getItem("addFlag");
        if (afl) {
            setAddFlag(afl);
            setText("");
            localStorage.removeItem("addFlag");
        }
    }, []);

    return (
        <>
            <Route exact path="/journal">
                <StartJournal 
                    text={text} 
                    setText={setText} 
                    setMoodRead={setMoodRead} 
                    moodWrite={moodWrite} 
                    editTimestamp={editTimestamp}
                    audioChunks={audioChunks}
                    elapsedTime={elapsedTime}
                    setElapsedTime={setElapsedTime}
                    audioView={audioView}
                    setAudioView={setAudioView}
                    addFlag={addFlag}
                    // SociallyFed props
                    sociallyFedEnabled={sociallyFedEnabled}
                    virtueAlignment={virtueAlignment}
                    setVirtueAlignment={setVirtueAlignment}
                    mediaConsumption={mediaConsumption}
                    setMediaConsumption={setMediaConsumption}
                    emotionalRegulation={emotionalRegulation}
                    setEmotionalRegulation={setEmotionalRegulation}
                    goalProgress={goalProgress}
                    setGoalProgress={setGoalProgress}
                />
            </Route>
            <Route path="/journal/finish">
                <FinishJournal 
                    files={files} 
                    setFiles={setFiles} 
                    text={text} 
                    moodWrite={moodWrite} 
                    setMoodWrite={setMoodWrite} 
                    moodRead={moodRead} 
                    average={average} 
                    setAverage={setAverage} 
                    editTimestamp={editTimestamp}
                    song={song}
                    setSong={setSong}
                    audioChunks={audioChunks}
                    elapsedTime={elapsedTime}
                    addFlag={addFlag}
                    // SociallyFed props
                    sociallyFedEnabled={sociallyFedEnabled}
                    virtueAlignment={virtueAlignment}
                    mediaConsumption={mediaConsumption}
                    emotionalRegulation={emotionalRegulation}
                    goalProgress={goalProgress}
                />
            </Route>
        </>
    );
};

export default Journal;
