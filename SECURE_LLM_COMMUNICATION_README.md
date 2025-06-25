# Secure LLM Communication Layer

## Overview

The Secure LLM Communication Layer provides a robust, privacy-focused system for sending journal data to a localhost LLM server for AI-powered insights. This implementation ensures data security through client-side encryption, automatic server discovery, health monitoring, and graceful offline handling.

## Architecture

### 1. Client-Side Components

#### LLMService (`src/services/LLMService.ts`)
- **Purpose**: Core service for managing LLM server communication
- **Features**:
  - Automatic server discovery on common ports (3001, 3000, 8000, 8080, 5000)
  - Health check monitoring with configurable intervals
  - Client-side encryption using Baseline's existing encryption system
  - Request queuing for offline scenarios
  - Automatic reconnection and retry logic

#### React Hooks (`src/hooks/useLLMInsights.ts`)
- **Purpose**: React integration for LLM insights
- **Features**:
  - `useLLMInsights()`: Generic hook for any data type
  - `useJournalInsights()`: Specialized for journal data
  - `usePatternInsights()`: Specialized for pattern data
  - `useVirtueInsights()`: Specialized for virtue data
  - `useMediaInsights()`: Specialized for media data
  - Auto-refresh capabilities
  - Connection status management

#### Enhanced Components
- **EnhancedPatternInsights**: Shows both traditional patterns and AI-generated insights
- **Connection Status Bar**: Real-time LLM server status with manual controls

### 2. Server-Side API

#### Endpoints
- `GET /health`: Server health check
- `POST /analyze`: Data analysis endpoint
- `GET /config`: Server configuration
- `GET /status`: Runtime status

#### Security Features
- CORS protection for localhost origins
- Request validation and sanitization
- Encrypted data handling
- Rate limiting support
- Error handling and logging

## Security Implementation

### 1. Client-Side Encryption

```typescript
// Data is encrypted before transmission
private async encryptData(data: any): Promise<string> {
    const keys = checkKeys();
    if (!keys || typeof keys !== 'object') {
        throw new Error('Encryption keys not available');
    }
    
    const jsonData = JSON.stringify(data);
    return encrypt(jsonData, keys);
}
```

### 2. Secure Communication Protocol

#### Request Format
```typescript
interface LLMRequest {
    encryptedData: string;        // AES-256 encrypted JSON
    requestId: string;           // Unique request identifier
    timestamp: number;           // Request timestamp
    dataType: 'journal' | 'patterns' | 'virtues' | 'media';
    version: string;             // API version
}
```

#### Response Format
```typescript
interface LLMResponse {
    requestId: string;           // Echo of request ID
    success: boolean;            // Operation success status
    encryptedInsights: string;   // AES-256 encrypted insights
    error?: string;             // Error message if failed
    processingTime?: number;     // Server processing time
    timestamp: number;          // Response timestamp
}
```

### 3. Data Privacy

- **Local Processing**: All data processing happens on localhost
- **No External Transmission**: Data never leaves the user's machine
- **Encrypted Storage**: Insights are encrypted before storage
- **User Control**: Users can enable/disable LLM features
- **Data Retention**: Configurable data retention policies

## Server Discovery & Health Monitoring

### 1. Automatic Discovery

