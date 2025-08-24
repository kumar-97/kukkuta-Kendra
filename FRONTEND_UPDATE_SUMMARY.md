# Frontend Update Summary - Azure Backend Integration

## Overview
Updated the Kukkuta Kendra frontend to connect to the deployed Azure backend instead of the local development server.

## Changes Made

### 1. Created Centralized API Configuration
**File**: `app/config/api.ts`
- Created a centralized configuration file to manage all API endpoints
- Updated base URL to Azure backend: `https://kukkuta-kendra-app-fgbaerahbufsage5.centralus-01.azurewebsites.net`
- Provides easy switching between development and production environments

### 2. Updated Authentication Service
**File**: `app/services/authService.ts`
- Updated API URL from local IP to Azure backend
- Fixed import to use centralized configuration
- Maintains all existing functionality (register, login, logout)

### 3. Updated Farmer Service
**File**: `app/services/farmerService.ts`
- Updated API URL from local IP to Azure backend
- Fixed token key name from 'token' to 'access_token' for consistency
- Updated import to use centralized configuration

### 4. Updated Routine Service
**File**: `app/services/routineService.ts`
- Updated API URL from local IP to Azure backend
- Updated all endpoints to use centralized configuration
- Maintains all existing functionality (submit, get, update, delete routine data)

### 5. Created Backend Status Component
**File**: `app/components/BackendStatus.tsx`
- Created a test component to verify Azure backend connectivity
- Displays connection status with visual indicators
- Shows backend response for debugging purposes
- Temporarily added to WelcomeScreen for testing

## API Endpoints Updated

### Authentication
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`

### Farmers
- Get Profile: `GET /api/v1/farmers/me`
- Update Profile: `PUT /api/v1/farmers/me`

### Routine Data
- Submit: `POST /api/v1/routine/`
- Get All: `GET /api/v1/routine/`
- Get By ID: `GET /api/v1/routine/{id}`
- Update: `PUT /api/v1/routine/{id}`
- Delete: `DELETE /api/v1/routine/{id}`
- Mortality: `POST /api/v1/routine/mortality`
- Upload Photo: `POST /api/v1/routine/upload-photo`

## Testing

### Backend Connection Test
The BackendStatus component will:
1. Automatically test connection on component mount
2. Display connection status (Connected/Error/Checking)
3. Show the actual response from the health endpoint
4. Allow manual retesting with a button

### Manual Testing Steps
1. Start the frontend: `npx expo start`
2. Open the app and check the WelcomeScreen for backend status
3. Test registration with a new user
4. Test login with existing credentials
5. Test farmer dashboard functionality

## Configuration

### Production Backend URL
```
https://kukkuta-kendra-app-fgbaerahbufsage5.centralus-01.azurewebsites.net
```

### Development Backend URL (Commented)
```
http://192.168.1.19:8000
```

## Next Steps

1. **Remove BackendStatus Component**: After confirming everything works, remove the test component from WelcomeScreen
2. **Test All Features**: Verify registration, login, farmer dashboard, routine data submission
3. **Error Handling**: Test error scenarios and ensure proper user feedback
4. **Performance**: Monitor API response times and optimize if needed

## Rollback Instructions

If needed, you can quickly rollback to local development by:
1. Uncomment the DEV_API_CONFIG in `app/config/api.ts`
2. Change the import in services to use DEV_API_CONFIG instead of API_CONFIG
3. Update the BASE_URL to your local development server

## Notes

- All existing functionality is preserved
- Token management remains the same
- Error handling patterns are maintained
- The app will now work with the production Azure backend
- Users can access the app from anywhere, not just local network 