# SociallyFed Onboarding Flow

## Overview

The SociallyFed onboarding flow is a comprehensive, step-by-step guide that introduces users to the three philosophical pillars of digital wellness and helps them configure their personalized experience. This guided setup ensures users understand the system's capabilities and can make informed decisions about their digital habits.

## Onboarding Flow Structure

### 1. Welcome & Introduction
**Purpose**: Introduce users to the three philosophical pillars
**Duration**: ~2 minutes

**Features**:
- Beautiful visual introduction to Stoicism, Cybernetics, and SociallyFed Pyramid
- Clear explanation of how ancient wisdom meets modern technology
- Overview of the 5-minute setup process
- Engaging animations and visual hierarchy

**Key Elements**:
- Three pillar cards with icons and descriptions
- Gradient backgrounds and smooth transitions
- Responsive design for all screen sizes

### 2. Stoic Virtues Selection
**Purpose**: Help users choose and prioritize their core virtues
**Duration**: ~3 minutes

**Features**:
- Interactive selection of the four cardinal virtues
- Weighted importance system (1-10 scale)
- Real-time preview of selections
- Educational descriptions of each virtue

**Virtues Covered**:
- **Courage (Fortitudo)**: Facing fears, taking action, persevering
- **Wisdom (Sapientia)**: Making thoughtful decisions, learning
- **Justice (Justitia)**: Treating others fairly, acting with integrity
- **Temperance (Temperantia)**: Practicing self-control, moderation

**Configuration Options**:
- Enable/disable individual virtues
- Set importance weights (1-10)
- Custom daily reflection prompts
- Weekly reflection scheduling

### 3. Media Consumption Baseline
**Purpose**: Establish user's current digital habits and preferences
**Duration**: ~2 minutes

**Features**:
- Interactive time slider for daily social media usage
- Tracking mode selection (passive, active, intervention)
- Real-time time display with hour conversion
- Platform-specific configuration options

**Configuration Options**:
- Daily social media time limits (0-8 hours)
- Tracking mode selection:
  - **Passive**: Monitor only, no interventions
  - **Active**: Gentle notifications and reminders
  - **Intervention**: Automatic blocking and guided breaks
- SociallyFed Pyramid level customization

### 4. Feedback Loop Configuration
**Purpose**: Set up cybernetic feedback systems for continuous improvement
**Duration**: ~2 minutes

**Features**:
- Three-tier feedback system configuration
- Sensitivity level selection
- Real-time preview of feedback frequency

**Feedback Loops**:
- **Daily Check-in**: Morning mood and goal progress review
- **Weekly Review**: Pattern analysis and habit effectiveness
- **Monthly Analysis**: Deep trend analysis and system optimization

**Configuration Options**:
- Enable/disable individual feedback loops
- Feedback sensitivity (low, medium, high)
- Custom scheduling for each loop type
- Goal type preferences (habit, outcome, process)

### 5. Local LLM Setup (Optional)
**Purpose**: Configure local AI server for personalized insights
**Duration**: ~1 minute

**Features**:
- One-click LLM server connection test
- Real-time connection status display
- Educational content about local AI benefits
- Skip option for later configuration

**Benefits Explained**:
- Data never leaves user's device
- Personalized insights based on patterns
- No external dependencies
- Works offline for enhanced privacy

### 6. Examples & Completion
**Purpose**: Show users how their configuration will work in practice
**Duration**: ~1 minute

**Features**:
- Personalized examples based on user selections
- Real-time preview of daily prompts and alerts
- Completion celebration with next steps
- Integration with existing Baseline features

**Example Types**:
- Daily Stoic reflection prompts
- Media consumption alerts
- Weekly feedback summaries
- Progress tracking visualizations

## Technical Implementation

### Component Architecture

```typescript
// Main onboarding component
SociallyFedOnboarding
├── OnboardingStep[] (array of step configurations)
├── State management for user selections
├── Progress tracking and navigation
└── Configuration persistence

// Individual step components
├── WelcomeStep
├── VirtuesStep
├── MediaBaselineStep
├── FeedbackStep
├── LLMSetupStep
└── ExamplesStep
```

### State Management

```typescript
interface OnboardingState {
    currentStep: number;
    selectedVirtues: {
        courage: { enabled: boolean; weight: number };
        wisdom: { enabled: boolean; weight: number };
        justice: { enabled: boolean; weight: number };
        temperance: { enabled: boolean; weight: number };
    };
    mediaBaseline: {
        dailySocialMedia: number;
        trackingMode: 'passive' | 'active' | 'intervention';
    };
    feedbackPreferences: {
        dailyCheck: boolean;
        weeklyReview: boolean;
        monthlyAnalysis: boolean;
        sensitivity: 'low' | 'medium' | 'high';
    };
    llmTestResult: { success: boolean; message: string } | null;
}
```

