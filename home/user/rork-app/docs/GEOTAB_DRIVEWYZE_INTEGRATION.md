# Geotab Drivewyze Integration

## Overview

This document outlines the integration of the Geotab API with Drivewyze functionality within our React Native application built with Expo. The integration enables weigh station bypass and safety alerts using GPS data from the Geotab Drive application.

## Features

- **Authentication**: Connect to Geotab using user credentials to access device and alert data.
- **Device Management**: Retrieve and display a list of devices (trucks) associated with the Geotab account, including their last known location.
- **Safety Alerts**: Fetch and show safety alerts related to driving behavior or upcoming weigh stations.
- **Weigh Station Bypass**: Request bypass for weigh stations based on current location and device data, with status updates.

## Technical Implementation

### Service Layer

- **GeotabService** (`services/geotabService.ts`): A dedicated service class that handles all API interactions with Geotab. It includes methods for connecting to Geotab, fetching devices and alerts, and requesting weigh station bypasses. Currently, it uses mock data for development purposes.

### State Management

- **IntegrationStore** (`store/integrationStore.ts`): Zustand store updated to manage Geotab-specific state including devices, alerts, and bypass responses. It provides actions to fetch data and request bypasses, integrated with the GeotabService.

### UI Components

- **GeotabIntegration** (`components/GeotabIntegration.tsx`): A component that displays Geotab data when the integration is connected. It shows a list of devices with the ability to request weigh station bypasses and a list of alerts with severity indicators.
- **IntegrationsScreen** (`app/(tabs)/integrations.tsx`): Updated to include a dedicated tab for Geotab integration, visible when the Geotab integration is available. It provides a UI to connect to Geotab if not already connected.

### Types

- **Geotab Types** (`types/index.ts`): TypeScript interfaces for Geotab credentials, devices, alerts, and bypass responses to ensure type safety across the application.

## User Flow

1. **Connection**: Users navigate to the Integrations tab, select Geotab Drivewyze, and provide their credentials to connect.
2. **Data Display**: Once connected, users can view their devices and any active alerts in the Geotab tab.
3. **Bypass Request**: For each device, users can request a weigh station bypass, receiving immediate feedback on the request status.
4. **Alerts Monitoring**: Safety and weigh station alerts are displayed with details like location and severity, helping users stay informed.

## Design Considerations

- **UX**: The design follows a clean, iOS-inspired aesthetic with pastel primary and secondary colors (as defined in `constants/colors.ts`). The Geotab tab is only shown if the integration exists, ensuring a clutter-free interface.
- **Performance**: Data fetching is handled with loading states and error handling to provide feedback to users during API calls.
- **Web Compatibility**: The integration avoids native-only modules, ensuring it doesn't crash on web platforms, though full functionality might be limited.

## Development Notes

- **Mock Data**: Currently, the GeotabService uses mock data for development and testing. In a production environment, real API endpoints and authentication tokens would need to be implemented.
- **API Keys**: For production, ensure that API keys and credentials are securely stored and not hardcoded into the application.
- **Error Handling**: Comprehensive error handling is implemented to manage connection issues or API failures gracefully.

## Future Enhancements

- **Real-time Updates**: Implement WebSocket or polling for real-time updates on alerts and bypass status.
- **Map Integration**: Show device locations and weigh station alerts on a map view for better visualization.
- **Automation Triggers**: Add more automation templates for Geotab events, such as automatic notifications for bypass approvals.

This integration provides a robust foundation for leveraging Geotab's GPS capabilities with Drivewyze services, enhancing driver efficiency and safety compliance.
