# AI Health Guide Feature

## Overview

The AI Health Guide is an intelligent assistant that analyzes user symptom patterns and provides health information guidance using OpenAI's GPT-3.5 model.

## ⚠️ Important Disclaimer

The AI Health Guide is **NOT** a medical professional and cannot:
- Diagnose medical conditions
- Prescribe medications
- Replace professional medical advice

It is designed to:
- Help users understand symptom patterns
- Provide general health information
- Suggest when to seek medical care
- Offer educational health guidance

## Features

### 1. Symptom Analysis
- Fetches user's symptom reports from the past 7 days
- Calculates symptom frequency
- Identifies patterns in reported symptoms
- Separates self-reported vs observed symptoms

### 2. Disease Prediction
- Provides 2-4 possible conditions
- Shows confidence levels (50-85%)
- Displays severity indicators:
  - 🟢 Low
  - 🔵 Medium
  - 🟠 High
  - 🔴 Critical

### 3. Visual Progress Bars
- Color-coded confidence indicators
- Visual percentage representation
- Severity badges with icons

### 4. Symptom Frequency Chart
- Top 5 most frequent symptoms
- Visual bar chart representation
- Color-coded by frequency:
  - Red: 4+ occurrences
  - Orange: 2-3 occurrences
  - Blue: 1 occurrence

### 5. Quick Analysis Buttons
- **My Symptoms:** Analyze self-reported symptoms
- **Observed:** Analyze observed symptoms
- **When to See Doctor:** General guidance

## Technical Implementation

### File Structure
```
screens/
└── AiDoctorAssistantScreen.tsx    # Main AI assistant screen

screens/tabs/
└── HistoryTab.tsx                  # Entry point with AI button

screens/
└── HomeScreen.tsx                  # Navigation handling
```

### Key Components

#### AiDoctorAssistantScreen
- Full-screen chat interface
- OpenAI API integration
- Message history management
- Symptom frequency analysis
- Disease parsing and display

#### Message Types
```typescript
interface Message {
  role: 'user' | 'assistant' | 'disclaimer';
  content: string;
  confidence?: number;
  diseases?: Array<{
    name: string;
    confidence: number;
    severity: string;
  }>;
}
```

### API Integration

#### OpenAI Configuration
```typescript
{
  model: 'gpt-3.5-turbo',
  max_tokens: 250,
  temperature: 0.7
}
```

#### System Prompt
The AI is instructed to:
- Act as a health information guide
- Provide realistic confidence levels (50-85%)
- Format diseases with specific syntax
- Include severity levels
- Remind users it's not a doctor
- Encourage consulting healthcare providers

#### Disease Format
```
DISEASE: [Disease Name] | CONFIDENCE: [X]% | SEVERITY: [Low/Medium/High/Critical]
```

### Data Flow

1. **User Opens AI Assistant**
   - Fetch symptom reports from Firestore
   - Filter reports from past 7 days
   - Calculate symptom frequency
   - Display quick analysis buttons

2. **User Sends Message**
   - Add user message to chat
   - Prepare context with symptom frequency
   - Send request to OpenAI API
   - Parse response for diseases
   - Display formatted response

3. **Disease Display**
   - Extract disease information
   - Create progress bars
   - Show severity badges
   - Display confidence percentages

## UI/UX Design

### Color Scheme
- **Primary:** #1B365D (Navy Blue)
- **Secondary:** #20A0D8 (Sky Blue)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Orange)
- **Error:** #DC2626 (Red)

### Typography
- **Font:** Inter
- **Sizes:** 9-18pt
- **Weights:** Medium, SemiBold

### Animations
- Fade-in on screen load
- Message bubble animations
- Pulsing AI assistant button
- Smooth scrolling

### Accessibility
- Dismissible disclaimer banner
- Closable frequency chart
- Clear visual hierarchy
- Readable font sizes
- Color contrast compliance

## Error Handling

### API Key Errors
```
Invalid API key. Please restart the server with: pnpm start --clear
```

### Network Errors
```
Network connection issue. Consult a healthcare professional for medical advice.
```

### Rate Limit Errors
```
Service temporarily unavailable. Consult a healthcare professional for medical advice.
```

### Unknown Errors
```
Unable to process your request. Please try again. Consult a healthcare professional for medical advice.
```

## Usage Examples

### Analyzing Self-Reported Symptoms
```
User: "Analyze my symptoms"
AI: Analyzes frequency data → Provides disease predictions → Shows confidence levels
```

### Quick Analysis
```
User: Clicks "My Symptoms (5)" button
AI: Auto-sends analysis request → Displays results with progress bars
```

### General Health Questions
```
User: "What should I do if symptoms worsen?"
AI: Provides general guidance → Recommends consulting healthcare provider
```

## Performance Considerations

### Optimization
- Limit symptom history to 7 days
- Cache symptom frequency calculations
- Debounce API calls
- Limit response tokens (250)

### Data Usage
- Minimal API calls
- Efficient Firestore queries
- Optimized image loading

## Future Enhancements

### Potential Features
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Symptom tracking over time
- [ ] Health tips and recommendations
- [ ] Integration with health records
- [ ] Medication reminders
- [ ] Doctor appointment booking

### Improvements
- [ ] Better disease parsing
- [ ] More detailed symptom analysis
- [ ] Historical trend visualization
- [ ] Export chat history
- [ ] Share with healthcare providers

## Testing

### Test Cases
1. ✅ Display symptom frequency chart
2. ✅ Parse disease predictions correctly
3. ✅ Show confidence levels with progress bars
4. ✅ Handle API errors gracefully
5. ✅ Display medical disclaimers
6. ✅ Navigate back to History tab
7. ✅ Auto-send quick analysis messages

### Edge Cases
- No symptom history
- API key invalid
- Network offline
- Malformed API response
- Empty user input

## Security & Privacy

### Data Protection
- Symptom data stays in user's Firestore
- No data shared with third parties
- API calls encrypted (HTTPS)
- No persistent chat history

### Compliance
- HIPAA considerations
- Data privacy regulations
- User consent for AI analysis
- Clear disclaimers about limitations

## Maintenance

### Regular Updates
- Monitor OpenAI API changes
- Update system prompts as needed
- Improve disease parsing logic
- Enhance error messages
- Update medical disclaimers

### Monitoring
- Track API usage
- Monitor error rates
- Analyze user feedback
- Review confidence accuracy
