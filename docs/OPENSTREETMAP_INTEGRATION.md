# OpenStreetMap Integration

This document explains how the app has been migrated from Google Maps API to OpenStreetMap (OSM) free services.

## Overview

The route optimization functionality now uses free OpenStreetMap services instead of Google Maps API, eliminating the need for API keys and associated costs.

## Services Used

### 1. Nominatim API (Geocoding)
- **Purpose**: Convert addresses to coordinates and vice versa
- **Base URL**: `https://nominatim.openstreetmap.org`
- **Rate Limit**: 1 request per second (implemented in code)
- **Cost**: Free
- **Documentation**: https://nominatim.org/release-docs/develop/api/Overview/

### 2. Overpass API (POI Data)
- **Purpose**: Query Points of Interest like fuel stations, truck stops
- **Base URL**: `https://overpass-api.de/api/interpreter`
- **Rate Limit**: Reasonable use policy
- **Cost**: Free
- **Documentation**: https://wiki.openstreetmap.org/wiki/Overpass_API

## Implementation Details

### Files Modified/Created

1. **`services/openStreetMapService.ts`** - New service replacing Google Maps
2. **`store/routeOptimizationStore.ts`** - Updated to use OSM service
3. **`app/(tabs)/route-optimization.tsx`** - Updated UI to show OSM branding

### Key Features

#### Geocoding
```typescript
// Convert address to coordinates
const coords = await openStreetMapService.geocodeAddress("123 Main St, New York, NY");

// Convert coordinates to address
const address = await openStreetMapService.reverseGeocode(40.7128, -74.0060);
```

#### Route Optimization
```typescript
// Optimize waypoints using nearest neighbor algorithm
const optimizedRoute = await openStreetMapService.optimizeRoute(waypoints, preferences);
```

#### Rate Limiting
The service implements automatic rate limiting to respect API usage policies:
```typescript
private async respectRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - this.lastRequestTime;
  
  if (timeSinceLastRequest < API_DELAY) {
    await new Promise(resolve => setTimeout(resolve, API_DELAY - timeSinceLastRequest));
  }
  
  this.lastRequestTime = Date.now();
}
```

## Benefits

### Cost Savings
- **Google Maps**: Requires API key, charges per request
- **OpenStreetMap**: Completely free, no API keys required

### No API Key Management
- No need to manage API keys
- No risk of API key exposure
- No billing setup required

### Open Source
- Built on open-source mapping data
- Community-driven updates
- Transparent data sources

## Limitations

### Real-time Traffic
- OSM doesn't provide real-time traffic data
- Currently using mock data for demonstration
- For production, consider integrating with:
  - HERE Traffic API
  - TomTom Traffic API
  - Mapbox Traffic API

### Advanced Routing
- Current implementation uses simple nearest neighbor algorithm
- For production routing, consider:
  - OpenRouteService API (free tier available)
  - GraphHopper API (free tier available)
  - OSRM (Open Source Routing Machine)

### Map Tiles
- For visual maps, you'll need tile servers
- Free options:
  - OpenStreetMap tile servers (with usage policy)
  - MapTiler (free tier)
  - Mapbox (free tier)

## Production Considerations

### Enhanced Routing
For production use, integrate with more advanced routing services:

```typescript
// Example: OpenRouteService integration
const ORS_API_KEY = 'your-free-api-key';
const ORS_BASE_URL = 'https://api.openrouteservice.org';

async function getOptimizedRoute(waypoints: RouteWaypoint[]) {
  const response = await fetch(`${ORS_BASE_URL}/v2/directions/driving-hgv`, {
    method: 'POST',
    headers: {
      'Authorization': ORS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: waypoints.map(wp => [wp.longitude, wp.latitude]),
      options: {
        vehicle_type: 'hgv', // Heavy Goods Vehicle
      }
    })
  });
  
  return response.json();
}
```

### Caching
Implement caching to reduce API calls:
```typescript
// Cache geocoding results
const geocodeCache = new Map<string, {latitude: number, longitude: number}>();

async function cachedGeocode(address: string) {
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address);
  }
  
  const result = await openStreetMapService.geocodeAddress(address);
  if (result) {
    geocodeCache.set(address, result);
  }
  
  return result;
}
```

### Error Handling
Implement robust error handling and fallbacks:
```typescript
async function geocodeWithFallback(address: string) {
  try {
    return await openStreetMapService.geocodeAddress(address);
  } catch (error) {
    console.warn('Primary geocoding failed, trying fallback');
    // Try alternative service or return approximate coordinates
    return getApproximateCoordinates(address);
  }
}
```

## Usage Guidelines

### Nominatim Usage Policy
- Maximum 1 request per second
- Include User-Agent header with contact information
- Don't use for bulk geocoding (use dedicated services)
- Cache results when possible

### Overpass API Usage
- Be reasonable with query complexity
- Cache POI data when possible
- Consider using local Overpass instance for heavy usage

## Migration Checklist

- [x] Replace Google Maps service with OpenStreetMap service
- [x] Update route optimization store
- [x] Update UI to show OSM branding
- [x] Implement rate limiting
- [x] Add error handling and fallbacks
- [ ] Add caching layer (recommended for production)
- [ ] Integrate advanced routing service (recommended for production)
- [ ] Add real-time traffic data source (optional)

## Testing

The current implementation includes:
- Mock data for demonstration
- Fallback coordinates for failed geocoding
- Rate limiting simulation
- Error handling

Test the integration by:
1. Adding waypoints in the route optimization screen
2. Optimizing routes to see OSM service in action
3. Checking console logs for API calls and rate limiting

## Support

For issues with OpenStreetMap services:
- Nominatim: https://help.openstreetmap.org/
- Overpass API: https://wiki.openstreetmap.org/wiki/Overpass_API
- General OSM: https://www.openstreetmap.org/help