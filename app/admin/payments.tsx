import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react-native';
import { useAdminStore } from '@/store/adminStore';

export default function PaymentSystem() {
  const { payments, users, fetchPayments } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled' | 'past_due'>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const user = users.find(u => u.uid === payment.user_id);
    const matchesSearch = user ? 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.subscription_id.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments.reduce((sum, payment) => 
    payment.status === 'active' ? sum + payment.amount : sum, 0
  );
  const activeSubscriptions = payments.filter(p => p.status === 'active').length;
  const pastDueSubscriptions = payments.filter(p => p.status === 'past_due').length;
  const churnRate = payments.filter(p => p.status === 'cancelled').length / payments.length * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="#10B981" />;
      case 'cancelled':
        return <XCircle size={16} color="#E5252C" />;
      case 'past_due':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return <AlertCircle size={16} color="#666666" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'cancelled':
        return '#E5252C';
      case 'past_due':
        return '#F59E0B';
      default:
        return '#666666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Payment Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <DollarSign size={24} color="#117ACA" />
          <Text style={styles.metricValue}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Monthly Revenue</Text>
        </View>
        <View style={styles.metricCard}>
          <CheckCircle size={24} color="#10B981" />
          <Text style={styles.metricValue}>{activeSubscriptions}</Text>
          <Text style={styles.metricLabel}>Active Subscriptions</Text>
        </View>
        <View style={styles.metricCard}>
          <AlertCircle size={24} color="#F59E0B" />
          <Text style={styles.metricValue}>{pastDueSubscriptions}</Text>
          <Text style={styles.metricLabel}>Past Due</Text>
        </View>
        <View style={styles.metricCard}>
          <TrendingUp size={24} color="#E5252C" />
          <Text style={styles.metricValue}>{churnRate.toFixed(1)}%</Text>
          <Text style={styles.metricLabel}>Churn Rate</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search payments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'active', 'cancelled', 'past_due'].map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive
              ]}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue Trend (Last 30 Days)</Text>
        <View style={styles.revenueChart}>
          {Array.from({ length: 30 }, (_, i) => {
            const height = Math.random() * 60 + 20;
            const isToday = i === 29;
            return (
              <View
                key={i}
                style={[
                  styles.revenueBar,
                  {
                    height,
                    backgroundColor: isToday ? '#117ACA' : '#93C5FD',
                    opacity: isToday ? 1 : 0.7,
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>30 days ago</Text>
          <Text style={styles.chartLabel}>Today</Text>
        </View>
      </View>

      {/* Payment List */}
      <View style={styles.paymentsContainer}>
        <Text style={styles.sectionTitle}>Payment Subscriptions</Text>
        
        {filteredPayments.map((payment) => {
          const user = users.find(u => u.uid === payment.user_id);
          if (!user) return null;
          
          return (
            <View key={payment.subscription_id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentUser}>{user.name}</Text>
                  <Text style={styles.paymentEmail}>{user.email}</Text>
                  <Text style={styles.paymentId}>ID: {payment.subscription_id}</Text>
                </View>
                
                <View style={styles.paymentStatus}>
                  <View style={styles.statusRow}>
                    {getStatusIcon(payment.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                      {payment.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.paymentAmount}>${payment.amount.toFixed(2)}/mo</Text>
                </View>
              </View>
              
              <View style={styles.paymentDetails}>
                <View style={styles.paymentMeta}>
                  <Text style={styles.paymentPlan}>{payment.plan}</Text>
                  <Text style={styles.paymentBilling}>
                    Next billing: {payment.next_billing}
                  </Text>
                </View>
                
                <View style={styles.paymentActions}>
                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </Pressable>
                  {payment.status === 'past_due' && (
                    <Pressable style={[styles.actionButton, styles.retryButton]}>
                      <Text style={[styles.actionButtonText, styles.retryButtonText]}>Retry Payment</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Stripe Integration Status */}
      <View style={styles.integrationContainer}>
        <Text style={styles.sectionTitle}>Payment Integration</Text>
        
        <View style={styles.integrationCard}>
          <View style={styles.integrationHeader}>
            <CreditCard size={24} color="#635BFF" />
            <Text style={styles.integrationName}>Stripe</Text>
            <View style={styles.integrationStatus}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.integrationStatusText}>Connected</Text>
            </View>
          </View>
          
          <View style={styles.integrationMetrics}>
            <View style={styles.integrationMetric}>
              <Text style={styles.integrationMetricValue}>99.9%</Text>
              <Text style={styles.integrationMetricLabel}>Uptime</Text>
            </View>
            <View style={styles.integrationMetric}>
              <Text style={styles.integrationMetricValue}>2.9%</Text>
              <Text style={styles.integrationMetricLabel}>Processing Fee</Text>
            </View>
            <View style={styles.integrationMetric}>
              <Text style={styles.integrationMetricValue}>1.2s</Text>
              <Text style={styles.integrationMetricLabel}>Avg Response</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.webhookStatus}>
          <Text style={styles.webhookTitle}>Webhook Events</Text>
          <View style={styles.webhookEvent}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.webhookEventText}>invoice.paid - Active</Text>
          </View>
          <View style={styles.webhookEvent}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.webhookEventText}>payment_failed - Active</Text>
          </View>
          <View style={styles.webhookEvent}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.webhookEventText}>customer.subscription.updated - Active</Text>
          </View>
        </View>
      </View>

      {/* Payment Analytics */}
      <View style={styles.analyticsContainer}>
        <Text style={styles.sectionTitle}>Payment Analytics</Text>
        
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>$2,370</Text>
            <Text style={styles.analyticsLabel}>Avg Monthly Revenue</Text>
            <Text style={styles.analyticsChange}>+12.5% vs last month</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>$15.00</Text>
            <Text style={styles.analyticsLabel}>Avg Revenue Per User</Text>
            <Text style={styles.analyticsChange}>+0% vs last month</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>94.2%</Text>
            <Text style={styles.analyticsLabel}>Payment Success Rate</Text>
            <Text style={styles.analyticsChange}>+1.8% vs last month</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsValue}>3.2 days</Text>
            <Text style={styles.analyticsLabel}>Avg Collection Time</Text>
            <Text style={styles.analyticsChange}>-0.5 days vs last month</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F7F7F7',
  },
  filterButtonActive: {
    backgroundColor: '#117ACA',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  revenueChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 8,
  },
  revenueBar: {
    flex: 1,
    marginHorizontal: 0.5,
    borderRadius: 1,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 10,
    color: '#666666',
  },
  paymentsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  paymentEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  paymentId: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'monospace',
  },
  paymentStatus: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paymentMeta: {
    flex: 1,
  },
  paymentPlan: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  paymentBilling: {
    fontSize: 12,
    color: '#666666',
  },
  paymentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F7F7F7',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  retryButtonText: {
    color: '#FFFFFF',
  },
  integrationContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  integrationCard: {
    marginBottom: 16,
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  integrationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  integrationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationStatusText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  integrationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  integrationMetric: {
    alignItems: 'center',
  },
  integrationMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#117ACA',
  },
  integrationMetricLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  webhookStatus: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  webhookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  webhookEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  webhookEventText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  analyticsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  analyticsCard: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    marginHorizontal: '1%',
    backgroundColor: '#F7F7F7',
    borderRadius: 6,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#117ACA',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 4,
  },
  analyticsChange: {
    fontSize: 10,
    color: '#10B981',
  },
});