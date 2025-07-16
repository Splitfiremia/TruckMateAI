import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Filter, Receipt as ReceiptIcon, Fuel, Truck, DollarSign, Upload, MoreHorizontal } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useReceiptStore } from '@/store/receiptStore';
import ReceiptCard from '@/components/ReceiptCard';
import ReceiptScanner from '@/components/ReceiptScanner';
import BulkReceiptUpload from '@/components/BulkReceiptUpload';
import ReceiptUploadOptions from '@/components/ReceiptUploadOptions';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';
import { Receipt, ReceiptType } from '@/types';

export default function ReceiptsScreen() {
  const [activeFilter, setActiveFilter] = useState<ReceiptType | 'All'>('All');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [bulkUploadVisible, setBulkUploadVisible] = useState(false);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [uploadOptionsVisible, setUploadOptionsVisible] = useState(false);
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { receipts, getTotalByCategory } = useReceiptStore();
  
  const filteredReceipts = useMemo(() => {
    if (activeFilter === 'All') {
      return receipts;
    }
    return receipts.filter(receipt => receipt.type === activeFilter);
  }, [receipts, activeFilter]);
  
  const fuelTotal = getTotalByCategory('Fuel');
  const tollsTotal = getTotalByCategory('Tolls');
  const maintenanceTotal = getTotalByCategory('Maintenance');
  
  const handleCommandProcessed = () => {
    setCommandModalVisible(true);
  };
  
  const handleScanComplete = (receipt: Receipt) => {
    // In a real app, we might navigate to a receipt detail screen
    console.log('Receipt scanned:', receipt);
  };
  
  const handleBulkUploadComplete = (receipts: Receipt[]) => {
    console.log('Bulk upload completed:', receipts.length, 'receipts');
  };
  
  const renderFilterButton = (type: ReceiptType | 'All', icon: React.ReactNode, label: string) => (
    <TouchableOpacity 
      style={[
        styles.filterButton,
        activeFilter === type && { backgroundColor: colors.primaryLight }
      ]}
      onPress={() => setActiveFilter(type)}
    >
      {icon}
      <Text style={[
        styles.filterButtonText,
        activeFilter === type && { color: colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Receipts & Expenses',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setUploadOptionsVisible(true)}
              >
                <MoreHorizontal size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Fuel</Text>
          <View style={styles.summaryValueContainer}>
            <DollarSign size={14} color={colors.primaryLight} />
            <Text style={[styles.summaryValue, { color: colors.primaryLight }]}>
              {fuelTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tolls</Text>
          <View style={styles.summaryValueContainer}>
            <DollarSign size={14} color={colors.warning} />
            <Text style={[styles.summaryValue, { color: colors.warning }]}>
              {tollsTotal.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Maintenance</Text>
          <View style={styles.summaryValueContainer}>
            <DollarSign size={14} color={colors.secondary} />
            <Text style={[styles.summaryValue, { color: colors.secondary }]}>
              {maintenanceTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', <Filter size={18} color={activeFilter === 'All' ? colors.text : colors.textSecondary} />, 'All')}
        {renderFilterButton('Fuel', <Fuel size={18} color={activeFilter === 'Fuel' ? colors.text : colors.textSecondary} />, 'Fuel')}
        {renderFilterButton('Toll', <ReceiptIcon size={18} color={activeFilter === 'Toll' ? colors.text : colors.textSecondary} />, 'Tolls')}
        {renderFilterButton('Maintenance', <Truck size={18} color={activeFilter === 'Maintenance' ? colors.text : colors.textSecondary} />, 'Maintenance')}
      </View>
      
      {filteredReceipts.length === 0 ? (
        <View style={styles.emptyState}>
          <ReceiptIcon size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>No receipts found</Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => setUploadOptionsVisible(true)}
            >
              <Upload size={20} color={colors.text} />
              <Text style={styles.uploadButtonText}>Upload Receipts</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredReceipts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReceiptCard receipt={item} />}
          contentContainerStyle={styles.receiptsList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.footer} />}
        />
      )}
      
      <View style={styles.voiceButtonContainer}>
        <VoiceCommandButton onCommandProcessed={handleCommandProcessed} />
      </View>
      
      <ReceiptScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanComplete={handleScanComplete}
      />
      
      <BulkReceiptUpload
        visible={bulkUploadVisible}
        onClose={() => setBulkUploadVisible(false)}
        onUploadComplete={handleBulkUploadComplete}
      />
      
      <ReceiptUploadOptions
        visible={uploadOptionsVisible}
        onClose={() => setUploadOptionsVisible(false)}
        onCameraPress={() => setScannerVisible(true)}
        onGalleryPress={() => setScannerVisible(true)}
        onFilePress={() => setScannerVisible(true)}
        onBulkUploadPress={() => setBulkUploadVisible(true)}
      />
      
      <CommandResponseModal
        visible={commandModalVisible}
        onClose={() => setCommandModalVisible(false)}
        command={lastCommand}
        response={lastResponse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  receiptsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    height: 100, // Space for the floating button
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});