import AES from "crypto-js/aes";
import { DateTime } from "luxon";
import Toastify from "toastify-js";
import ldb, { Log, validateVirtueAlignment, validateMediaConsumption, validatePatterns, validateCybernetics, validatePromptMetadata, validateSociallyFedPreferences, getDefaultVirtueAlignment, getDefaultMediaConsumption, getDefaultPatterns, getDefaultCybernetics, getDefaultPromptMetadata, getDefaultSociallyFedPreferences, SociallyFedPreferences } from "./db";
import { signOutAndCleanUp, db } from "./firebase";
import history from "./history";
import aesutf8 from "crypto-js/enc-utf8";
import hash from "crypto-js/sha512";
import { getIdToken, User } from "firebase/auth";
import { get, orderByKey, query, ref } from "firebase/database";
import Fuse from "fuse.js";
import { murmurhash3_32_gc } from "./murmurhash3_gc";
import UAParser from "ua-parser-js";
import * as Sentry from "@sentry/react";

export interface AnyMap {
    [key: string]: any;
}

export enum PullDataStates {
    NOT_STARTED,
    NOT_ENOUGH_DATA
}

export function getTime() {
    return Math.round(Date.now() / 1000);
}

export function getDateFromLog(log: Log) {
    return DateTime.fromObject({year: log.year, month: log.month, day: log.day});
}

const SECONDS_IN_DAY = 86400;
// https://materializecss.com/color
export const COLORS: AnyMap = {
    "-5": "#d50000",
    "-4": "#f44336", // red accent-4
    "-3": "#f57c00", // orange darken-2
    "-2": "#ffb300", // amber darken-1
    "-1": "#fdd835", // yellow darken-1
    "0": "#03a9f4",  // light-blue
    "1": "#4fc3f7",  // light-blue lighten-2
    "2": "#cddc39",  // lime
    "3": "#8bc34a",  // light-green
    "4": "#43a047",  // green darken-1
    "5": "#1b5e20"   // green darken-3
};

// based on jet color scale
export const COLORS_CB: AnyMap = {
    "-5": "var(--background-color-inverted)",
    "-4": "#120176",
    "-3": "#4000B5",
    "-2": "#9301D1",
    "-1": "#AD0293",
    "0": "#D2123A",
    "1": "#F25701",
    "2": "#FFA500",
    "3": "#FDC803",
    "4": "#FFE704",
    "5": "var(--background-color-inverted)"
};

export const BASE_URL = "https://api.getbaseline.app";

export function createPoints(data: Log[], colors: AnyMap) {
    let points = [];
    for (let point of data) {
        let [h, rest] = point.time.split(":");
        let hour = Number(h);
        if (hour === 12) hour = 0;
        let [m, meridiem] = rest.split(" ");
        let minute = Number(m);
        const time = DateTime.fromObject({hour: (meridiem === "AM" ? hour : hour + 12), minute}, {zone: point.zone});
        const seconds = (time.toSeconds() - time.startOf("day").toSeconds());
        const style = {
            left: `min(${seconds / SECONDS_IN_DAY * 100}%, calc(100% - 6px))`,
            top: `${(10 - (point.mood + 5)) * 6.5 + 25}%`,
            backgroundColor: colors[point.mood]
        };
        points.push(<div className="marker" key={point.timestamp} style={style}></div>);
    }

    return points;
}

export function getMoodLogListBound(el: HTMLElement, node: HTMLElement, offset: number) {
    return node.offsetTop - el.getBoundingClientRect().y + offset;
}

export function toast(message: string, gravity?: Toastify.Options["gravity"], duration?: number) {
    Toastify({
        text: message,
        duration: duration || 3000,
        gravity: gravity || "top",
        position: "center",
        style: {
            "border-radius": "10px",
        },
        offset: {
            y: (gravity === "bottom") ? "5px" : "max(calc(env(safe-area-inset-top) - 5px), 0px)",
            x: 0
        },
        stopOnFocus: false
    }).showToast();
}

export function networkFailure(message: string) {
    return message === "Load failed" || message.includes("Failed to fetch");
}

