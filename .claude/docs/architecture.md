# Project Architecture

## Directory Structure

```
Sentinel-PH-App/
├── .claude/                    # AI workspace configuration
│   ├── workflows/             # Development workflows
│   └── docs/                  # Project documentation
├── @types/                    # TypeScript type definitions
├── assets/                    # Static assets
│   ├── fonts/                # Custom fonts (Inter)
│   ├── images/               # Images and icons
│   └── logo/                 # App logo
├── components/               # Reusable components
│   ├── camera/              # Camera components
│   ├── registration/        # Registration flow components
│   ├── report/              # Report submission components
│   ├── screens/             # Screen-level components
│   └── ui/                  # UI components (Button, Input, etc.)
├── config/                   # Configuration files
├── constants/               # App constants
├── context/                 # React context providers
│   └── AuthContext.tsx      # Authentication context
├── hooks/                   # Custom React hooks
├── lib/                     # Library integrations
│   └── firebase.ts         # Firebase initialization
├── navigation/              # Navigation setup
├── screens/                 # App screens
│   ├── tabs/               # Tab screens
│   │   ├── HomeTab.tsx
│   │   ├── HistoryTab.tsx
│   │   ├── MapTab.tsx
│   │   └── ProfileTab.tsx
│   ├── AiDoctorAssistantScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ReportScreen.tsx
├── services/                # API services
│   ├── auth.ts             # Authentication service
│   ├── cloudinary.ts       # Image upload service
│   └── registration.ts     # Registration service
├── theme/                   # Theme configuration
├── utils/                   # Utility functions
└── App.tsx                  # Main app component
```

## Component Architecture

### Screen Components
- Full-screen views
- Handle navigation
- Manage screen-level state
- Coordinate child components

### Tab Components
- Individual tab content
- Manage tab-specific state
- Handle tab-specific logic

### UI Components
- Reusable, presentational
- Accept props for customization
- Minimal internal state
- Styled with NativeWind

### Feature Components
- Domain-specific logic
- Combine multiple UI components
- Handle feature-specific state

## State Management

### Local State (useState)
- Component-specific state
- UI state (modals, inputs)
- Temporary data

### Context API
- Authentication state
- User data
- Global app state

### Firebase Realtime
- Symptom reports
- User profiles
- Community data

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Service Layer (API Call)
    ↓
Firebase/Backend
    ↓
State Update (Context/Local)
    ↓
UI Re-render
```

## Navigation Structure

```
App
├── Auth Stack
│   ├── Login
│   ├── Register
│   └── Pending Approval
└── Main Stack
    ├── Home (Tab Navigator)
    │   ├── Home Tab
    │   ├── History Tab
    │   ├── Map Tab
    │   └── Profile Tab
    ├── Report Screen (Full Screen)
    └── AI Doctor Assistant (Full Screen)
```

## Key Features Architecture

### Authentication Flow
1. User enters credentials
2. Service validates with Firebase
3. Context updates with user data
4. Navigation to appropriate screen

### Symptom Reporting
1. Multi-step form (Type → Symptoms → Details)
2. Image upload to Cloudinary
3. Data saved to Firestore
4. Real-time updates on map

### AI Health Guide
1. Fetch user symptom history
2. Calculate symptom frequency
3. Send to OpenAI API
4. Parse disease predictions
5. Display with confidence levels

### Profile Management
1. Display user information
2. Show verified documents
3. Display community role badge
4. Handle logout

## API Integrations

### Firebase
- **Authentication:** User login/registration
- **Firestore:** Data storage
- **Storage:** Document uploads

### OpenAI
- **Model:** GPT-3.5 Turbo
- **Purpose:** Symptom analysis
- **Features:** Disease prediction, health guidance

### Cloudinary
- **Purpose:** Image hosting
- **Features:** Upload, transformation, CDN

### Google Maps
- **Purpose:** Location visualization
- **Features:** Markers, heatmaps, clustering

## Security Considerations

### Environment Variables
- API keys stored in `.env`
- Never committed to repository
- Accessed via `process.env`

### Authentication
- Firebase Auth tokens
- Secure session management
- Role-based access control

### Data Validation
- Input sanitization
- Type checking with TypeScript
- Server-side validation

## Performance Optimization

### Code Splitting
- Lazy load screens
- Dynamic imports
- Reduce initial bundle size

### Image Optimization
- Cloudinary transformations
- Lazy loading images
- Proper image sizing

### State Updates
- Minimize re-renders
- Use React.memo
- Optimize context usage

## Testing Strategy

### Unit Tests
- Utility functions
- Service layer
- Custom hooks

### Integration Tests
- Component interactions
- API integrations
- Navigation flows

### E2E Tests
- Critical user flows
- Authentication
- Report submission

## Deployment

### Development
```bash
pnpm start
pnpm ios / pnpm android
```

### Production
```bash
pnpm build
eas build --platform all
eas submit
```

## Monitoring

### Error Tracking
- Console logging
- Error boundaries
- User feedback

### Analytics
- User engagement
- Feature usage
- Performance metrics
