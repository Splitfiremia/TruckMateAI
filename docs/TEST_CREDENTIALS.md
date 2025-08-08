# Fleet Management Test Credentials

This document contains test login credentials for the Fleet Management application. These credentials are for development and testing purposes only.

## Driver Portal Credentials

The driver portal is accessible at `/driver-login` and requires driver role credentials.

### Available Driver Accounts

| Name | Email | Password | Vehicle Assigned | Description |
|------|-------|----------|------------------|-------------|
| John Smith | `john.driver@fleet.com` | `driver123` | Freightliner Cascadia 2022 | Long-haul driver with 5+ years experience |
| Sarah Johnson | `sarah.driver@fleet.com` | `driver123` | Ford Transit 2023 | Local delivery driver, excellent safety record |
| Mike Rodriguez | `mike.driver@fleet.com` | `driver123` | Volvo VNL 2021 | Regional driver specializing in refrigerated transport |
| Lisa Chen | `lisa.driver@fleet.com` | `driver123` | Peterbilt 579 2020 | New driver in training program |

### Quick Test Login
For quick testing, use:
- **Email:** `john.driver@fleet.com`
- **Password:** `driver123`

## Dispatcher Credentials

These credentials are for future dispatcher portal implementation:

| Name | Email | Password | Description |
|------|-------|----------|-------------|
| Robert Wilson | `dispatch@fleet.com` | `dispatch123` | Senior dispatcher managing 20+ drivers |
| Amanda Davis | `dispatch2@fleet.com` | `dispatch123` | Night shift dispatcher |

## Fleet Manager Credentials

These credentials are for future fleet manager portal implementation:

| Name | Email | Password | Description |
|------|-------|----------|-------------|
| David Thompson | `manager@fleet.com` | `manager123` | Fleet operations manager |
| Jennifer Martinez | `admin@fleet.com` | `admin123` | Fleet administrator with full access |

## Features Available After Login

When you log in with driver credentials, you'll have access to:

### Dashboard Features
- Personalized greeting with driver name
- Active trip information (if any)
- Quick action buttons (Start Trip, Report Issue, Check Messages)
- Vehicle status display (fuel level, maintenance alerts)
- Today's summary (trips completed, hours worked, idle time, distance traveled)

### Sample Data Generated
- **Vehicle Information:** Dynamically generated based on assigned vehicle
- **Messages:** Sample messages from dispatcher and fleet manager
- **Maintenance Alerts:** Random maintenance notifications
- **Daily Stats:** Randomized realistic daily statistics

### Authentication Security
- Only driver role accounts can access the driver portal
- Non-driver accounts will receive "Access denied" error
- Invalid credentials will show "Invalid credentials" error

## Implementation Details

The test credentials are stored in `constants/testCredentials.ts` and validated through the `validateTestCredentials` function. The driver store (`store/driverStore.ts`) handles authentication and generates realistic mock data for each logged-in driver.

## Usage in Development

```typescript
import { QUICK_LOGIN } from '@/constants/testCredentials';

// Quick access to test credentials
const driverCreds = QUICK_LOGIN.DRIVER;
// { email: 'john.driver@fleet.com', password: 'driver123' }
```

## Security Note

These credentials are for development and testing only. In production, implement proper authentication with secure password hashing and real user management.