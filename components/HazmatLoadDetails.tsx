import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Load, HazmatInfo } from '@/types';
import { HazmatIndicator } from './HazmatIndicator';
import { HazmatPlacardGuide } from './HazmatPlacardGuide';
import { 
  AlertTriangle, 
  Phone, 
  FileText, 
  Shield, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react-native';

interface HazmatLoadDetailsProps {
  load: Load;
  onUpdateHazmat?: (hazmatInfo: HazmatInfo) => void;
}

export const HazmatLoadDetails: React.FC<HazmatLoadDetailsProps> = ({
  load,
  onUpdateHazmat,
}) => {
  const [showPlacardGuide, setShowPlacardGuide] = useState(false);

  if (!load.hazmat?.isHazmat) {
    return (
      <View style={styles.noHazmatContainer}>
        <Shield size={32} color={colors.textSecondary} />
        <Text style={styles.noHazmatText}>This load does not contain hazardous materials</Text>
      </View>
    );
  }

  const hazmat = load.hazmat;

  const handleEmergencyCall = () => {
    if (hazmat.emergencyContact) {
      Alert.alert(
        'Emergency Contact',
        `Call ${hazmat.emergencyContact}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => Linking.openURL(`tel:${hazmat.emergencyContact}`),
          },
        ]
      );
    }
  };

  const getComplianceStatus = () => {
    const issues = [];
    
    if (!hazmat.unNumber) issues.push('Missing UN Number');
    if (!hazmat.properShippingName) issues.push('Missing Proper Shipping Name');
    if (!hazmat.packingGroup) issues.push('Missing Packing Group');
    if (hazmat.placards.length === 0) issues.push('No placards assigned');
    if (!hazmat.emergencyContact) issues.push('Missing emergency contact');
    
    return {
      isCompliant: issues.length === 0,
      issues,
    };
  };

  const compliance = getComplianceStatus();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <AlertTriangle size={24} color={colors.warning} />
          <Text style={styles.title}>Hazmat Load Details</Text>
        </View>
        <View style={[
          styles.complianceStatus,
          { backgroundColor: compliance.isCompliant ? colors.secondary + '20' : colors.error + '20' }
        ]}>
          {compliance.isCompliant ? (
            <CheckCircle size={16} color={colors.secondary} />
          ) : (
            <XCircle size={16} color={colors.error} />
          )}
          <Text style={[
            styles.complianceText,
            { color: compliance.isCompliant ? colors.secondary : colors.error }
          ]}>
            {compliance.isCompliant ? 'Compliant' : 'Issues Found'}
          </Text>
        </View>
      </View>

      {/* Load Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Load Information</Text>
        <View style={styles.loadInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Load ID:</Text>
            <Text style={styles.infoValue}>{load.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{load.pickup.location} → {load.delivery.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>
              {new Date(load.pickup.time).toLocaleDateString()} - {new Date(load.delivery.time).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Hazmat Classification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazmat Classification</Text>
        <View style={styles.classificationGrid}>
          <View style={styles.classificationItem}>
            <Text style={styles.classificationLabel}>UN Number</Text>
            <Text style={styles.classificationValue}>{hazmat.unNumber || 'Not specified'}</Text>
          </View>
          <View style={styles.classificationItem}>
            <Text style={styles.classificationLabel}>Hazard Class</Text>
            <Text style={styles.classificationValue}>{hazmat.hazardClass}</Text>
          </View>
          <View style={styles.classificationItem}>
            <Text style={styles.classificationLabel}>Packing Group</Text>
            <Text style={styles.classificationValue}>{hazmat.packingGroup || 'Not specified'}</Text>
          </View>
          <View style={styles.classificationItem}>
            <Text style={styles.classificationLabel}>Quantity</Text>
            <Text style={styles.classificationValue}>{hazmat.totalQuantity || 'Not specified'}</Text>
          </View>
        </View>
        
        {hazmat.properShippingName && (
          <View style={styles.shippingNameContainer}>
            <Text style={styles.shippingNameLabel}>Proper Shipping Name</Text>
            <Text style={styles.shippingNameValue}>{hazmat.properShippingName}</Text>
          </View>
        )}\n      </View>\n\n      {/* Required Placards */}\n      <View style={styles.section}>\n        <View style={styles.sectionHeader}>\n          <Text style={styles.sectionTitle}>Required Placards</Text>\n          <TouchableOpacity\n            style={styles.manageButton}\n            onPress={() => setShowPlacardGuide(true)}\n          >\n            <Shield size={16} color={colors.primary} />\n            <Text style={styles.manageButtonText}>Manage</Text>\n          </TouchableOpacity>\n        </View>\n        \n        {hazmat.placards.length > 0 ? (\n          <View style={styles.placardsContainer}>\n            {hazmat.placards.map((placard) => (\n              <View key={placard.id} style={styles.placardItem}>\n                <View style={styles.placardInfo}>\n                  <Text style={styles.placardName}>{placard.name}</Text>\n                  <Text style={styles.placardClass}>Class {placard.class}</Text>\n                  <Text style={styles.placardDescription}>{placard.description}</Text>\n                </View>\n                <View style={styles.placardVisual}>\n                  <Text style={styles.placardColor}>{placard.color}</Text>\n                  <Text style={styles.placardSymbol}>{placard.symbol}</Text>\n                </View>\n              </View>\n            ))}\n          </View>\n        ) : (\n          <View style={styles.noPlacards}>\n            <AlertTriangle size={32} color={colors.warning} />\n            <Text style={styles.noPlacardText}>No placards assigned</Text>\n            <Text style={styles.noPlacardSubtext}>Tap \"Manage\" to add required placards</Text>\n          </View>\n        )}\n      </View>\n\n      {/* Emergency Information */}\n      {hazmat.emergencyContact && (\n        <View style={styles.section}>\n          <Text style={styles.sectionTitle}>Emergency Information</Text>\n          <TouchableOpacity style={styles.emergencyCard} onPress={handleEmergencyCall}>\n            <View style={styles.emergencyHeader}>\n              <Phone size={20} color={colors.error} />\n              <Text style={styles.emergencyTitle}>Emergency Contact</Text>\n            </View>\n            <Text style={styles.emergencyContact}>{hazmat.emergencyContact}</Text>\n            <Text style={styles.emergencySubtext}>Tap to call in case of emergency</Text>\n          </TouchableOpacity>\n        </View>\n      )}\n\n      {/* Special Instructions */}\n      {hazmat.specialInstructions && hazmat.specialInstructions.length > 0 && (\n        <View style={styles.section}>\n          <Text style={styles.sectionTitle}>Special Instructions</Text>\n          <View style={styles.instructionsContainer}>\n            {hazmat.specialInstructions.map((instruction, index) => (\n              <View key={index} style={styles.instructionItem}>\n                <Info size={16} color={colors.warning} />\n                <Text style={styles.instructionText}>{instruction}</Text>\n              </View>\n            ))}\n          </View>\n        </View>\n      )}\n\n      {/* Compliance Issues */}\n      {!compliance.isCompliant && (\n        <View style={styles.section}>\n          <Text style={[styles.sectionTitle, { color: colors.error }]}>Compliance Issues</Text>\n          <View style={styles.issuesContainer}>\n            {compliance.issues.map((issue, index) => (\n              <View key={index} style={styles.issueItem}>\n                <XCircle size={16} color={colors.error} />\n                <Text style={styles.issueText}>{issue}</Text>\n              </View>\n            ))}\n          </View>\n          <Text style={styles.issueWarning}>\n            ⚠️ This load cannot be transported until all compliance issues are resolved.\n          </Text>\n        </View>\n      )}\n\n      {/* Documentation Requirements */}\n      <View style={styles.section}>\n        <Text style={styles.sectionTitle}>Required Documentation</Text>\n        <View style={styles.documentationList}>\n          <View style={styles.documentItem}>\n            <FileText size={16} color={colors.textSecondary} />\n            <Text style={styles.documentText}>Shipping papers with proper shipping name</Text>\n          </View>\n          <View style={styles.documentItem}>\n            <FileText size={16} color={colors.textSecondary} />\n            <Text style={styles.documentText}>Emergency response information</Text>\n          </View>\n          <View style={styles.documentItem}>\n            <FileText size={16} color={colors.textSecondary} />\n            <Text style={styles.documentText}>Driver hazmat endorsement</Text>\n          </View>\n          <View style={styles.documentItem}>\n            <FileText size={16} color={colors.textSecondary} />\n            <Text style={styles.documentText}>Vehicle placarding certificate</Text>\n          </View>\n        </View>\n      </View>\n\n      <HazmatPlacardGuide\n        visible={showPlacardGuide}\n        onClose={() => setShowPlacardGuide(false)}\n        hazmatInfo={hazmat}\n        onUpdateHazmat={onUpdateHazmat}\n      />\n    </ScrollView>\n  );\n};\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: colors.background,\n  },\n  noHazmatContainer: {\n    flex: 1,\n    alignItems: 'center',\n    justifyContent: 'center',\n    padding: 40,\n    gap: 16,\n  },\n  noHazmatText: {\n    fontSize: 16,\n    color: colors.textSecondary,\n    textAlign: 'center',\n  },\n  header: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    padding: 20,\n    borderBottomWidth: 1,\n    borderBottomColor: colors.border,\n  },\n  headerTitle: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    gap: 12,\n  },\n  title: {\n    fontSize: 20,\n    fontWeight: '600',\n    color: colors.text,\n  },\n  complianceStatus: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingHorizontal: 12,\n    paddingVertical: 6,\n    borderRadius: 8,\n    gap: 6,\n  },\n  complianceText: {\n    fontSize: 14,\n    fontWeight: '600',\n  },\n  section: {\n    padding: 20,\n    borderBottomWidth: 1,\n    borderBottomColor: colors.border,\n  },\n  sectionHeader: {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: 16,\n  },\n  sectionTitle: {\n    fontSize: 18,\n    fontWeight: '600',\n    color: colors.text,\n    marginBottom: 16,\n  },\n  manageButton: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingHorizontal: 12,\n    paddingVertical: 6,\n    backgroundColor: colors.primaryLight,\n    borderRadius: 6,\n    gap: 6,\n  },\n  manageButtonText: {\n    fontSize: 14,\n    fontWeight: '600',\n    color: colors.primary,\n  },\n  loadInfo: {\n    gap: 12,\n  },\n  infoRow: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    gap: 8,\n  },\n  infoLabel: {\n    fontSize: 14,\n    fontWeight: '600',\n    color: colors.textSecondary,\n    minWidth: 60,\n  },\n  infoValue: {\n    fontSize: 14,\n    color: colors.text,\n    flex: 1,\n  },\n  classificationGrid: {\n    flexDirection: 'row',\n    flexWrap: 'wrap',\n    gap: 12,\n  },\n  classificationItem: {\n    flex: 1,\n    minWidth: '45%',\n    backgroundColor: colors.backgroundLight,\n    padding: 12,\n    borderRadius: 8,\n  },\n  classificationLabel: {\n    fontSize: 12,\n    color: colors.textSecondary,\n    marginBottom: 4,\n    textTransform: 'uppercase',\n    fontWeight: '500',\n  },\n  classificationValue: {\n    fontSize: 16,\n    color: colors.text,\n    fontWeight: '600',\n  },\n  shippingNameContainer: {\n    marginTop: 16,\n    padding: 12,\n    backgroundColor: colors.primaryLight + '20',\n    borderRadius: 8,\n    borderWidth: 1,\n    borderColor: colors.primaryLight,\n  },\n  shippingNameLabel: {\n    fontSize: 12,\n    color: colors.primary,\n    marginBottom: 4,\n    textTransform: 'uppercase',\n    fontWeight: '600',\n  },\n  shippingNameValue: {\n    fontSize: 16,\n    color: colors.text,\n    fontWeight: '600',\n  },\n  placardsContainer: {\n    gap: 12,\n  },\n  placardItem: {\n    flexDirection: 'row',\n    backgroundColor: colors.backgroundLight,\n    padding: 16,\n    borderRadius: 12,\n    borderWidth: 1,\n    borderColor: colors.border,\n  },\n  placardInfo: {\n    flex: 1,\n  },\n  placardName: {\n    fontSize: 16,\n    fontWeight: '600',\n    color: colors.text,\n    marginBottom: 4,\n  },\n  placardClass: {\n    fontSize: 14,\n    color: colors.primary,\n    fontWeight: '500',\n    marginBottom: 4,\n  },\n  placardDescription: {\n    fontSize: 12,\n    color: colors.textSecondary,\n  },\n  placardVisual: {\n    alignItems: 'flex-end',\n    justifyContent: 'center',\n    minWidth: 80,\n  },\n  placardColor: {\n    fontSize: 12,\n    color: colors.textSecondary,\n    marginBottom: 2,\n  },\n  placardSymbol: {\n    fontSize: 10,\n    color: colors.textSecondary,\n    textAlign: 'center',\n  },\n  noPlacards: {\n    alignItems: 'center',\n    padding: 40,\n    gap: 12,\n  },\n  noPlacardText: {\n    fontSize: 16,\n    fontWeight: '600',\n    color: colors.warning,\n  },\n  noPlacardSubtext: {\n    fontSize: 14,\n    color: colors.textSecondary,\n    textAlign: 'center',\n  },\n  emergencyCard: {\n    backgroundColor: colors.error + '10',\n    padding: 16,\n    borderRadius: 12,\n    borderWidth: 1,\n    borderColor: colors.error + '30',\n  },\n  emergencyHeader: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    marginBottom: 8,\n    gap: 8,\n  },\n  emergencyTitle: {\n    fontSize: 16,\n    fontWeight: '600',\n    color: colors.error,\n  },\n  emergencyContact: {\n    fontSize: 20,\n    fontWeight: '700',\n    color: colors.error,\n    marginBottom: 4,\n  },\n  emergencySubtext: {\n    fontSize: 12,\n    color: colors.textSecondary,\n  },\n  instructionsContainer: {\n    gap: 12,\n  },\n  instructionItem: {\n    flexDirection: 'row',\n    alignItems: 'flex-start',\n    gap: 12,\n    padding: 12,\n    backgroundColor: colors.warning + '10',\n    borderRadius: 8,\n    borderWidth: 1,\n    borderColor: colors.warning + '30',\n  },\n  instructionText: {\n    flex: 1,\n    fontSize: 14,\n    color: colors.text,\n    lineHeight: 20,\n  },\n  issuesContainer: {\n    gap: 8,\n    marginBottom: 16,\n  },\n  issueItem: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    gap: 8,\n  },\n  issueText: {\n    fontSize: 14,\n    color: colors.error,\n    fontWeight: '500',\n  },\n  issueWarning: {\n    fontSize: 14,\n    color: colors.error,\n    fontWeight: '600',\n    textAlign: 'center',\n    padding: 12,\n    backgroundColor: colors.error + '10',\n    borderRadius: 8,\n  },\n  documentationList: {\n    gap: 12,\n  },\n  documentItem: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    gap: 12,\n  },\n  documentText: {\n    fontSize: 14,\n    color: colors.text,\n    flex: 1,\n  },\n});