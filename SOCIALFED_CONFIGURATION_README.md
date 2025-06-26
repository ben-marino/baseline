# SociallyFed Configuration System

This document describes the comprehensive configuration system for SociallyFed features within Baseline, providing secure storage, privacy controls, and flexible feature management.

## Overview

The SociallyFed configuration system provides:

1. **Settings Interface** for all SociallyFed features
2. **Secure Storage** with encryption support
3. **Privacy Controls** for data sharing preferences
4. **Feature Toggles** for enabling/disabling specific functionality
5. **LLM Server Configuration** for local AI analysis
6. **Custom Virtue Definitions** with weightings
7. **Analysis Frequency Controls** for automated insights

## Architecture

### Core Components

#### 1. SociallyFedConfigService (`src/services/SociallyFedConfigService.ts`)
The main configuration service that handles:
- Configuration loading/saving with encryption
- Validation and error handling
- Default configurations
- Feature state management

#### 2. Settings UI Components
- `SociallyFedSettings.tsx` - Main settings interface
- `SociallyFedSettingsBox.tsx` - Individual setting toggles
- `SociallyFedSettingsPage.tsx` - Dedicated settings page

#### 3. Integration Points
- Main Settings page integration
- Route configuration in App.tsx
- Database schema extensions

## Configuration Structure

### LLM Server Configuration
```typescript
interface LLMServerConfig {
    endpoint: string;           // Server hostname/IP
    port: number;              // Server port
    protocol: 'http' | 'https'; // Connection protocol
    timeout: number;           // Request timeout (ms)
    retryAttempts: number;     // Retry attempts on failure
    healthCheckInterval: number; // Health check frequency (ms)
    authenticationToken?: string; // Optional auth token
    encryptionKey?: string;    // Optional encryption key
}
```

### Privacy Configuration
```typescript
interface PrivacyConfig {
    dataSharingLevel: 'minimal' | 'standard' | 'comprehensive';
    allowAnonymousAnalytics: boolean;
    allowPatternSharing: boolean;
    allowVirtueSharing: boolean;
    allowMediaSharing: boolean;
    dataRetentionDays: number;
    autoDeleteOldData: boolean;
}
```

### Feature Toggles
```typescript
interface FeatureToggles {
    enableVirtueTracking: boolean;
    enableMediaTracking: boolean;
    enablePatternTracking: boolean;
    enableCybernetics: boolean;
    enableAIAnalysis: boolean;
    enableLocalLLM: boolean;
    enableInsights: boolean;
    enableTrendAnalysis: boolean;
    enableCorrelationDetection: boolean;
}
```

### Analysis Frequency
```typescript
interface AnalysisFrequency {
    mode: 'daily' | 'weekly' | 'manual' | 'custom';
    customInterval?: number;    // Hours for custom mode
    preferredTime?: string;     // HH:MM format
    timezone?: string;         // User's timezone
}
```

### Virtue Definitions
```typescript
interface VirtueDefinition {
    name: string;              // Virtue name
    description: string;       // Description
    weight: number;           // 1-10 importance scale
    customPrompt?: string;    // Custom AI prompt
    enabled: boolean;         // Whether to track this virtue
}
```

## Security Features

### Encryption
- Configuration is encrypted using the user's passphrase when available
- Falls back to unencrypted storage when no passphrase is set
- Automatic encryption/decryption on configuration changes

### Privacy Controls
- Granular control over data sharing
- Anonymous analytics opt-in/opt-out
- Data retention policies
- Auto-deletion of old data

### Server Communication
- Secure token-based authentication
- Encrypted data transmission
- Health checks and connection validation
- Retry logic with exponential backoff

## Usage Examples

### Basic Configuration
```typescript
import { sociallyFedConfig } from '../services/SociallyFedConfigService';

// Initialize the service
await sociallyFedConfig.initialize();

// Get current configuration
const config = sociallyFedConfig.getConfig();

// Update specific settings
await sociallyFedConfig.updateFeatureToggles({
    enableVirtueTracking: true,
    enableAIAnalysis: false
});

// Check if feature is enabled
if (sociallyFedConfig.isFeatureEnabled('enableVirtueTracking')) {
    // Enable virtue tracking UI
}
```

### LLM Server Setup
```typescript
// Configure local LLM server
await sociallyFedConfig.updateLLMConfig({
    endpoint: 'localhost',
    port: 3001,
    protocol: 'http',
    timeout: 30000
});

// Validate server connection
const validation = await sociallyFedConfig.validateLLMConfig(config.llmServer);
if (validation.valid) {
    console.log('LLM server is ready');
} else {
    console.error('LLM server error:', validation.error);
}
```

### Privacy Configuration
```typescript
// Set privacy level
await sociallyFedConfig.updatePrivacyConfig({
    dataSharingLevel: 'standard',
    allowAnonymousAnalytics: true,
    allowPatternSharing: false
});

// Check data sharing permissions
if (sociallyFedConfig.isDataSharingAllowed('patterns')) {
    // Share pattern data with LLM server
}
```

