import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  TextInput,
  Alert 
} from 'react-native';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clipboard,
  MapPin,
  User,
  ChevronRight,
  ChevronLeft,
  Lock
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useInspectionStore } from '@/store/inspectionStore';
import { preTripInspectionItems } from '@/constants/mockData';
import { InspectionStatus } from '@/types';

interface PreTripInspectionModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  isBeginningTrip?: boolean; // New prop to indicate if this is the start of a trip
}

export default function PreTripInspectionModal({ 
  visible, 
  onClose, 
  onComplete,
  isBeginningTrip = false 
}: PreTripInspectionModalProps) {
  const [location, setLocation] = useState('Atlanta, GA');
  const [activeCategory, setActiveCategory] = useState(0);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [defectDescriptions, setDefectDescriptions] = useState<{ [key: string]: string }>({});
  const [attemptedBypass, setAttemptedBypass] = useState(false);
  
  const {
    currentInspection,
    startInspection,
    updateInspectionItem,
    completeInspection,
    getInspectionProgress,
    hasDefects,
    canCompleteInspection,
  } = useInspectionStore();
  
  useEffect(() => {
    if (visible && currentInspection.length === 0) {
      startInspection();
    }
  }, [visible]);
  
  const progress = getInspectionProgress();
  
  const getItemStatus = (itemId: string): InspectionStatus => {
    const item = currentInspection.find(i => i.itemId === itemId);
    return item?.status || 'Pass';
  };
  
  const handleItemStatusChange = (itemId: string, status: InspectionStatus) => {
    updateInspectionItem(
      itemId, 
      status, 
      notes[itemId] || '', 
      defectDescriptions[itemId] || ''
    );
  };
  
  const handleNotesChange = (itemId: string, text: string) => {
    setNotes(prev => ({ ...prev, [itemId]: text }));
    const currentStatus = getItemStatus(itemId);
    updateInspectionItem(
      itemId, 
      currentStatus, 
      text, 
      defectDescriptions[itemId] || ''
    );
  };
  
  const handleDefectDescriptionChange = (itemId: string, text: string) => {
    setDefectDescriptions(prev => ({ ...prev, [itemId]: text }));
    const currentStatus = getItemStatus(itemId);
    updateInspectionItem(
      itemId, 
      currentStatus, 
      notes[itemId] || '', 
      text
    );
  };
  
  // Check if current category is complete
  const isCategoryComplete = (categoryIndex: number) => {
    const category = preTripInspectionItems[categoryIndex];
    if (!category) return false;
    
    return category.items.every(item => {
      const status = getItemStatus(item.id);
      return status === 'Pass' || status === 'Fail' || status === 'Defect';
    });
  };
  
  // Check if user can proceed to next category
  const canProceedToNext = () => {
    return isCategoryComplete(activeCategory);
  };
  
  // Check if user can go back to previous category
  const canGoBack = () => {
    return activeCategory > 0;
  };
  
  // Handle next category
  const handleNextCategory = () => {
    if (!canProceedToNext()) {
      setAttemptedBypass(true);
      Alert.alert(
        'Category Incomplete - Hard Stop',
        `You must complete ALL inspection points in "${preTripInspectionItems[activeCategory].category}" before proceeding. This is a FMCSA safety requirement and cannot be bypassed.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (activeCategory < preTripInspectionItems.length - 1) {
      setActiveCategory(activeCategory + 1);
      setAttemptedBypass(false);
    }
  };
  
  // Handle previous category
  const handlePreviousCategory = () => {
    if (canGoBack()) {
      setActiveCategory(activeCategory - 1);
      setAttemptedBypass(false);
    }
  };
  
  // Handle close with conditional hard stop
  const handleClose = () => {
    // Only enforce hard stop when beginning a trip
    if (isBeginningTrip && !canCompleteInspection()) {
      Alert.alert(
        'Trip Start - Inspection Required',
        'You cannot begin your trip until ALL 21 inspection points are completed. This is a federal safety requirement for trip initiation.',
        [
          { text: 'Continue Inspection', style: 'default' },
          { 
            text: 'Cancel Trip Start', 
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Cancel Trip Confirmation',
                'Canceling will prevent you from starting your trip. You can complete the inspection later for routine checks.',
                [
                  { text: 'Stay', style: 'cancel' },
                  { text: 'Cancel Trip', style: 'destructive', onPress: onClose }
                ]
              );
            }
          }
        ]
      );
      return;
    }
    
    // For non-trip inspections, allow exit with warning
    if (!isBeginningTrip && !canCompleteInspection()) {
      Alert.alert(
        'Incomplete Inspection',
        'This inspection is not complete. You can finish it later, but it will be required before starting a trip.',
        [
          { text: 'Continue Later', onPress: onClose },
          { text: 'Stay', style: 'cancel' }
        ]
      );
      return;
    }
    
    onClose();
  };
  
  const handleComplete = () => {
    if (!canCompleteInspection()) {
      const message = isBeginningTrip 
        ? `Please complete all ${preTripInspectionItems.reduce((sum, cat) => sum + cat.items.length, 0)} CDL inspection points before starting your trip. This is required by FMCSA regulations for trip initiation.`
        : `Please complete all ${preTripInspectionItems.reduce((sum, cat) => sum + cat.items.length, 0)} CDL inspection points before finishing. This inspection can be completed later if not starting a trip.`;
      
      Alert.alert(
        'CDL Inspection Incomplete',
        message,
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (hasDefects()) {
      const defectMessage = isBeginningTrip
        ? 'This vehicle has defects and cannot be used to start a trip. FMCSA regulations require addressing defects before trip operation. Contact maintenance immediately.'
        : 'This vehicle has defects and may not be safe to operate. FMCSA regulations require addressing defects before operation. Contact maintenance immediately.';
      
      Alert.alert(
        'CDL Inspection: Defects Found',
        defectMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: isBeginningTrip ? 'Cannot Start Trip' : 'Complete with Defects', 
            style: 'destructive',
            onPress: () => {
              if (isBeginningTrip) {
                Alert.alert(
                  'Trip Start Blocked',
                  'Cannot start trip with vehicle defects. Please resolve defects first.',
                  [{ text: 'OK' }]
                );
                return;
              }
              completeInspection(location);
              onComplete();
              onClose();
            }
          }
        ]
      );
    } else {
      const successMessage = isBeginningTrip
        ? 'All 21 inspection points passed. Vehicle is safe to operate and trip can begin.'
        : 'All 21 inspection points passed. Vehicle is safe to operate.';
      
      Alert.alert(
        'CDL Inspection Complete',
        successMessage,
        [
          {
            text: 'Finish',
            onPress: () => {
              completeInspection(location);
              onComplete();
              onClose();
            }
          }
        ]
      );
    }
  };
  
  const renderStatusButton = (itemId: string, status: InspectionStatus, icon: React.ReactNode, label: string) => {
    const isSelected = getItemStatus(itemId) === status;
    const buttonColor = status === 'Pass' ? colors.secondary : 
                       status === 'Fail' ? colors.danger : colors.warning;
    
    return (
      <TouchableOpacity
        style={[
          styles.statusButton,
          { borderColor: buttonColor },
          isSelected && { backgroundColor: buttonColor }
        ]}
        onPress={() => handleItemStatusChange(itemId, status)}
      >
        {icon}
        <Text style={[
          styles.statusButtonText,
          isSelected && { color: colors.text }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderInspectionItem = (item: any) => {
    const itemStatus = getItemStatus(item.id);
    const showDefectInput = itemStatus === 'Fail' || itemStatus === 'Defect';
    const isCompleted = itemStatus === 'Pass' || itemStatus === 'Fail' || itemStatus === 'Defect';
    
    return (
      <View key={item.id} style={[
        styles.inspectionItem,
        isCompleted && styles.completedItem
      ]}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.required && <Text style={styles.requiredText}>*CDL Required</Text>}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <CheckCircle size={14} color={colors.secondary} />
            </View>
          )}
        </View>
        
        <View style={styles.statusButtons}>
          {renderStatusButton(
            item.id, 
            'Pass', 
            <CheckCircle size={16} color={getItemStatus(item.id) === 'Pass' ? colors.text : colors.secondary} />, 
            'Pass'
          )}
          {renderStatusButton(
            item.id, 
            'Defect', 
            <AlertTriangle size={16} color={getItemStatus(item.id) === 'Defect' ? colors.text : colors.warning} />, 
            'Defect'
          )}
          {renderStatusButton(
            item.id, 
            'Fail', 
            <XCircle size={16} color={getItemStatus(item.id) === 'Fail' ? colors.text : colors.danger} />, 
            'Fail'
          )}
        </View>
        
        {showDefectInput && (
          <TextInput
            style={styles.defectInput}
            placeholder="Describe the defect or issue in detail..."
            placeholderTextColor={colors.textSecondary}
            value={defectDescriptions[item.id] || ''}
            onChangeText={(text) => handleDefectDescriptionChange(item.id, text)}
            multiline
          />
        )}
        
        <TextInput
          style={styles.notesInput}
          placeholder="Additional inspection notes (optional)"
          placeholderTextColor={colors.textSecondary}
          value={notes[item.id] || ''}
          onChangeText={(text) => handleNotesChange(item.id, text)}
          multiline
        />
      </View>
    );
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Clipboard size={24} color={colors.primaryLight} />
            <View>
              <Text style={styles.title}>CDL Pre-Trip Inspection</Text>
              <Text style={styles.subtitle}>
                {isBeginningTrip ? '21-Point Trip Start Checklist' : '21-Point Safety Checklist'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              CDL Inspection Progress: {progress.completed}/{progress.total} points
            </Text>
            <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress.percentage}%` }
              ]} 
            />
          </View>
          {progress.percentage === 100 && (
            <Text style={styles.completionText}>✓ All 21 points completed</Text>
          )}
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.primaryLight} />
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Inspection location"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        {/* Step-by-step category navigation */}
        <View style={styles.stepNavigation}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>
              Step {activeCategory + 1} of {preTripInspectionItems.length}
            </Text>
            <Text style={styles.stepSubtitle}>
              {preTripInspectionItems[activeCategory]?.category}
            </Text>
          </View>
          
          <View style={styles.stepProgress}>
            {preTripInspectionItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index === activeCategory && styles.activeStepDot,
                  isCategoryComplete(index) && styles.completedStepDot,
                  index > activeCategory && !isCategoryComplete(index - 1) && styles.lockedStepDot
                ]}
              >
                {isCategoryComplete(index) ? (
                  <CheckCircle size={12} color={colors.text} />
                ) : index > activeCategory && !isCategoryComplete(index - 1) ? (
                  <Lock size={10} color={colors.textSecondary} />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
            ))}
          </View>
          
          {attemptedBypass && (
            <View style={styles.bypassWarning}>
              <AlertTriangle size={16} color={colors.danger} />
              <Text style={styles.bypassWarningText}>
                Complete all items in this category to proceed
              </Text>
            </View>
          )}
        </View>
        
        <ScrollView style={styles.inspectionContent}>
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {preTripInspectionItems[activeCategory]?.category}
              </Text>
              <View style={styles.categoryProgress}>
                <Text style={styles.categoryProgressText}>
                  {preTripInspectionItems[activeCategory]?.items.filter(item => {
                    const status = getItemStatus(item.id);
                    return status === 'Pass' || status === 'Fail' || status === 'Defect';
                  }).length} / {preTripInspectionItems[activeCategory]?.items.length} Complete
                </Text>
              </View>
            </View>
            
            {preTripInspectionItems[activeCategory]?.items.map(renderInspectionItem)}
            
            {/* Navigation buttons */}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.backButton,
                  !canGoBack() && styles.disabledNavButton
                ]}
                onPress={handlePreviousCategory}
                disabled={!canGoBack()}
              >
                <ChevronLeft size={20} color={canGoBack() ? colors.text : colors.textSecondary} />
                <Text style={[
                  styles.navButtonText,
                  !canGoBack() && styles.disabledNavButtonText
                ]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              {activeCategory < preTripInspectionItems.length - 1 ? (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.nextButton,
                    !canProceedToNext() && styles.disabledNavButton
                  ]}
                  onPress={handleNextCategory}
                  disabled={!canProceedToNext()}
                >
                  <Text style={[
                    styles.navButtonText,
                    !canProceedToNext() && styles.disabledNavButtonText
                  ]}>
                    Next Category
                  </Text>
                  <ChevronRight size={20} color={canProceedToNext() ? colors.text : colors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.completeButton,
                    !canCompleteInspection() && styles.disabledNavButton,
                    hasDefects() && { backgroundColor: colors.warning }
                  ]}
                  onPress={handleComplete}
                  disabled={!canCompleteInspection()}
                >
                  <User size={20} color={colors.text} />
                  <Text style={styles.navButtonText}>
                    {hasDefects() ? 'Complete with Defects' : 'Complete Inspection'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          {hasDefects() && (
            <View style={styles.warningContainer}>
              <AlertTriangle size={16} color={colors.warning} />
              <Text style={styles.warningText}>
                ⚠️ Defects found - Vehicle may not be safe to operate. Contact maintenance before driving.
              </Text>
            </View>
          )}
          
          {isBeginningTrip && (
            <View style={styles.hardStopNotice}>
              <Lock size={16} color={colors.primaryLight} />
              <Text style={styles.hardStopText}>
                FMCSA Hard Stop: Complete ALL categories to begin trip
              </Text>
            </View>
          )}
          
          {!isBeginningTrip && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Routine inspection - can be completed later if not starting a trip
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 2,
  },
  completionText: {
    fontSize: 12,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  categoryTabs: {
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  activeCategoryTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  categoryTabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeCategoryTabText: {
    color: colors.primaryLight,
    fontWeight: '600',
  },
  inspectionContent: {
    flex: 1,
  },
  categorySection: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inspectionItem: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedItem: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completedBadge: {
    marginLeft: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '500',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  defectInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.primaryLight,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stepNavigation: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  stepSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  stepProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepDot: {
    backgroundColor: colors.primaryLight,
  },
  completedStepDot: {
    backgroundColor: colors.secondary,
  },
  lockedStepDot: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  bypassWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  bypassWarningText: {
    fontSize: 14,
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '500',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryProgress: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryProgressText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  backButton: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.primaryLight,
  },
  completeButton: {
    backgroundColor: colors.secondary,
  },
  disabledNavButton: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  disabledNavButtonText: {
    color: colors.textSecondary,
  },
  hardStopNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  hardStopText: {
    fontSize: 14,
    color: colors.primaryLight,
    marginLeft: 8,
    fontWeight: '500',
  },
});