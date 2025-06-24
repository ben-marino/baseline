import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import ldb from "../../db";
import { DateTime } from "luxon";

interface WeeklyStats {
    virtueProgress: {
        stoicism: number[];
        courage: number[];
        wisdom: number[];
        justice: number[];
        temperance: number[];
    };
    mediaBalance: {
        totalTime: number;
        deepFocusPercentage: number;
        averageMoodImpact: number;
    };
    patternCount: number;
    journalStreak: number;
}

const WeeklyProgress = () => {
    const [stats, setStats] = useState<WeeklyStats | null>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const loadWeeklyData = async () => {
            try {
                const now = DateTime.now();
                const weekAgo = now.minus({ days: 7 });
                
                // Get logs from the last 7 days
                const logs = await ldb.logs.toArray();
                const weeklyLogs = logs.filter(log => {
                    const logDate = DateTime.fromMillis(log.timestamp);
                    return logDate >= weekAgo && logDate <= now;
                });

                if (weeklyLogs.length === 0) {
                    setStats(null);
                    return;
                }

                // Calculate virtue progress
                const virtueProgress = {
                    stoicism: [] as number[],
                    courage: [] as number[],
                    wisdom: [] as number[],
                    justice: [] as number[],
                    temperance: [] as number[]
                };

                weeklyLogs.forEach(log => {
                    if (log.virtueAlignment) {
                        virtueProgress.stoicism.push(log.virtueAlignment.stoicism);
                        virtueProgress.courage.push(log.virtueAlignment.courage);
                        virtueProgress.wisdom.push(log.virtueAlignment.wisdom);
                        virtueProgress.justice.push(log.virtueAlignment.justice);
                        virtueProgress.temperance.push(log.virtueAlignment.temperance);
                    }
                });

                // Calculate media balance
                let totalMediaTime = 0;
                let totalDeepFocus = 0;
                let moodImpacts: number[] = [];

                weeklyLogs.forEach(log => {
                    if (log.mediaConsumption) {
                        const mediaTime = log.mediaConsumption.servedContent + 
                                        log.mediaConsumption.casualBrowsing + 
                                        log.mediaConsumption.intentionalContent + 
                                        log.mediaConsumption.creation + 
                                        log.mediaConsumption.deepFocus;
                        totalMediaTime += mediaTime;
                        totalDeepFocus += log.mediaConsumption.deepFocus;

                        if (log.mediaConsumption.moodBefore && log.mediaConsumption.moodAfter) {
                            moodImpacts.push(log.mediaConsumption.moodAfter - log.mediaConsumption.moodBefore);
                        }
                    }
                });

                const mediaBalance = {
                    totalTime: totalMediaTime,
                    deepFocusPercentage: totalMediaTime > 0 ? Math.round((totalDeepFocus / totalMediaTime) * 100) : 0,
                    averageMoodImpact: moodImpacts.length > 0 ? 
                        Math.round(moodImpacts.reduce((a, b) => a + b, 0) / moodImpacts.length * 10) / 10 : 0
                };

                // Count patterns
                const patternCount = weeklyLogs.filter(log => log.patterns).length;

                // Calculate journal streak
                let streak = 0;
                const sortedLogs = weeklyLogs.sort((a, b) => b.timestamp - a.timestamp);
                for (let i = 0; i < sortedLogs.length; i++) {
                    if (i === 0) {
                        streak = 1;
                    } else {
                        const currentDate = DateTime.fromMillis(sortedLogs[i].timestamp);
                        const prevDate = DateTime.fromMillis(sortedLogs[i - 1].timestamp);
                        const daysDiff = prevDate.diff(currentDate, 'days').days;
                        if (daysDiff <= 1) {
                            streak++;
                        } else {
                            break;
                        }
                    }
                }

                setStats({
                    virtueProgress,
                    mediaBalance,
                    patternCount,
                    journalStreak: streak
                });

            } catch (error) {
                console.error("Failed to load weekly data:", error);
            }
        };

        loadWeeklyData();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !stats) return;

        // Destroy existing chart
        if (chart) {
            chart.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Create virtue progress chart
        const virtueAverages = {
            stoicism: stats.virtueProgress.stoicism.length > 0 ? 
                stats.virtueProgress.stoicism.reduce((a, b) => a + b, 0) / stats.virtueProgress.stoicism.length : 0,
            courage: stats.virtueProgress.courage.length > 0 ? 
                stats.virtueProgress.courage.reduce((a, b) => a + b, 0) / stats.virtueProgress.courage.length : 0,
            wisdom: stats.virtueProgress.wisdom.length > 0 ? 
                stats.virtueProgress.wisdom.reduce((a, b) => a + b, 0) / stats.virtueProgress.wisdom.length : 0,
            justice: stats.virtueProgress.justice.length > 0 ? 
                stats.virtueProgress.justice.reduce((a, b) => a + b, 0) / stats.virtueProgress.justice.length : 0,
            temperance: stats.virtueProgress.temperance.length > 0 ? 
                stats.virtueProgress.temperance.reduce((a, b) => a + b, 0) / stats.virtueProgress.temperance.length : 0
        };

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Stoicism', 'Courage', 'Wisdom', 'Justice', 'Temperance'],
                datasets: [{
                    label: 'Average Score (1-10)',
                    data: [
                        virtueAverages.stoicism,
                        virtueAverages.courage,
                        virtueAverages.wisdom,
                        virtueAverages.justice,
                        virtueAverages.temperance
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Average Virtue Score'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        setChart(newChart);

        return () => {
            if (newChart) {
                newChart.destroy();
            }
        };
    }, [stats, chart]);

    if (!stats) {
        return (
            <div className="weekly-progress-placeholder">
                <p className="text-center">No weekly data available</p>
                <p className="text-center small">Complete journal entries this week to see your progress</p>
            </div>
        );
    }

    return (
        <div className="weekly-progress-container">
            <div className="progress-summary">
                <div className="summary-item">
                    <div className="summary-label">Journal Streak</div>
                    <div className="summary-value">{stats.journalStreak} days</div>
                </div>
                <div className="summary-item">
                    <div className="summary-label">Media Balance</div>
                    <div className="summary-value">{stats.mediaBalance.deepFocusPercentage}% deep focus</div>
                </div>
                <div className="summary-item">
                    <div className="summary-label">Pattern Insights</div>
                    <div className="summary-value">{stats.patternCount} entries</div>
                </div>
                <div className="summary-item">
                    <div className="summary-label">Mood Impact</div>
                    <div className="summary-value">{stats.mediaBalance.averageMoodImpact > 0 ? '+' : ''}{stats.mediaBalance.averageMoodImpact}</div>
                </div>
            </div>

            <div className="chart-wrapper">
                <h4>Weekly Virtue Progress</h4>
                <canvas ref={canvasRef} height="200"></canvas>
            </div>

            <div className="progress-details">
                <div className="detail-section">
                    <h5>Media Consumption</h5>
                    <p>Total time: {stats.mediaBalance.totalTime} minutes</p>
                    <p>Deep focus: {stats.mediaBalance.deepFocusPercentage}% of total time</p>
                    {stats.mediaBalance.averageMoodImpact !== 0 && (
                        <p>Average mood impact: {stats.mediaBalance.averageMoodImpact > 0 ? '+' : ''}{stats.mediaBalance.averageMoodImpact}</p>
                    )}
                </div>

                <div className="detail-section">
                    <h5>Pattern Recognition</h5>
                    <p>Entries with patterns: {stats.patternCount}</p>
                    <p>Journal consistency: {stats.journalStreak}/7 days</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyProgress; 