## Default Configurations

### LLM Server Defaults
- Endpoint: `localhost`
- Port: `3001`
- Protocol: `http`
- Timeout: `30000ms`
- Retry attempts: `3`
- Health check interval: `60000ms`

### Privacy Defaults
- Data sharing level: `standard`
- Anonymous analytics: `enabled`
- Pattern sharing: `enabled`
- Virtue sharing: `enabled`
- Media sharing: `enabled`
- Data retention: `365 days`
- Auto-delete: `disabled`

### Feature Defaults
All SociallyFed features are enabled by default:
- Virtue tracking: `enabled`
- Media tracking: `enabled`
- Pattern tracking: `enabled`
- Cybernetics: `enabled`
- AI analysis: `enabled`
- Local LLM: `enabled`
- Insights: `enabled`
- Trend analysis: `enabled`
- Correlation detection: `enabled`

### Default Virtues
Five core stoic virtues are pre-configured:
1. **Stoicism** (weight: 8) - Inner peace and resilience
2. **Courage** (weight: 7) - Facing fears and uncertainty
3. **Wisdom** (weight: 8) - Thoughtful decisions and learning
4. **Justice** (weight: 7) - Fairness and integrity
5. **Temperance** (weight: 6) - Self-control and moderation

## UI Integration

### Main Settings Page
The main Settings page includes:
- Quick toggles for core SociallyFed features
- Link to advanced SociallyFed settings
- Visual indicators for feature status

### Advanced Settings Page
The dedicated SociallyFed settings page provides:
- LLM server configuration with validation
- Privacy controls and data sharing preferences
- Feature toggles for all SociallyFed capabilities
- Analysis frequency and scheduling
- Custom virtue definitions and weightings
- Configuration import/export

### Settings Components
- `SociallyFedSettingsBox` - Individual setting toggles
- Accordion-style organization for different setting categories
- Real-time validation and error handling
- Responsive design for mobile and desktop

## Error Handling

### Configuration Loading
- Graceful fallback to defaults if loading fails
- User notification of configuration errors
- Automatic retry mechanisms

### Server Validation
- Connection timeout handling
- Health check failures
- Authentication errors
- Network connectivity issues

### Data Validation
- Input validation for all configuration fields
- Type checking and range validation
- Malformed configuration detection

## Migration and Compatibility

### Backward Compatibility
- Existing Baseline settings are preserved
- SociallyFed configuration is additive
- Graceful degradation when features are disabled

### Configuration Migration
- Automatic migration from old formats
- Default value population for missing fields
- Version checking and upgrade paths

### Data Export/Import
- JSON configuration export for backup
- Configuration import with validation
- Cross-device configuration sync

## Performance Considerations

### Storage Optimization
- Efficient JSON serialization
- Minimal storage footprint
- Lazy loading of configuration sections

### UI Performance
- Debounced configuration updates
- Optimistic UI updates
- Background validation

### Network Efficiency
- Minimal server communication
- Cached configuration validation
- Efficient health checks

## Testing

### Unit Tests
- Configuration service methods
- Validation logic
- Default configuration loading

### Integration Tests
- UI component behavior
- Settings persistence
- Server communication

### End-to-End Tests
- Complete configuration workflow
- Error handling scenarios
- Cross-device synchronization

## Future Enhancements

### Planned Features
- Cloud configuration sync
- Advanced privacy controls
- Custom analysis schedules
- Multi-server LLM support
- Configuration templates
- Automated optimization

### Extensibility
- Plugin architecture for new features
- Custom validation rules
- Third-party integration hooks
- Advanced analytics capabilities

## Troubleshooting

### Common Issues

#### Configuration Not Loading
1. Check localStorage permissions
2. Verify encryption key availability
3. Check for corrupted configuration data

#### LLM Server Connection Issues
1. Verify server is running
2. Check network connectivity
3. Validate server configuration
4. Review firewall settings

#### Feature Toggles Not Working
1. Restart the application
2. Check configuration service initialization
3. Verify feature dependencies

### Debug Information
Enable debug logging by setting:
```javascript
localStorage.setItem('sociallyfed_debug', 'true');
```

### Support
For configuration issues:
1. Check the browser console for errors
2. Export configuration for analysis
3. Reset to defaults if needed
4. Contact support with debug logs

## Security Best Practices

### Configuration Security
- Use strong passphrases for encryption
- Regularly rotate authentication tokens
- Monitor configuration access logs
- Backup configurations securely

### Privacy Protection
- Review data sharing settings regularly
- Understand what data is shared
- Use minimal sharing when possible
- Monitor privacy level changes

### Server Security
- Use HTTPS for production servers
- Implement proper authentication
- Regular security updates
- Monitor server access logs 