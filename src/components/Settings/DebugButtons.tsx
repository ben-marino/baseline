import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useCallback } from "react";
import { ref, remove } from "firebase/database";
import { toast } from "../../helpers";
import { IonButton, IonItem, IonLabel } from "@ionic/react";
import { DateTime } from "luxon";
import ldb from "../../db";
import { migrateAllLogs, getSociallyFedStats, migrateSociallyFedData, getUserMigrationPreferences, updateUserMigrationPreferences } from "../../helpers";

const addWIRFakeData = () => {
    let date = DateTime.now().minus({ days: 2 });
    for (let i = 0; i < 28; i++) {
        ldb.logs.add({
            timestamp: date.toMillis(),
            month: date.month,
            day: date.day,
            year: date.year,
            time: "1:00",
            zone: date.zoneName,
            average: "average",
            mood: Math.round((Math.random() * 10) - 5),
            journal: "fake",
            files: []
        })
        
        date = date.minus({ days: 1 });
    }

    toast("Added fake data!");
};

const setOneTodayOneTomorrow = () => {
    ldb.logs.clear();
    const d1 = DateTime.now().plus({ days: 1 });
    ldb.logs.add({
        timestamp: d1.toMillis(),
        month: d1.month,
        day: d1.day,
        year: d1.year,
        time: "1:00",
        zone: d1.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })

    // This log happens the day before, but has a higher timestamp!
    const d2 = DateTime.now()
    ldb.logs.add({
        timestamp: d1.toMillis() + 1000,
        month: d2.month,
        day: d2.day,
        year: d2.year,
        time: "1:00",
        zone: d2.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })
}

const setOneYesterdayOneTomorrow = () => {
    ldb.logs.clear();
    const d1 = DateTime.now().plus({ days: 1 });
    ldb.logs.add({
        timestamp: d1.toMillis(),
        month: d1.month,
        day: d1.day,
        year: d1.year,
        time: "1:00",
        zone: d1.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })

    const d2 = DateTime.now().minus({ days: 1 })
    ldb.logs.add({
        timestamp: d2.toMillis(),
        month: d2.month,
        day: d2.day,
        year: d2.year,
        time: "1:00",
        zone: d2.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })
}

const setOneTwoDaysAgoOneTodayOneTomorrow = () => {
    ldb.logs.clear();
    const d1 = DateTime.now().plus({ days: 1 });
    ldb.logs.add({
        timestamp: d1.toMillis(),
        month: d1.month,
        day: d1.day,
        year: d1.year,
        time: "1:00",
        zone: d1.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })

    const d2 = DateTime.now().minus({ days: 2 })
    ldb.logs.add({
        timestamp: d2.toMillis(),
        month: d2.month,
        day: d2.day,
        year: d2.year,
        time: "1:00",
        zone: d2.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })

    // This log happens the "today", but has a higher timestamp that tomorrow!
    const d3 = DateTime.now()
    ldb.logs.add({
        timestamp: d1.toMillis() + 1000,
        month: d3.month,
        day: d3.day,
        year: d3.year,
        time: "1:00",
        zone: d3.zoneName,
        average: "average",
        mood: Math.round((Math.random() * 10) - 5),
        journal: "fake",
        files: []
    })
}

