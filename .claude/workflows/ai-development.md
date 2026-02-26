# AI-Assisted Development Workflow

## Overview

This document outlines the workflow for AI-assisted development using Claude AI for the Sentinel PH App.

## Workflow Steps

### 1. Feature Planning
- Define feature requirements clearly
- Break down into smaller, manageable tasks
- Identify affected files and components
- Consider TypeScript type implications

### 2. Code Generation
- Provide context about existing code structure
- Specify TypeScript types and interfaces
- Request minimal, focused implementations
- Ensure React Native compatibility

### 3. Integration
- Review generated code for consistency
- Test on both iOS and Android
- Verify TypeScript compilation
- Check for proper error handling

### 4. Testing
- Test user interactions
- Verify API integrations
- Check loading and error states
- Validate data persistence

### 5. Documentation
- Update component documentation
- Add inline comments for complex logic
- Update README if needed
- Document API changes

## Best Practices

### Code Quality
- Use TypeScript strict mode
- Implement proper error boundaries
- Add loading indicators
- Handle edge cases

### Performance
- Optimize re-renders with React.memo
- Use useCallback for event handlers
- Implement lazy loading where appropriate
- Minimize bundle size

### Security
- Never commit API keys or secrets
- Use environment variables
- Validate user inputs
- Implement proper authentication checks

### Accessibility
- Add proper labels for screen readers
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with accessibility tools

## AI Prompting Tips

### Effective Prompts
✅ "Add a button to navigate to AI Doctor screen from History tab"
✅ "Create TypeScript interface for symptom report with frequency tracking"
✅ "Implement error handling for OpenAI API calls with user-friendly messages"

### Ineffective Prompts
❌ "Make it better"
❌ "Fix the bug"
❌ "Add more features"

## Common Tasks

### Adding a New Screen
1. Create screen component in `screens/`
2. Add to navigation in `HomeScreen.tsx`
3. Update TypeScript types for navigation
4. Export from `screens/index.ts`

### Adding a New Feature
1. Plan component structure
2. Define TypeScript interfaces
3. Implement UI components
4. Add business logic
5. Integrate with backend
6. Test thoroughly

### Fixing Bugs
1. Identify the issue clearly
2. Locate affected files
3. Understand the root cause
4. Implement minimal fix
5. Test the fix
6. Verify no regressions

## Version Control

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/config changes

### Example Commits
```
feat: Add AI Health Guide with OpenAI integration

- Implement chat interface with animated messages
- Add disease prediction with confidence levels
- Display symptom frequency analysis chart
- Include medical disclaimers and safety warnings

Closes #123
```