```typescript
private async discoverServer(): Promise<boolean> {
    const commonPorts = [3001, 3000, 8000, 8080, 5000];
    
    for (const port of commonPorts) {
        const url = `http://localhost:${port}`;
        try {
            const response = await fetch(`${url}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SociallyFed-Baseline/1.0'
                },
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                this.serverUrl = url;
                return true;
            }
        } catch (error) {
            continue;
        }
    }
    return false;
}
```

### 2. Health Monitoring

- **Periodic Checks**: Every 60 seconds by default
- **Connection Status**: Real-time connection state
- **Automatic Reconnection**: Seamless recovery from disconnections
- **User Notifications**: Toast messages for connection changes

### 3. Offline Handling

- **Request Queuing**: Failed requests are queued for later processing
- **Graceful Degradation**: App continues to work without LLM server
- **Manual Retry**: Users can manually retry failed operations
- **Status Indicators**: Clear visual feedback about connection state

## API Integration

### 1. Data Types Supported

#### Journal Data
```typescript
{
    timestamp: number;
    mood: number;
    journal: string;
    average: string;
    year: number;
    month: number;
    day: number;
}
```

#### Pattern Data
```typescript
{
    timestamp: number;
    patterns: {
        emotionalTriggers: string[];
        copingStrategies: string[];
        socialContexts: string[];
        aiGenerated: string[];
        confidence: number;
        category: string;
    };
    mood: number;
}
```

#### Virtue Data
```typescript
{
    timestamp: number;
    virtueAlignment: {
        stoicism: number;
        courage: number;
        wisdom: number;
        justice: number;
        temperance: number;
        dailyContext?: string;
        focusVirtue?: string;
    };
    mood: number;
}
```

#### Media Data
```typescript
{
    timestamp: number;
    mediaConsumption: {
        servedContent: number;
        casualBrowsing: number;
        intentionalContent: number;
        creation: number;
        deepFocus: number;
        timeOfDay?: string;
        triggers?: string[];
        moodBefore?: number;
        moodAfter?: number;
    };
    mood: number;
}
```

### 2. Insights Response

```typescript
interface LLMInsights {
    patterns: string[];                    // Identified patterns
    recommendations: string[];             // Actionable recommendations
    correlations: Array<{                  // Factor correlations
        factor1: string;
        factor2: string;
        strength: number;
        confidence: number;
    }>;
    trends: Array<{                        // Trend analysis
        metric: string;
        direction: 'increasing' | 'decreasing' | 'stable';
        confidence: number;
        timeframe: string;
    }>;
    actionableInsights: Array<{            // Prioritized insights
        category: string;
        insight: string;
        action: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}
```

## Usage Examples

### 1. Basic LLM Service Usage

```typescript
import { llmService } from '../services/LLMService';

// Initialize the service
const connected = await llmService.initialize();

if (connected) {
    // Get insights for journal data
    const insights = await llmService.analyzeJournalData(logs, 'journal');
    
    if (insights) {
        console.log('AI Insights:', insights.actionableInsights);
    }
}
```

### 2. React Hook Usage

```typescript
import { usePatternInsights } from '../hooks/useLLMInsights';

const MyComponent = () => {
    const {
        insights,
        loading,
        error,
        connected,
        refreshInsights
    } = usePatternInsights();

    if (loading) return <div>Loading AI insights...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!connected) return <div>LLM server offline</div>;

    return (
        <div>
            {insights?.actionableInsights.map((insight, index) => (
                <div key={index}>
                    <h4>{insight.category}</h4>
                    <p>{insight.insight}</p>
                    <p><strong>Action:</strong> {insight.action}</p>
                </div>
            ))}
        </div>
    );
};
```

### 3. Enhanced Pattern Insights Component

```typescript
import EnhancedPatternInsights from '../components/SociallyFed/EnhancedPatternInsights';

// Automatically shows both traditional patterns and AI insights
<EnhancedPatternInsights />
```

## Server Setup

### 1. Example Server

The `llm-server-example/` directory contains a complete example server:

```bash
cd llm-server-example
npm install
npm start
```

### 2. Server Requirements

- **Node.js**: Version 16 or higher
- **Express**: Web framework
- **CORS**: Cross-origin resource sharing
- **Health Endpoint**: `/health` for discovery
- **Analysis Endpoint**: `/analyze` for data processing
- **Encryption Support**: Handle encrypted requests/responses

### 3. Custom LLM Integration

To integrate with your own LLM:

1. **Implement the API endpoints** as shown in the example server
2. **Handle encrypted data** using the same encryption keys as the client
3. **Process data** with your LLM model
4. **Return insights** in the expected format
5. **Implement health checks** for automatic discovery

## Error Handling

### 1. Client-Side Errors

- **Network Errors**: Automatic retry with exponential backoff
- **Encryption Errors**: Fallback to unencrypted mode or graceful failure
- **Server Errors**: User notification and manual retry options
- **Timeout Errors**: Configurable timeouts with user feedback

### 2. Server-Side Errors

- **Validation Errors**: Clear error messages for invalid requests
- **Processing Errors**: Graceful degradation with partial results
- **System Errors**: Comprehensive logging and error reporting

### 3. Offline Scenarios

- **Server Unavailable**: Queue requests for later processing
- **Network Issues**: Continue with cached insights
- **Data Loss**: Graceful recovery with user notification

## Performance Considerations

### 1. Optimization Strategies

- **Request Batching**: Combine multiple analysis requests
- **Caching**: Cache insights to reduce server load
- **Lazy Loading**: Load insights on demand
- **Background Processing**: Non-blocking UI updates

### 2. Resource Management

- **Memory Usage**: Efficient data structures and cleanup
- **Network Efficiency**: Compressed data transmission
- **CPU Usage**: Asynchronous processing to prevent UI blocking

### 3. Scalability

- **Connection Pooling**: Reuse connections when possible
- **Rate Limiting**: Prevent server overload
- **Load Balancing**: Support for multiple server instances

## Security Best Practices

### 1. Data Protection

- **End-to-End Encryption**: All data encrypted in transit and at rest
- **Key Management**: Secure key storage and rotation
- **Access Control**: Local-only access with no external transmission
- **Data Minimization**: Only send necessary data for analysis

### 2. Server Security

- **Input Validation**: Sanitize all incoming requests
- **Rate Limiting**: Prevent abuse and overload
- **Error Handling**: Don't expose sensitive information in errors
- **Logging**: Secure logging without sensitive data

### 3. Privacy Compliance

- **Local Processing**: No data leaves user's machine
- **User Consent**: Clear opt-in for LLM features
- **Data Retention**: User-controlled data retention
- **Right to Deletion**: Easy data removal capabilities

## Future Enhancements

### 1. Advanced Features

- **Real-time Analysis**: Streaming insights as data is entered
- **Custom Models**: User-specific model training
- **Multi-modal Analysis**: Support for images, audio, and text
- **Predictive Insights**: Future trend predictions

### 2. Integration Opportunities

- **External APIs**: Integration with health and wellness services
- **Device Integration**: Smart device data correlation
- **Social Features**: Anonymous pattern sharing
- **Professional Tools**: Therapist and coach integrations

### 3. Performance Improvements

- **Edge Computing**: Local model inference
- **Federated Learning**: Collaborative model improvement
- **Optimized Models**: Smaller, faster inference models
- **Hardware Acceleration**: GPU/TPU support

## Conclusion

The Secure LLM Communication Layer provides a robust, privacy-focused foundation for AI-powered journal insights. By maintaining data security, providing graceful offline handling, and offering comprehensive error management, it ensures a reliable and trustworthy user experience while enabling powerful AI analysis capabilities.

The modular design allows for easy extension and customization, making it suitable for both current needs and future enhancements. The emphasis on local processing and encryption ensures user privacy while providing valuable insights for personal development and mental health tracking. 