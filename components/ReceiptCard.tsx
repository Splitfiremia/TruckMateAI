import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Receipt, DollarSign, MapPin, Calendar, Fuel, Truck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Receipt as ReceiptType } from '@/types';

interface ReceiptCardProps {
  receipt: ReceiptType;
  onPress?: () => void;
}

export default function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  const getCategoryIcon = () => {
    switch (receipt.type) {
      case 'Fuel':
        return <Fuel size={18} color={colors.primaryLight} />;
      case 'Toll':
        return <Receipt size={18} color={colors.warning} />;
      case 'Maintenance':
        return <Truck size={18} color={colors.secondary} />;
      default:
        return <Receipt size={18} color={colors.textSecondary} />;
    }
  };
  
  const getCategoryColor = () => {
    switch (receipt.type) {
      case 'Fuel':
        return colors.primaryLight;
      case 'Toll':
        return colors.warning;
      case 'Maintenance':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <View style={[styles.iconContainer, { backgroundColor: getCategoryColor() + '20' }]}>
              {getCategoryIcon()}
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.vendor}>{receipt.vendor}</Text>
              <Text style={styles.type}>{receipt.type}</Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{receipt.location}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{formatDate(receipt.date)}</Text>
            </View>
          </View>
          
          {receipt.type === 'Fuel' && receipt.gallons && (
            <View style={styles.fuelInfo}>
              <Text style={styles.fuelText}>
                {receipt.gallons.toFixed(1)} gal @ ${receipt.pricePerGallon?.toFixed(2)}/gal
              </Text>
              <Text style={styles.stateText}>{receipt.state}</Text>
            </View>
          )}
          
          {receipt.type === 'Maintenance' && receipt.service && (
            <Text style={styles.serviceText}>{receipt.service}</Text>
          )}
        </View>
        
        {receipt.imageUrl && (
          <Image 
            source={{ uri: receipt.imageUrl }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  vendor: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  type: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  detailsContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  fuelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fuelText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  stateText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  serviceText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: colors.background.primary,
  },
});