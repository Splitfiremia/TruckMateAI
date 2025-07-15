import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { HazmatInfo, HazmatPlacard } from '@/types';
import { hazmatPlacards, commonHazmatMaterials, segregationTable } from '@/constants/hazmatData';
import { Search, AlertTriangle, Info, Phone, Shield, Truck } from 'lucide-react-native';

interface HazmatPlacardGuideProps {
  visible: boolean;
  onClose: () => void;
  hazmatInfo?: HazmatInfo;
  onUpdateHazmat?: (hazmatInfo: HazmatInfo) => void;
}

export const HazmatPlacardGuide: React.FC<HazmatPlacardGuideProps> = ({
  visible,
  onClose,
  hazmatInfo,
  onUpdateHazmat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlacard, setSelectedPlacard] = useState<HazmatPlacard | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'current' | 'guide'>('search');

  const filteredPlacards = hazmatPlacards.filter(
    (placard) =>
      placard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placard.class.includes(searchQuery) ||
      placard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlacardSelect = (placard: HazmatPlacard) => {
    if (onUpdateHazmat && hazmatInfo) {
      const updatedPlacards = hazmatInfo.placards.some(p => p.id === placard.id)
        ? hazmatInfo.placards.filter(p => p.id !== placard.id)
        : [...hazmatInfo.placards, placard];

      onUpdateHazmat({
        ...hazmatInfo,
        placards: updatedPlacards,
      });
    }
  };

  const renderPlacardCard = (placard: HazmatPlacard, isSelected: boolean = false) => (
    <TouchableOpacity
      key={placard.id}
      style={[styles.placardCard, isSelected && styles.selectedPlacardCard]}
      onPress={() => setSelectedPlacard(placard)}
      onLongPress={() => handlePlacardSelect(placard)}
    >
      <View style={styles.placardHeader}>
        <Image source={{ uri: placard.imageUrl }} style={styles.placardImage} />
        <View style={styles.placardInfo}>
          <Text style={styles.placardName}>{placard.name}</Text>
          <Text style={styles.placardClass}>Class {placard.class}{placard.division ? `.${placard.division}` : ''}</Text>
          <Text style={styles.placardColor}>{placard.color}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Shield size={16} color={colors.primary} />
          </View>
        )}
      </View>
      <Text style={styles.placardDescription}>{placard.description}</Text>
      {placard.segregationTable && (
        <Text style={styles.segregationInfo}>Segregation: {placard.segregationTable}</Text>
      )}
    </TouchableOpacity>
  );

  const renderSearchTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by class, name, or description..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.placardList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Hazmat Placards</Text>
        {filteredPlacards.map((placard) => {
          const isSelected = hazmatInfo?.placards.some(p => p.id === placard.id) || false;
          return renderPlacardCard(placard, isSelected);
        })}
      </ScrollView>
    </View>
  );

  const renderCurrentTab = () => (
    <View style={styles.tabContent}>
      {hazmatInfo?.isHazmat ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.currentHazmatHeader}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={styles.currentHazmatTitle}>Current Hazmat Load</Text>
          </View>

          {hazmatInfo.unNumber && (
            <View style={styles.hazmatDetailCard}>
              <Text style={styles.hazmatDetailLabel}>UN Number</Text>
              <Text style={styles.hazmatDetailValue}>{hazmatInfo.unNumber}</Text>
            </View>
          )}

          {hazmatInfo.properShippingName && (
            <View style={styles.hazmatDetailCard}>
              <Text style={styles.hazmatDetailLabel}>Proper Shipping Name</Text>
              <Text style={styles.hazmatDetailValue}>{hazmatInfo.properShippingName}</Text>
            </View>
          )}

          <View style={styles.hazmatDetailCard}>
            <Text style={styles.hazmatDetailLabel}>Hazard Class</Text>
            <Text style={styles.hazmatDetailValue}>{hazmatInfo.hazardClass}</Text>
          </View>

          {hazmatInfo.packingGroup && (
            <View style={styles.hazmatDetailCard}>
              <Text style={styles.hazmatDetailLabel}>Packing Group</Text>
              <Text style={styles.hazmatDetailValue}>{hazmatInfo.packingGroup}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Required Placards</Text>
          {hazmatInfo.placards.map((placard) => renderPlacardCard(placard))}

          {hazmatInfo.emergencyContact && (
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <Phone size={20} color={colors.error} />
                <Text style={styles.emergencyTitle}>Emergency Contact</Text>
              </View>
              <Text style={styles.emergencyContact}>{hazmatInfo.emergencyContact}</Text>
            </View>
          )}

          {hazmatInfo.specialInstructions && hazmatInfo.specialInstructions.length > 0 && (
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>Special Instructions</Text>
              {hazmatInfo.specialInstructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionItem}>• {instruction}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.noHazmatContainer}>
          <Truck size={48} color={colors.textSecondary} />
          <Text style={styles.noHazmatTitle}>No Hazmat Load</Text>
          <Text style={styles.noHazmatDescription}>
            This load does not contain hazardous materials
          </Text>
        </View>
      )}
    </View>
  );

  const renderGuideTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Hazmat Transportation Guide</Text>
      
      <View style={styles.guideCard}>
        <Text style={styles.guideCardTitle}>Placard Requirements</Text>
        <Text style={styles.guideCardText}>
          • Placards must be displayed on all four sides of the transport vehicle
        </Text>
        <Text style={styles.guideCardText}>
          • Use the correct placard for each hazard class
        </Text>
        <Text style={styles.guideCardText}>
          • Ensure placards are clean, undamaged, and securely attached
        </Text>
      </View>

      <View style={styles.guideCard}>
        <Text style={styles.guideCardTitle}>Documentation Required</Text>
        <Text style={styles.guideCardText}>
          • Shipping papers with proper shipping name and UN number
        </Text>
        <Text style={styles.guideCardText}>
          • Emergency response information
        </Text>
        <Text style={styles.guideCardText}>
          • Driver training certificates
        </Text>
      </View>

      <View style={styles.guideCard}>
        <Text style={styles.guideCardTitle}>Segregation Rules</Text>
        {Object.entries(segregationTable).map(([table, info]) => (
          <View key={table} style={styles.segregationRule}>
            <Text style={styles.segregationTableName}>{table}</Text>
            <Text style={styles.segregationDescription}>{info.description}</Text>
            {info.restrictions.map((restriction, index) => (
              <Text key={index} style={styles.segregationRestriction}>• {restriction}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.guideCard}>
        <Text style={styles.guideCardTitle}>Emergency Procedures</Text>
        <Text style={styles.guideCardText}>
          • Keep emergency response guide accessible
        </Text>
        <Text style={styles.guideCardText}>
          • Know the location of emergency equipment
        </Text>
        <Text style={styles.guideCardText}>
          • Report incidents immediately to authorities
        </Text>
        <Text style={styles.guideCardText}>
          • Contact emergency response number: 1-800-424-9300
        </Text>
      </View>
    </ScrollView>
  );

  const renderPlacardDetail = () => {
    if (!selectedPlacard) return null;

    return (
      <Modal
        visible={!!selectedPlacard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPlacard(null)}
      >
        <View style={styles.detailModal}>
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPlacard(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailContent}>
            <Image source={{ uri: selectedPlacard.imageUrl }} style={styles.detailImage} />
            
            <Text style={styles.detailTitle}>{selectedPlacard.name}</Text>
            <Text style={styles.detailClass}>
              Class {selectedPlacard.class}{selectedPlacard.division ? `.${selectedPlacard.division}` : ''}
            </Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Description</Text>
              <Text style={styles.detailSectionText}>{selectedPlacard.description}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Visual Characteristics</Text>
              <Text style={styles.detailSectionText}>Color: {selectedPlacard.color}</Text>
              <Text style={styles.detailSectionText}>Symbol: {selectedPlacard.symbol}</Text>
            </View>

            {selectedPlacard.compatibilityGroup && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Compatibility Group</Text>
                <Text style={styles.detailSectionText}>{selectedPlacard.compatibilityGroup}</Text>
              </View>
            )}

            {selectedPlacard.segregationTable && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Segregation Requirements</Text>
                <Text style={styles.detailSectionText}>{selectedPlacard.segregationTable}</Text>
                <Text style={styles.detailSectionText}>
                  {segregationTable[selectedPlacard.segregationTable as keyof typeof segregationTable]?.description}
                </Text>
              </View>
            )}

            {onUpdateHazmat && hazmatInfo && (
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  hazmatInfo.placards.some(p => p.id === selectedPlacard.id) && styles.selectedButton
                ]}
                onPress={() => handlePlacardSelect(selectedPlacard)}
              >
                <Text style={[
                  styles.selectButtonText,
                  hazmatInfo.placards.some(p => p.id === selectedPlacard.id) && styles.selectedButtonText
                ]}>
                  {hazmatInfo.placards.some(p => p.id === selectedPlacard.id) ? 'Remove from Load' : 'Add to Load'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hazmat Placard Guide</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
            onPress={() => setActiveTab('search')}
          >
            <Search size={20} color={activeTab === 'search' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'current' && styles.activeTab]}
            onPress={() => setActiveTab('current')}
          >
            <AlertTriangle size={20} color={activeTab === 'current' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
              Current Load
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'guide' && styles.activeTab]}
            onPress={() => setActiveTab('guide')}
          >
            <Info size={20} color={activeTab === 'guide' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'guide' && styles.activeTabText]}>
              Guide
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'search' && renderSearchTab()}
        {activeTab === 'current' && renderCurrentTab()}
        {activeTab === 'guide' && renderGuideTab()}

        {renderPlacardDetail()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  placardList: {
    flex: 1,
  },
  placardCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPlacardCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  placardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placardImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  placardInfo: {
    flex: 1,
  },
  placardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  placardClass: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  placardColor: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  segregationInfo: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  currentHazmatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  currentHazmatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  hazmatDetailCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  hazmatDetailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  hazmatDetailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  emergencyCard: {
    backgroundColor: colors.error + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  emergencyContact: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
  },
  instructionsCard: {
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  noHazmatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  noHazmatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  noHazmatDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  guideCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  guideCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  guideCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  segregationRule: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  segregationTableName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  segregationDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  segregationRestriction: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  detailClass: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  detailSectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  selectButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  selectedButton: {
    backgroundColor: colors.error,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: 'white',
  },
});