import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  Check, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  ChevronDown,
  ChevronUp,
  Calculator,
  Award,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { pricingPlans, testimonials, competitorComparison } from '@/constants/pricingData';
import { usePricingStore } from '@/store/pricingStore';
import { PricingTier, UserType, BillingCycle } from '@/types/pricing';

const { width } = Dimensions.get('window');

export default function PricingScreen() {
  const {
    calculation,
    updateCalculation,
    savingsCalculation,
    calculateSavings,
    trackEvent,
  } = usePricingStore();

  const [showComparison, setShowComparison] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    trackEvent('pricing_page_view');
    calculateSavings({});
  }, []);

  const handlePlanSelect = (tier: PricingTier) => {
    updateCalculation({ selectedTier: tier });
    trackEvent('calculator_used');
  };

  const handleUserTypeToggle = (userType: UserType) => {
    updateCalculation({ userType, vehicleCount: userType === 'owner-operator' ? 1 : 5 });
  };

  const handleVehicleCountChange = (count: number) => {
    updateCalculation({ vehicleCount: Math.max(1, Math.min(100, count)) });
  };

  const handleBillingCycleToggle = (cycle: BillingCycle) => {
    updateCalculation({ billingCycle: cycle });
  };

  const renderPricingCard = (plan: typeof pricingPlans[0]) => {
    const isSelected = calculation.selectedTier === plan.id;
    const price = calculation.userType === 'owner-operator'
      ? plan.basePrice.ownerOperator[calculation.billingCycle]
      : plan.basePrice.fleet[calculation.billingCycle] * calculation.vehicleCount;

    const monthlyPrice = calculation.billingCycle === 'annual' ? price / 12 : price;

    return (
      <Pressable
        key={plan.id}
        style={[
          styles.pricingCard,
          isSelected && styles.selectedCard,
          plan.popular && styles.popularCard,
        ]}
        onPress={() => handlePlanSelect(plan.id)}
      >
        {plan.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}
        
        <View style={styles.cardHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${Math.round(monthlyPrice)}
              <Text style={styles.priceUnit}>/mo</Text>
            </Text>
            {calculation.billingCycle === 'annual' && (
              <Text style={styles.annualSavings}>
                Save ${Math.round((price / 10) - price)} annually
              </Text>
            )}
          </View>
        </View>

        <View style={styles.featuresList}>
          {plan.features.slice(0, 6).map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <Check color={colors.status.success} size={16} />
              <Text style={styles.featureText}>{feature.name}</Text>
            </View>
          ))}
          
          {plan.features.length > 6 && (
            <Text style={styles.moreFeatures}>
              +{plan.features.length - 6} more features
            </Text>
          )}
        </View>

        <View style={styles.limitsContainer}>
          <Text style={styles.limitsTitle}>Plan Limits:</Text>
          <Text style={styles.limitsText}>
            {typeof plan.limits.vehicles === 'number' 
              ? `${plan.limits.vehicles} vehicle${plan.limits.vehicles > 1 ? 's' : ''}`
              : 'Unlimited vehicles'
            }
          </Text>
          <Text style={styles.limitsText}>
            {typeof plan.limits.apiCalls === 'number'
              ? `${plan.limits.apiCalls.toLocaleString()} API calls/month`
              : 'Unlimited API calls'
            }
          </Text>
        </View>

        <Pressable 
          style={[styles.selectButton, isSelected && styles.selectedButton]}
          onPress={() => handlePlanSelect(plan.id)}
        >
          <Text style={[styles.selectButtonText, isSelected && styles.selectedButtonText]}>
            {isSelected ? 'Selected' : 'Select Plan'}
          </Text>
        </Pressable>
      </Pressable>
    );
  };

  const renderCalculator = () => (
    <View style={styles.calculatorContainer}>
      <View style={styles.calculatorHeader}>
        <Calculator color={colors.primary} size={24} />
        <Text style={styles.calculatorTitle}>Pricing Calculator</Text>
      </View>

      {/* User Type Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>I am a:</Text>
        <View style={styles.toggleButtons}>
          <Pressable
            style={[
              styles.toggleButton,
              calculation.userType === 'owner-operator' && styles.activeToggle,
            ]}
            onPress={() => handleUserTypeToggle('owner-operator')}
          >
            <Text style={[
              styles.toggleButtonText,
              calculation.userType === 'owner-operator' && styles.activeToggleText,
            ]}>
              Owner-Operator
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              calculation.userType === 'fleet' && styles.activeToggle,
            ]}
            onPress={() => handleUserTypeToggle('fleet')}
          >
            <Text style={[
              styles.toggleButtonText,
              calculation.userType === 'fleet' && styles.activeToggleText,
            ]}>
              Fleet Manager
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Vehicle Count Slider */}
      {calculation.userType === 'fleet' && (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Number of vehicles: {calculation.vehicleCount}
          </Text>
          <View style={styles.sliderButtons}>
            <Pressable
              style={styles.sliderButton}
              onPress={() => handleVehicleCountChange(calculation.vehicleCount - 1)}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </Pressable>
            <Text style={styles.vehicleCount}>{calculation.vehicleCount}</Text>
            <Pressable
              style={styles.sliderButton}
              onPress={() => handleVehicleCountChange(calculation.vehicleCount + 1)}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Billing Cycle Toggle */}
      <View style={styles.billingToggle}>
        <Text style={styles.toggleLabel}>Billing:</Text>
        <View style={styles.toggleButtons}>
          <Pressable
            style={[
              styles.toggleButton,
              calculation.billingCycle === 'monthly' && styles.activeToggle,
            ]}
            onPress={() => handleBillingCycleToggle('monthly')}
          >
            <Text style={[
              styles.toggleButtonText,
              calculation.billingCycle === 'monthly' && styles.activeToggleText,
            ]}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              calculation.billingCycle === 'annual' && styles.activeToggle,
            ]}
            onPress={() => handleBillingCycleToggle('annual')}
          >
            <Text style={[
              styles.toggleButtonText,
              calculation.billingCycle === 'annual' && styles.activeToggleText,
            ]}>
              Annual (Save 17%)
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Total Cost Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Cost:</Text>
        <Text style={styles.totalAmount}>
          ${Math.round(calculation.total)}
          <Text style={styles.totalUnit}>
            /{calculation.billingCycle === 'annual' ? 'year' : 'month'}
          </Text>
        </Text>
        {calculation.savings && (
          <Text style={styles.savingsText}>
            You save ${Math.round(calculation.savings.annualDiscount)} annually!
          </Text>
        )}
      </View>
    </View>
  );

  const renderSavingsCalculator = () => (
    <View style={styles.savingsContainer}>
      <View style={styles.savingsHeader}>
        <TrendingUp color={colors.status.success} size={24} />
        <Text style={styles.savingsTitle}>Your Potential Savings</Text>
      </View>

      <View style={styles.savingsGrid}>
        <View style={styles.savingsCard}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.fuelSavings}
          </Text>
          <Text style={styles.savingsLabel}>Fuel Savings/Month</Text>
        </View>
        
        <View style={styles.savingsCard}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.maintenanceSavings}
          </Text>
          <Text style={styles.savingsLabel}>Maintenance Savings/Month</Text>
        </View>
        
        <View style={styles.savingsCard}>
          <Text style={styles.savingsAmount}>
            ${savingsCalculation.complianceSavings}
          </Text>
          <Text style={styles.savingsLabel}>Compliance Savings/Month</Text>
        </View>
        
        <View style={[styles.savingsCard, styles.totalSavingsCard]}>
          <Text style={styles.totalSavingsAmount}>
            ${savingsCalculation.totalMonthlySavings}
          </Text>
          <Text style={styles.totalSavingsLabel}>Total Monthly Savings</Text>
          <Text style={styles.roiText}>
            {savingsCalculation.roiPercentage}% ROI
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTestimonials = () => (
    <View style={styles.testimonialsContainer}>
      <Text style={styles.sectionTitle}>What Our Customers Say</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
          setActiveTestimonial(index);
        }}
      >
        {testimonials.map((testimonial, index) => (
          <View key={testimonial.id} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.avatarText}>
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>
                  {testimonial.role} {testimonial.company && `• ${testimonial.company}`}
                </Text>
                <View style={styles.ratingContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} color={colors.warning} size={14} fill={colors.warning} />
                  ))}
                </View>
              </View>
            </View>
            
            <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
            
            {testimonial.savings && (
              <View style={styles.testimonialSavings}>
                <Text style={styles.savingsHighlight}>
                  Saved ${testimonial.savings.amount.toLocaleString()} on {testimonial.savings.metric}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.testimonialDots}>
        {testimonials.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeTestimonial && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderComparison = () => (
    <View style={styles.comparisonContainer}>
      <Pressable
        style={styles.comparisonHeader}
        onPress={() => setShowComparison(!showComparison)}
      >
        <Text style={styles.comparisonTitle}>See Plan Comparison</Text>
        {showComparison ? (
          <ChevronUp color={colors.text.primary} size={20} />
        ) : (
          <ChevronDown color={colors.text.primary} size={20} />
        )}
      </Pressable>

      {showComparison && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.comparisonTable}>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Feature</Text>
              <Text style={styles.comparisonColumn}>Rork</Text>
              <Text style={styles.comparisonColumn}>Motive</Text>
              <Text style={styles.comparisonColumn}>Samsara</Text>
              <Text style={styles.comparisonColumn}>Geotab</Text>
            </View>
            
            {competitorComparison.map((item, index) => (
              <View key={index} style={styles.comparisonRow}>
                <Text style={styles.comparisonFeature}>{item.feature}</Text>
                <Text style={[styles.comparisonValue, styles.rorkValue]}>
                  {typeof item.rork === 'boolean' ? (item.rork ? '✓' : '✗') : item.rork}
                </Text>
                <Text style={styles.comparisonValue}>
                  {typeof item.motive === 'boolean' ? (item.motive ? '✓' : '✗') : item.motive}
                </Text>
                <Text style={styles.comparisonValue}>
                  {typeof item.samsara === 'boolean' ? (item.samsara ? '✓' : '✗') : item.samsara}
                </Text>
                <Text style={styles.comparisonValue}>
                  {typeof item.geotab === 'boolean' ? (item.geotab ? '✓' : '✗') : item.geotab}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Pricing Plans',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Start saving money from day one with our transparent pricing
          </Text>
        </View>

        {/* Calculator Toggle */}
        <Pressable
          style={styles.calculatorToggle}
          onPress={() => setShowCalculator(!showCalculator)}
        >
          <Calculator color={colors.primary} size={20} />
          <Text style={styles.calculatorToggleText}>
            {showCalculator ? 'Hide' : 'Show'} Pricing Calculator
          </Text>
        </Pressable>

        {/* Dynamic Calculator */}
        {showCalculator && renderCalculator()}

        {/* Savings Calculator */}
        {renderSavingsCalculator()}

        {/* Pricing Cards */}
        <View style={styles.pricingGrid}>
          {pricingPlans.map(renderPricingCard)}
        </View>

        {/* Testimonials */}
        {renderTestimonials()}

        {/* Comparison Table */}
        {renderComparison()}

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Award color={colors.primary} size={32} />
          <Text style={styles.ctaTitle}>Ready to Start Saving?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of truckers who trust Rork for their business
          </Text>
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          </Pressable>
          <Text style={styles.ctaDisclaimer}>
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  calculatorToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: 20,
  },
  calculatorToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  calculatorContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeToggleText: {
    color: colors.white,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 12,
  },
  sliderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  vehicleCount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  billingToggle: {
    marginBottom: 20,
  },
  totalContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  totalUnit: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  savingsText: {
    fontSize: 14,
    color: colors.status.success,
    fontWeight: '500',
    marginTop: 4,
  },
  savingsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  savingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  savingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  savingsCard: {
    width: '48%',
    padding: 16,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  totalSavingsCard: {
    width: '100%',
    backgroundColor: colors.status.success,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.status.success,
    marginBottom: 4,
  },
  totalSavingsAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  totalSavingsLabel: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  roiText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
    marginTop: 4,
  },
  pricingGrid: {
    padding: 20,
    gap: 16,
  },
  pricingCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.background.tertiary,
  },
  popularCard: {
    borderColor: colors.status.success,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.status.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  cardHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  annualSavings: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
    marginTop: 4,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  moreFeatures: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  limitsContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  limitsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  limitsText: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  selectButton: {
    backgroundColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  selectedButtonText: {
    color: colors.white,
  },
  testimonialsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  testimonialCard: {
    width: width - 40,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testimonialHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  testimonialQuote: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  testimonialSavings: {
    padding: 12,
    backgroundColor: colors.status.success,
    borderRadius: 8,
  },
  savingsHighlight: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  testimonialDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  comparisonContainer: {
    margin: 20,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.tertiary,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  comparisonTable: {
    padding: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonFeature: {
    width: 120,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  comparisonColumn: {
    width: 80,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  comparisonValue: {
    width: 80,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  rorkValue: {
    color: colors.status.success,
    fontWeight: '600',
  },
  ctaSection: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    margin: 20,
    borderRadius: 16,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  ctaDisclaimer: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});