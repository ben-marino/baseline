import { IonButton, IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/react";
import ldb from "../../db";
import { AnyMap, decrypt, parseSettings } from "../../helpers";
import { useRef, useState } from "react";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import "./ExportData.css";
import { exportCategories } from "./constants";

const ExportData = () => {
    const [selectedCategories, setSelectedCategories] = useState<{[key: string]: boolean}>({
        baseline: true,    // Default selected
        virtues: false,
        media: false,
        patterns: false,
        cybernetics: false
    });

    const [selectedOptions, setSelectedOptions] = useState<string[]>(['timestamp', 'journal', 'mood', 'average']);

    const downloadLink = useRef<HTMLAnchorElement>(null);

    // Category selection handlers
    const toggleCategory = (categoryKey: string) => {
        const category = exportCategories[categoryKey as keyof typeof exportCategories];
        const isSelected = selectedCategories[categoryKey];
        
        setSelectedCategories(prev => ({
            ...prev,
            [categoryKey]: !isSelected
        }));

        // Add/remove all options in this category
        if (!isSelected) {
            // Add all options from this category
            const categoryOptions = category.options.map(opt => opt.value);
            setSelectedOptions(prev => Array.from(new Set([...prev, ...categoryOptions])));
        } else {
            // Remove all options from this category
            const categoryOptions = category.options.map(opt => opt.value);
            setSelectedOptions(prev => prev.filter(opt => !categoryOptions.includes(opt)));
        }
    };

    // Export presets
    const selectPreset = (presetType: string) => {
        switch (presetType) {
            case 'basic':
                setSelectedOptions(['timestamp', 'journal', 'mood', 'average']);
                setSelectedCategories({
                    baseline: true,
                    virtues: false,
                    media: false,
                    patterns: false,
                    cybernetics: false
                });
                break;
                
            case 'sociallyfed':
                // Select all SociallyFed fields for LLM analysis
                const sociallyFedOptions = [
                    ...exportCategories.virtues.options.map(opt => opt.value),
                    ...exportCategories.media.options.map(opt => opt.value),
                    ...exportCategories.patterns.options.map(opt => opt.value),
                    ...exportCategories.cybernetics.options.map(opt => opt.value),
                    'timestamp', 'journal', 'mood' // Include core fields too
                ];
                setSelectedOptions(sociallyFedOptions);
                setSelectedCategories({
                    baseline: true,
                    virtues: true,
                    media: true,
                    patterns: true,
                    cybernetics: true
                });
                break;
                
            case 'full':
                // Select everything
                const allOptions = Object.values(exportCategories)
                    .flatMap(category => category.options.map(opt => opt.value));
                setSelectedOptions(allOptions);
                setSelectedCategories(Object.keys(exportCategories).reduce((acc, key) => ({
                    ...acc,
                    [key]: true
                }), {}));
                break;
        }
    };

    const getData = async () => {
        const entries = await ldb.logs.orderBy("timestamp").toArray();
        if (parseSettings()["pdp"]) {
            const pwd = sessionStorage.getItem("pwd");
            if (!pwd) return;

            for (const entry of entries) {
                entry.journal = decrypt(entry.ejournal!, pwd);
                if (entry.efiles) {
                    entry.files = JSON.parse(decrypt(entry.efiles, pwd));
                }
            }
        }

        return entries;
    };

    const exportDataAsJSON = async () => {
        const data = await getData();
        let newData = [];
        for (const entry of (data ?? [])) {
            let newEntry: AnyMap = {};
            for (const optionValue of selectedOptions) {
                // Find the option definition
                const allOptions = Object.values(exportCategories).flatMap(cat => cat.options);
                const option = allOptions.find(opt => opt.value === optionValue);
                if (option) {
                    newEntry[optionValue] = option.getEntryAttribute(entry);
                }
            }
            newData.push(newEntry);
        }
        save(JSON.stringify(newData), "journal-data.json", "application/json");
    };

    const exportDataAsCSV = async () => {
        const data = await getData();
        const allOptions = Object.values(exportCategories).flatMap(cat => cat.options);
        const selectedOptionDefs = allOptions.filter(opt => selectedOptions.includes(opt.value));
        
        let csv = selectedOptionDefs.map((option) => option.description).join(",") + "\n";
        for (const entry of (data ?? [])) {
            entry.journal = entry.journal?.replace(/"/g, '""');
            entry.files = entry.files ?? [];
            csv += '"' + selectedOptionDefs.map((option) => option.getEntryAttribute(entry)).join("\",\"") + "\"\n";
        }
        save(csv, "journal-data.csv", "text/csv");
    };

    const exportForLLMAnalysis = async () => {
        // TODO: Implement actual LLM analysis in next phase
        // For now, show a placeholder message
        console.log("LLM Analysis placeholder - will be implemented in next phase");
        
        // Show user feedback
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--ion-color-success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        toast.textContent = "LLM Analysis feature coming soon!";
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
        
        // Placeholder: Log what would be sent
        const data = await getData();
        if (!data) {
            console.error("No data available for LLM analysis");
            return;
        }
        
        const allOptions = Object.values(exportCategories).flatMap(cat => cat.options);
        const selectedOptionDefs = allOptions.filter(opt => selectedOptions.includes(opt.value));
        
        const llmData = {
            entries: data.map(entry => {
                let newEntry: AnyMap = {};
                for (const option of selectedOptionDefs) {
                    newEntry[option.value] = option.getEntryAttribute(entry);
                }
                return newEntry;
            }),
            metadata: {
                exportDate: new Date().toISOString(),
                totalEntries: data.length,
                selectedFields: selectedOptions,
                moodRange: data.length > 0 ? {
                    min: Math.min(...data.map(d => d.mood)),
                    max: Math.max(...data.map(d => d.mood))
                } : null
            }
        };
        
        console.log("LLM Analysis would send:", llmData);
    };

    const save = async (data: string, filename: string, filetype: string) => {
        if (Capacitor.getPlatform() === "web") {
            const el = downloadLink.current!;
            el.href = URL.createObjectURL(new Blob([data], {type: filetype}));
            el.download = filename;
            el.click();
        } else {
            const { uri } = await Filesystem.writeFile({
                "path": filename,
                "data": data,
                "directory": Directory.Cache,
                "encoding": Encoding.UTF8
            });

            Share.share({
                "title": "Journal Data",
                "files": [uri]
            }).catch(() => {});
        }
    };

    return (
        <div className="export-data">
            <h2>Export Your Data</h2>
            
            {/* Category-based selection */}
            <div className="export-categories">
                {Object.entries(exportCategories).map(([key, category]) => (
                    <div key={key} className="category-section">
                        <div className="category-header">
                            <input
                                type="checkbox"
                                checked={selectedCategories[key]}
                                onChange={() => toggleCategory(key)}
                                id={`category-${key}`}
                            />
                            <label htmlFor={`category-${key}`} className="category-title">
                                <strong>{category.title}</strong>
                            </label>
                        </div>
                        
                        {/* Individual field checkboxes */}
                        <div className={`category-options ${selectedCategories[key] ? 'expanded' : 'collapsed'}`}>
                            {category.options.map(option => (
                                <div key={option.value} className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedOptions(prev => [...prev, option.value]);
                                            } else {
                                                setSelectedOptions(prev => prev.filter(v => v !== option.value));
                                            }
                                        }}
                                        id={`option-${option.value}`}
                                    />
                                    <label htmlFor={`option-${option.value}`}>
                                        {option.description}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Export presets */}
            <div className="export-presets">
                <h3>Quick Presets</h3>
                <button onClick={() => selectPreset('basic')}>
                    Basic Export (Journal + Mood)
                </button>
                <button onClick={() => selectPreset('sociallyfed')}>
                    SociallyFed Analysis (All Fields)
                </button>
                <button onClick={() => selectPreset('full')}>
                    Complete Export
                </button>
            </div>

            {/* Export buttons */}
            <div className="export-actions">
                <button onClick={exportDataAsJSON} disabled={selectedOptions.length === 0}>
                    Export as JSON ({selectedOptions.length} fields)
                </button>
                <button onClick={exportDataAsCSV} disabled={selectedOptions.length === 0}>
                    Export as CSV ({selectedOptions.length} fields)
                </button>
                <button 
                    className="llm-analysis"
                    onClick={exportForLLMAnalysis} 
                    disabled={selectedOptions.length === 0}
                >
                    Send to Local LLM for Analysis
                </button>
            </div>
            
            {/* Hidden download link for web */}
            <a style={{"display": "none"}} ref={downloadLink} />
        </div>
    );
};

export default ExportData;