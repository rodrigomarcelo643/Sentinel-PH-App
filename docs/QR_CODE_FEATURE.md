# QR Code Feature Documentation

## Overview
The QR code feature allows users to generate a unique QR code that contains their profile information and symptom report history. This QR code can be scanned by authorized personnel to view the user's complete health profile.

## Features

### 1. Unique QR Code Generation
- Each user gets a unique QR ID in the format: `QR-{timestamp}-{random}`
- The QR ID is persistent and doesn't change unless regenerated
- QR codes are stored in the `userQRCodes` collection in Firestore

### 2. Data Included in QR Code
The QR code links to the following user data:
- **Personal Information:** First Name, Last Name, Middle Initial, Email, Contact Number, Address, Community Role, Account Status
- **Documents:** ID Type, Valid ID URL, Selfie URL
- **Symptom Report History:** All symptom reports with timestamps, symptoms, location, and verification status

### 3. Auto-Update Feature
- When the QR code is scanned, it automatically fetches the latest user data
- Any updates to user profile or new symptom reports are reflected when scanned

### 4. Manual Regeneration
- Users can manually regenerate their QR code using the refresh button

## File Structure

```
screens/
├── QRScreen.tsx              # QR code display screen
└── tabs/ProfileTab.tsx       # Updated with "My QR Code" button

services/
└── qrCode.ts                 # QR code service functions

screens/
└── HomeScreen.tsx            # Updated with QR navigation
```

## Usage Flow

1. User navigates to Profile tab
2. Clicks "My QR Code" button
3. System checks if QR code exists (if not, generates new one)
4. QR code is displayed with user information
5. User can regenerate QR code if needed

## API Functions

- `generateUserQRCode(userId)` - Generates or updates QR code
- `getUserQRCode(userId)` - Retrieves existing QR code
- `getQRCodeData(qrId)` - Fetches QR data by ID (for scanning)
- `updateUserQRCode(userId)` - Updates QR code with latest data
