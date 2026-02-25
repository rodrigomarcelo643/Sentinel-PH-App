<div align="center">
  <img src="./assets/logo/logo.png" alt="Sentinel PH Logo" width="200"/>
  
  # Sentinel PH App
  
  ![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Expo](https://img.shields.io/badge/Expo-54.0.0-000020?style=for-the-badge&logo=expo&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-12.9.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  
  A modern React Native mobile application built with Expo for Innovation Cup Hackathon
</div>

---

## 📱 Features

- 🔐 Authentication with Firebase
- 🇵🇭 Philippine Contact Number Input
- 🎨 Custom UI Components with NativeWind
- ⚡ Smooth Animations
- 🌐 Cross-platform (iOS & Android)

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Styling:** NativeWind (TailwindCSS for React Native)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Navigation:** React Navigation
- **Fonts:** Inter (Light, Medium, SemiBold)

## 📂 Project Structure

```
Sentinel-PH-App/
├── @types/                    # TypeScript type definitions
├── assets/                    # Static assets
│   ├── fonts/                # Custom fonts (Inter)
│   └── logo/                 # App logo
├── components/               # Reusable components
│   ├── screens/             # Screen components
│   │   └── SplashScreen.tsx
│   └── ui/                  # UI components
│       ├── Alert.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Checkbox.tsx
│       ├── Divider.tsx
│       ├── Input.tsx
│       ├── Spinner.tsx
│       └── Switch.tsx
├── config/                   # Configuration files
│   └── firebase.ts          # Firebase config
├── constants/               # App constants
├── context/                 # React context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Library integrations
│   └── firebase.ts         # Firebase initialization
├── navigation/              # Navigation setup
├── screens/                 # App screens
│   └── LoginScreen.tsx
├── services/                # API services
├── theme/                   # Theme configuration
├── utils/                   # Utility functions
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
├── tailwind.config.js       # TailwindCSS config
└── package.json             # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Sentinel-PH-App
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
# Create .env file and add your Firebase credentials
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
pnpm start
```

5. Run on your preferred platform
```bash
# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

## 🎨 Design System

### Colors
- **Primary:** `#1B365D` (Navy Blue)
- **Secondary:** `#20A0D8` (Sky Blue)
- **Background:** `#FFFFFF` (White)

### Typography
- **Font Family:** Inter
  - Light (18pt)
  - Medium (18pt)
  - SemiBold (24pt)

## 📝 Scripts

```bash
pnpm start          # Start Expo development server
pnpm android        # Run on Android
pnpm ios            # Run on iOS
pnpm web            # Run on web
pnpm lint           # Lint code
pnpm format         # Format code with Prettier
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Innovation Cup Hackathon.

---

<div align="center">
  Made with ❤️ for Innovation Cup Hackathon
</div>
