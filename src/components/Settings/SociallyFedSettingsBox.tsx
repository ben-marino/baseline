import { IonSpinner, IonToggle } from "@ionic/react";
import { useEffect, useState } from "react";
import { sociallyFedConfig } from "../../services/SociallyFedConfigService";
import { toast } from "../../helpers";
import "./SettingsBox.css";

interface Props {
    title: string;
    description: string;
    feature: string;
    configKey: keyof import("../../services/SociallyFedConfigService").FeatureToggles;
}

const SociallyFedSettingsBox = ({ 
    title, 
    description, 
    feature,
    configKey
}: Props) => {
    const [checked, setChecked] = useState<boolean | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadSetting();
    }, []);

    const loadSetting = async () => {
        try {
            await sociallyFedConfig.initialize();
            const config = sociallyFedConfig.getConfig();
            setChecked(config.features[configKey]);
        } catch (error) {
            console.error('Failed to load SociallyFed setting:', error);
            setChecked(false);
        }
    };

    const handleToggle = async (value: boolean) => {
        try {
            setLoading(true);
            setChecked(value);
            
            const update = { [configKey]: value };
            await sociallyFedConfig.updateFeatureToggles(update);
            
            toast(`${title} ${value ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Failed to update setting:', error);
            toast('Failed to update setting');
            // Revert the change
            setChecked(!value);
        } finally {
            setLoading(false);
        }
    };

    return <>
        { checked !== undefined && <div className="settings-box-grid">
            <p className="bold margin-bottom-0 margin-top-8" style={{"gridArea": "title"}}>{ title }</p>
            <IonToggle 
                style={{"gridArea": "toggle"}} 
                checked={checked} 
                onIonChange={e => handleToggle(e.detail.checked)}
                disabled={loading}
            />
            <p style={{"gridAutoColumns": "description"}}>{ description }</p>
        </div> }
        { checked === undefined && <div className="text-center" style={{"width": "100%"}}>
            <IonSpinner className="loader" name="crescent" />
        </div> }
    </>
};

export default SociallyFedSettingsBox; 