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
  User
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useInspectionStore } from '@/store/inspectionStore';
import { preTripInspectionItems } from '@/constants/mockData';
import { InspectionStatus } from '@/types';

interface PreTripInspectionModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function PreTripInspectionModal({ 
  visible, 
  onClose, 
  onComplete 
}: PreTripInspectionModalProps) {
  const [location, setLocation] = useState('Atlanta, GA');
  const [activeCategory, setActiveCategory] = useState(0);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [defectDescriptions, setDefectDescriptions] = useState<{ [key: string]: string }>({});
  
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
  
  const handleComplete = () => {
    if (!canCompleteInspection()) {
      Alert.alert(
        'Incomplete Inspection',
        'Please complete all inspection items before finishing.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (hasDefects()) {
      Alert.alert(
        'Defects Found',
        'This vehicle has defects and may not be safe to operate. Contact maintenance before driving.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Complete Anyway', 
            style: 'destructive',
            onPress: () => {
              completeInspection(location);
              onComplete();
              onClose();
            }
          }
        ]
      );
    } else {
      completeInspection(location);
      onComplete();
      onClose();
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
    const showDefectInput = itemStatus === 'Fail';
    
    return (
      <View key={item.id} style={styles.inspectionItem}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.required && <Text style={styles.requiredText}>*Required</Text>}
        
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
            placeholder="Describe the defect..."
            placeholderTextColor={colors.textSecondary}
            value={defectDescriptions[item.id] || ''}
            onChangeText={(text) => handleDefectDescriptionChange(item.id, text)}
            multiline
          />
        )}
        
        <TextInput
          style={styles.notesInput}
          placeholder="Additional notes (optional)"
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
            <Text style={styles.title}>Pre-Trip Inspection</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progress: {progress.completed}/{progress.total} items
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
        
        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {preTripInspectionItems.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryTab,
                  activeCategory === index && styles.activeCategoryTab
                ]}
                onPress={() => setActiveCategory(index)}
              >
                <Text style={[
                  styles.categoryTabText,
                  activeCategory === index && styles.activeCategoryTabText
                ]}>
                  {category.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <ScrollView style={styles.inspectionContent}>
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {preTripInspectionItems[activeCategory]?.category}
            </Text>
            
            {preTripInspectionItems[activeCategory]?.items.map(renderInspectionItem)}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          {hasDefects() && (
            <View style={styles.warningContainer}>
              <AlertTriangle size={16} color={colors.warning} />
              <Text style={styles.warningText}>
                Defects found - Vehicle may not be safe to operate
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.completeButton,
              !canCompleteInspection() && styles.disabledButton,
              hasDefects() && { backgroundColor: colors.warning }
            ]}
            onPress={handleComplete}
            disabled={!canCompleteInspection()}
          >
            <User size={20} color={colors.text} />
            <Text style={styles.completeButtonText}>
              {hasDefects() ? 'Complete with Defects' : 'Complete Inspection'}
            </Text>
          </TouchableOpacity>
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
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  requiredText: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: 12,
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
  warningText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});