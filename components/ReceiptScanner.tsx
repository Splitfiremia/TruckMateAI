import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { Camera, X, Check, Receipt as ReceiptIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useReceiptStore } from '@/store/receiptStore';
import { Receipt, ReceiptType } from '@/types';

interface ReceiptScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanComplete?: (receipt: Receipt) => void;
}

export default function ReceiptScanner({ visible, onClose, onScanComplete }: ReceiptScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [mockReceipt, setMockReceipt] = useState<Receipt | null>(null);
  const { addReceipt } = useReceiptStore();
  
  const handleScan = () => {
    setScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const mockReceiptData: Receipt = {
        id: `R-${Math.floor(Math.random() * 100000)}`,
        type: "Fuel" as ReceiptType,
        vendor: "Love's Travel Stop",
        location: "Atlanta, GA",
        date: new Date().toISOString().split('T')[0],
        amount: 187.45,
        gallons: 56.8,
        pricePerGallon: 3.29,
        state: "GA",
        category: "Fuel",
        imageUrl: "https://images.unsplash.com/photo-1622644989151-33a3ced5ec8a?q=80&w=1000",
      };
      
      setMockReceipt(mockReceiptData);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };
  
  const handleSave = () => {
    if (mockReceipt) {
      addReceipt(mockReceipt);
      
      if (onScanComplete) {
        onScanComplete(mockReceipt);
      }
      
      resetAndClose();
    }
  };
  
  const resetAndClose = () => {
    setScanning(false);
    setScanned(false);
    setMockReceipt(null);
    onClose();
  };
  
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
            <Text style={styles.title}>Receipt Scanner</Text>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {!scanning && !scanned && (
              <View style={styles.instructionsContainer}>
                <ReceiptIcon size={48} color={colors.primaryLight} />
                <Text style={styles.instructions}>
                  Position receipt within frame and ensure good lighting for best results
                </Text>
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleScan}
                >
                  <Camera size={20} color={colors.text} />
                  <Text style={styles.scanButtonText}>Scan Receipt</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {scanning && (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color={colors.primaryLight} />
                <Text style={styles.scanningText}>Scanning receipt...</Text>
                <Text style={styles.scanningSubtext}>Extracting data with AI</Text>
              </View>
            )}
            
            {scanned && mockReceipt && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Receipt Scanned Successfully</Text>
                
                <View style={styles.receiptPreview}>
                  <Image 
                    source={{ uri: mockReceipt.imageUrl }} 
                    style={styles.receiptImage}
                    resizeMode="cover"
                  />
                  
                  <View style={styles.receiptDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Vendor:</Text>
                      <Text style={styles.detailValue}>{mockReceipt.vendor}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Amount:</Text>
                      <Text style={styles.detailValue}>${mockReceipt.amount.toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>{mockReceipt.date}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{mockReceipt.type}</Text>
                    </View>
                    
                    {mockReceipt.gallons && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Gallons:</Text>
                        <Text style={styles.detailValue}>{mockReceipt.gallons.toFixed(1)}</Text>
                      </View>
                    )}
                    
                    {mockReceipt.pricePerGallon && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price/Gal:</Text>
                        <Text style={styles.detailValue}>${mockReceipt.pricePerGallon.toFixed(2)}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Check size={20} color={colors.text} />
                  <Text style={styles.saveButtonText}>Save Receipt</Text>
                </TouchableOpacity>
              </View>
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
    height: '80%',
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
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructions: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  scanningSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  receiptPreview: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  receiptImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.backgroundLight,
  },
  receiptDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
});