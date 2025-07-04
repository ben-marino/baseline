import "./JournalComponents.css";
import { MutableRefObject, useCallback, useEffect } from "react";
import history from "../../history";
import { closeOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { encrypt } from "../../helpers";
import WriteJournal from "./WriteJournal";
import RecordJournal from "./RecordJournal";
import { getInfoBadge } from "./InfoBadge";
import SociallyFedJournalExtensions from "./SociallyFedJournalExtensions";
import { VirtueAlignment, MediaConsumption } from "../../db";
import { EmotionalRegulation, GoalProgress } from "../../pages/Journal";

interface Props {
    setMoodRead: (mood: number) => void;
    moodWrite: number;
    setText: (text: string) => void;
    editTimestamp: number | null;
    text: string;
    audioChunks: MutableRefObject<Blob[]>;
    elapsedTime: number;
    setElapsedTime: (time: number) => void;
    audioView: boolean;
    setAudioView: (view: boolean) => void;
    addFlag: string | null;
    // SociallyFed props
    sociallyFedEnabled: boolean;
    virtueAlignment: VirtueAlignment;
    setVirtueAlignment: (alignment: VirtueAlignment) => void;
    mediaConsumption: MediaConsumption;
    setMediaConsumption: (consumption: MediaConsumption) => void;
    emotionalRegulation: EmotionalRegulation;
    setEmotionalRegulation: (regulation: EmotionalRegulation) => void;
    goalProgress: GoalProgress;
    setGoalProgress: (progress: GoalProgress) => void;
}

const StartJournal = ({ 
    setMoodRead, 
    moodWrite, 
    text, 
    setText, 
    editTimestamp, 
    audioChunks, 
    elapsedTime, 
    setElapsedTime, 
    audioView, 
    setAudioView, 
    addFlag,
    // SociallyFed props
    sociallyFedEnabled,
    virtueAlignment,
    setVirtueAlignment,
    mediaConsumption,
    setMediaConsumption,
    emotionalRegulation,
    setEmotionalRegulation,
    goalProgress,
    setGoalProgress
} : Props) => {
    const next = useCallback(() => {
        history.push("/journal/finish");
    }, []);

    useEffect(() => {
        setMoodRead(moodWrite);
    }, [setMoodRead, moodWrite]);

    useEffect(() => {
        if (!text || editTimestamp || addFlag) return;

        const pwd = sessionStorage.getItem("pwd");
        if (pwd) {
            localStorage.setItem("eautosave", encrypt(text, pwd));
        } else {
            localStorage.setItem("autosave", text);
        }
    }, [text, editTimestamp, addFlag]);

    let title = "What's happening?";
    const summaryJournal = addFlag?.startsWith("summary");
    if (summaryJournal) title = "What happened?";

    const subtitle = "What have you been doing, how have you been feeling, and why might you be feeling that way?";
    const infoBadge = getInfoBadge(editTimestamp, addFlag);

    return (
        <div className="container">
            <IonIcon className="top-corner x" icon={closeOutline} onClick={() => history.push("/summary")}></IonIcon>
            <div className="center-journal">
                <div className="title">{ title }</div>
                { !infoBadge && <p className="text-center bold max-width-600 margin-top-8">{ subtitle }</p> }
                { infoBadge }
                { !audioView && <WriteJournal 
                    text={text} 
                    setText={setText} 
                    next={next} 
                    setAudioView={setAudioView} 
                    editTimestamp={editTimestamp}
                /> }
                { audioView && <RecordJournal 
                    audioChunks={audioChunks} 
                    elapsedTime={elapsedTime}
                    setElapsedTime={setElapsedTime}
                    next={next}
                    setAudioView={setAudioView}
                /> }
                
                {/* SociallyFed Extensions */}
                <SociallyFedJournalExtensions
                    onVirtueAlignmentChange={setVirtueAlignment}
                    onMediaConsumptionChange={setMediaConsumption}
                    onEmotionalRegulationChange={setEmotionalRegulation}
                    onGoalProgressChange={setGoalProgress}
                    initialVirtueAlignment={virtueAlignment}
                    initialMediaConsumption={mediaConsumption}
                    isEnabled={sociallyFedEnabled}
                />
            </div>
        </div>
    );
};

export default StartJournal;
