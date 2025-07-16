import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { X, Upload, Check, Trash2, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useReceiptStore } from '@/store/receiptStore';
import { Receipt, ReceiptType } from '@/types';

interface BulkReceiptUploadProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete?: (receipts: Receipt[]) => void;
}

interface PendingReceipt {
  id: string;
  uri: string;
  processed: boolean;
  receipt?: Receipt;
}

export default function BulkReceiptUpload({ visible, onClose, onUploadComplete }: BulkReceiptUploadProps) {
  const [pendingReceipts, setPendingReceipts] = useState<PendingReceipt[]>([]);
  const [processing, setProcessing] = useState(false);
  const { addReceipt } = useReceiptStore();
  
  const addImages = async () => {
    try {
      // Check current permission status first
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      let finalStatus = currentStatus;
      if (currentStatus !== 'granted') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission is required to select images');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets) {
        const newPendingReceipts = result.assets.map((asset, index) => ({
          id: `pending-${Date.now()}-${index}`,
          uri: asset.uri,
          processed: false,
        }));
        
        setPendingReceipts(prev => [...prev, ...newPendingReceipts]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images');
    }
  };
  
  const removeImage = (id: string) => {
    setPendingReceipts(prev => prev.filter(item => item.id !== id));
  };
  
  const processAllReceipts = async () => {
    if (pendingReceipts.length === 0) return;
    
    setProcessing(true);
    
    // Process each receipt with a delay to simulate real OCR processing
    for (let i = 0; i < pendingReceipts.length; i++) {
      const pending = pendingReceipts[i];
      
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const receiptTypes = ['Fuel', 'Toll', 'Maintenance'] as ReceiptType[];
      const randomType = receiptTypes[Math.floor(Math.random() * receiptTypes.length)];
      
      let mockReceiptData: Receipt;
      
      switch (randomType) {
        case 'Fuel':
          mockReceiptData = {
            id: `R-${Math.floor(Math.random() * 100000)}`,
            type: 'Fuel',
            vendor: `Fuel Station ${i + 1}`,
            location: "Various Locations",
            date: new Date().toISOString().split('T')[0],
            amount: Math.round((Math.random() * 200 + 50) * 100) / 100,
            gallons: Math.round((Math.random() * 60 + 20) * 10) / 10,
            pricePerGallon: Math.round((Math.random() * 2 + 3) * 100) / 100,
            state: "TX",
            category: "Fuel",
            imageUrl: pending.uri,
          };
          break;
        case 'Toll':
          mockReceiptData = {
            id: `R-${Math.floor(Math.random() * 100000)}`,
            type: 'Toll',
            vendor: "Toll Authority",
            location: "Highway Toll",
            date: new Date().toISOString().split('T')[0],
            amount: Math.round((Math.random() * 20 + 5) * 100) / 100,
            state: "TX",
            category: "Tolls",
            imageUrl: pending.uri,
          };
          break;
        default:
          mockReceiptData = {
            id: `R-${Math.floor(Math.random() * 100000)}`,
            type: 'Maintenance',
            vendor: "Service Center",
            location: "Truck Stop",
            date: new Date().toISOString().split('T')[0],
            amount: Math.round((Math.random() * 300 + 100) * 100) / 100,
            state: "TX",
            category: "Maintenance",
            service: "Maintenance Service",
            imageUrl: pending.uri,
          };
      }
      
      // Update the pending receipt with processed data
      setPendingReceipts(prev => prev.map(item => 
        item.id === pending.id 
          ? { ...item, processed: true, receipt: mockReceiptData }
          : item
      ));
    }
    
    setProcessing(false);
  };
  
  const saveAllReceipts = () => {
    const processedReceipts = pendingReceipts
      .filter(item => item.processed && item.receipt)
      .map(item => item.receipt!);
    
    processedReceipts.forEach(receipt => addReceipt(receipt));
    
    if (onUploadComplete) {
      onUploadComplete(processedReceipts);
    }
    
    resetAndClose();
  };
  
  const resetAndClose = () => {
    setPendingReceipts([]);
    setProcessing(false);
    onClose();
  };
  
  const renderReceiptItem = ({ item }: { item: PendingReceipt }) => (
    <View style={styles.receiptItem}>
      <Image source={{ uri: item.uri }} style={styles.receiptImage} resizeMode="cover" />
      
      {item.processed && item.receipt ? (
        <View style={styles.receiptInfo}>
          <Text style={styles.receiptVendor}>{item.receipt.vendor}</Text>
          <Text style={styles.receiptAmount}>${item.receipt.amount.toFixed(2)}</Text>
          <Text style={styles.receiptType}>{item.receipt.type}</Text>
        </View>
      ) : (
        <View style={styles.receiptInfo}>
          {processing ? (
            <>
              <ActivityIndicator size="small" color={colors.primaryLight} />
              <Text style={styles.processingText}>Processing...</Text>
            </>
          ) : (
            <Text style={styles.pendingText}>Ready to process</Text>
          )}
        </View>
      )}
      
      {!processing && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeImage(item.id)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      )}
      
      {item.processed && (
        <View style={styles.processedIndicator}>
          <Check size={16} color={colors.secondary} />
        </View>
      )}
    </View>
  );
  
  const allProcessed = pendingReceipts.length > 0 && pendingReceipts.every(item => item.processed);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={resetAndClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Bulk Receipt Upload</Text>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {pendingReceipts.length === 0 ? (
              <View style={styles.emptyState}>
                <Upload size={48} color={colors.primaryLight} />
                <Text style={styles.emptyText}>No receipts selected</Text>
                <Text style={styles.emptySubtext}>Add multiple receipt images to process them all at once</Text>
              </View>
            ) : (
              <FlatList
                data={pendingReceipts}
                keyExtractor={(item) => item.id}
                renderItem={renderReceiptItem}
                numColumns={2}
                contentContainerStyle={styles.receiptsList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addImages}
              disabled={processing}
            >
              <Plus size={20} color={colors.text} />
              <Text style={styles.addButtonText}>Add Images</Text>
            </TouchableOpacity>
            
            {pendingReceipts.length > 0 && !allProcessed && (
              <TouchableOpacity 
                style={[styles.processButton, processing && styles.processingButton]}
                onPress={processAllReceipts}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Upload size={20} color={colors.text} />
                )}
                <Text style={styles.processButtonText}>
                  {processing ? 'Processing...' : 'Process All'}
                </Text>
              </TouchableOpacity>
            )}
            
            {allProcessed && (
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveAllReceipts}
              >
                <Check size={20} color={colors.text} />
                <Text style={styles.saveButtonText}>Save All ({pendingReceipts.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
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
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  receiptsList: {
    paddingBottom: 20,
  },
  receiptItem: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    margin: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  receiptInfo: {
    padding: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  receiptVendor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryLight,
    marginBottom: 2,
  },
  receiptType: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  processingText: {
    fontSize: 12,
    color: colors.primaryLight,
    marginTop: 4,
  },
  pendingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  processedIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  processButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processingButton: {
    opacity: 0.7,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});