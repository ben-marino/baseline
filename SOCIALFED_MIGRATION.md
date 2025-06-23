# SociallyFed Data Migration Strategy

## Overview

This document outlines the strategy for extending Baseline's data models to support SociallyFed features while maintaining full backward compatibility with existing user data.

## Data Model Extensions

### 1. Core Interfaces

The following TypeScript interfaces have been added to `src/db.ts`:

#### VirtueAlignment
- **Purpose**: Track Stoic virtue development
- **Fields**: stoicism, courage, wisdom, justice, temperance (1-10 scale)
- **Validation**: All values must be integers between 1-10
- **Default**: All virtues set to 5 (neutral)

#### MediaConsumption
- **Purpose**: Track time spent in different media consumption modes
- **Fields**: servedContent, casualBrowsing, intentionalContent, creation, deepFocus (minutes)
- **Validation**: All values must be integers between 0-1440 (24 hours)
- **Default**: All categories set to 0 minutes

#### Patterns
- **Purpose**: Store AI-generated and user-identified patterns
- **Fields**: emotionalTriggers, copingStrategies, socialContexts (string arrays)
- **Validation**: Each string must be ≤500 characters
- **Default**: Empty arrays

#### Cybernetics
- **Purpose**: Track goal progress and feedback loops
- **Fields**: goalProgress (0-100%), feedbackLoops, adjustments (string arrays)
- **Validation**: goalProgress 0-100, strings ≤500 characters
- **Default**: goalProgress=0, empty arrays

#### PromptMetadata
- **Purpose**: Categorize journal prompts and track AI interactions
- **Fields**: category, subcategory, aiGenerated, userConfirmed
- **Validation**: category must be valid enum, subcategory ≤100 chars
- **Default**: category='baseline'

### 2. Extended Log Interface

The existing `Log` interface has been extended with optional SociallyFed fields:

```typescript
export interface Log {
    // ... existing Baseline fields ...
    
    // SociallyFed extensions - all optional for backward compatibility
    virtueAlignment?: VirtueAlignment;
    mediaConsumption?: MediaConsumption;
    patterns?: Patterns;
    cybernetics?: Cybernetics;
    promptMetadata?: PromptMetadata;
}
```

## Migration Strategy

### 1. Backward Compatibility

- **All SociallyFed fields are optional**: Existing logs without these fields continue to work
- **Default values**: When fields are missing, sensible defaults are applied
- **Validation**: Invalid data is replaced with defaults rather than causing errors
- **Storage**: New fields are stored alongside existing data without schema changes

### 2. Data Migration Functions

#### `migrateLogToSociallyFed(log: Log): Log`
- Adds default SociallyFed fields to existing logs
- Preserves all existing data
- Returns new log object with defaults populated

#### `validateAndMigrateLog(log: any): Log | null`
- Validates both Baseline and SociallyFed data
- Applies defaults for missing or invalid SociallyFed fields
- Returns null for completely invalid logs

#### `migrateAllLogs(): Promise<void>`
- Bulk migration utility for all existing logs
- Updates IndexedDB with SociallyFed defaults
- Handles errors gracefully with Sentry logging

### 3. Validation Functions

Each SociallyFed data type has dedicated validation:

- `validateVirtueAlignment()`: Ensures 1-10 scale integers
- `validateMediaConsumption()`: Ensures 0-1440 minute integers
- `validatePatterns()`: Ensures string arrays with length limits
- `validateCybernetics()`: Ensures percentage and string arrays
- `validatePromptMetadata()`: Ensures valid categories and limits

## Storage Layer Updates

### 1. IndexedDB (Frontend)
- **No schema changes required**: Dexie handles optional fields automatically
- **Version remains 1**: No database version bump needed
- **Bulk operations**: Efficient migration of existing data

### 2. Firebase Realtime Database (Backend)
- **Encryption preserved**: SociallyFed data encrypted with existing keys
- **Validation added**: Backend validates all SociallyFed fields
- **Backward compatible**: Existing API calls continue to work

### 3. Export System
- **New export categories**: Virtues, Media, Patterns, Cybernetics, Prompts
- **CSV compatibility**: Arrays converted to comma-separated strings
- **Null handling**: Missing data exported as null/empty

## Implementation Phases

### Phase 1: Data Models (Complete)
- ✅ Extended Log interface
- ✅ Validation functions
- ✅ Default value generators
- ✅ Migration utilities

### Phase 2: Backend Integration (Complete)
- ✅ Backend validation for SociallyFed fields
- ✅ Data storage in Firebase
- ✅ Encryption support

### Phase 3: Frontend Integration (Complete)
- ✅ Export system updates
- ✅ Migration utilities
- ✅ Validation helpers

### Phase 4: UI Components (Future)
- ⏳ Virtue tracking interface
- ⏳ Media consumption logging
- ⏳ Pattern recognition display
- ⏳ Cybernetic feedback forms

### Phase 5: AI Integration (Future)
- ⏳ Pattern analysis algorithms
- ⏳ Prompt generation system
- ⏳ Insight recommendations

## Testing Strategy

### 1. Migration Testing
```typescript
// Test migration of existing logs
const oldLog = { timestamp: 1234567890, mood: 3, average: "average" };
const migratedLog = migrateLogToSociallyFed(oldLog);
// Should have all SociallyFed fields with defaults
```

### 2. Validation Testing
```typescript
// Test validation of SociallyFed data
const validVirtues = { stoicism: 7, courage: 8, wisdom: 6, justice: 9, temperance: 5 };
const isValid = validateVirtueAlignment(validVirtues); // Should return valid object
```

### 3. Backward Compatibility Testing
```typescript
// Test that existing functionality still works
const existingLogs = await ldb.logs.toArray();
// All existing logs should still be accessible and functional
```

## Rollout Plan

### 1. Silent Deployment
- Deploy data models and validation
- No user-facing changes
- Monitor for any validation errors

### 2. Gradual Feature Rollout
- Enable SociallyFed features for beta users
- Collect feedback on data quality
- Iterate on validation rules

### 3. Full Release
- Enable for all users
- Provide migration utilities
- Monitor data integrity

## Monitoring and Maintenance

### 1. Data Quality Metrics
- Track percentage of logs with SociallyFed data
- Monitor validation error rates
- Measure migration success rates

### 2. Performance Monitoring
- IndexedDB operation times
- Firebase write/read performance
- Export generation times

### 3. Error Handling
- Sentry integration for migration errors
- Graceful fallbacks for invalid data
- User notification for data issues

## Security Considerations

### 1. Data Privacy
- SociallyFed data encrypted with existing keys
- No additional encryption overhead
- Same privacy guarantees as existing data

### 2. Validation Security
- Input sanitization for all new fields
- Length limits to prevent abuse
- Type checking to prevent injection

### 3. Access Control
- Same Firebase rules apply
- No additional permissions required
- User data isolation maintained

## Future Considerations

### 1. Schema Evolution
- Plan for additional SociallyFed fields
- Consider versioning strategy for major changes
- Maintain backward compatibility

### 2. Performance Optimization
- Index SociallyFed fields for queries
- Optimize bulk operations
- Consider data archiving strategies

### 3. Integration Points
- LLM analysis endpoints
- Pattern recognition services
- External virtue tracking tools

## Conclusion

This migration strategy ensures that Baseline's existing functionality remains intact while providing a solid foundation for SociallyFed features. The approach prioritizes backward compatibility, data integrity, and user privacy while enabling future enhancements. 