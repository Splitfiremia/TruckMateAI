import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  AlertTriangle,
  Camera,
  X,
  Send,
  Truck,
  Wrench,
  Fuel,
  Zap,
  Gauge,
  Thermometer,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore } from '@/store/driverStore';

interface IssueReport {
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  photos: string[];
  location: string;
}

const issueTypes = [
  { id: 'engine', label: 'Engine Problem', icon: Wrench, color: colors.danger },
  { id: 'fuel', label: 'Fuel Issue', icon: Fuel, color: colors.warning },
  { id: 'electrical', label: 'Electrical', icon: Zap, color: colors.accent },
  { id: 'brakes', label: 'Brake System', icon: AlertTriangle, color: colors.danger },
  { id: 'tires', label: 'Tire Problem', icon: Truck, color: colors.text.secondary },
  { id: 'temperature', label: 'Overheating', icon: Thermometer, color: colors.danger },
  { id: 'gauges', label: 'Dashboard Warning', icon: Gauge, color: colors.warning },
  { id: 'other', label: 'Other Issue', icon: AlertTriangle, color: colors.text.tertiary },
];

const priorityLevels = [
  { id: 'low', label: 'Low', description: 'Can continue driving', color: colors.success },
  { id: 'medium', label: 'Medium', description: 'Should be addressed soon', color: colors.warning },
  { id: 'high', label: 'High', description: 'Immediate attention needed', color: colors.danger },
];

export default function ReportIssueScreen() {
  const [issueReport, setIssueReport] = useState<IssueReport>({
    type: '',
    description: '',
    priority: 'medium',
    photos: [],
    location: 'Current Location', // In real app, get from GPS
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportIssue } = useDriverStore();

  const handleSelectIssueType = (type: string) => {
    setIssueReport(prev => ({ ...prev, type }));
  };

  const handleSelectPriority = (priority: 'low' | 'medium' | 'high') => {
    setIssueReport(prev => ({ ...prev, priority }));
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => mockTakePhoto() },
        { text: 'Choose from Gallery', onPress: () => mockChoosePhoto() },
      ]
    );
  };

  const mockTakePhoto = () => {
    const mockPhotoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setIssueReport(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl],
    }));
  };

  const mockChoosePhoto = () => {
    const mockPhotoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setIssueReport(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl],
    }));
  };

  const removePhoto = (index: number) => {
    setIssueReport(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!issueReport.type) {
      Alert.alert('Missing Information', 'Please select an issue type.');
      return;
    }

    if (!issueReport.description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description of the issue.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await reportIssue({
        type: issueReport.type,
        description: issueReport.description,
        priority: issueReport.priority,
        photos: issueReport.photos,
      });
      
      Alert.alert(
        'Issue Reported',
        'Your issue has been reported successfully. The maintenance team will be notified.',
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit issue report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIssueReport({
      type: '',
      description: '',
      priority: 'medium',
      photos: [],
      location: 'Current Location',
    });
  };

  const getSelectedIssueType = () => {
    return issueTypes.find(type => type.id === issueReport.type);
  };

  const getSelectedPriority = () => {
    return priorityLevels.find(level => level.id === issueReport.priority);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <AlertTriangle color={colors.warning} size={24} />
          <Text style={styles.headerTitle}>Report Vehicle Issue</Text>
          <Text style={styles.headerSubtitle}>Help us keep you safe on the road</Text>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of issue are you experiencing?</Text>
          
          <View style={styles.issueTypesGrid}>
            {issueTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = issueReport.type === type.id;
              
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.issueTypeButton,
                    isSelected && styles.issueTypeButtonSelected
                  ]}
                  onPress={() => handleSelectIssueType(type.id)}
                >
                  <IconComponent 
                    color={isSelected ? colors.white : type.color} 
                    size={24} 
                  />
                  <Text style={[
                    styles.issueTypeText,
                    isSelected && styles.issueTypeTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How urgent is this issue?</Text>
          
          <View style={styles.priorityContainer}>
            {priorityLevels.map((level) => {
              const isSelected = issueReport.priority === level.id;
              
              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.priorityButton,
                    isSelected && styles.priorityButtonSelected,
                    { borderColor: level.color }
                  ]}
                  onPress={() => handleSelectPriority(level.id as 'low' | 'medium' | 'high')}
                >
                  <View style={[
                    styles.priorityIndicator,
                    { backgroundColor: level.color }
                  ]} />
                  <View style={styles.priorityContent}>
                    <Text style={[
                      styles.priorityLabel,
                      isSelected && styles.priorityLabelSelected
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={[
                      styles.priorityDescription,
                      isSelected && styles.priorityDescriptionSelected
                    ]}>
                      {level.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the issue in detail</Text>
          
          <TextInput
            style={styles.descriptionInput}
            value={issueReport.description}
            onChangeText={(text) => setIssueReport(prev => ({ ...prev, description: text }))}
            placeholder="Please provide as much detail as possible about the issue, including when it started, any warning lights, sounds, or symptoms..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          
          <Text style={styles.characterCount}>
            {issueReport.description.length}/500 characters
          </Text>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add photos (optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Photos help our mechanics understand the issue better
          </Text>
          
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            <Camera color={colors.primary} size={24} />
            <Text style={styles.photoButtonText}>Add Photo</Text>
          </TouchableOpacity>

          {issueReport.photos.length > 0 && (
            <View style={styles.photosGrid}>
              {issueReport.photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <X color={colors.white} size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{issueReport.location}</Text>
          </View>
        </View>

        {/* Summary */}
        {(issueReport.type || issueReport.description) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issue Summary</Text>
            <View style={styles.summaryContainer}>
              {issueReport.type && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Type:</Text>
                  <Text style={styles.summaryValue}>
                    {getSelectedIssueType()?.label}
                  </Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Priority:</Text>
                <View style={styles.prioritySummary}>
                  <View style={[
                    styles.prioritySummaryIndicator,
                    { backgroundColor: getSelectedPriority()?.color }
                  ]} />
                  <Text style={styles.summaryValue}>
                    {getSelectedPriority()?.label}
                  </Text>
                </View>
              </View>
              
              {issueReport.photos.length > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Photos:</Text>
                  <Text style={styles.summaryValue}>
                    {issueReport.photos.length} attached
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Send color={colors.white} size={20} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting Report...' : 'Submit Issue Report'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 16,
  },
  issueTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueTypeButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  issueTypeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  issueTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  issueTypeTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  priorityContainer: {
    gap: 12,
  },
  priorityButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityButtonSelected: {
    backgroundColor: colors.background.primary,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityContent: {
    flex: 1,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  priorityLabelSelected: {
    fontWeight: '700',
  },
  priorityDescription: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  priorityDescriptionSelected: {
    color: colors.text.secondary,
  },
  descriptionInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  characterCount: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: 8,
  },
  photoButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  prioritySummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prioritySummaryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
});