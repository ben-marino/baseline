import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { getSociallyFedStats, migrateSociallyFedData } from "../helpers";
import history from "../history";
import EndSpacer from "../components/EndSpacer";
import VirtueAlignmentRadar from "../components/SociallyFed/VirtueAlignmentRadar";
import MediaConsumptionPyramid from "../components/SociallyFed/MediaConsumptionPyramid";
import PatternInsights from "../components/SociallyFed/PatternInsights";
import WeeklyProgress from "../components/SociallyFed/WeeklyProgress";
import "./Container.css";
import "./SociallyFedDashboard.css";

const SociallyFedDashboard = () => {
    const [user] = useAuthState(auth);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [migrationStatus, setMigrationStatus] = useState<string>("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                const socialStats = await getSociallyFedStats();
                setStats(socialStats);
            } catch (error) {
                console.error("Failed to load SociallyFed stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const handleMigration = async () => {
        try {
            setMigrationStatus("Migrating data...");
            const result = await migrateSociallyFedData();
            setMigrationStatus(`Migration complete! ${result.migrated}/${result.total} logs migrated.`);
            
            // Reload stats after migration
            const socialStats = await getSociallyFedStats();
            setStats(socialStats);
        } catch (error) {
            console.error("Migration failed:", error);
            setMigrationStatus("Migration failed. Check console for details.");
        }
    };

    if (loading) {
        return (
            <div className="container">
                <IonIcon className="top-corner x" icon={closeOutline} onClick={() => history.push("/summary")}></IonIcon>
                <div className="center-journal">
                    <div className="title">Loading SociallyFed Dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <IonIcon className="top-corner x" icon={closeOutline} onClick={() => history.push("/summary")}></IonIcon>
            <div className="center-journal">
                <div className="title">SociallyFed Dashboard</div>
                <p className="text-center margin-bottom-0">
                    Your enhanced journaling insights and virtue development tracking
                </p>
                
                {stats && (
                    <div className="sociallyfed-stats">
                        <p className="text-center">
                            <strong>Data Overview:</strong> {stats.totalLogs} total entries, 
                            {stats.logsWithVirtues} with virtue data, 
                            {stats.logsWithMedia} with media tracking
                        </p>
                    </div>
                )}

                {migrationStatus && (
                    <div className="migration-status">
                        <p className="text-center">{migrationStatus}</p>
                    </div>
                )}

                <div className="dashboard-grid">
                    <div className="dashboard-section">
                        <h3>Virtue Alignment</h3>
                        <VirtueAlignmentRadar />
                    </div>

                    <div className="dashboard-section">
                        <h3>Media Consumption Pyramid</h3>
                        <MediaConsumptionPyramid />
                    </div>

                    <div className="dashboard-section">
                        <h3>AI-Generated Patterns</h3>
                        <PatternInsights />
                    </div>

                    <div className="dashboard-section">
                        <h3>Weekly Progress</h3>
                        <WeeklyProgress />
                    </div>
                </div>

                {!stats?.userPreferences?.enableVirtueTracking && (
                    <div className="migration-prompt">
                        <p className="text-center">
                            Enable SociallyFed features to see enhanced insights and tracking.
                        </p>
                        <div className="finish-button" onClick={handleMigration}>
                            Enable SociallyFed Features
                        </div>
                    </div>
                )}

                <EndSpacer />
            </div>
        </div>
    );
};

export default SociallyFedDashboard; 