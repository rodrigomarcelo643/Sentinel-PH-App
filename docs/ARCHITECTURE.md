# SentinelPH Architecture Documentation

## System Overview

SentinelPH is a community-driven health surveillance mobile application built as a Progressive Web App (PWA) using React Native and Firebase.

## Architecture Layers

### 1. Presentation Layer
- **React Native Components** - Cross-platform UI components
- **NativeWind (Tailwind CSS)** - Styling system
- **Framer Motion** - Animations and transitions
- **Custom UI Components** - Reusable design system components

### 2. Application Layer
- **Context Providers** - State management (Auth, Announcements, Navigation)
- **Custom Hooks** - Reusable business logic
- **Navigation** - Screen routing and navigation flow
- **Services** - API integration and business logic

### 3. Data Layer
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Authentication** - User authentication and authorization
- **Firebase Cloud Functions** - Serverless backend logic
- **Cloudinary** - Image storage and optimization

## Core Components

### Authentication Flow
```
User → LoginScreen → Firebase Auth → AuthContext → HomeScreen
                                    ↓
                              PendingApprovalScreen (if status = pending)
```

### Data Flow
```
User Action → Service Layer → Firebase API → Firestore
                                           ↓
                                    Real-time Listener
                                           ↓
                                    Context Update
                                           ↓
                                    UI Re-render
```

## Key Design Patterns

### 1. Context Pattern
- **AuthContext** - Manages user authentication state
- **AnnouncementContext** - Handles real-time announcements
- **NavigationContext** - Controls screen navigation

### 2. Service Layer Pattern
- Centralized API calls in `/services` directory
- Separation of concerns between UI and business logic
- Reusable service functions across components

### 3. Component Composition
- Atomic design principles
- Reusable UI components in `/components/ui`
- Feature-specific components in dedicated folders

## Security Architecture

### Authentication
- Firebase Authentication with email/password
- JWT token-based session management
- Role-based access control (Sentinel, BHW, Admin)

### Data Privacy
- User status verification (pending/approved)
- QR code encryption for health data
- Anonymized public map data

### API Security
- Environment variable protection
- Firebase security rules
- Rate limiting on Cloud Functions

## Offline-First Strategy

### Local Storage
- AsyncStorage for user preferences
- Cached symptom reports
- Offline queue for pending submissions

### Sync Strategy
- Auto-sync when connectivity restored
- Conflict resolution for concurrent updates
- Background sync for announcements

## Scalability Considerations

### Database Design
- Indexed queries for performance
- Denormalized data for read optimization
- Batch operations for bulk updates

### Performance Optimization
- Lazy loading of screens
- Image optimization via Cloudinary
- Memoization of expensive computations
- Virtual lists for large datasets

## Integration Points

### External Services
- **Google Maps API** - Location services and heatmaps
- **Cloudinary** - Image upload and CDN
- **Geoapify** - Address autocomplete
- **Twilio** (planned) - SMS notifications

### Firebase Services
- **Authentication** - User management
- **Firestore** - Real-time database
- **Cloud Functions** - Backend logic
- **Hosting** - PWA deployment
- **Cloud Messaging** (planned) - Push notifications

## Deployment Architecture

### Development
```
Local Dev → Expo Dev Server → Mobile Device/Emulator
```

### Production
```
Source Code → Build Process → Firebase Hosting → PWA
                           ↓
                    Android APK/iOS IPA
```

## Monitoring & Analytics

### Error Tracking
- Console logging for development
- Firebase Crashlytics (planned)

### Usage Analytics
- User engagement metrics
- Feature adoption tracking
- Performance monitoring

## Future Architecture Enhancements

1. **Microservices** - Separate AI/ML processing
2. **CDN** - Global content delivery
3. **Load Balancing** - Handle increased traffic
4. **Caching Layer** - Redis for frequently accessed data
5. **Message Queue** - RabbitMQ for async processing