export function checkKeys() {
    const keys = localStorage.getItem("keys");

    if (!keys) {
        const pdpSetting = parseSettings()["pdp"];
        if (pdpSetting) {
            const pwd = sessionStorage.getItem("pwd");
            if (pwd) {
                const ekeys = decrypt(JSON.parse(localStorage.getItem("ekeys") ?? "{}")["keys"], pwd);
                if (!ekeys) {
                    toast("Something went wrong, please sign in again.");
                    Sentry.addBreadcrumb({
                        category: "checkKeys",
                        message: "Sign Out"
                    });
                    signOutAndCleanUp();
                    return;
                }
                
                return JSON.parse(ekeys);
            }

            if (pdpSetting === "upfront") {
                history.push("/unlock");
                return "upfront";
            } else {
                if (!["/summary", "/rsummary", "/settings", "/unlock"].includes(history.location.pathname)) history.push("/summary");
                return "discreet";
            }
        }

        return false;
    }

    return JSON.parse(keys);
}

export function goBackSafely() {
    history.length > 2 ? history.goBack() : history.push("/summary");
}

export function parseSettings() {
    let data: AnyMap = {};
    try {
        data = JSON.parse(localStorage.getItem("settings") ?? "{}");
    } catch {}
    return data;
}

// NOTE: Old password comes in hashed, new password does not
export async function changeDatabaseEncryption(oldPwd: string, newPwd: string) {
    let logs = await ldb.logs.toArray();

    // Undo encryption if we're changing passphrases or removing an old one
    if (oldPwd) {
        for (let i = 0; i < logs.length; ++i) {
            logs[i].journal = decrypt(logs[i].ejournal ?? "", oldPwd);
            logs[i].ejournal = "";
            if (logs[i].efiles) {
                logs[i].files = JSON.parse(decrypt(logs[i].efiles ?? "[]", oldPwd));
                delete logs[i].efiles;
            }
        }
        
        if (!newPwd) await ldb.logs.bulkPut(logs);
        
        // Reconstruct keys
        let keys = JSON.parse(localStorage.getItem("ekeys") ?? "{}");
        localStorage.setItem("keys", decrypt(keys.keys, oldPwd));
        localStorage.removeItem("ekeys");
        sessionStorage.removeItem("pwd");
    }

    if (newPwd) {
        // Encryption needed
        // Construct new passphrase
        newPwd = hash(newPwd).toString();

        // Encrypt data
        for (let i = 0; i < logs.length; ++i) {
            logs[i].ejournal = encrypt(logs[i].journal ?? "", newPwd);
            logs[i].journal = "";
            if (logs[i].files) {
                logs[i].efiles = encrypt(JSON.stringify(logs[i].files), newPwd);
                delete logs[i].files;
            }
        }
        
        await ldb.logs.bulkPut(logs);

        // Set keys
        const keys = localStorage.getItem("keys") ?? "";
        setEkeys(keys, newPwd);
    }
}

export function setEkeys(keys: string, pwd: string) {
    localStorage.setItem("ekeys", JSON.stringify({
        keys: encrypt(keys, pwd),
        hash: hash(keys).toString()
    }));

    sessionStorage.setItem("pwd", pwd);
    localStorage.removeItem("keys");
}

export function setSettings(key: string, value: any) {
    let data = parseSettings();
    data[key] = value;
    localStorage.setItem("settings", JSON.stringify(data));
}

export function checkPassphrase(passphrase: string): boolean {
    try {
        const keyData = JSON.parse(localStorage.getItem("ekeys") ?? "{}");
        return hash(decrypt(keyData.keys, hash(passphrase).toString(), false)).toString() === keyData.hash
    } catch {
        return false;
    }
}

export async function makeRequest(route: string, user: User, body: AnyMap, setSubmitting?: (_: boolean) => void, failSilently?: boolean) {
    let response;
    let toasted = failSilently ?? false;
    try {
        response = await fetch(`${BASE_URL}/${route}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${await getIdToken(user)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    } catch (e: any) {
        if (!toasted) {
            if (networkFailure(e.message)) {
                toast(`We can't reach our servers. Check your internet connection and try again.`);
            } else {
                toast(`Something went wrong, please try again! \nError: ${e.message}`);
            }
            toasted = true;
        }
    }

    if (response) {
        if (!response.ok) {
            if (!toasted) toast(`Something went wrong, please try again! \nError: ${await response.text()}`);
        } else {
            return true;
        }
    } else if (!toasted) {
        toast(`Something went wrong, please try again!`);
    }

    if (setSubmitting) setSubmitting(false);
    return false;
}

