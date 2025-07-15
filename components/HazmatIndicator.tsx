import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { HazmatInfo } from '@/types';
import { AlertTriangle, Shield } from 'lucide-react-native';

interface HazmatIndicatorProps {
  hazmatInfo?: HazmatInfo;
  onPress?: () => void;
  compact?: boolean;
}

export const HazmatIndicator: React.FC<HazmatIndicatorProps> = ({
  hazmatInfo,
  onPress,
  compact = false,
}) => {
  if (!hazmatInfo?.isHazmat) {
    return null;
  }

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
        <AlertTriangle size={16} color={colors.warning} />
        <Text style={styles.compactText}>HAZMAT</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.title}>HAZMAT LOAD</Text>
        </View>
        <View style={styles.classContainer}>
          <Text style={styles.classText}>Class {hazmatInfo.hazardClass}</Text>
        </View>
      </View>

      {hazmatInfo.unNumber && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>UN Number:</Text>
          <Text style={styles.detailValue}>{hazmatInfo.unNumber}</Text>
        </View>
      )}

      {hazmatInfo.properShippingName && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Material:</Text>
          <Text style={styles.detailValue}>{hazmatInfo.properShippingName}</Text>
        </View>
      )}

      {hazmatInfo.packingGroup && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Packing Group:</Text>
          <Text style={styles.detailValue}>{hazmatInfo.packingGroup}</Text>
        </View>
      )}

      <View style={styles.placardsContainer}>
        <Text style={styles.placardsTitle}>Required Placards:</Text>
        <View style={styles.placardsList}>
          {hazmatInfo.placards.map((placard, index) => (
            <View key={placard.id} style={styles.placardChip}>
              <Shield size={12} color={colors.primary} />
              <Text style={styles.placardChipText}>{placard.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {hazmatInfo.emergencyContact && (
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyLabel}>Emergency Contact:</Text>
          <Text style={styles.emergencyContact}>{hazmatInfo.emergencyContact}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap for placard guide</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: colors.warning + '30',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  compactText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.warning,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.warning,
  },
  classContainer: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  classText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    minWidth: 100,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  placardsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  placardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  placardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  placardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  placardChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  emergencyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.error + '10',\n    borderRadius: 8,\n    borderWidth: 1,\n    borderColor: colors.error + '30',\n  },\n  emergencyLabel: {\n    fontSize: 12,\n    color: colors.error,\n    fontWeight: '600',\n    marginBottom: 4,\n  },\n  emergencyContact: {\n    fontSize: 16,\n    color: colors.error,\n    fontWeight: '700',\n  },\n  footer: {\n    marginTop: 12,\n    alignItems: 'center',\n  },\n  footerText: {\n    fontSize: 12,\n    color: colors.textSecondary,\n    fontStyle: 'italic',\n  },\n});