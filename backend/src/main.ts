import { Response } from "express";
import { AnyMap, UserRequest, validateKeys } from "./helpers.js";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import AES from "crypto-js/aes.js";
import aesutf8 from "crypto-js/enc-utf8.js";
import { DateTime } from "luxon";
import formidable from "formidable";
import sharp from "sharp";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();

export const survey = async (req: UserRequest, res: Response) => {
    const body = req.body;
    const db = getDatabase();
    const encryptionKey = await validateKeys(body.keys, db, req.user!.user_id);

    if (!encryptionKey) {
        res.send(400);
        return;
    }

    // Valid surveys, and
    // validation parameters for each one
    const VALIDATION = {
        dassv1: {
            type: "object",
            keys: ["d", "a", "s"],
            min: [0, 0, 0],
            max: [21, 21, 21]
        },
        edev1: {
            type: "number",
            min: 0,
            max: 36
        },
        harmv1: {
            type: "object",
            keys: [0, 1, 2],
            min: [0, 0, 0],
            max: [1, 1, 1]
        },
        cagev1: {
            type: "number",
            min: 0,
            max: 12
        },
        spfv1: {
            type: "object",
            keys: ["Social-Interpersonal", "Cognitive-Individual"],
            min: [6, 6],
            max: [30, 30]
        },
        wastv1: {
            type: "number",
            min: 0,
            max: 24
        }
    };

    // Validate survey key (is it one we know about/still accept?)
    if (!("key" in body) || typeof body.key !== "string" || !(body.key in VALIDATION)) {
        res.send(400);
        return;
    }

    // Validate presence of results of survey
    if (!("results" in body)) {
        res.send(400);
        return;
    }

    const RESULT_VAL = VALIDATION[body.key as ("dassv1" | "edev1" | "harmv1" | "cagev1" | "spfv1" | "wastv1")];
    const results = body.results;
    if (RESULT_VAL.type === "number") {
        // Result should be a number

        // Validate that result is a number, and that it's within bounds
        if (typeof results !== "number" || isNaN(results) || results < RESULT_VAL.min || results > RESULT_VAL.max) {
            res.send(400);
            return;
        }
    } else if (RESULT_VAL.type === "object") {
        // Result should be an object with keys and numeric values

        // Validate that result is an object
        if (typeof results !== "object") {
            res.send(400);
            return;
        }

        // Validate that result has the right keys
        if (!("keys" in RESULT_VAL)) {
            throw Error("Result dictionary type mismatch -- check configuration.");
        }

        let keys = JSON.parse(JSON.stringify(RESULT_VAL.keys));
        for (const key_ in results) {
            const key = isNaN(Number(key_)) ? key_ : Number(key_);
            if (!keys.includes(key)) {
                res.send(400);
                return;
            }

            keys.splice(keys.indexOf(key), 1);
        }

        if (keys.length !== 0) {
            res.send(400);
            return;
        }

        // Validate that result values are numbers, and that they're within bounds
        for (const key of RESULT_VAL.keys) {
            if (
                typeof results[key] !== "number" || 
                isNaN(results[key]) || 
                results[key] < RESULT_VAL.min[key as number] || 
                results[key] > RESULT_VAL.max[key as number]
            ) {
                res.send(400);
                return;
            }
        }
    }

    // Add survey to database
    await db.ref(`/${req.user!.user_id}/surveys/${DateTime.utc().toMillis()}`).set({
        key: body.key,
        results: AES.encrypt(JSON.stringify(body.results), encryptionKey).toString()
    });

    res.send(200);
}

