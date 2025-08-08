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
  Camera,
  FileText,
  CheckCircle,
  User,
  MapPin,
  Clock,
  Upload,
  X,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface DeliveryData {
  customerName: string;
  customerAddress: string;
  signature: string | null;
  photos: string[];
  notes: string;
  deliveryTime: string;
}

export default function ProofOfDeliveryScreen() {
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    customerName: 'John Doe',
    customerAddress: '123 Main St, City, State 12345',
    signature: null,
    photos: [],
    notes: '',
    deliveryTime: new Date().toLocaleString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Mock photo URL - in real app, this would use expo-camera
    const mockPhotoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setDeliveryData(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl],
    }));
  };

  const mockChoosePhoto = () => {
    // Mock photo URL - in real app, this would use expo-image-picker
    const mockPhotoUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setDeliveryData(prev => ({
      ...prev,
      photos: [...prev.photos, mockPhotoUrl],
    }));
  };

  const removePhoto = (index: number) => {
    setDeliveryData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSignature = () => {
    Alert.alert(
      'Capture Signature',
      'Signature capture would open here',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Capture', onPress: () => mockCaptureSignature() },
      ]
    );
  };

  const mockCaptureSignature = () => {
    // Mock signature - in real app, this would use a signature capture library
    setDeliveryData(prev => ({
      ...prev,
      signature: 'signature_captured',
    }));
  };

  const handleSubmit = async () => {
    if (!deliveryData.signature) {
      Alert.alert('Missing Signature', 'Please capture customer signature before submitting.');
      return;
    }

    if (deliveryData.photos.length === 0) {
      Alert.alert('Missing Photos', 'Please take at least one photo for proof of delivery.');
      return;
    }

    setIsSubmitting(true);
    
    // Mock submission - in real app, this would send to API
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success',
        'Proof of delivery submitted successfully!',
        [{ text: 'OK', onPress: () => resetForm() }]
      );
    }, 2000);
  };

  const resetForm = () => {
    setDeliveryData({
      customerName: '',
      customerAddress: '',
      signature: null,
      photos: [],
      notes: '',
      deliveryTime: new Date().toLocaleString(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <FileText color={colors.primary} size={24} />
          <Text style={styles.headerTitle}>Proof of Delivery</Text>
          <Text style={styles.headerSubtitle}>Complete delivery verification</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User color={colors.primary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Customer Name</Text>
                <TextInput
                  style={styles.infoInput}
                  value={deliveryData.customerName}
                  onChangeText={(text) => setDeliveryData(prev => ({ ...prev, customerName: text }))}
                  placeholder="Enter customer name"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin color={colors.primary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <TextInput
                  style={[styles.infoInput, styles.multilineInput]}
                  value={deliveryData.customerAddress}
                  onChangeText={(text) => setDeliveryData(prev => ({ ...prev, customerAddress: text }))}
                  placeholder="Enter delivery address"
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            <View style={styles.infoRow}>
              <Clock color={colors.primary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Time</Text>
                <Text style={styles.infoValue}>{deliveryData.deliveryTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Signature Capture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Signature</Text>
          
          <TouchableOpacity
            style={[
              styles.signatureButton,
              deliveryData.signature && styles.signatureButtonCompleted
            ]}
            onPress={handleSignature}
          >
            {deliveryData.signature ? (
              <>
                <CheckCircle color={colors.success} size={24} />
                <Text style={styles.signatureButtonTextCompleted}>Signature Captured</Text>
              </>
            ) : (
              <>
                <FileText color={colors.text.tertiary} size={24} />
                <Text style={styles.signatureButtonText}>Tap to Capture Signature</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Photos</Text>
          
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            <Camera color={colors.primary} size={24} />
            <Text style={styles.photoButtonText}>Add Photo</Text>
          </TouchableOpacity>

          {deliveryData.photos.length > 0 && (
            <View style={styles.photosGrid}>
              {deliveryData.photos.map((photo, index) => (
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

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          
          <TextInput
            style={styles.notesInput}
            value={deliveryData.notes}
            onChangeText={(text) => setDeliveryData(prev => ({ ...prev, notes: text }))}
            placeholder="Add any notes about the delivery (damage, delays, special instructions, etc.)"
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Task Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Checklist</Text>
          
          <View style={styles.checklistContainer}>
            <ChecklistItem text="Verify cargo seals" completed={true} />
            <ChecklistItem text="Check for damage" completed={true} />
            <ChecklistItem text="Confirm delivery address" completed={true} />
            <ChecklistItem text="Obtain customer signature" completed={!!deliveryData.signature} />
            <ChecklistItem text="Take delivery photos" completed={deliveryData.photos.length > 0} />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Upload color={colors.white} size={20} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Proof of Delivery'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ChecklistItemProps {
  text: string;
  completed: boolean;
}

function ChecklistItem({ text, completed }: ChecklistItemProps) {
  return (
    <View style={styles.checklistItem}>
      <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
        {completed && <CheckCircle color={colors.white} size={16} />}
      </View>
      <Text style={[styles.checklistText, completed && styles.checklistTextCompleted]}>
        {text}
      </Text>
    </View>
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoInput: {
    fontSize: 16,
    color: colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  signatureButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signatureButtonCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    borderStyle: 'solid',
  },
  signatureButtonText: {
    fontSize: 16,
    color: colors.text.tertiary,
    marginTop: 12,
    fontWeight: '500',
  },
  signatureButtonTextCompleted: {
    fontSize: 16,
    color: colors.white,
    marginTop: 12,
    fontWeight: '600',
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
  notesInput: {
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
  checklistContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checklistText: {
    fontSize: 16,
    color: colors.text.secondary,
    flex: 1,
  },
  checklistTextCompleted: {
    color: colors.text.primary,
    fontWeight: '500',
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