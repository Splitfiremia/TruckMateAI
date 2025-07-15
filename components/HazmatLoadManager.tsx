import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Load, HazmatInfo } from '@/types';
import { useLoadStore } from '@/store/loadStore';
import { HazmatIndicator } from './HazmatIndicator';
import { HazmatPlacardGuide } from './HazmatPlacardGuide';
import { AlertTriangle, Plus, CheckCircle, Clock, Shield } from 'lucide-react-native';

interface HazmatLoadManagerProps {
  visible: boolean;
  onClose: () => void;
}

export const HazmatLoadManager: React.FC<HazmatLoadManagerProps> = ({
  visible,
  onClose,
}) => {
  const { loads, updateLoad } = useLoadStore();
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showPlacardGuide, setShowPlacardGuide] = useState(false);

  const hazmatLoads = loads.filter(load => load.hazmat?.isHazmat);
  const regularLoads = loads.filter(load => !load.hazmat?.isHazmat);

  const handleUpdateHazmat = (loadId: string, hazmatInfo: HazmatInfo) => {
    updateLoad(loadId, { hazmat: hazmatInfo });
  };

  const handleConvertToHazmat = (load: Load) => {
    const hazmatInfo: HazmatInfo = {
      isHazmat: true,
      hazardClass: '3',
      placards: [],
      specialInstructions: [],
    };
    
    updateLoad(load.id, { hazmat: hazmatInfo });
    setSelectedLoad({ ...load, hazmat: hazmatInfo });
    setShowPlacardGuide(true);
  };

  const handleRemoveHazmat = (loadId: string) => {
    Alert.alert(
      'Remove Hazmat Classification',
      'Are you sure you want to remove the hazmat classification from this load?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            updateLoad(loadId, { hazmat: undefined });
          },
        },
      ]
    );
  };

  const getComplianceStatus = (hazmatInfo: HazmatInfo) => {
    if (!hazmatInfo.unNumber || !hazmatInfo.properShippingName) {
      return { status: 'incomplete', color: colors.error, text: 'Incomplete' };
    }
    if (hazmatInfo.placards.length === 0) {
      return { status: 'missing-placards', color: colors.warning, text: 'Missing Placards' };
    }
    return { status: 'compliant', color: colors.secondary, text: 'Compliant' };
  };

  const renderHazmatLoadCard = (load: Load) => {
    if (!load.hazmat) return null;
    
    const compliance = getComplianceStatus(load.hazmat);
    
    return (
      <View key={load.id} style={styles.hazmatLoadCard}>
        <View style={styles.loadHeader}>
          <View style={styles.loadInfo}>
            <Text style={styles.loadId}>{load.id}</Text>
            <Text style={styles.loadRoute}>
              {load.pickup.location} → {load.delivery.location}
            </Text>
          </View>
          <View style={[styles.complianceStatus, { backgroundColor: compliance.color + '20' }]}>
            <Text style={[styles.complianceText, { color: compliance.color }]}>
              {compliance.text}
            </Text>
          </View>
        </View>

        <HazmatIndicator 
          hazmatInfo={load.hazmat} 
          onPress={() => {
            setSelectedLoad(load);
            setShowPlacardGuide(true);
          }}
        />

        <View style={styles.loadActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSelectedLoad(load);
              setShowPlacardGuide(true);
            }}
          >
            <Shield size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Manage Placards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => handleRemoveHazmat(load.id)}
          >
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Remove Hazmat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRegularLoadCard = (load: Load) => (
    <View key={load.id} style={styles.regularLoadCard}>
      <View style={styles.loadHeader}>
        <View style={styles.loadInfo}>
          <Text style={styles.loadId}>{load.id}</Text>
          <Text style={styles.loadRoute}>
            {load.pickup.location} → {load.delivery.location}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.convertButton}
          onPress={() => handleConvertToHazmat(load)}
        >
          <Plus size={16} color={colors.primary} />
          <Text style={styles.convertButtonText}>Add Hazmat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hazmat Load Manager</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {hazmatLoads.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <AlertTriangle size={20} color={colors.warning} />
                  <Text style={styles.sectionTitle}>Hazmat Loads ({hazmatLoads.length})</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Loads requiring special handling and placards
                </Text>
              </View>

              {hazmatLoads.map(renderHazmatLoadCard)}
            </>
          )}

          {regularLoads.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Regular Loads ({regularLoads.length})</Text>
                <Text style={styles.sectionSubtitle}>
                  Convert to hazmat if carrying dangerous goods
                </Text>
              </View>

              {regularLoads.map(renderRegularLoadCard)}
            </>
          )}

          {loads.length === 0 && (
            <View style={styles.emptyState}>
              <AlertTriangle size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No Loads Available</Text>
              <Text style={styles.emptyStateDescription}>
                Loads will appear here when they are assigned
              </Text>
            </View>
          )}
        </ScrollView>

        {selectedLoad && (
          <HazmatPlacardGuide
            visible={showPlacardGuide}
            onClose={() => {
              setShowPlacardGuide(false);
              setSelectedLoad(null);
            }}
            hazmatInfo={selectedLoad.hazmat}
            onUpdateHazmat={(hazmatInfo) => handleUpdateHazmat(selectedLoad.id, hazmatInfo)}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  hazmatLoadCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.warning + '30',
  },
  regularLoadCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadInfo: {
    flex: 1,
  },
  loadId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  loadRoute: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  complianceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  complianceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    gap: 6,
  },
  dangerButton: {
    backgroundColor: colors.error + '20',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    gap: 4,
  },
  convertButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },
});