export function encrypt(data: string, key: string) {
    try {
        return AES.encrypt(data, key).toString();
    } catch {
        toast("Data encryption failed, so as a security precaution, we ask that you sign in again.");
        Sentry.addBreadcrumb({
            category: "encrypt",
            message: "Sign Out"
        });
        signOutAndCleanUp();
        return "";
    }
}

export function decrypt(data: string, key: string, signOut=true) {
    try {
        return AES.decrypt(data, key).toString(aesutf8);
    } catch {
        if (signOut) {
            Sentry.addBreadcrumb({
                category: "decrypt",
                message: "Sign Out"
            });
            toast("Data decryption failed, so as a security precaution, we ask that you sign in again.");
            signOutAndCleanUp();
        }
    }

    return "";
}

export async function parseSurveyHistory(user: User, setSurveyHistory: (_: (AnyMap[] | PullDataStates)) => void) {
    if (!user) return;
    const keys = checkKeys();
    get(query(ref(db, `${user.uid}/surveys`), orderByKey())).then(snap => {
        let val = snap.val();
        for (let key in val) {  
            if (typeof val[key]["results"] === "string") {
                val[key]["results"] = JSON.parse(decrypt(val[key]["results"], `${keys.visibleKey}${keys.encryptedKeyVisible}`));
            }
        }

        if (val) {
            setSurveyHistory(val);
        } else {
            setSurveyHistory(PullDataStates.NOT_ENOUGH_DATA);
        }
    });
}

const BASELINE_DAYS = 14;
export async function calculateBaseline(setBaselineGraph: (_: AnyMap[] | PullDataStates) => void) {
    const logs = await ldb.logs.orderBy("timestamp").toArray();
    if (!logs.length) {
        setBaselineGraph(PullDataStates.NOT_ENOUGH_DATA);
        return;
    }

    let currentDate = getDateFromLog(logs[0]);
    let ptr = 0;
    let perDayDates = [];
    let perDayAverages = [];
    let perDayCount = [];
    const now = DateTime.local();
    // Aggregate average mood data per day
    while (currentDate < now) {
        let todaySum = 0;
        let ctr = 0;
        while (
            ptr < logs.length 
            && logs[ptr].day === currentDate.day 
            && logs[ptr].month === currentDate.month 
            && logs[ptr].year === currentDate.year
        ) {
            if (logs[ptr].average === "average") {
                todaySum += logs[ptr].mood;
            } else {
                todaySum += logs[ptr].mood * 0.4;
            }
            ++ctr;
            ++ptr;
        }
        perDayDates.push(currentDate.toMillis())
        perDayAverages.push(ctr === 0 ? 0 : todaySum / ctr);
        perDayCount.push(ctr);
        currentDate = currentDate.plus({"days": 1});
    }

    // We're adding an extra week to the base days,
    // to ensure people can actually see a trend
    if (perDayAverages.length <= BASELINE_DAYS + 7) {
        setBaselineGraph(PullDataStates.NOT_ENOUGH_DATA);
        return;
    }

    let countSum = 0;
    let sum = 0;
    let i = 0;
    while (i < BASELINE_DAYS) {
        countSum += perDayCount[i];
        sum += perDayAverages[i];
        ++i;
    }

    // Start average with base 14 days
    let baseline = [];
    baseline.push({
        timestamp: perDayDates[i - 1],
        value: sum / BASELINE_DAYS
    });

    // Calculate rolling average to end of list
    while (i < perDayAverages.length) {
        sum -= perDayAverages[i - BASELINE_DAYS];
        sum += perDayAverages[i];

        countSum -= perDayCount[i - BASELINE_DAYS];
        countSum += perDayCount[i];

        // If user hasn't logged in a while,
        // don't put out baseline for those days
        if (countSum !== 0) {
            baseline.push({
                timestamp: perDayDates[i],
                value: sum / BASELINE_DAYS
            });
        } else {
            baseline.push({
                timestamp: perDayDates[i],
                value: NaN
            });
        }
        ++i;
    }

    setBaselineGraph(baseline);
}

