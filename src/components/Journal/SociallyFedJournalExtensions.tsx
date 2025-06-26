import React, { useState, useEffect } from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonRange, IonTextarea, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonBadge } from '@ionic/react';
import { SociallyFedConfigService } from '../../services/SociallyFedConfigService';
import { VirtueAlignment, MediaConsumption, validateVirtueAlignment, validateMediaConsumption, getDefaultVirtueAlignment, getDefaultMediaConsumption } from '../../db';
import { 
    heartOutline, 
    brainOutline, 
    shieldCheckmarkOutline, 
    scaleOutline, 
    phonePortraitOutline,
    timeOutline,
    trendingUpOutline,
    checkmarkCircleOutline,
    closeCircleOutline
} from 'ionicons/icons';
import './SociallyFedJournalExtensions.css';

interface SociallyFedJournalExtensionsProps {
    onVirtueAlignmentChange: (alignment: VirtueAlignment) => void;
    onMediaConsumptionChange: (consumption: MediaConsumption) => void;
    onEmotionalRegulationChange: (regulation: {
        techniques: string[];
        effectiveness: number;
        triggers: string[];
        copingStrategies: string[];
    }) => void;
    onGoalProgressChange: (progress: {
        goals: Array<{
            id: string;
            name: string;
            progress: number;
            category: string;
            notes?: string;
        }>;
        overallProgress: number;
    }) => void;
    initialVirtueAlignment?: VirtueAlignment;
    initialMediaConsumption?: MediaConsumption;
    isEnabled: boolean;
}

