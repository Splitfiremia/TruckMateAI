import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Fuel,
  MapPin,
  Star,
  Clock,
  Utensils,
  Droplets,
  Car,
  Navigation,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { FuelStop } from '@/types';

interface FuelStopsCardProps {
  fuelStops: FuelStop[];
  onStopPress: (stop: FuelStop) => void;
  onNavigatePress: (stop: FuelStop) => void;
}

const FuelStopsCard: React.FC<FuelStopsCardProps> = ({
  fuelStops,
  onStopPress,
  onNavigatePress,
}) => {
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'restaurant':
      case 'food':
        return <Utensils size={12} color={colors.text.secondary} />;
      case 'showers':
        return <Droplets size={12} color={colors.text.secondary} />;
      case 'parking':
        return <Car size={12} color={colors.text.secondary} />;
      default:
        return null;
    }
  };

  const getPriceColor = (price: number) => {
    if (price < 3.50) return colors.success;
    if (price < 4.00) return colors.warning;
    return colors.danger;
  };

  const renderFuelStop = (stop: FuelStop) => (
    <TouchableOpacity
      key={stop.id}
      style={styles.stopCard}
      onPress={() => onStopPress(stop)}
    >
      <View style={styles.stopHeader}>
        <View style={styles.stopInfo}>
          <Text style={styles.stopName} numberOfLines={1}>
            {stop.name}
          </Text>
          <Text style={styles.stopBrand}>{stop.brand}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: getPriceColor(stop.currentPrice) }]}>
            ${stop.currentPrice.toFixed(2)}
          </Text>
          <Text style={styles.priceUnit}>/gal</Text>
        </View>
      </View>

      <View style={styles.stopDetails}>
        <View style={styles.locationRow}>
          <MapPin size={12} color={colors.text.secondary} />
          <Text style={styles.distance}>
            {stop.distance.toFixed(1)} mi • +{stop.detourTime}min
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <Star size={12} color={colors.warning} />
          <Text style={styles.rating}>
            {stop.rating.toFixed(1)} ({stop.reviewCount})
          </Text>
        </View>
      </View>

      {stop.amenities.length > 0 && (
        <View style={styles.amenitiesRow}>
          {stop.amenities.slice(0, 4).map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              {renderAmenityIcon(amenity)}
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.stopActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onNavigatePress(stop)}
        >
          <Navigation size={14} color={colors.primary} />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <Text style={styles.availability}>{stop.availability}</Text>
      </View>
    </TouchableOpacity>
  );

  if (fuelStops.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Fuel size={48} color={colors.text.secondary} />
        <Text style={styles.emptyText}>No fuel stops found</Text>
        <Text style={styles.emptySubtext}>
          Fuel stops will appear when you have an active route
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Fuel size={20} color={colors.primary} />
        <Text style={styles.title}>Nearby Fuel Stops</Text>
        <Text style={styles.count}>({fuelStops.length})</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {fuelStops.map(renderFuelStop)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  count: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scrollContent: {
    gap: 12,
  },
  stopCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    width: 280,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stopInfo: {
    flex: 1,
    marginRight: 12,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  stopBrand: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  stopDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  amenityText: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  stopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  availability: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FuelStopsCard;