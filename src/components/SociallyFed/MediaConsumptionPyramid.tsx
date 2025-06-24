import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import ldb from "../../db";
import { MediaConsumption } from "../../db";

const MediaConsumptionPyramid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<MediaConsumption | null>(null);

    useEffect(() => {
        const loadMediaData = async () => {
            try {
                // Get all logs and filter for those with media consumption data
                const logs = await ldb.logs.toArray();
                const logsWithMedia = logs
                    .filter(log => log.mediaConsumption)
                    .sort((a, b) => b.timestamp - a.timestamp);
                
                if (logsWithMedia.length > 0) {
                    setData(logsWithMedia[0].mediaConsumption!);
                }
            } catch (error) {
                console.error("Failed to load media consumption data:", error);
            }
        };

        loadMediaData();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        // Destroy existing chart
        if (chart) {
            chart.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Level 1: Served Content',
                    'Level 2: Casual Browsing', 
                    'Level 3: Intentional Content',
                    'Level 4: Content Creation',
                    'Level 5: Deep Focus'
                ],
                datasets: [{
                    label: 'Minutes',
                    data: [
                        data.servedContent,
                        data.casualBrowsing,
                        data.intentionalContent,
                        data.creation,
                        data.deepFocus
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',   // Red - Level 1
                        'rgba(255, 159, 64, 0.8)',   // Orange - Level 2
                        'rgba(255, 205, 86, 0.8)',   // Yellow - Level 3
                        'rgba(75, 192, 192, 0.8)',   // Teal - Level 4
                        'rgba(54, 162, 235, 0.8)'    // Blue - Level 5
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'SociallyFed Pyramid Levels'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.x} minutes`;
                            }
                        }
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
    }, [data, chart]);

    if (!data) {
        return (
            <div className="media-pyramid-placeholder">
                <p className="text-center">No media consumption data available</p>
                <p className="text-center small">Complete a journal entry with media tracking to see your pyramid</p>
            </div>
        );
    }

    const totalMinutes = data.servedContent + data.casualBrowsing + data.intentionalContent + data.creation + data.deepFocus;
    const level5Percentage = totalMinutes > 0 ? Math.round((data.deepFocus / totalMinutes) * 100) : 0;

    return (
        <div className="media-pyramid-container">
            <div className="chart-wrapper">
                <canvas ref={canvasRef} height="300"></canvas>
            </div>
            
            <div className="pyramid-stats">
                <div className="stat-item">
                    <strong>Total Media Time:</strong> {totalMinutes} minutes
                </div>
                <div className="stat-item">
                    <strong>Deep Focus Level:</strong> {level5Percentage}% of total time
                </div>
                {data.timeOfDay && (
                    <div className="stat-item">
                        <strong>Primary Time:</strong> {data.timeOfDay}
                    </div>
                )}
                {data.moodBefore && data.moodAfter && (
                    <div className="stat-item">
                        <strong>Mood Impact:</strong> {data.moodBefore}/10 → {data.moodAfter}/10
                    </div>
                )}
            </div>

            {data.triggers && data.triggers.length > 0 && (
                <div className="media-triggers">
                    <p className="text-center small">
                        <strong>Triggers:</strong> {data.triggers.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MediaConsumptionPyramid; 