import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Shield, Settings, DollarSign, Percent, Save, RotateCcw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAdminStore } from '@/store/adminStore';

export function CostControlPanel() {
  const { costThresholds, updateCostThresholds } = useAdminStore();
  const [editMode, setEditMode] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(costThresholds);

  const handleSave = () => {
    // Validate inputs
    if (tempThresholds.apiCostRatio < 0 || tempThresholds.apiCostRatio > 1) {
      Alert.alert('Invalid Input', 'API cost ratio must be between 0 and 1');
      return;
    }
    
    if (tempThresholds.profitMarginMin < 0 || tempThresholds.profitMarginMin > 1) {
      Alert.alert('Invalid Input', 'Profit margin must be between 0 and 1');
      return;
    }
    
    if (tempThresholds.maxApiCostPerUser < 0) {
      Alert.alert('Invalid Input', 'Max API cost per user must be positive');
      return;
    }

    updateCostThresholds(tempThresholds);
    setEditMode(false);
    Alert.alert('Success', 'Cost thresholds updated successfully');
  };

  const handleCancel = () => {
    setTempThresholds(costThresholds);
    setEditMode(false);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all thresholds to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaults = {
              apiCostRatio: 0.3,
              profitMarginMin: 0.2,
              maxApiCostPerUser: 4.50
            };
            setTempThresholds(defaults);
            updateCostThresholds(defaults);
            setEditMode(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shield color={colors.primary} size={24} />
        <Text style={styles.title}>Cost Control Settings</Text>
        
        <View style={styles.headerActions}>
          {editMode ? (
            <>
              <Pressable style={styles.actionButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                <Save color={colors.white} size={16} />
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.actionButton} onPress={handleReset}>
                <RotateCcw color={colors.text.secondary} size={16} />
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => setEditMode(true)}>
                <Settings color={colors.primary} size={16} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Cost Threshold Settings */}
      <View style={styles.settingsGrid}>
        {/* API Cost Ratio Threshold */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Percent color={colors.warning} size={20} />
            <Text style={styles.settingLabel}>API Cost Ratio Limit</Text>
          </View>
          
          <Text style={styles.settingDescription}>
            Maximum percentage of user revenue that can be spent on API costs
          </Text>
          
          {editMode ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={(tempThresholds.apiCostRatio * 100).toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) / 100;
                  setTempThresholds(prev => ({ ...prev, apiCostRatio: isNaN(value) ? 0 : value }));
                }}
                keyboardType="numeric"
                placeholder="30"
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          ) : (
            <Text style={styles.settingValue}>
              {(costThresholds.apiCostRatio * 100).toFixed(0)}%
            </Text>
          )}
        </View>

        {/* Profit Margin Minimum */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <DollarSign color={colors.success} size={20} />
            <Text style={styles.settingLabel}>Min Profit Margin</Text>
          </View>
          
          <Text style={styles.settingDescription}>
            Minimum profit margin required before triggering alerts
          </Text>
          
          {editMode ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={(tempThresholds.profitMarginMin * 100).toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) / 100;
                  setTempThresholds(prev => ({ ...prev, profitMarginMin: isNaN(value) ? 0 : value }));
                }}
                keyboardType="numeric"
                placeholder="20"
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          ) : (
            <Text style={styles.settingValue}>
              {(costThresholds.profitMarginMin * 100).toFixed(0)}%
            </Text>
          )}
        </View>

        {/* Max API Cost Per User */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <DollarSign color={colors.error} size={20} />
            <Text style={styles.settingLabel}>Max Cost Per User</Text>
          </View>
          
          <Text style={styles.settingDescription}>
            Maximum API cost allowed per paid user per month
          </Text>
          
          {editMode ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={tempThresholds.maxApiCostPerUser.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text);
                  setTempThresholds(prev => ({ ...prev, maxApiCostPerUser: isNaN(value) ? 0 : value }));
                }}
                keyboardType="numeric"
                placeholder="4.50"
              />
            </View>
          ) : (
            <Text style={styles.settingValue}>
              ${costThresholds.maxApiCostPerUser.toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      {/* Automated Actions */}
      <View style={styles.automationSection}>
        <Text style={styles.automationTitle}>Automated Cost Controls</Text>
        
        <View style={styles.automationList}>
          <View style={styles.automationItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={styles.automationText}>
              Auto-fallback to free APIs when cost threshold exceeded
            </Text>
          </View>
          
          <View style={styles.automationItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={styles.automationText}>
              Email alerts to admin@fleetpilotpro.com for violations
            </Text>
          </View>
          
          <View style={styles.automationItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={styles.automationText}>
              Real-time cost monitoring and user notifications
            </Text>
          </View>
          
          <View style={styles.automationItem}>
            <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.automationText}>
              Throttle non-essential API calls during high usage
            </Text>
          </View>
        </View>
      </View>

      {/* Current Status */}
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Current Status</Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Active Users</Text>
            <Text style={styles.statusValue}>12 paid • 8 trial</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Cost Control</Text>
            <Text style={[styles.statusValue, { color: colors.success }]}>Active</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Fallback Mode</Text>
            <Text style={[styles.statusValue, { color: colors.text.secondary }]}>Standby</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  settingsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  settingCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    paddingVertical: 8,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginRight: 4,
  },
  inputSuffix: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 4,
  },
  automationSection: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
    marginBottom: 16,
  },
  automationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  automationList: {
    gap: 8,
  },
  automationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  automationText: {
    fontSize: 12,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 16,
  },
  statusSection: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
});