import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Receipt, DollarSign, MapPin, Calendar } from 'lucide-react-native';
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
        return <Receipt size={20} color={colors.primaryLight} />;
      case 'Toll':
        return <Receipt size={20} color={colors.warning} />;
      case 'Maintenance':
        return <Receipt size={20} color={colors.secondary} />;
      default:
        return <Receipt size={20} color={colors.textSecondary} />;
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
      activeOpacity={0.8}
    >
      {receipt.imageUrl && (
        <Image 
          source={{ uri: receipt.imageUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            {getCategoryIcon()}
            <Text style={styles.type}>{receipt.type}</Text>
          </View>
          <View style={styles.amountContainer}>
            <DollarSign size={16} color={colors.secondary} />
            <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.vendor}>{receipt.vendor}</Text>
        
        <View style={styles.footer}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 2,
  },
  vendor: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  fuelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 8,
    fontStyle: 'italic',
  },
});