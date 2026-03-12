# API Documentation

## Authentication Services

### `auth.ts`

#### `loginUser(email: string, password: string)`
Authenticates user with email and password.

**Returns:** `Promise<User>`

**Throws:** Authentication errors

---

#### `registerUser(userData: RegisterData)`
Creates new user account with pending status.

**Parameters:**
- `userData.email` - User email
- `userData.password` - User password
- `userData.firstName` - First name
- `userData.lastName` - Last name
- Additional profile fields

**Returns:** `Promise<void>`

---

#### `logoutUser()`
Signs out current user.

**Returns:** `Promise<void>`

---

#### `resetPassword(email: string)`
Sends password reset email.

**Returns:** `Promise<void>`

---

## Symptom Report Services

### `symptomReports.ts`

#### `submitSymptomReport(reportData: SymptomReportData)`
Submits new symptom observation.

**Parameters:**
```typescript
{
  userId: string;
  reportType: 'self' | 'observation';
  symptoms: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  proofImageUrl?: string;
  additionalNotes?: string;
}
```

**Returns:** `Promise<string>` - Report ID

---

#### `getUserReports(userId: string)`
Fetches all reports by user.

**Returns:** `Promise<SymptomReport[]>`

---

#### `getReportById(reportId: string)`
Retrieves specific report details.

**Returns:** `Promise<SymptomReport>`

---

## Announcement Services

### `announcements.ts`

#### `getAnnouncements(barangay?: string)`
Fetches announcements, optionally filtered by barangay.

**Returns:** `Promise<Announcement[]>`

---

#### `subscribeToAnnouncements(callback: Function)`
Real-time listener for new announcements.

**Returns:** `Unsubscribe function`

---

## QR Code Services

### `qrCode.ts`

#### `generateUserQRCode(userId: string)`
Generates unique QR code for user.

**Returns:** `Promise<string>` - QR ID

---

#### `getUserQRCode(userId: string)`
Retrieves existing QR code.

**Returns:** `Promise<QRCodeData>`

---

#### `getQRCodeData(qrId: string)`
Fetches user data by QR ID (for scanning).

**Returns:** `Promise<UserHealthProfile>`

---

#### `updateUserQRCode(userId: string)`
Updates QR code with latest user data.

**Returns:** `Promise<void>`

---

## Location Services

### `location.ts`

#### `getCurrentLocation()`
Gets device GPS coordinates.

**Returns:** `Promise<Location>`

---

#### `reverseGeocode(latitude: number, longitude: number)`
Converts coordinates to address.

**Returns:** `Promise<string>`

---

## Cloudinary Services

### `cloudinary.ts`

#### `uploadImage(imageUri: string, folder: string)`
Uploads image to Cloudinary.

**Parameters:**
- `imageUri` - Local image URI
- `folder` - Cloudinary folder path

**Returns:** `Promise<string>` - Image URL

---

## Google Maps Services

### `googleMaps.ts`

#### `getPlaceSuggestions(query: string)`
Autocomplete address suggestions.

**Returns:** `Promise<PlaceSuggestion[]>`

---

#### `getPlaceDetails(placeId: string)`
Detailed place information.

**Returns:** `Promise<PlaceDetails>`

---

## Geoapify Services

### `geoapify.ts`

#### `searchAddress(query: string)`
Address autocomplete using Geoapify.

**Returns:** `Promise<AddressResult[]>`

---

## Firebase Collections

### Users Collection
```
users/{userId}
├── email: string
├── firstName: string
├── lastName: string
├── middleInitial: string
├── contactNumber: string
├── address: string
├── barangay: string
├── municipality: string
├── province: string
├── communityRole: string
├── status: 'pending' | 'approved' | 'rejected'
├── idType: string
├── validIdUrl: string
├── selfieUrl: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Symptom Reports Collection
```
symptomReports/{reportId}
├── userId: string
├── reportType: 'self' | 'observation'
├── symptoms: string[]
├── location: {
│   ├── latitude: number
│   ├── longitude: number
│   └── address: string
│   }
├── proofImageUrl?: string
├── additionalNotes?: string
├── verificationStatus: 'pending' | 'verified' | 'rejected'
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Announcements Collection
```
announcements/{announcementId}
├── title: string
├── message: string
├── priority: 'low' | 'medium' | 'high' | 'critical'
├── barangay?: string
├── municipality?: string
├── province?: string
├── createdBy: string (BHW userId)
├── createdAt: timestamp
└── expiresAt?: timestamp
```

### QR Codes Collection
```
userQRCodes/{qrId}
├── userId: string
├── qrId: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

## Error Handling

All service functions throw errors that should be caught:

```typescript
try {
  await submitSymptomReport(data);
} catch (error) {
  console.error('Report submission failed:', error);
  // Handle error appropriately
}
```

## Rate Limiting

- **Symptom Reports:** Max 10 per hour per user
- **QR Code Generation:** Max 5 per day per user
- **Image Uploads:** Max 20 per day per user
