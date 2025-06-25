const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8100'], // Allow Baseline app origins
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Mock LLM processing function
const processLLMRequest = async (data, dataType) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate mock insights based on data type
    const insights = {
        patterns: [
            "You tend to feel better after social interactions",
            "Stress levels increase during work hours",
            "Mood improves significantly after exercise"
        ],
        recommendations: [
            "Schedule more social activities during low mood periods",
            "Consider taking breaks during peak work hours",
            "Incorporate daily exercise into your routine"
        ],
        correlations: [
            {
                factor1: "Social interactions",
                factor2: "Mood improvement",
                strength: 0.85,
                confidence: 0.92
            },
            {
                factor1: "Work stress",
                factor2: "Sleep quality",
                strength: -0.73,
                confidence: 0.88
            }
        ],
        trends: [
            {
                metric: "Overall mood",
                direction: "increasing",
                confidence: 0.78,
                timeframe: "last 2 weeks"
            },
            {
                metric: "Stress levels",
                direction: "decreasing",
                confidence: 0.65,
                timeframe: "last month"
            }
        ],
        actionableInsights: [
            {
                category: "Behavioral",
                insight: "Your mood consistently improves after 30+ minutes of physical activity",
                action: "Schedule daily exercise sessions, especially on low mood days",
                priority: "high"
            },
            {
                category: "Social",
                insight: "Group activities provide 40% more mood improvement than solo activities",
                action: "Prioritize social exercise or group activities",
                priority: "medium"
            },
            {
                category: "Temporal",
                insight: "Your productivity peaks between 9-11 AM",
                action: "Schedule important tasks during this time window",
                priority: "low"
            }
        ]
    };
    
    return insights;
};

// Health check endpoint
app.get('/health', (req, res) => {
    const healthData = {
        status: 'healthy',
        version: '1.0.0',
        capabilities: ['journal-analysis', 'pattern-recognition', 'trend-analysis', 'correlation-detection'],
        load: Math.random() * 0.3 + 0.1, // Simulate 10-40% load
        uptime: process.uptime()
    };
    
    res.json(healthData);
});

// Analysis endpoint
app.post('/analyze', async (req, res) => {
    try {
        const { encryptedData, requestId, timestamp, dataType, version } = req.body;
        
        // Validate request
        if (!encryptedData || !requestId || !timestamp || !dataType) {
            return res.status(400).json({
                requestId,
                success: false,
                error: 'Missing required fields',
                timestamp: Date.now()
            });
        }
        
        // Validate data type
        const validDataTypes = ['journal', 'patterns', 'virtues', 'media'];
        if (!validDataTypes.includes(dataType)) {
            return res.status(400).json({
                requestId,
                success: false,
                error: 'Invalid data type',
                timestamp: Date.now()
            });
        }
        
        // Note: In a real implementation, you would decrypt the data here
        // For this example, we'll simulate decryption
        console.log(`Processing ${dataType} analysis for request ${requestId}`);
        
        // Simulate decryption (in real implementation, use the same encryption key)
        let decryptedData;
        try {
            // This is a mock - in reality, you'd decrypt using the shared key
            decryptedData = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
        } catch (error) {
            return res.status(400).json({
                requestId,
                success: false,
                error: 'Failed to decrypt data',
                timestamp: Date.now()
            });
        }
        
        // Process the data with LLM
        const startTime = Date.now();
        const insights = await processLLMRequest(decryptedData, dataType);
        const processingTime = Date.now() - startTime;
        
        // Encrypt the response (in real implementation, encrypt with shared key)
        const encryptedInsights = Buffer.from(JSON.stringify(insights)).toString('base64');
        
        // Return encrypted response
        res.json({
            requestId,
            success: true,
            encryptedInsights,
            processingTime,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            requestId: req.body.requestId || 'unknown',
            success: false,
            error: 'Internal server error',
            timestamp: Date.now()
        });
    }
});

// Configuration endpoint
app.get('/config', (req, res) => {
    res.json({
        version: '1.0.0',
        supportedDataTypes: ['journal', 'patterns', 'virtues', 'media'],
        maxRequestSize: '10MB',
        rateLimit: '100 requests/hour',
        encryption: 'AES-256',
        features: {
            patternRecognition: true,
            trendAnalysis: true,
            correlationDetection: true,
            actionableInsights: true
        }
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        load: Math.random() * 0.3 + 0.1
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: Date.now()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: Date.now()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LLM Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Analysis endpoint: http://localhost:${PORT}/analyze`);
    console.log(`Configuration: http://localhost:${PORT}/config`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app; 