export function filterLogs(
    searchText: string,
    numberFilter: number[],
    averageFilter: string[],
    imageFilter: boolean,
    logs: Log[], 
    setFilteredLogs: (logs: Log[]) => void
) {
    if (!searchText && !numberFilter.length && !averageFilter.length && !imageFilter) {
        setFilteredLogs(logs);
        return;
    }

    if (imageFilter) logs = logs.filter(x => x.files && x.files.length > 0);
    if (numberFilter.length) logs = logs.filter(x => numberFilter.includes(x.mood));
    if (averageFilter.length) logs = logs.filter(x => averageFilter.includes(x.average));

    if (searchText) {
        const fuse = new Fuse(logs, {
            keys: ["journal"],
            shouldSort: false,
            findAllMatches: true,
            ignoreLocation: true,
            threshold: 0.2
        });

        logs = fuse.search(searchText).map(x => x.item);
    }

    setFilteredLogs(logs);
}

export function fingerprint() {
    let fingerprint = "";
    const ua = new UAParser().getResult();
    fingerprint += `${ua.os.name}${ua.os.version}${ua.device.vendor}${ua.device.model}${ua.device.type}`;
    fingerprint += `${navigator.language}${navigator.platform}${navigator.maxTouchPoints}`;
    fingerprint += `${window.screen.width}${window.screen.height}`;
    fingerprint += `|${new Date().getTimezoneOffset()}`;
    const hash = murmurhash3_32_gc(fingerprint, 921743158);
    return hash;
}

