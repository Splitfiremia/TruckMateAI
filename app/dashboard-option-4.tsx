import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Zap, Target, Award, TrendingUp, Users, Star, ArrowLeft, Trophy, Medal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardOption4() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Dashboard Option 4 - Performance Pro',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Performance Hero */}
        <LinearGradient
          colors={['#7c3aed', '#a855f7', '#c084fc']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <Trophy size={32} color="white" />
            </View>
            <Text style={styles.heroTitle}>Fleet Performance</Text>
            <Text style={styles.heroSubtitle}>Driving Excellence Forward</Text>
            
            <View style={styles.heroMetrics}>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricNumber}>98.2%</Text>
                <Text style={styles.heroMetricLabel}>Efficiency</Text>
              </View>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricNumber}>4.8</Text>
                <Text style={styles.heroMetricLabel}>Rating</Text>
              </View>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricNumber}>24</Text>
                <Text style={styles.heroMetricLabel}>Awards</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        {/* KPI Cards */}
        <View style={styles.kpiSection}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: '#dbeafe' }]}>
                  <Target size={20} color="#3b82f6" />
                </View>
                <Text style={styles.kpiTrend}>+12%</Text>
              </View>
              <Text style={styles.kpiValue}>94.2%</Text>
              <Text style={styles.kpiLabel}>On-Time Delivery</Text>
            </View>
            
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: '#dcfce7' }]}>
                  <Zap size={20} color="#10b981" />
                </View>
                <Text style={styles.kpiTrend}>+8%</Text>
              </View>
              <Text style={styles.kpiValue}>7.2</Text>
              <Text style={styles.kpiLabel}>MPG Average</Text>
            </View>
            
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: '#fef3c7' }]}>
                  <Award size={20} color="#f59e0b" />
                </View>
                <Text style={styles.kpiTrend}>+15%</Text>
              </View>
              <Text style={styles.kpiValue}>$2,847</Text>
              <Text style={styles.kpiLabel}>Cost Savings</Text>
            </View>
            
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: '#fce7f3' }]}>
                  <TrendingUp size={20} color="#ec4899" />
                </View>
                <Text style={styles.kpiTrend}>+22%</Text>
              </View>
              <Text style={styles.kpiValue}>89%</Text>
              <Text style={styles.kpiLabel}>Customer Satisfaction</Text>
            </View>
          </View>
        </View>
        
        {/* Top Performers */}
        <View style={styles.performersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.leaderboard}>
            <View style={styles.performerCard}>
              <View style={styles.rankBadge}>
                <Medal size={16} color="#ffd700" />
                <Text style={styles.rankNumber}>1</Text>
              </View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>Sarah Johnson</Text>
                <Text style={styles.performerMetric}>98.5% Efficiency • 0 Incidents</Text>
              </View>
              <View style={styles.performerScore}>
                <Text style={styles.scoreValue}>985</Text>
                <Text style={styles.scoreLabel}>pts</Text>
              </View>
            </View>
            
            <View style={styles.performerCard}>
              <View style={styles.rankBadge}>
                <Medal size={16} color="#c0c0c0" />
                <Text style={styles.rankNumber}>2</Text>
              </View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>Mike Rodriguez</Text>
                <Text style={styles.performerMetric}>96.8% Efficiency • 1 Incident</Text>
              </View>
              <View style={styles.performerScore}>
                <Text style={styles.scoreValue}>968</Text>
                <Text style={styles.scoreLabel}>pts</Text>
              </View>
            </View>
            
            <View style={styles.performerCard}>
              <View style={styles.rankBadge}>
                <Medal size={16} color="#cd7f32" />
                <Text style={styles.rankNumber}>3</Text>
              </View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>David Chen</Text>
                <Text style={styles.performerMetric}>95.2% Efficiency • 0 Incidents</Text>
              </View>
              <View style={styles.performerScore}>
                <Text style={styles.scoreValue}>952</Text>
                <Text style={styles.scoreLabel}>pts</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Achievement Badges */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          
          <View style={styles.badgeGrid}>
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: '#ffd700' }]}>
                <Star size={24} color="white" />
              </View>
              <Text style={styles.badgeTitle}>Safety Champion</Text>
              <Text style={styles.badgeDescription}>30 days accident-free</Text>
            </View>
            
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: '#10b981' }]}>
                <Zap size={24} color="white" />
              </View>
              <Text style={styles.badgeTitle}>Fuel Efficiency</Text>
              <Text style={styles.badgeDescription}>Best MPG this month</Text>
            </View>
            
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: '#3b82f6' }]}>
                <Target size={24} color="white" />
              </View>
              <Text style={styles.badgeTitle}>On-Time Master</Text>
              <Text style={styles.badgeDescription}>100% delivery rate</Text>
            </View>
            
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: '#8b5cf6' }]}>
                <Users size={24} color="white" />
              </View>
              <Text style={styles.badgeTitle}>Team Player</Text>
              <Text style={styles.badgeDescription}>Highest collaboration</Text>
            </View>
          </View>
        </View>
        
        {/* Performance Trends */}
        <View style={styles.trendsSection}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          
          <View style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendTitle}>Weekly Progress</Text>
              <View style={styles.trendIndicator}>
                <TrendingUp size={16} color="#10b981" />
                <Text style={styles.trendValue}>+5.2%</Text>
              </View>
            </View>
            
            <View style={styles.trendChart}>
              <View style={styles.chartArea}>
                <View style={[styles.trendBar, { height: 30, backgroundColor: '#e5e7eb' }]} />
                <View style={[styles.trendBar, { height: 45, backgroundColor: '#d1d5db' }]} />
                <View style={[styles.trendBar, { height: 60, backgroundColor: '#9ca3af' }]} />
                <View style={[styles.trendBar, { height: 75, backgroundColor: '#6b7280' }]} />
                <View style={[styles.trendBar, { height: 90, backgroundColor: '#374151' }]} />
                <View style={[styles.trendBar, { height: 85, backgroundColor: '#10b981' }]} />
                <View style={[styles.trendBar, { height: 95, backgroundColor: '#059669' }]} />
              </View>
            </View>
            
            <View style={styles.trendMetrics}>
              <View style={styles.trendMetric}>
                <Text style={styles.metricLabel}>Best Day</Text>
                <Text style={styles.metricValue}>Friday</Text>
              </View>
              <View style={styles.trendMetric}>
                <Text style={styles.metricLabel}>Avg Score</Text>
                <Text style={styles.metricValue}>92.4</Text>
              </View>
              <View style={styles.trendMetric}>
                <Text style={styles.metricLabel}>Improvement</Text>
                <Text style={styles.metricValue}>+5.2%</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 32,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  heroMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  heroMetric: {
    alignItems: 'center',
  },
  heroMetricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  heroMetricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  kpiSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: (width - 48) / 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTrend: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  performersSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  leaderboard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 4,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  performerMetric: {
    fontSize: 12,
    color: '#6b7280',
  },
  performerScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 48) / 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  trendsSection: {
    marginBottom: 24,
  },
  trendCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    marginLeft: 4,
  },
  trendChart: {
    marginBottom: 20,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  trendBar: {
    width: 24,
    borderRadius: 4,
  },
  trendMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  footer: {
    height: 20,
  },
});