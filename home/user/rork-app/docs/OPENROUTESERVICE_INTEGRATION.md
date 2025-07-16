# Openrouteservice API Integration

## Overview

This document outlines the integration of the Openrouteservice API into our fleet management application for route optimization and geo-services. Openrouteservice is an open-source routing service based on OpenStreetMap data, providing various geo-services including routing, geocoding, and points of interest (POI) search.

## API Details

- **Base URL**: `https://api.openrouteservice.org`
- **API Key**: Required for all requests, currently set as a constant in the service file (should be moved to environment variables in production)
- **Documentation**: [Openrouteservice API Documentation](https://openrouteservice.org/dev/#/api-docs)

## Implemented Features

1. **Geocoding**: Converting addresses to coordinates
2. **Reverse Geocoding**: Converting coordinates to readable addresses
3. **Route Optimization**: Calculating optimized routes for multiple waypoints with truck-specific parameters
4. **Fuel Stops Search**: Finding fuel stations near a route using POI search
5. **Distance Calculation**: Haversine formula for direct distance between points

## Limitations

- **Traffic Information**: Real-time traffic data is not supported by Openrouteservice. The API returns an empty array for traffic requests.
- **Weather Alerts**: Not supported by Openrouteservice. Additional integration with a weather API would be needed.
- **Detailed Truck Restrictions**: While truck restrictions are considered in route calculation, they are not provided as separate data points.
- **Fuel Pricing**: Fuel price information is not available through Openrouteservice.

## Service Class

The `OpenRouteService` class in `services/openRouteService.ts` handles all interactions with the API:

- Constructor accepts an API key (defaults to a placeholder constant)
- Methods for geocoding, reverse geocoding, route optimization, and POI search
- Fallback mechanisms for unsupported features

## Usage in Application

The service is integrated into the route optimization feature:

- `app/(tabs)/route-optimization.tsx` uses the service for route planning
- `components/RouteOptimizationMap.tsx` displays the route and waypoints
- Other components like `FuelStopsCard.tsx` use the POI search for fuel stops

## Setup Instructions

1. **API Key**: Sign up at [openrouteservice.org](https://openrouteservice.org) to get an API key
2. **Replace Placeholder**: In `services/openRouteService.ts`, replace `YOUR_OPENROUTESERVICE_API_KEY` with your actual key or use environment variables
3. **Testing**: The integration includes fallbacks for web compatibility, but full testing on mobile devices is recommended

## Dependencies

- `axios`: Used for HTTP requests to the Openrouteservice API

## Future Enhancements

- Integrate additional APIs for traffic and weather data
- Implement caching for geocoding results to improve performance
- Add support for more advanced routing options as they become available in Openrouteservice

## Troubleshooting

- **Rate Limits**: Openrouteservice has rate limits on free plans. Check your quota if requests fail.
- **Unsupported Features**: For traffic or weather data, consider integrating dedicated APIs.
- **Error Logs**: The service logs errors to console for debugging.

For any issues with this integration, contact the development team or refer to the official Openrouteservice documentation.