export function timeToString (time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// SociallyFed data migration utilities
export const migrateLogToSociallyFed = (log: Log): Log => {
    // Create a copy to avoid mutating the original
    const migratedLog = { ...log };
    
    // Initialize SociallyFed fields if they don't exist
    if (!migratedLog.virtueAlignment) {
        migratedLog.virtueAlignment = getDefaultVirtueAlignment();
    }
    
    if (!migratedLog.mediaConsumption) {
        migratedLog.mediaConsumption = getDefaultMediaConsumption();
    }
    
    if (!migratedLog.patterns) {
        migratedLog.patterns = getDefaultPatterns();
    }
    
    if (!migratedLog.cybernetics) {
        migratedLog.cybernetics = getDefaultCybernetics();
    }
    
    if (!migratedLog.promptMetadata) {
        migratedLog.promptMetadata = getDefaultPromptMetadata();
    }
    
    return migratedLog;
};

export const validateAndMigrateLog = (log: any): Log | null => {
    // Basic log validation
    if (!log || typeof log !== 'object') return null;
    
    // Required fields validation
    const requiredFields = ['timestamp', 'year', 'month', 'day', 'time', 'zone', 'mood', 'average'];
    for (const field of requiredFields) {
        if (!(field in log)) return null;
    }
    
    // Mood validation
    const mood = Number(log.mood);
    if (typeof mood !== 'number' || isNaN(mood) || mood < -5 || mood > 5 || mood !== parseInt(mood.toString())) {
        return null;
    }
    
    // Average validation
    const validAverages = ['below', 'average', 'above'];
    if (!validAverages.includes(log.average)) return null;
    
    // Validate SociallyFed fields if present
    if (log.virtueAlignment && !validateVirtueAlignment(log.virtueAlignment)) {
        log.virtueAlignment = getDefaultVirtueAlignment();
    }
    
    if (log.mediaConsumption && !validateMediaConsumption(log.mediaConsumption)) {
        log.mediaConsumption = getDefaultMediaConsumption();
    }
    
    if (log.patterns && !validatePatterns(log.patterns)) {
        log.patterns = getDefaultPatterns();
    }
    
    if (log.cybernetics && !validateCybernetics(log.cybernetics)) {
        log.cybernetics = getDefaultCybernetics();
    }
    
    if (log.promptMetadata && !validatePromptMetadata(log.promptMetadata)) {
        log.promptMetadata = getDefaultPromptMetadata();
    }
    
    // Migrate to ensure all SociallyFed fields are present
    return migrateLogToSociallyFed(log as Log);
};

export const migrateAllLogs = async (): Promise<void> => {
    try {
        const logs = await ldb.logs.toArray();
        const migratedLogs: Log[] = [];
        
        for (const log of logs) {
            const migratedLog = migrateLogToSociallyFed(log);
            migratedLogs.push(migratedLog);
        }
        
        // Bulk update all logs
        await ldb.logs.bulkPut(migratedLogs);
        console.log(`Successfully migrated ${migratedLogs.length} logs to SociallyFed format`);
    } catch (error) {
        console.error('Error migrating logs:', error);
        Sentry.captureException(error);
    }
};

// Enhanced migration with user preferences
export const migrateSociallyFedData = async (): Promise<{
    total: number;
    migrated: number;
    errors: number;
    features: {
        virtues: number;
        media: number;
        patterns: number;
        cybernetics: number;
        prompts: number;
    };
}> => {
    const stats = {
        total: 0,
        migrated: 0,
        errors: 0,
        features: {
            virtues: 0,
            media: 0,
            patterns: 0,
            cybernetics: 0,
            prompts: 0
        }
    };

    try {
        // Get user preferences (default to all enabled if not set)
        const userPreferences = await getUserMigrationPreferences();
        
        const logs = await ldb.logs.toArray();
        stats.total = logs.length;
        
        const migratedLogs: Log[] = [];
        
        for (const log of logs) {
            try {
                const migratedLog = { ...log };
                
                // Only migrate features user wants to enable
                if (userPreferences.enableVirtueTracking && !migratedLog.virtueAlignment) {
                    migratedLog.virtueAlignment = getDefaultVirtueAlignment();
                    stats.features.virtues++;
                }
                
                if (userPreferences.enableMediaTracking && !migratedLog.mediaConsumption) {
                    migratedLog.mediaConsumption = getDefaultMediaConsumption();
                    stats.features.media++;
                }
                
                if (userPreferences.enablePatternTracking && !migratedLog.patterns) {
                    migratedLog.patterns = getDefaultPatterns();
                    stats.features.patterns++;
                }
                
                if (userPreferences.enableCybernetics && !migratedLog.cybernetics) {
                    migratedLog.cybernetics = getDefaultCybernetics();
                    stats.features.cybernetics++;
                }
                
                if (userPreferences.enableAIAnalysis && !migratedLog.promptMetadata) {
                    migratedLog.promptMetadata = getDefaultPromptMetadata();
                    stats.features.prompts++;
                }
                
                migratedLogs.push(migratedLog);
                stats.migrated++;
                
            } catch (error) {
                console.error('Error migrating log:', error);
                stats.errors++;
                Sentry.captureException(error);
            }
        }
        
        // Bulk update all logs
        await ldb.logs.bulkPut(migratedLogs);
        console.log(`Migration completed: ${stats.migrated}/${stats.total} logs migrated, ${stats.errors} errors`);
        
    } catch (error) {
        console.error('Error in bulk migration:', error);
        Sentry.captureException(error);
    }
    
    return stats;
};

// Get user migration preferences
export const getUserMigrationPreferences = async (): Promise<SociallyFedPreferences> => {
    try {
        const preferences = await ldb.sociallyFedPreferences.get('default');
        if (preferences) {
            return preferences;
        }
        
        // Create default preferences if none exist
        const defaultPreferences = getDefaultSociallyFedPreferences();
        await ldb.sociallyFedPreferences.put(defaultPreferences, 'default');
        return defaultPreferences;
        
    } catch (error) {
        console.error('Error getting user preferences:', error);
        return getDefaultSociallyFedPreferences();
    }
};

// Update user migration preferences
export const updateUserMigrationPreferences = async (preferences: Partial<SociallyFedPreferences>): Promise<void> => {
    try {
        const currentPreferences = await getUserMigrationPreferences();
        const updatedPreferences = { ...currentPreferences, ...preferences };
        
        // Validate the updated preferences
        if (!validateSociallyFedPreferences(updatedPreferences)) {
            throw new Error('Invalid preferences data');
        }
        
        await ldb.sociallyFedPreferences.put(updatedPreferences, 'default');
        console.log('User preferences updated successfully');
        
    } catch (error) {
        console.error('Error updating user preferences:', error);
        Sentry.captureException(error);
        throw error;
    }
};

export const getSociallyFedStats = async (): Promise<{
    totalLogs: number;
    logsWithVirtues: number;
    logsWithMedia: number;
    logsWithPatterns: number;
    logsWithCybernetics: number;
    logsWithPrompts: number;
    userPreferences: SociallyFedPreferences | null;
}> => {
    const logs = await ldb.logs.toArray();
    const userPreferences = await getUserMigrationPreferences();
    
    return {
        totalLogs: logs.length,
        logsWithVirtues: logs.filter(log => log.virtueAlignment).length,
        logsWithMedia: logs.filter(log => log.mediaConsumption).length,
        logsWithPatterns: logs.filter(log => log.patterns).length,
        logsWithCybernetics: logs.filter(log => log.cybernetics).length,
        logsWithPrompts: logs.filter(log => log.promptMetadata).length,
        userPreferences
    };
};