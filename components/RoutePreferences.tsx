import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Modal,
} from 'react-native';
import {
  Settings,
  Clock,
  Fuel,
  DollarSign,
  Route,
  Truck,
  Shield,
  X,
  Check,
  Info,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useRouteOptimizationStore } from '@/store/routeOptimizationStore';
import { RouteOptimizationPreferences } from '@/types';

interface RoutePreferencesProps {
  visible: boolean;
  onClose: () => void;
}

const RoutePreferences: React.FC<RoutePreferencesProps> = ({ visible, onClose }) => {
  const { preferences, updatePreferences } = useRouteOptimizationStore();
  const [localPreferences, setLocalPreferences] = useState<RouteOptimizationPreferences>(preferences);

  const handleSave = () => {
    updatePreferences(localPreferences);
    onClose();
  };

  const handleReset = () => {
    const defaultPreferences: RouteOptimizationPreferences = {
      prioritizeTime: true,
      prioritizeFuel: false,
      avoidTolls: false,
      avoidHighways: false,
      preferTruckRoutes: true,
      maxDrivingHours: 11,
      requiredBreakDuration: 30,
      fuelTankCapacity: 200,
      mpg: 6.5,
      truckDimensions: {
        height: 13.6,
        width: 8.5,
        length: 53,
        weight: 80000,
      },
      hazmatEndorsement: false,
    };
    setLocalPreferences(defaultPreferences);
  };

  const updateLocalPreference = <K extends keyof RouteOptimizationPreferences>(
    key: K,
    value: RouteOptimizationPreferences[K]
  ) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateTruckDimension = (dimension: keyof RouteOptimizationPreferences['truckDimensions'], value: number) => {
    setLocalPreferences(prev => ({
      ...prev,
      truckDimensions: {
        ...prev.truckDimensions,
        [dimension]: value,
      },
    }));
  };

  const renderSwitchRow = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: React.ComponentType<any>
  ) => {
    const IconComponent = icon;
    
    return (
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <View style={styles.switchIcon}>
            <IconComponent size={20} color={colors.primary} />
          </View>
          <View style={styles.switchText}>
            <Text style={styles.switchTitle}>{title}</Text>
            <Text style={styles.switchSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.background.secondary, true: colors.primaryLight }}
          thumbColor={value ? colors.primary : colors.text.secondary}
        />
      </View>
    );
  };

  const renderInputRow = (
    title: string,
    subtitle: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'default' | 'numeric' = 'default',
    suffix?: string
  ) => {
    return (
      <View style={styles.inputRow}>
        <View style={styles.inputInfo}>
          <Text style={styles.inputTitle}>{title}</Text>
          <Text style={styles.inputSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder="0"
            placeholderTextColor={colors.text.secondary}
          />
          {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Route Preferences</Text>
          <TouchableOpacity onPress={handleSave}>
            <Check size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Optimization Priorities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optimization Priorities</Text>
            <Text style={styles.sectionSubtitle}>
              Choose what to prioritize when optimizing routes
            </Text>

            {renderSwitchRow(
              'Prioritize Time',
              'Optimize for fastest route',
              localPreferences.prioritizeTime,
              (value) => updateLocalPreference('prioritizeTime', value),
              Clock
            )}

            {renderSwitchRow(
              'Prioritize Fuel Efficiency',
              'Optimize for lowest fuel consumption',
              localPreferences.prioritizeFuel,
              (value) => updateLocalPreference('prioritizeFuel', value),
              Fuel
            )}
          </View>

          {/* Route Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Preferences</Text>

            {renderSwitchRow(
              'Avoid Tolls',
              'Find routes without toll roads',
              localPreferences.avoidTolls,
              (value) => updateLocalPreference('avoidTolls', value),
              DollarSign
            )}

            {renderSwitchRow(
              'Avoid Highways',
              'Prefer local roads over highways',
              localPreferences.avoidHighways,
              (value) => updateLocalPreference('avoidHighways', value),
              Route
            )}

            {renderSwitchRow(
              'Prefer Truck Routes',
              'Use designated truck routes when available',
              localPreferences.preferTruckRoutes,
              (value) => updateLocalPreference('preferTruckRoutes', value),
              Truck
            )}

            {renderSwitchRow(
              'HazMat Endorsement',
              'I have hazardous materials endorsement',
              localPreferences.hazmatEndorsement,
              (value) => updateLocalPreference('hazmatEndorsement', value),
              Shield
            )}
          </View>

          {/* Driving Limits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driving Limits</Text>
            <Text style={styles.sectionSubtitle}>
              Set your HOS and break requirements
            </Text>

            {renderInputRow(
              'Max Driving Hours',
              'Maximum hours you can drive per day',
              localPreferences.maxDrivingHours.toString(),
              (text) => updateLocalPreference('maxDrivingHours', parseFloat(text) || 11),
              'numeric',
              'hours'
            )}

            {renderInputRow(
              'Required Break Duration',
              'Minimum break time required',
              localPreferences.requiredBreakDuration.toString(),
              (text) => updateLocalPreference('requiredBreakDuration', parseFloat(text) || 30),
              'numeric',
              'minutes'
            )}
          </View>

          {/* Vehicle Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
            <Text style={styles.sectionSubtitle}>
              Enter your truck's specifications for accurate routing
            </Text>

            {renderInputRow(
              'Fuel Tank Capacity',
              'Total fuel tank capacity',
              localPreferences.fuelTankCapacity.toString(),
              (text) => updateLocalPreference('fuelTankCapacity', parseFloat(text) || 200),
              'numeric',
              'gallons'
            )}

            {renderInputRow(
              'Miles Per Gallon',
              'Average fuel efficiency',
              localPreferences.mpg.toString(),
              (text) => updateLocalPreference('mpg', parseFloat(text) || 6.5),
              'numeric',
              'mpg'
            )}
          </View>

          {/* Truck Dimensions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Truck Dimensions</Text>
            <Text style={styles.sectionSubtitle}>
              Used to avoid routes with restrictions
            </Text>

            {renderInputRow(
              'Height',
              'Maximum height including load',
              localPreferences.truckDimensions.height.toString(),
              (text) => updateTruckDimension('height', parseFloat(text) || 13.6),
              'numeric',
              'feet'
            )}

            {renderInputRow(
              'Width',
              'Maximum width including mirrors',
              localPreferences.truckDimensions.width.toString(),
              (text) => updateTruckDimension('width', parseFloat(text) || 8.5),
              'numeric',
              'feet'
            )}

            {renderInputRow(
              'Length',
              'Total length of truck and trailer',
              localPreferences.truckDimensions.length.toString(),
              (text) => updateTruckDimension('length', parseFloat(text) || 53),
              'numeric',
              'feet'
            )}

            {renderInputRow(
              'Weight',
              'Maximum gross vehicle weight',
              localPreferences.truckDimensions.weight.toString(),
              (text) => updateTruckDimension('weight', parseFloat(text) || 80000),
              'numeric',
              'lbs'
            )}
          </View>

          {/* Reset Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer} />
        </ScrollView>
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
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  switchText: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  switchSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  inputInfo: {
    flex: 1,
    marginRight: 16,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  inputSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },
  input: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'right',
    flex: 1,
  },
  inputSuffix: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  resetButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  footer: {
    height: 32,
  },
});

export default RoutePreferences;