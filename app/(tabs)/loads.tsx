import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Search, Filter, DollarSign, TrendingUp, MessageSquare } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useLoadStore } from '@/store/loadStore';
import UpcomingLoadCard from '@/components/UpcomingLoadCard';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import CommandResponseModal from '@/components/CommandResponseModal';
import { useVoiceCommandStore } from '@/store/voiceCommandStore';

export default function LoadsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const { lastCommand, lastResponse } = useVoiceCommandStore();
  const { loads, negotiateRate } = useLoadStore();
  
  const filteredLoads = searchQuery
    ? loads.filter(load => 
        load.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.pickup.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.delivery.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.broker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : loads;
  
  const handleCommandProcessed = () => {
    setCommandModalVisible(true);
  };
  
  const handleNegotiateRate = (id: string) => {
    // In a real app, this would open a negotiation interface
    // For this demo, we'll just increase the rate by a random amount
    const currentLoad = loads.find(load => load.id === id);
    if (currentLoad) {
      const currentRate = parseFloat(currentLoad.rate.replace('$', ''));
      const newRate = (currentRate + 0.15).toFixed(2);
      negotiateRate(id, `$${newRate}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Loads & Dispatch',
        }} 
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search loads..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>$2.38</Text>
          <Text style={styles.statLabel}>Avg Rate/Mile</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>278</Text>
          <Text style={styles.statLabel}>Avg Miles</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>$662</Text>
          <Text style={styles.statLabel}>Avg Load</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Loads</Text>
        </View>
        
        {filteredLoads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No loads found</Text>
          </View>
        ) : (
          filteredLoads.map((load) => (
            <View key={load.id}>
              <UpcomingLoadCard load={load} />
              <View style={styles.loadActions}>
                <TouchableOpacity 
                  style={[styles.loadActionButton, { backgroundColor: colors.primaryLight }]}
                  onPress={() => {}}
                >
                  <MessageSquare size={18} color={colors.text} />
                  <Text style={styles.loadActionText}>Contact</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.loadActionButton, { backgroundColor: colors.secondary }]}
                  onPress={() => handleNegotiateRate(load.id)}
                >
                  <DollarSign size={18} color={colors.text} />
                  <Text style={styles.loadActionText}>Negotiate</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.loadActionButton, { backgroundColor: colors.warning }]}
                  onPress={() => {}}
                >
                  <TrendingUp size={18} color={colors.text} />
                  <Text style={styles.loadActionText}>Counter</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        
        <View style={styles.footer} />
      </ScrollView>
      
      <View style={styles.voiceButtonContainer}>
        <VoiceCommandButton onCommandProcessed={handleCommandProcessed} />
      </View>
      
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
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text,
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundLight,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loadActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: 16,
    gap: 8,
  },
  loadActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  loadActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
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