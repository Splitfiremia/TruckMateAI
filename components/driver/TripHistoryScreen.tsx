import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
} from 'react-native';
import {
  Clock,
  MapPin,
  Route,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Pause,
  Eye,
  Navigation,
  Fuel,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore, Trip } from '@/store/driverStore';

type FilterStatus = 'all' | 'completed' | 'cancelled' | 'pending';

export default function TripHistoryScreen() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);
  
  const { tripHistory } = useDriverStore();

  const filteredTrips = tripHistory.filter(trip => {
    if (filterStatus === 'all') return true;
    return trip.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateDuration = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return '--';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      case 'in-progress':
        return colors.primary;
      case 'pending':
        return colors.warning;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusIcon = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'in-progress':
        return Navigation;
      case 'pending':
        return Pause;
      default:
        return Clock;
    }
  };

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  const renderTripItem = ({ item }: { item: Trip }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => handleTripPress(item)}
      >
        <View style={styles.tripHeader}>
          <View style={styles.tripStatus}>
            <StatusIcon color={statusColor} size={16} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          
          {item.startTime && (
            <Text style={styles.tripDate}>
              {formatDate(item.startTime)}
            </Text>
          )}
        </View>

        <View style={styles.tripRoute}>
          <View style={styles.locationRow}>
            <MapPin color={colors.success} size={16} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.startLocation.address}
            </Text>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.locationRow}>
            <MapPin color={colors.danger} size={16} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.destination.address}
            </Text>
          </View>
        </View>

        <View style={styles.tripStats}>
          {item.startTime && (
            <View style={styles.statItem}>
              <Clock color={colors.text.tertiary} size={14} />
              <Text style={styles.statText}>
                {formatTime(item.startTime)}
              </Text>
            </View>
          )}
          
          {item.distance && (
            <View style={styles.statItem}>
              <Route color={colors.text.tertiary} size={14} />
              <Text style={styles.statText}>
                {item.distance} mi
              </Text>
            </View>
          )}
          
          <View style={styles.statItem}>
            <Eye color={colors.primary} size={14} />
            <Text style={[styles.statText, { color: colors.primary }]}>
              View Details
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <Text style={styles.modalTitle}>Filter Trips</Text>
          
          {[
            { id: 'all', label: 'All Trips' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'pending', label: 'Pending' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterOption,
                filterStatus === filter.id && styles.filterOptionSelected
              ]}
              onPress={() => {
                setFilterStatus(filter.id as FilterStatus);
                setShowFilterModal(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                filterStatus === filter.id && styles.filterOptionTextSelected
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderTripDetailsModal = () => (
    <Modal
      visible={showTripDetails}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTripDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailsModal}>
          {selectedTrip && (
            <>
              <View style={styles.detailsHeader}>
                <Text style={styles.detailsTitle}>Trip Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTripDetails(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailsContent}>
                {/* Status */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.detailStatus}>
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedTrip.status);
                      const statusColor = getStatusColor(selectedTrip.status);
                      return (
                        <>
                          <StatusIcon color={statusColor} size={16} />
                          <Text style={[styles.detailValue, { color: statusColor }]}>
                            {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                          </Text>
                        </>
                      );
                    })()}
                  </View>
                </View>

                {/* Route */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Route</Text>
                  <View style={styles.routeDetails}>
                    <View style={styles.routePoint}>
                      <MapPin color={colors.success} size={16} />
                      <Text style={styles.routePointText}>
                        {selectedTrip.startLocation.address}
                      </Text>
                    </View>
                    <View style={styles.routeArrow} />
                    <View style={styles.routePoint}>
                      <MapPin color={colors.danger} size={16} />
                      <Text style={styles.routePointText}>
                        {selectedTrip.destination.address}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Times */}
                {selectedTrip.startTime && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start Time</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedTrip.startTime)} at {formatTime(selectedTrip.startTime)}
                    </Text>
                  </View>
                )}

                {selectedTrip.endTime && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Time</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedTrip.endTime)} at {formatTime(selectedTrip.endTime)}
                    </Text>
                  </View>
                )}

                {/* Duration */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {calculateDuration(selectedTrip.startTime, selectedTrip.endTime)}
                  </Text>
                </View>

                {/* Distance */}
                {selectedTrip.distance && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Distance</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.distance} miles
                    </Text>
                  </View>
                )}

                {/* Stops */}
                {selectedTrip.stops && selectedTrip.stops.length > 0 && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Stops</Text>
                    <View style={styles.stopsContainer}>
                      {selectedTrip.stops.map((stop, index) => (
                        <View key={stop.id} style={styles.stopItem}>
                          <View style={[
                            styles.stopIndicator,
                            { backgroundColor: stop.completed ? colors.success : colors.text.tertiary }
                          ]} />
                          <Text style={styles.stopText}>
                            {stop.address}
                          </Text>
                          {stop.completed && stop.completedAt && (
                            <Text style={styles.stopTime}>
                              {formatTime(stop.completedAt)}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Route color={colors.text.tertiary} size={64} />
      <Text style={styles.emptyStateTitle}>No Trips Found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {filterStatus === 'all' 
          ? 'Your trip history will appear here'
          : `No ${filterStatus} trips found`
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Calendar color={colors.primary} size={24} />
          <Text style={styles.headerTitle}>Trip History</Text>
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter color={colors.primary} size={20} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tripHistory.length}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {tripHistory.filter(t => t.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {tripHistory.reduce((total, trip) => total + (trip.distance || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Total Miles</Text>
        </View>
      </View>

      {/* Trip List */}
      <FlatList
        data={filteredTrips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        style={styles.tripList}
        contentContainerStyle={styles.tripListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {renderFilterModal()}
      {renderTripDetailsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  tripList: {
    flex: 1,
  },
  tripListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripDate: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  tripRoute: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 8,
    marginVertical: 4,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
  filterOptionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  detailsModal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
  detailsContent: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  detailStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDetails: {
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routePointText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  routeArrow: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 8,
  },
  stopsContainer: {
    gap: 12,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  stopTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 8,
    textAlign: 'center',
  },
});