# Fleet Management Test Credentials

This document contains test credentials for the Fleet Management System. These credentials are for development and testing purposes only.

## Driver Accounts

Use these credentials to access the Driver Portal at `/driver-login`:

### Primary Driver Account
- **Email:** `john.driver@fleet.com`
- **Password:** `driver123`
- **Name:** John Smith
- **Description:** Long-haul driver with 5+ years experience
- **Vehicle:** Freightliner Cascadia 2022

### Additional Driver Accounts
- **Email:** `sarah.driver@fleet.com` | **Password:** `driver123` | **Name:** Sarah Johnson
- **Email:** `mike.driver@fleet.com` | **Password:** `driver123` | **Name:** Mike Rodriguez  
- **Email:** `lisa.driver@fleet.com` | **Password:** `driver123` | **Name:** Lisa Chen

## Dispatcher Accounts

For fleet management and dispatch operations:

- **Email:** `dispatch@fleet.com` | **Password:** `dispatch123` | **Name:** Robert Wilson
- **Email:** `dispatch2@fleet.com` | **Password:** `dispatch123` | **Name:** Amanda Davis

## Fleet Manager Accounts

For administrative and management functions:

- **Email:** `manager@fleet.com` | **Password:** `manager123` | **Name:** David Thompson
- **Email:** `admin@fleet.com` | **Password:** `admin123` | **Name:** Jennifer Martinez

## Social Login (Development Mode)

### Google Sign-In
- Available on all platforms
- Creates mock accounts automatically
- No real Google authentication required
- Returns demo user data

### Apple Sign-In
- Available on iOS devices (real Apple Sign-In)
- Mock implementation on other platforms
- Creates demo accounts automatically
- No real Apple ID required for testing

## Access Points

### Driver Portal
- **URL:** `/driver-login`
- **Features:** Trip management, vehicle status, messages, proof of delivery
- **Test with:** Any driver account above

### Fleet Management
- **URL:** Main app flow (sign-in → onboarding → dashboard)
- **Features:** Fleet overview, driver management, compliance, analytics
- **Test with:** Manager or dispatcher accounts

### Owner/Operator Portal
- **URL:** Main app flow
- **Features:** Individual trucking business management
- **Test with:** Create account through main sign-in flow

## Development Notes

1. **Password Security:** All test passwords are intentionally simple for development
2. **Data Persistence:** Test data is stored locally and will reset on app reinstall
3. **Mock Services:** Social login and external integrations use mock implementations
4. **Fleet ID:** All test accounts belong to `fleet-001`
5. **Vehicle Assignment:** Each driver has a pre-assigned vehicle with mock data

## Quick Testing Commands

```javascript
// Import in your test files
import { QUICK_LOGIN, FLEET_TEST_SUMMARY } from '@/constants/testCredentials';

// Quick access to primary accounts
const driverLogin = QUICK_LOGIN.DRIVER;
const dispatcherLogin = QUICK_LOGIN.DISPATCHER;
const managerLogin = QUICK_LOGIN.FLEET_MANAGER;
```

## Troubleshooting

### Login Issues
1. Ensure you're using the correct portal (driver vs main app)
2. Check that credentials are typed exactly as shown
3. Try clearing app storage if authentication persists

### Social Login Issues
1. Development mode is enabled by default
2. Real OAuth setup not required for testing
3. Mock accounts are created automatically

### Navigation Issues
1. Driver accounts should redirect to `/driver-dashboard`
2. Manager accounts go through onboarding flow
3. Check console logs for routing errors

---

**Last Updated:** January 2024  
**Environment:** Development/Testing Only