export const moodLog = async (req: UserRequest, res: Response) => {
    const MEGABYTE = 1024 * 1024;
    let { data, files } : any = await new Promise(resolve => {
        formidable({ keepExtensions: true, multiples: true, maxFileSize: (500 * MEGABYTE) }).parse(req, (err: any, data: any, files: any) => {
            if (err) {
                if (err.httpCode === 413) {
                    res.status(400).send("Your images or audio recording are too big. If it's an image, remove it and try again. If it's an audio recording, you may need to make a smaller recording.");
                } else {
                    console.warn(err);
                    res.status(400).send("Something's wrong with your images. Please remove them and try again.");
                }
            }

            resolve({ data, files });
        });
    });

    if (res.headersSent) return;

    const db = getDatabase();
    const encryptionKey = await validateKeys(data.keys, db, req.user!.user_id);

    if (!encryptionKey) {
        res.send(400);
        return;
    }

    // Mood validation
    data.mood = Number(data.mood);
    if (typeof data.mood !== "number" || isNaN(data.mood) || data.mood < -5 || data.mood > 5 || data.mood !== parseInt(data.mood)) {
        res.send(400);
        return;
    }

    // Journal validation
    const MAX_CHARS = 25000;
    if (typeof data.journal !== "string" || data.journal.length > MAX_CHARS) {
        res.status(400).send(`Please keep journals below ${MAX_CHARS} characters. You can split up your journal into multiple entries if you need to.`);
        return;
    }

    // Average validation
    const acceptedAverages = ["below", "average", "above"];
    if (typeof data.average !== "string" || !acceptedAverages.includes(data.average)) {
        res.send(400);
        return;
    }

    /// Non-now journaling validation
    // Basic property validation
    data.editTimestamp = data.editTimestamp ? Number(data.editTimestamp) : null;
    if (data.editTimestamp) {
        if (typeof data.editTimestamp !== "number" || isNaN(data.editTimestamp) || data.editTimestamp !== parseInt(data.editTimestamp) || data.editTimestamp < 0) {
            res.send(400);
            return;
        }
    }

    if (data.editTimestamp && data.addFlag) {
        res.send(400);
        return;
    }

    // Set globalNow based on sent properties
    let globalNow = DateTime.utc();

    if (data.addFlag) {
        if (typeof data.addFlag !== "string" || !data.addFlag.startsWith("summary:")) {
            res.send(400);
            return;
        }

        globalNow = DateTime.fromISO(data.addFlag.split(":")[1], { zone: data.timezone });

        if (!globalNow.isValid) {
            res.send(400);
            return;
        }
    }

    if (data.editTimestamp) {
        globalNow = DateTime.fromMillis(data.editTimestamp);
    }

    // Final timezone validation
    if (typeof data.timezone !== "string" || !globalNow.setZone(data.timezone).isValid) {
        res.send(400);
        return;
    }

    // Song validation
    if (data.song) {
        if (typeof data.song !== "string" || !data.song.startsWith("spotify:track:") || data.song.length > 100) {
            res.send(400);
            return;
        }
    }

    // SociallyFed data validation
    // Virtue alignment validation
    if (data.virtueAlignment) {
        if (typeof data.virtueAlignment !== "object") {
            res.send(400);
            return;
        }
        
        const virtues = ['stoicism', 'courage', 'wisdom', 'justice', 'temperance'];
        for (const virtue of virtues) {
            if (data.virtueAlignment[virtue] !== undefined) {
                const value = Number(data.virtueAlignment[virtue]);
                if (typeof value !== "number" || isNaN(value) || value < 1 || value > 10 || value !== parseInt(value.toString())) {
                    res.send(400);
                    return;
                }
            }
        }
        
        // Validate optional context fields
        if (data.virtueAlignment.dailyContext && (typeof data.virtueAlignment.dailyContext !== "string" || data.virtueAlignment.dailyContext.length > 1000)) {
            res.send(400);
            return;
        }
        
        if (data.virtueAlignment.focusVirtue && !virtues.includes(data.virtueAlignment.focusVirtue)) {
            res.send(400);
            return;
        }
    }

    // Media consumption validation
    if (data.mediaConsumption) {
        if (typeof data.mediaConsumption !== "object") {
            res.send(400);
            return;
        }
        
        const categories = ['servedContent', 'casualBrowsing', 'intentionalContent', 'creation', 'deepFocus'];
        for (const category of categories) {
            if (data.mediaConsumption[category] !== undefined) {
                const value = Number(data.mediaConsumption[category]);
                if (typeof value !== "number" || isNaN(value) || value < 0 || value > 1440 || value !== parseInt(value.toString())) {
                    res.send(400);
                    return;
                }
            }
        }
        
        // Validate optional temporal and mood fields
        const validTimeOfDay = ['morning', 'afternoon', 'evening', 'night'];
        if (data.mediaConsumption.timeOfDay && !validTimeOfDay.includes(data.mediaConsumption.timeOfDay)) {
            res.send(400);
            return;
        }
        
        if (data.mediaConsumption.triggers && (!Array.isArray(data.mediaConsumption.triggers) || data.mediaConsumption.triggers.some((t: any) => typeof t !== "string" || t.length > 200))) {
            res.send(400);
            return;
        }
        
        if (data.mediaConsumption.moodBefore !== undefined) {
            const moodBefore = Number(data.mediaConsumption.moodBefore);
            if (typeof moodBefore !== "number" || isNaN(moodBefore) || moodBefore < 1 || moodBefore > 10) {
                res.send(400);
                return;
            }
        }
        
        if (data.mediaConsumption.moodAfter !== undefined) {
            const moodAfter = Number(data.mediaConsumption.moodAfter);
            if (typeof moodAfter !== "number" || isNaN(moodAfter) || moodAfter < 1 || moodAfter > 10) {
                res.send(400);
                return;
            }
        }
    }

    // Patterns validation (Enhanced)
    if (data.patterns) {
        if (typeof data.patterns !== "object") {
            res.send(400);
            return;
        }
        
        const patternCategories = ['emotionalTriggers', 'copingStrategies', 'socialContexts', 'aiGenerated', 'userNoted'];
        for (const category of patternCategories) {
            if (data.patterns[category] !== undefined) {
                if (!Array.isArray(data.patterns[category])) {
                    res.send(400);
                    return;
                }
                
                // Validate each string in the array
                for (const item of data.patterns[category]) {
                    if (typeof item !== "string" || item.length > 500) {
                        res.send(400);
                        return;
                    }
                }
            }
        }
        
        // Validate confidence
        if (data.patterns.confidence !== undefined) {
            const confidence = Number(data.patterns.confidence);
            if (typeof confidence !== "number" || isNaN(confidence) || confidence < 0 || confidence > 1) {
                res.send(400);
                return;
            }
        }
        
        // Validate category
        const validCategories = ['emotional', 'behavioral', 'media', 'virtue', 'temporal'];
        if (data.patterns.category && !validCategories.includes(data.patterns.category)) {
            res.send(400);
            return;
        }
        
        // Validate optional fields
        if (data.patterns.actionable !== undefined && typeof data.patterns.actionable !== "boolean") {
            res.send(400);
            return;
        }
        
        if (data.patterns.correlations && (!Array.isArray(data.patterns.correlations) || data.patterns.correlations.some((c: any) => 
            typeof c !== "object" || typeof c.pattern !== "string" || typeof c.strength !== "number" || 
            c.strength < -1 || c.strength > 1 || c.pattern.length > 500))) {
            res.send(400);
            return;
        }
    }

    // Cybernetics validation
    if (data.cybernetics) {
        if (typeof data.cybernetics !== "object") {
            res.send(400);
            return;
        }
        
        if (data.cybernetics.goalProgress !== undefined) {
            const goalProgress = Number(data.cybernetics.goalProgress);
            if (typeof goalProgress !== "number" || isNaN(goalProgress) || goalProgress < 0 || goalProgress > 100) {
                res.send(400);
                return;
            }
        }
        
        const arrayFields = ['feedbackLoops', 'adjustments'];
        for (const field of arrayFields) {
            if (data.cybernetics[field] !== undefined) {
                if (!Array.isArray(data.cybernetics[field])) {
                    res.send(400);
                    return;
                }
                
                // Validate each string in the array
                for (const item of data.cybernetics[field]) {
                    if (typeof item !== "string" || item.length > 500) {
                        res.send(400);
                        return;
                    }
                }
            }
        }
    }

    // Prompt metadata validation
    if (data.promptMetadata) {
        if (typeof data.promptMetadata !== "object") {
            res.send(400);
            return;
        }
        
        const validCategories = ['stoic', 'cybernetic', 'media-awareness', 'baseline'];
        if (data.promptMetadata.category && !validCategories.includes(data.promptMetadata.category)) {
            res.send(400);
            return;
        }
        
        if (data.promptMetadata.subcategory && (typeof data.promptMetadata.subcategory !== "string" || data.promptMetadata.subcategory.length > 100)) {
            res.send(400);
            return;
        }
        
        if (data.promptMetadata.aiGenerated !== undefined && typeof data.promptMetadata.aiGenerated !== "boolean") {
            res.send(400);
            return;
        }
        
        if (data.promptMetadata.userConfirmed !== undefined && typeof data.promptMetadata.userConfirmed !== "boolean") {
            res.send(400);
            return;
        }
    }

    // Emotional regulation validation
    if (data.emotionalRegulation) {
        if (typeof data.emotionalRegulation !== "object") {
            res.send(400);
            return;
        }
        
        // Validate techniques array
        if (data.emotionalRegulation.techniques !== undefined) {
            if (!Array.isArray(data.emotionalRegulation.techniques)) {
                res.send(400);
                return;
            }
            
            for (const technique of data.emotionalRegulation.techniques) {
                if (typeof technique !== "string" || technique.length > 200) {
                    res.send(400);
                    return;
                }
            }
        }
        
        // Validate effectiveness
        if (data.emotionalRegulation.effectiveness !== undefined) {
            const effectiveness = Number(data.emotionalRegulation.effectiveness);
            if (typeof effectiveness !== "number" || isNaN(effectiveness) || effectiveness < 1 || effectiveness > 10) {
                res.send(400);
                return;
            }
        }
        
        // Validate triggers array
        if (data.emotionalRegulation.triggers !== undefined) {
            if (!Array.isArray(data.emotionalRegulation.triggers)) {
                res.send(400);
                return;
            }
            
            for (const trigger of data.emotionalRegulation.triggers) {
                if (typeof trigger !== "string" || trigger.length > 200) {
                    res.send(400);
                    return;
                }
            }
        }
        
        // Validate coping strategies array
        if (data.emotionalRegulation.copingStrategies !== undefined) {
            if (!Array.isArray(data.emotionalRegulation.copingStrategies)) {
                res.send(400);
                return;
            }
            
            for (const strategy of data.emotionalRegulation.copingStrategies) {
                if (typeof strategy !== "string" || strategy.length > 200) {
                    res.send(400);
                    return;
                }
            }
        }
    }

    // Goal progress validation
    if (data.goalProgress) {
        if (typeof data.goalProgress !== "object") {
            res.send(400);
            return;
        }
        
        // Validate goals array
        if (data.goalProgress.goals !== undefined) {
            if (!Array.isArray(data.goalProgress.goals)) {
                res.send(400);
                return;
            }
            
            for (const goal of data.goalProgress.goals) {
                if (typeof goal !== "object") {
                    res.send(400);
                    return;
                }
                
                if (typeof goal.id !== "string" || goal.id.length > 50) {
                    res.send(400);
                    return;
                }
                
                if (typeof goal.name !== "string" || goal.name.length > 200) {
                    res.send(400);
                    return;
                }
                
                if (goal.progress !== undefined) {
                    const progress = Number(goal.progress);
                    if (typeof progress !== "number" || isNaN(progress) || progress < 0 || progress > 100) {
                        res.send(400);
                        return;
                    }
                }
                
                if (typeof goal.category !== "string" || goal.category.length > 50) {
                    res.send(400);
                    return;
                }
                
                if (goal.notes !== undefined && (typeof goal.notes !== "string" || goal.notes.length > 500)) {
                    res.send(400);
                    return;
                }
            }
        }
        
        // Validate overall progress
        if (data.goalProgress.overallProgress !== undefined) {
            const overallProgress = Number(data.goalProgress.overallProgress);
            if (typeof overallProgress !== "number" || isNaN(overallProgress) || overallProgress < 0 || overallProgress > 100) {
                res.send(400);
                return;
            }
        }
    }

    let filePaths: string[] = [];
    let images = files["file"];
    // If user has screenshots:
    if (images) {
        // If there's only one, they'll be given as just an object,
        // so put them into an array
        if (!Array.isArray(images)) images = [images];
        // Validate file limit
        if (images.length > 3) {
            res.send(400);
            return;
        }

        let promises = [];
        for (const file of images) {
            // Convert file to WEBP (with compression), and then save
            // Promises array for parallel processing
            try {
                promises.push(
                    sharp(file.filepath)
                        .rotate()
                        .webp()
                        .toBuffer()
                        .then((buf: Buffer) => {
                            // Clean up temp file: https://firebase.google.com/docs/functions/tips#always_delete_temporary_files
                            fs.rmSync(file.filepath);

                            // Upload
                            const fileName = `${uuidv4()}.webp.enc`;
                            filePaths.push(fileName);
                            const data = AES.encrypt(`data:image/webp;base64,${buf.toString("base64")}`, encryptionKey).toString();
                            return getStorage().bucket().file(`user/${req.user!.user_id}/${fileName}`).save(data);
                        })
                );
            } catch (e: any) {
                console.log(e);
                res.status(400).send("Something's wrong with your images. Please remove them and try again.");
                return;
            }
        }

        // Wait for all uploads to complete
        try {
            await Promise.all(promises);
        } catch (e: any) {
            console.log(e);
            res.status(400).send("Something's wrong with your images. Please remove them and try again.");
            return;
        }
    }

    let logData: AnyMap = {};

    let promises = [];

    // Audio processing
    let audio = files["audio"] as formidable.File;
    let audioData = null;
    if (audio) {        
        if (Array.isArray(audio)) {
            res.send(400);
            return;
        }

        if (!audio.mimetype) {
            res.send(400);
            return;
        }

        if (audio.size === 0) {
            res.status(400).send("Your audio journal has no data. Please try submitting/recording again. If you continue to see this message, your device/browser may not support audio recording.");
            return;
        }

        const storagePath = "tmp/" + audio.newFilename;
        promises.push(getStorage().bucket().file(storagePath).save(fs.readFileSync(audio.filepath), { contentType: audio.mimetype ?? undefined }).then(() => {
            // Clean up temp file
            fs.rmSync(audio.filepath);
        }));
        audioData = {
            user: req.user!.user_id,
            log: globalNow.toMillis(),
            file: storagePath,
            encryptionKey: encryptionKey
        }
    }
    
    let setLastUpdated = true;
    if (!data.editTimestamp) {
        const userNow = globalNow.setZone(data.timezone);
        logData = {
            year: userNow.year,
            month: userNow.month,
            day: userNow.day,
            time: userNow.toFormat("h:mm a"),
            zone: userNow.zone.name,
            mood: data.mood,
            journal: data.journal,
            average: data.average,
            files: filePaths,
        };

        if (data.song) {
            logData.song = data.song;
        }

        if (audioData) {
            logData.journal = "Audio upload and transcription in progress! Check back in a minute.";
            logData.audio = "inprogress";
        }

        if (data.addFlag && data.addFlag.startsWith("summary:")) {
            logData.time = "12:00 PM";
            logData.zone = "local";
            logData.addFlag = "summary";
            logData.timeLogged = DateTime.utc().toMillis();

            const lastUpdated = (await db.ref(`/${req.user!.user_id}/lastUpdated`).get()).val();
            if (lastUpdated && lastUpdated > globalNow.toMillis()) {
                setLastUpdated = false;
                promises.push(db.ref(`/${req.user!.user_id}/offline`).set(Math.random()));
            }
        }
    } else {
        logData = await (await db.ref(`/${req.user!.user_id}/logs/${data.editTimestamp}`).get()).val();
        if (!logData) {
            res.send(400);
            return;
        }

        logData = JSON.parse(AES.decrypt(logData.data, encryptionKey).toString(aesutf8));
        logData.mood = data.mood;
        logData.journal = data.journal;
        logData.average = data.average;
        promises.push(db.ref(`/${req.user!.user_id}/offline`).set(Math.random()));
    }

    // Add SociallyFed data to logData if provided
    if (data.virtueAlignment) {
        logData.virtueAlignment = data.virtueAlignment;
    }
    
    if (data.mediaConsumption) {
        logData.mediaConsumption = data.mediaConsumption;
    }
    
    if (data.patterns) {
        logData.patterns = data.patterns;
    }
    
    if (data.cybernetics) {
        logData.cybernetics = data.cybernetics;
    }
    
    if (data.promptMetadata) {
        logData.promptMetadata = data.promptMetadata;
    }
    
    if (data.emotionalRegulation) {
        logData.emotionalRegulation = data.emotionalRegulation;
    }
    
    if (data.goalProgress) {
        logData.goalProgress = data.goalProgress;
    }

    const p1 = db.ref(`/${req.user!.user_id}/logs/${globalNow.toMillis()}`).set({
        data: AES.encrypt(JSON.stringify(logData), encryptionKey).toString()
    });

    const p2 = pubsub.topic("pubsub-trigger-cleanup").publishMessage({ data: Buffer.from(req.user!.user_id) });

    if (setLastUpdated) {
        promises.push(db.ref(`/${req.user!.user_id}/lastUpdated`).set(globalNow.toMillis()));
    }

    await Promise.all([p1, p2, ...promises]);
    if (audioData) {
        await pubsub.topic("pubsub-audio-processing").publishMessage({ json: audioData });
    }
    
    res.sendStatus(200);
}