const SociallyFedJournalExtensions: React.FC<SociallyFedJournalExtensionsProps> = ({
    onVirtueAlignmentChange,
    onMediaConsumptionChange,
    onEmotionalRegulationChange,
    onGoalProgressChange,
    initialVirtueAlignment,
    initialMediaConsumption,
    isEnabled
}) => {
    const [configService] = useState(() => new SociallyFedConfigService());
    const [activeTab, setActiveTab] = useState<'virtues' | 'media' | 'emotions' | 'goals'>('virtues');
    const [virtueAlignment, setVirtueAlignment] = useState<VirtueAlignment>(initialVirtueAlignment || getDefaultVirtueAlignment());
    const [mediaConsumption, setMediaConsumption] = useState<MediaConsumption>(initialMediaConsumption || getDefaultMediaConsumption());
    const [emotionalRegulation, setEmotionalRegulation] = useState({
        techniques: [] as string[],
        effectiveness: 5,
        triggers: [] as string[],
        copingStrategies: [] as string[]
    });
    const [goalProgress, setGoalProgress] = useState({
        goals: [] as Array<{
            id: string;
            name: string;
            progress: number;
            category: string;
            notes?: string;
        }>,
        overallProgress: 0
    });
    const [newTechnique, setNewTechnique] = useState('');
    const [newTrigger, setNewTrigger] = useState('');
    const [newCopingStrategy, setNewCopingStrategy] = useState('');
    const [newGoal, setNewGoal] = useState({ name: '', category: 'general' });

    useEffect(() => {
        if (!isEnabled) return;
        
        const initializeConfig = async () => {
            await configService.initialize();
        };
        
        initializeConfig();
    }, [isEnabled, configService]);

    useEffect(() => {
        onVirtueAlignmentChange(virtueAlignment);
    }, [virtueAlignment, onVirtueAlignmentChange]);

    useEffect(() => {
        onMediaConsumptionChange(mediaConsumption);
    }, [mediaConsumption, onMediaConsumptionChange]);

    useEffect(() => {
        onEmotionalRegulationChange(emotionalRegulation);
    }, [emotionalRegulation, onEmotionalRegulationChange]);

    useEffect(() => {
        onGoalProgressChange(goalProgress);
    }, [goalProgress, onGoalProgressChange]);

    const updateVirtueAlignment = (virtue: keyof Omit<VirtueAlignment, 'dailyContext' | 'focusVirtue'>, value: number) => {
        setVirtueAlignment(prev => ({
            ...prev,
            [virtue]: value
        }));
    };

    const updateMediaConsumption = (category: keyof Omit<MediaConsumption, 'timeOfDay' | 'triggers' | 'moodBefore' | 'moodAfter'>, value: number) => {
        setMediaConsumption(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const addTechnique = () => {
        if (newTechnique.trim()) {
            setEmotionalRegulation(prev => ({
                ...prev,
                techniques: [...prev.techniques, newTechnique.trim()]
            }));
            setNewTechnique('');
        }
    };

    const removeTechnique = (index: number) => {
        setEmotionalRegulation(prev => ({
            ...prev,
            techniques: prev.techniques.filter((_, i) => i !== index)
        }));
    };

    const addTrigger = () => {
        if (newTrigger.trim()) {
            setEmotionalRegulation(prev => ({
                ...prev,
                triggers: [...prev.triggers, newTrigger.trim()]
            }));
            setNewTrigger('');
        }
    };

    const removeTrigger = (index: number) => {
        setEmotionalRegulation(prev => ({
            ...prev,
            triggers: prev.triggers.filter((_, i) => i !== index)
        }));
    };

    const addCopingStrategy = () => {
        if (newCopingStrategy.trim()) {
            setEmotionalRegulation(prev => ({
                ...prev,
                copingStrategies: [...prev.copingStrategies, newCopingStrategy.trim()]
            }));
            setNewCopingStrategy('');
        }
    };

    const removeCopingStrategy = (index: number) => {
        setEmotionalRegulation(prev => ({
            ...prev,
            copingStrategies: prev.copingStrategies.filter((_, i) => i !== index)
        }));
    };

    const addGoal = () => {
        if (newGoal.name.trim()) {
            const goal = {
                id: Date.now().toString(),
                name: newGoal.name.trim(),
                progress: 0,
                category: newGoal.category
            };
            setGoalProgress(prev => ({
                ...prev,
                goals: [...prev.goals, goal]
            }));
            setNewGoal({ name: '', category: 'general' });
        }
    };

    const updateGoalProgress = (goalId: string, progress: number) => {
        setGoalProgress(prev => {
            const updatedGoals = prev.goals.map(goal => 
                goal.id === goalId ? { ...goal, progress } : goal
            );
            const overallProgress = updatedGoals.length > 0 
                ? updatedGoals.reduce((sum, goal) => sum + goal.progress, 0) / updatedGoals.length 
                : 0;
            return { ...prev, goals: updatedGoals, overallProgress };
        });
    };

    const removeGoal = (goalId: string) => {
        setGoalProgress(prev => {
            const updatedGoals = prev.goals.filter(goal => goal.id !== goalId);
            const overallProgress = updatedGoals.length > 0 
                ? updatedGoals.reduce((sum, goal) => sum + goal.progress, 0) / updatedGoals.length 
                : 0;
            return { ...prev, goals: updatedGoals, overallProgress };
        });
    };

    if (!isEnabled) {
        return null;
    }

    const getVirtueIcon = (virtue: string) => {
        switch (virtue) {
            case 'courage': return heartOutline;
            case 'wisdom': return brainOutline;
            case 'justice': return shieldCheckmarkOutline;
            case 'temperance': return scaleOutline;
            default: return heartOutline;
        }
    };

    const getVirtueColor = (virtue: string) => {
        switch (virtue) {
            case 'courage': return '#ff6b6b';
            case 'wisdom': return '#4ecdc4';
            case 'justice': return '#45b7d1';
            case 'temperance': return '#96ceb4';
            default: return '#ff6b6b';
        }
    };

    return (
        <div className="sociallyfed-journal-extensions">
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        <IonIcon icon={trendingUpOutline} />
                        SociallyFed Insights
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as any)}>
                        <IonSegmentButton value="virtues">
                            <IonLabel>Virtues</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="media">
                            <IonLabel>Media</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="emotions">
                            <IonLabel>Emotions</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="goals">
                            <IonLabel>Goals</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {activeTab === 'virtues' && (
                        <div className="virtue-alignment-section">
                            <h3>Virtue Alignment Today</h3>
                            <p className="section-description">
                                Rate how well you embodied each virtue today (1-10)
                            </p>
                            
                            {Object.entries(virtueAlignment).filter(([key]) => key !== 'dailyContext' && key !== 'focusVirtue').map(([virtue, value]) => (
                                <div key={virtue} className="virtue-item">
                                    <div className="virtue-header">
                                        <IonIcon 
                                            icon={getVirtueIcon(virtue)} 
                                            style={{ color: getVirtueColor(virtue) }}
                                        />
                                        <span className="virtue-name">{virtue.charAt(0).toUpperCase() + virtue.slice(1)}</span>
                                        <IonBadge color="primary">{value}/10</IonBadge>
                                    </div>
                                    <IonRange
                                        value={value}
                                        min={1}
                                        max={10}
                                        step={1}
                                        onIonChange={e => updateVirtueAlignment(virtue as any, e.detail.value as number)}
                                        color={getVirtueColor(virtue)}
                                    />
                                </div>
                            ))}
                            
                            <div className="virtue-context">
                                <IonTextarea
                                    placeholder="What made today challenging or successful for virtue practice?"
                                    value={virtueAlignment.dailyContext || ''}
                                    onIonInput={e => setVirtueAlignment(prev => ({ ...prev, dailyContext: e.detail.value || undefined }))}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="media-consumption-section">
                            <h3>Media Consumption Pyramid</h3>
                            <p className="section-description">
                                Track your media consumption across different levels of engagement
                            </p>
                            
                            {Object.entries(mediaConsumption).filter(([key]) => !['timeOfDay', 'triggers', 'moodBefore', 'moodAfter'].includes(key)).map(([category, minutes]) => (
                                <div key={category} className="media-item">
                                    <div className="media-header">
                                        <IonIcon icon={phonePortraitOutline} />
                                        <span className="media-category">
                                            {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                        <IonBadge color="secondary">{minutes}m</IonBadge>
                                    </div>
                                    <IonRange
                                        value={minutes}
                                        min={0}
                                        max={240}
                                        step={5}
                                        onIonChange={e => updateMediaConsumption(category as any, e.detail.value as number)}
                                    />
                                </div>
                            ))}
                            
                            <div className="media-mood-tracking">
                                <h4>Mood Impact</h4>
                                <div className="mood-inputs">
                                    <div>
                                        <label>Mood before media:</label>
                                        <IonRange
                                            value={mediaConsumption.moodBefore || 5}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={e => setMediaConsumption(prev => ({ ...prev, moodBefore: e.detail.value as number }))}
                                        />
                                    </div>
                                    <div>
                                        <label>Mood after media:</label>
                                        <IonRange
                                            value={mediaConsumption.moodAfter || 5}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onIonChange={e => setMediaConsumption(prev => ({ ...prev, moodAfter: e.detail.value as number }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'emotions' && (
                        <div className="emotional-regulation-section">
                            <h3>Emotional Regulation</h3>
                            <p className="section-description">
                                Track your emotional regulation techniques and effectiveness
                            </p>
                            
                            <div className="effectiveness-rating">
                                <label>Overall effectiveness of regulation techniques:</label>
                                <IonRange
                                    value={emotionalRegulation.effectiveness}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onIonChange={e => setEmotionalRegulation(prev => ({ ...prev, effectiveness: e.detail.value as number }))}
                                />
                                <span className="rating-label">{emotionalRegulation.effectiveness}/10</span>
                            </div>
                            
                            <div className="techniques-section">
                                <h4>Regulation Techniques Used</h4>
                                <div className="input-group">
                                    <IonTextarea
                                        placeholder="Add a technique you used today..."
                                        value={newTechnique}
                                        onIonInput={e => setNewTechnique(e.detail.value || '')}
                                        rows={2}
                                    />
                                    <IonButton size="small" onClick={addTechnique}>Add</IonButton>
                                </div>
                                <div className="tags-container">
                                    {emotionalRegulation.techniques.map((technique, index) => (
                                        <IonChip key={index} color="primary">
                                            {technique}
                                            <IonIcon icon={closeCircleOutline} onClick={() => removeTechnique(index)} />
                                        </IonChip>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="triggers-section">
                                <h4>Emotional Triggers</h4>
                                <div className="input-group">
                                    <IonTextarea
                                        placeholder="What triggered strong emotions today?"
                                        value={newTrigger}
                                        onIonInput={e => setNewTrigger(e.detail.value || '')}
                                        rows={2}
                                    />
                                    <IonButton size="small" onClick={addTrigger}>Add</IonButton>
                                </div>
                                <div className="tags-container">
                                    {emotionalRegulation.triggers.map((trigger, index) => (
                                        <IonChip key={index} color="warning">
                                            {trigger}
                                            <IonIcon icon={closeCircleOutline} onClick={() => removeTrigger(index)} />
                                        </IonChip>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="coping-section">
                                <h4>Coping Strategies</h4>
                                <div className="input-group">
                                    <IonTextarea
                                        placeholder="What coping strategies worked well?"
                                        value={newCopingStrategy}
                                        onIonInput={e => setNewCopingStrategy(e.detail.value || '')}
                                        rows={2}
                                    />
                                    <IonButton size="small" onClick={addCopingStrategy}>Add</IonButton>
                                </div>
                                <div className="tags-container">
                                    {emotionalRegulation.copingStrategies.map((strategy, index) => (
                                        <IonChip key={index} color="success">
                                            {strategy}
                                            <IonIcon icon={closeCircleOutline} onClick={() => removeCopingStrategy(index)} />
                                        </IonChip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'goals' && (
                        <div className="goal-progress-section">
                            <h3>Goal Progress</h3>
                            <p className="section-description">
                                Track progress on your current goals
                            </p>
                            
                            <div className="overall-progress">
                                <h4>Overall Progress</h4>
                                <div className="progress-display">
                                    <IonBadge color="success">{Math.round(goalProgress.overallProgress)}%</IonBadge>
                                    <IonRange
                                        value={goalProgress.overallProgress}
                                        min={0}
                                        max={100}
                                        step={5}
                                        disabled
                                    />
                                </div>
                            </div>
                            
                            <div className="add-goal">
                                <h4>Add New Goal</h4>
                                <div className="input-group">
                                    <IonTextarea
                                        placeholder="Goal name..."
                                        value={newGoal.name}
                                        onIonInput={e => setNewGoal(prev => ({ ...prev, name: e.detail.value || '' }))}
                                        rows={2}
                                    />
                                    <IonButton size="small" onClick={addGoal}>Add Goal</IonButton>
                                </div>
                            </div>
                            
                            <div className="goals-list">
                                <h4>Current Goals</h4>
                                {goalProgress.goals.map(goal => (
                                    <div key={goal.id} className="goal-item">
                                        <div className="goal-header">
                                            <span className="goal-name">{goal.name}</span>
                                            <IonIcon icon={closeCircleOutline} onClick={() => removeGoal(goal.id)} />
                                        </div>
                                        <div className="goal-progress">
                                            <IonBadge color="primary">{goal.progress}%</IonBadge>
                                            <IonRange
                                                value={goal.progress}
                                                min={0}
                                                max={100}
                                                step={5}
                                                onIonChange={e => updateGoalProgress(goal.id, e.detail.value as number)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default SociallyFedJournalExtensions;
