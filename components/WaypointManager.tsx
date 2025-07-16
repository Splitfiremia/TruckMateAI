import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {
  Plus,
  MapPin,
  Trash2,
  Edit3,
  Clock,
  Package,
  Fuel,
  Coffee,
  Scale,
  X,
  Check,
  GripVertical,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useRouteOptimizationStore } from '@/store/routeOptimizationStore';
import { RouteWaypoint } from '@/types';

interface WaypointManagerProps {
  visible: boolean;
  onClose: () => void;
}

const WaypointManager: React.FC<WaypointManagerProps> = ({ visible, onClose }) => {
  const [editingWaypoint, setEditingWaypoint] = useState<RouteWaypoint | null>(null);
  const [newWaypointForm, setNewWaypointForm] = useState({
    address: '',
    type: 'pickup' as RouteWaypoint['type'],
    notes: '',
    timeWindowStart: '',
    timeWindowEnd: '',
    serviceTime: '30',
  });

  const {
    waypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    reorderWaypoints,
  } = useRouteOptimizationStore();

  const waypointTypes = [
    { value: 'pickup', label: 'Pickup', icon: Package, color: colors.primary },
    { value: 'delivery', label: 'Delivery', icon: MapPin, color: colors.success },
    { value: 'fuel', label: 'Fuel Stop', icon: Fuel, color: colors.warning },
    { value: 'rest', label: 'Rest Area', icon: Coffee, color: colors.secondary },
    { value: 'weigh_station', label: 'Weigh Station', icon: Scale, color: colors.danger },
  ];

  const handleAddWaypoint = async () => {
    if (!newWaypointForm.address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    // In a real app, you would geocode the address to get coordinates
    // For this demo, we'll use mock coordinates
    const mockCoordinates = {
      latitude: 40.7128 + (Math.random() - 0.5) * 10,
      longitude: -74.0060 + (Math.random() - 0.5) * 10,
    };

    const waypoint: RouteWaypoint = {
      id: `waypoint_${Date.now()}`,
      address: newWaypointForm.address,
      latitude: mockCoordinates.latitude,
      longitude: mockCoordinates.longitude,
      type: newWaypointForm.type,
      notes: newWaypointForm.notes,
      serviceTime: parseInt(newWaypointForm.serviceTime) || 30,
      timeWindow: newWaypointForm.timeWindowStart && newWaypointForm.timeWindowEnd ? {
        start: newWaypointForm.timeWindowStart,
        end: newWaypointForm.timeWindowEnd,
      } : undefined,
    };

    addWaypoint(waypoint);
    
    // Reset form
    setNewWaypointForm({
      address: '',
      type: 'pickup',
      notes: '',
      timeWindowStart: '',
      timeWindowEnd: '',
      serviceTime: '30',
    });
  };

  const handleEditWaypoint = (waypoint: RouteWaypoint) => {
    setEditingWaypoint(waypoint);
  };

  const handleUpdateWaypoint = () => {
    if (!editingWaypoint) return;

    updateWaypoint(editingWaypoint.id, editingWaypoint);
    setEditingWaypoint(null);
  };

  const handleDeleteWaypoint = (waypointId: string) => {
    Alert.alert(
      'Delete Waypoint',
      'Are you sure you want to delete this waypoint?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeWaypoint(waypointId) },
      ]
    );
  };

  const getTypeInfo = (type: string) => {
    return waypointTypes.find(t => t.value === type) || waypointTypes[0];
  };

  const renderWaypointItem = (waypoint: RouteWaypoint, index: number) => {
    const typeInfo = getTypeInfo(waypoint.type);
    const IconComponent = typeInfo.icon;

    return (
      <View key={waypoint.id} style={styles.waypointItem}>
        <View style={styles.waypointHeader}>
          <View style={styles.waypointInfo}>
            <View style={[styles.waypointIcon, { backgroundColor: typeInfo.color }]}>
              <IconComponent size={16} color={colors.white} />
            </View>
            <View style={styles.waypointDetails}>
              <Text style={styles.waypointAddress} numberOfLines={1}>
                {waypoint.address}
              </Text>
              <Text style={styles.waypointType}>{typeInfo.label}</Text>
            </View>
          </View>
          
          <View style={styles.waypointActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditWaypoint(waypoint)}
            >
              <Edit3 size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteWaypoint(waypoint.id)}
            >
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dragHandle}>
              <GripVertical size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {waypoint.notes && (
          <Text style={styles.waypointNotes}>{waypoint.notes}</Text>
        )}

        {waypoint.timeWindow && (
          <View style={styles.timeWindow}>
            <Clock size={12} color={colors.text.secondary} />
            <Text style={styles.timeWindowText}>
              {waypoint.timeWindow.start} - {waypoint.timeWindow.end}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEditModal = () => {
    if (!editingWaypoint) return null;

    return (
      <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.editModal}>
          <View style={styles.editHeader}>
            <TouchableOpacity onPress={() => setEditingWaypoint(null)}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.editTitle}>Edit Waypoint</Text>
            <TouchableOpacity onPress={handleUpdateWaypoint}>
              <Check size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.formInput}
                value={editingWaypoint.address}
                onChangeText={(text) => setEditingWaypoint({ ...editingWaypoint, address: text })}
                placeholder="Enter address"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                {waypointTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = editingWaypoint.type === type.value;
                  
                  return (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        { backgroundColor: isSelected ? type.color : colors.background.secondary }
                      ]}
                      onPress={() => setEditingWaypoint({ ...editingWaypoint, type: type.value as any })}
                    >
                      <IconComponent size={16} color={isSelected ? colors.white : colors.text.primary} />
                      <Text style={[
                        styles.typeOptionText,
                        { color: isSelected ? colors.white : colors.text.primary }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={editingWaypoint.notes || ''}
                onChangeText={(text) => setEditingWaypoint({ ...editingWaypoint, notes: text })}
                placeholder="Add notes (optional)"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Start Time</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingWaypoint.timeWindow?.start || ''}
                  onChangeText={(text) => setEditingWaypoint({
                    ...editingWaypoint,
                    timeWindow: { ...editingWaypoint.timeWindow, start: text, end: editingWaypoint.timeWindow?.end || '' }
                  })}
                  placeholder="09:00"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>End Time</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingWaypoint.timeWindow?.end || ''}
                  onChangeText={(text) => setEditingWaypoint({
                    ...editingWaypoint,
                    timeWindow: { ...editingWaypoint.timeWindow, start: editingWaypoint.timeWindow?.start || '', end: text }
                  })}
                  placeholder="17:00"
                  placeholderTextColor={colors.text.secondary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Service Time (minutes)</Text>
              <TextInput
                style={styles.formInput}
                value={editingWaypoint.serviceTime?.toString() || '30'}
                onChangeText={(text) => setEditingWaypoint({ ...editingWaypoint, serviceTime: parseInt(text) || 30 })}
                placeholder="30"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Waypoints</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Add New Waypoint Form */}
          <View style={styles.addForm}>
            <Text style={styles.sectionTitle}>Add Waypoint</Text>
            
            <View style={styles.formGroup}>
              <TextInput
                style={styles.formInput}
                value={newWaypointForm.address}
                onChangeText={(text) => setNewWaypointForm({ ...newWaypointForm, address: text })}
                placeholder="Enter address"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
              {waypointTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = newWaypointForm.type === type.value;
                
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeOption,
                      { backgroundColor: isSelected ? type.color : colors.background.secondary }
                    ]}
                    onPress={() => setNewWaypointForm({ ...newWaypointForm, type: type.value as any })}
                  >
                    <IconComponent size={16} color={isSelected ? colors.white : colors.text.primary} />
                    <Text style={[
                      styles.typeOptionText,
                      { color: isSelected ? colors.white : colors.text.primary }
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={handleAddWaypoint}>
              <Plus size={20} color={colors.white} />
              <Text style={styles.addButtonText}>Add Waypoint</Text>
            </TouchableOpacity>
          </View>

          {/* Waypoints List */}
          <View style={styles.waypointsList}>
            <Text style={styles.sectionTitle}>
              Waypoints ({waypoints.length})
            </Text>
            
            {waypoints.length === 0 ? (
              <View style={styles.emptyState}>
                <MapPin size={48} color={colors.text.secondary} />
                <Text style={styles.emptyStateText}>No waypoints added yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Add waypoints to plan your route
                </Text>
              </View>
            ) : (
              waypoints.map((waypoint, index) => renderWaypointItem(waypoint, index))
            )}
          </View>
        </ScrollView>

        {renderEditModal()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  addForm: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  waypointsList: {
    flex: 1,
  },
  waypointItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  waypointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waypointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waypointIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waypointDetails: {
    flex: 1,
  },
  waypointAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  waypointType: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  waypointActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  dragHandle: {
    padding: 8,
  },
  waypointNotes: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  timeWindow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  timeWindowText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  editModal: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  editForm: {
    flex: 1,
    padding: 16,
  },
});

export default WaypointManager;