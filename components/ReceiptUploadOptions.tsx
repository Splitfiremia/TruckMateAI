import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, Camera, ImageIcon, FileText, Upload } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ReceiptUploadOptionsProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onFilePress: () => void;
  onBulkUploadPress: () => void;
}

export default function ReceiptUploadOptions({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onFilePress,
  onBulkUploadPress,
}: ReceiptUploadOptionsProps) {
  const handleOptionPress = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleOptionPress(onCameraPress)}
            >
              <View style={styles.optionIcon}>
                <Camera size={24} color={colors.primaryLight} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Take Photo</Text>
                <Text style={styles.optionDescription}>Capture receipt with camera</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleOptionPress(onGalleryPress)}
            >
              <View style={styles.optionIcon}>
                <ImageIcon size={24} color={colors.secondary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Choose from Gallery</Text>
                <Text style={styles.optionDescription}>Select existing photo</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleOptionPress(onFilePress)}
            >
              <View style={styles.optionIcon}>
                <FileText size={24} color={colors.warning} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Browse Files</Text>
                <Text style={styles.optionDescription}>Select from documents</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleOptionPress(onBulkUploadPress)}
            >
              <View style={styles.optionIcon}>
                <Upload size={24} color={colors.primaryLight} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Bulk Upload</Text>
                <Text style={styles.optionDescription}>Process multiple receipts</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  options: {
    gap: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    marginBottom: 8,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});