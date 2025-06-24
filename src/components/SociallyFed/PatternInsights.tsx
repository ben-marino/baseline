import { useEffect, useState } from "react";
import ldb from "../../db";
import { Patterns } from "../../db";

const PatternInsights = () => {
    const [patterns, setPatterns] = useState<Patterns | null>(null);
    const [recentPatterns, setRecentPatterns] = useState<Patterns[]>([]);

    useEffect(() => {
        const loadPatternData = async () => {
            try {
                // Get all logs and filter for those with pattern data
                const logs = await ldb.logs.toArray();
                const logsWithPatterns = logs
                    .filter(log => log.patterns)
                    .sort((a, b) => b.timestamp - a.timestamp);
                
                if (logsWithPatterns.length > 0) {
                    setPatterns(logsWithPatterns[0].patterns!);
                    // Get recent patterns (last 7 days)
                    const recentLogs = logsWithPatterns.slice(0, 7);
                    setRecentPatterns(recentLogs.map(log => log.patterns!));
                }
            } catch (error) {
                console.error("Failed to load pattern data:", error);
            }
        };

        loadPatternData();
    }, []);

    const getActionableInsights = () => {
        if (!patterns) return [];

        const insights = [];
        
        // Analyze emotional triggers
        if (patterns.emotionalTriggers && patterns.emotionalTriggers.length > 0) {
            insights.push({
                type: 'emotional',
                title: 'Emotional Triggers Identified',
                description: `Common triggers: ${patterns.emotionalTriggers.slice(0, 3).join(', ')}`,
                action: 'Consider developing coping strategies for these triggers'
            });
        }

        // Analyze coping strategies
        if (patterns.copingStrategies && patterns.copingStrategies.length > 0) {
            insights.push({
                type: 'coping',
                title: 'Effective Coping Strategies',
                description: `Working strategies: ${patterns.copingStrategies.slice(0, 3).join(', ')}`,
                action: 'Continue using these strategies when facing challenges'
            });
        }

        // Analyze social contexts
        if (patterns.socialContexts && patterns.socialContexts.length > 0) {
            insights.push({
                type: 'social',
                title: 'Social Context Patterns',
                description: `Key contexts: ${patterns.socialContexts.slice(0, 3).join(', ')}`,
                action: 'Leverage positive social contexts for better outcomes'
            });
        }

        // AI-generated patterns
        if (patterns.aiGenerated && patterns.aiGenerated.length > 0) {
            insights.push({
                type: 'ai',
                title: 'AI-Generated Insights',
                description: patterns.aiGenerated[0],
                action: 'Consider this pattern in your daily decisions'
            });
        }

        return insights;
    };

    const getPatternTrends = () => {
        if (recentPatterns.length < 2) return [];

        const trends = [];
        const allTriggers = recentPatterns.flatMap(p => p.emotionalTriggers || []);
        const allStrategies = recentPatterns.flatMap(p => p.copingStrategies || []);
        const allContexts = recentPatterns.flatMap(p => p.socialContexts || []);

        // Find most common patterns
        const triggerCounts = allTriggers.reduce((acc, trigger) => {
            acc[trigger] = (acc[trigger] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const strategyCounts = allStrategies.reduce((acc, strategy) => {
            acc[strategy] = (acc[strategy] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const contextCounts = allContexts.reduce((acc, context) => {
            acc[context] = (acc[context] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get top patterns
        const topTriggers = Object.entries(triggerCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([trigger, count]) => ({ pattern: trigger, count }));

        const topStrategies = Object.entries(strategyCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([strategy, count]) => ({ pattern: strategy, count }));

        if (topTriggers.length > 0) {
            trends.push({
                type: 'trigger',
                title: 'Frequent Triggers',
                patterns: topTriggers
            });
        }

        if (topStrategies.length > 0) {
            trends.push({
                type: 'strategy',
                title: 'Reliable Strategies',
                patterns: topStrategies
            });
        }

        return trends;
    };

    if (!patterns) {
        return (
            <div className="pattern-insights-placeholder">
                <p className="text-center">No pattern data available</p>
                <p className="text-center small">Complete journal entries with pattern tracking to see AI insights</p>
            </div>
        );
    }

    const insights = getActionableInsights();
    const trends = getPatternTrends();

    return (
        <div className="pattern-insights-container">
            {insights.length > 0 && (
                <div className="insights-section">
                    <h4>Actionable Insights</h4>
                    {insights.map((insight, index) => (
                        <div key={index} className={`insight-card ${insight.type}`}>
                            <div className="insight-title">{insight.title}</div>
                            <div className="insight-description">{insight.description}</div>
                            <div className="insight-action">
                                <strong>Action:</strong> {insight.action}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {trends.length > 0 && (
                <div className="trends-section">
                    <h4>Recent Trends</h4>
                    {trends.map((trend, index) => (
                        <div key={index} className="trend-card">
                            <div className="trend-title">{trend.title}</div>
                            {trend.patterns.map((pattern, pIndex) => (
                                <div key={pIndex} className="trend-pattern">
                                    <span className="pattern-name">{pattern.pattern}</span>
                                    <span className="pattern-count">({pattern.count} times)</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {patterns.confidence !== undefined && (
                <div className="confidence-section">
                    <p className="text-center small">
                        <strong>Pattern Confidence:</strong> {Math.round(patterns.confidence * 100)}%
                    </p>
                </div>
            )}

            {patterns.category && (
                <div className="category-section">
                    <p className="text-center small">
                        <strong>Primary Category:</strong> {patterns.category}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PatternInsights; 