const DebugButtons = () => {
    const [user] = useAuthState(auth);
    const clearJournalPrompt = useCallback(() => {
        if (!user) return;
        
        remove(ref(db, `${user.uid}/prompts/streak`)).then(() => {
            toast("Cleared journal prompt from DB!");
        });
    }, [user]);

    const handleMigrateLogs = async () => {
        try {
            await migrateAllLogs();
            alert("Migration completed successfully!");
        } catch (error) {
            console.error("Migration failed:", error);
            alert("Migration failed. Check console for details.");
        }
    };

    const handleEnhancedMigration = async () => {
        try {
            const stats = await migrateSociallyFedData();
            alert(`Enhanced Migration completed!
Total: ${stats.total}
Migrated: ${stats.migrated}
Errors: ${stats.errors}

Features Added:
- Virtues: ${stats.features.virtues}
- Media: ${stats.features.media}
- Patterns: ${stats.features.patterns}
- Cybernetics: ${stats.features.cybernetics}
- Prompts: ${stats.features.prompts}`);
        } catch (error) {
            console.error("Enhanced migration failed:", error);
            alert("Enhanced migration failed. Check console for details.");
        }
    };

    const handleGetStats = async () => {
        try {
            const stats = await getSociallyFedStats();
            const preferences = stats.userPreferences;
            
            alert(`SociallyFed Stats:
Total Logs: ${stats.totalLogs}
Logs with Virtues: ${stats.logsWithVirtues}
Logs with Media: ${stats.logsWithMedia}
Logs with Patterns: ${stats.logsWithPatterns}
Logs with Cybernetics: ${stats.logsWithCybernetics}
Logs with Prompts: ${stats.logsWithPrompts}

User Preferences:
- Virtue Tracking: ${preferences?.enableVirtueTracking ? 'Enabled' : 'Disabled'}
- Media Tracking: ${preferences?.enableMediaTracking ? 'Enabled' : 'Disabled'}
- Pattern Tracking: ${preferences?.enablePatternTracking ? 'Enabled' : 'Disabled'}
- Cybernetics: ${preferences?.enableCybernetics ? 'Enabled' : 'Disabled'}
- AI Analysis: ${preferences?.enableAIAnalysis ? 'Enabled' : 'Disabled'}
- Privacy Level: ${preferences?.privacyLevel}`);
        } catch (error) {
            console.error("Failed to get stats:", error);
            alert("Failed to get stats. Check console for details.");
        }
    };

    const handleResetPreferences = async () => {
        try {
            await updateUserMigrationPreferences({
                enableVirtueTracking: true,
                enableMediaTracking: true,
                enablePatternTracking: true,
                enableCybernetics: true,
                enableAIAnalysis: true,
                privacyLevel: 'standard'
            });
            alert("Preferences reset to defaults successfully!");
        } catch (error) {
            console.error("Failed to reset preferences:", error);
            alert("Failed to reset preferences. Check console for details.");
        }
    };

    return <>
        <IonButton style={{"display": "none"}} mode="ios" onClick={addWIRFakeData}>Add Local Fake Data For WIR</IonButton>
        <IonButton style={{"display": "none"}} mode="ios" onClick={setOneTodayOneTomorrow}>One Today One Tomorrow</IonButton>
        <IonButton style={{"display": "none"}} mode="ios" onClick={setOneYesterdayOneTomorrow}>One Yesterday One Tomorrow</IonButton>
        <IonButton style={{"display": "none"}} mode="ios" onClick={setOneTwoDaysAgoOneTodayOneTomorrow}>One Two Days Ago One Today One Tomorrow</IonButton>
        { user && <IonButton style={{"display": "none"}} mode="ios" onClick={clearJournalPrompt}>Clear Journal Prompt from DB</IonButton> }
        <IonItem>
            <IonLabel>SociallyFed Migration</IonLabel>
            <IonButton slot="end" onClick={handleMigrateLogs}>
                Basic Migration
            </IonButton>
        </IonItem>
        
        <IonItem>
            <IonLabel>Enhanced Migration</IonLabel>
            <IonButton slot="end" onClick={handleEnhancedMigration}>
                Enhanced Migration
            </IonButton>
        </IonItem>
        
        <IonItem>
            <IonLabel>SociallyFed Statistics</IonLabel>
            <IonButton slot="end" onClick={handleGetStats}>
                Get Stats
            </IonButton>
        </IonItem>
        
        <IonItem>
            <IonLabel>Reset Preferences</IonLabel>
            <IonButton slot="end" onClick={handleResetPreferences}>
                Reset to Defaults
            </IonButton>
        </IonItem>
    </>
}

export default DebugButtons;