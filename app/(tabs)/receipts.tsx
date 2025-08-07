import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, Filter, Receipt as ReceiptIcon, Fuel, Truck, DollarSign, Upload, Plus, TrendingUp } from 'lucide-react-native';

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
        activeFilter === type && { color: colors.background.primary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Receipts',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setUploadOptionsVisible(true)}
            >
              <Plus size={20} color={colors.background.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Monthly Expenses</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(fuelTotal + tollsTotal + maintenanceTotal).toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight + '20' }]}>
                <Fuel size={16} color={colors.primaryLight} />
              </View>
              <Text style={styles.categoryLabel}>Fuel</Text>
            </View>
            <Text style={[styles.categoryValue, { color: colors.primaryLight }]}>
              ${fuelTotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: colors.warning + '20' }]}>
                <ReceiptIcon size={16} color={colors.warning} />
              </View>
              <Text style={styles.categoryLabel}>Tolls</Text>
            </View>
            <Text style={[styles.categoryValue, { color: colors.warning }]}>
              ${tollsTotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Truck size={16} color={colors.secondary} />
              </View>
              <Text style={styles.categoryLabel}>Maintenance</Text>
            </View>
            <Text style={[styles.categoryValue, { color: colors.secondary }]}>
              ${maintenanceTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {renderFilterButton('All', <Filter size={16} color={activeFilter === 'All' ? colors.background.primary : colors.textSecondary} />, 'All')}
        {renderFilterButton('Fuel', <Fuel size={16} color={activeFilter === 'Fuel' ? colors.background.primary : colors.textSecondary} />, 'Fuel')}
        {renderFilterButton('Toll', <ReceiptIcon size={16} color={activeFilter === 'Toll' ? colors.background.primary : colors.textSecondary} />, 'Tolls')}
        {renderFilterButton('Maintenance', <Truck size={16} color={activeFilter === 'Maintenance' ? colors.background.primary : colors.textSecondary} />, 'Maintenance')}
      </ScrollView>
      
      {filteredReceipts.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <ReceiptIcon size={48} color={colors.textSecondary} />
          </View>
          <Text style={styles.emptyStateTitle}>No receipts yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Start tracking your expenses by uploading your first receipt
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setUploadOptionsVisible(true)}
          >
            <Plus size={20} color={colors.background.primary} />
            <Text style={styles.primaryButtonText}>Add Receipt</Text>
          </TouchableOpacity>
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
  addButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  summaryContainer: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
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