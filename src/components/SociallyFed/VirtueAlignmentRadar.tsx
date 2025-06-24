import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import ldb from "../../db";
import { VirtueAlignment } from "../../db";

const VirtueAlignmentRadar = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chart, setChart] = useState<Chart | null>(null);
    const [data, setData] = useState<VirtueAlignment | null>(null);

    useEffect(() => {
        const loadVirtueData = async () => {
            try {
                // Get all logs and filter for those with virtue alignment data
                const logs = await ldb.logs.toArray();
                const logsWithVirtues = logs
                    .filter(log => log.virtueAlignment)
                    .sort((a, b) => b.timestamp - a.timestamp);
                
                if (logsWithVirtues.length > 0) {
                    setData(logsWithVirtues[0].virtueAlignment!);
                }
            } catch (error) {
                console.error("Failed to load virtue alignment data:", error);
            }
        };

        loadVirtueData();
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
            type: 'radar',
            data: {
                labels: ['Stoicism', 'Courage', 'Wisdom', 'Justice', 'Temperance'],
                datasets: [{
                    label: 'Virtue Alignment',
                    data: [
                        data.stoicism,
                        data.courage,
                        data.wisdom,
                        data.justice,
                        data.temperance
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        min: 0,
                        ticks: {
                            stepSize: 2
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
                                return `${context.label}: ${context.parsed.r}/10`;
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
            <div className="virtue-radar-placeholder">
                <p className="text-center">No virtue alignment data available</p>
                <p className="text-center small">Complete a journal entry with virtue tracking to see your alignment</p>
            </div>
        );
    }

    return (
        <div className="virtue-radar-container">
            <div className="chart-wrapper">
                <canvas ref={canvasRef} height="300"></canvas>
            </div>
            {data.dailyContext && (
                <div className="virtue-context">
                    <p className="text-center small">
                        <strong>Daily Context:</strong> {data.dailyContext}
                    </p>
                </div>
            )}
            {data.focusVirtue && (
                <div className="virtue-focus">
                    <p className="text-center small">
                        <strong>Focus Virtue:</strong> {data.focusVirtue.charAt(0).toUpperCase() + data.focusVirtue.slice(1)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VirtueAlignmentRadar; 