### Configuration Persistence

The onboarding flow integrates with the `SociallyFedConfigService` to:
- Save user selections to encrypted local storage
- Update configuration in real-time
- Validate settings before completion
- Provide fallback defaults for incomplete setup

### Navigation & Flow Control

- **Progress Bar**: Visual indication of completion status
- **Back/Next Navigation**: Intuitive step-by-step progression
- **Skip Options**: Allow users to bypass optional steps
- **Completion Detection**: Check if user has already completed setup

## User Experience Features

### Accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Supports high contrast mode

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for larger screens
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets and gestures

### Visual Design
- **Gradient Backgrounds**: Modern, engaging visual style
- **Smooth Animations**: Subtle transitions between steps
- **Icon Integration**: Meaningful icons for each section
- **Color Coding**: Consistent color scheme throughout

### Error Handling
- **Validation**: Real-time input validation
- **Error Messages**: Clear, helpful error descriptions
- **Recovery Options**: Easy ways to fix mistakes
- **Graceful Degradation**: Works even with network issues

## Integration Points

### With Baseline Journal
- **Journal Prompts**: Stoic virtue prompts appear in daily journaling
- **Mood Tracking**: Media consumption correlates with mood patterns
- **Goal Integration**: Feedback loops inform goal setting
- **Progress Visualization**: Charts show framework effectiveness

### With SociallyFed Settings
- **Configuration Sync**: Onboarding settings appear in main settings
- **Modification Options**: Users can adjust settings after onboarding
- **Advanced Features**: Access to additional configuration options
- **Reset Capabilities**: Option to restart onboarding process

### With LLM Service
- **Connection Testing**: Real-time LLM server validation
- **Configuration Storage**: Secure storage of LLM settings
- **Fallback Handling**: Graceful degradation if LLM unavailable
- **Privacy Assurance**: Local-only data processing

## Usage Examples

### Starting the Onboarding Flow

```typescript
// From Settings page
history.push('/sociallyfed-onboarding');

// Direct navigation
window.location.href = '/sociallyfed-onboarding';
```

### Checking Onboarding Status

```typescript
const hasCompletedOnboarding = await sociallyFedConfig.hasCompletedOnboarding();
if (!hasCompletedOnboarding) {
    // Show onboarding prompt
    showOnboardingPrompt();
}
```

### Customizing Onboarding Steps

```typescript
// Modify step requirements
const customSteps = steps.map(step => ({
    ...step,
    required: step.id !== 'llm-setup' // Make LLM setup optional
}));
```

## Best Practices

### For Users
1. **Take Your Time**: Each step is designed to be thoughtful, not rushed
2. **Be Honest**: Accurate baseline data leads to better recommendations
3. **Start Simple**: Begin with basic settings, refine over time
4. **Review Examples**: Understand how your choices will work in practice

### For Developers
1. **Maintain State**: Preserve user progress across sessions
2. **Validate Input**: Ensure all user selections are valid
3. **Provide Feedback**: Give clear confirmation of successful actions
4. **Handle Errors**: Gracefully manage network and validation errors

### For Designers
1. **Progressive Disclosure**: Show information when relevant
2. **Visual Hierarchy**: Guide user attention effectively
3. **Consistent Language**: Use clear, consistent terminology
4. **Accessibility First**: Design for all users from the start

## Future Enhancements

### Planned Features
1. **A/B Testing**: Test different onboarding flows
2. **Personalization**: Adapt flow based on user behavior
3. **Video Tutorials**: Embedded video explanations
4. **Community Features**: Share configurations with others

### Analytics Integration
1. **Completion Tracking**: Monitor onboarding completion rates
2. **Step Analysis**: Identify where users drop off
3. **Configuration Patterns**: Understand common user preferences
4. **Effectiveness Metrics**: Measure impact on user engagement

### Advanced Customization
1. **Custom Virtues**: Allow users to define their own virtues
2. **Advanced Scheduling**: More granular timing options
3. **Integration APIs**: Connect with external habit tracking apps
4. **Machine Learning**: AI-powered configuration recommendations

---

*The SociallyFed onboarding flow represents a thoughtful approach to introducing complex philosophical concepts in an accessible, engaging way. By guiding users through each step with clear explanations and practical examples, we help them build a foundation for mindful technology use that can last a lifetime.* 