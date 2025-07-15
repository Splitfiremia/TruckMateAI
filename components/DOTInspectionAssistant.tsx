import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Shield,
  AlertTriangle,
  CheckCircle,
  Brain,
  MapPin,
  Clock,
  FileText,
  MessageCircle,
  TrendingUp,
  Route,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDOTInspectionStore } from '@/store/dotInspectionStore';

interface DOTInspectionAssistantProps {
  visible: boolean;
  onClose: () => void;
}

export default function DOTInspectionAssistant({ visible, onClose }: DOTInspectionAssistantProps) {
  const [activeTab, setActiveTab] = useState<'prediction' | 'tips' | 'history' | 'chat'>('prediction');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ question: string; answer: string }[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  
  const {
    currentPrediction,
    inspectionTips,
    inspectionHistory,
    blitzAlerts,
    isAnalyzing,
    generatePrediction,
    getInspectionTips,
    getBlitzAlerts,
    analyzeVehicleReadiness,
    getAIGuidance,
    dismissBlitzAlert,
  } = useDOTInspectionStore();
  
  useEffect(() => {
    if (visible) {
      generatePrediction('Atlanta, GA', 'I-75 North');
      getInspectionTips();
      getBlitzAlerts('I-75 North');
    }
  }, [visible]);
  
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setIsLoadingChat(true);
    const question = chatInput.trim();
    setChatInput('');
    
    try {
      const answer = await getAIGuidance(question);
      setChatMessages(prev => [...prev, { question, answer }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI guidance. Please try again.');
    } finally {
      setIsLoadingChat(false);
    }
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      case 'Low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.danger;
      case 'Medium': return colors.warning;
      case 'Low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };
  
  const renderPredictionTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Blitz Alerts */}
      {blitzAlerts.map(alert => (
        <View key={alert.id} style={[styles.alertCard, { borderLeftColor: colors.danger }]}>
          <View style={styles.alertHeader}>
            <View style={styles.alertTitleContainer}>
              <AlertTriangle size={20} color={colors.danger} />
              <Text style={styles.alertTitle}>Inspection Blitz Alert</Text>
            </View>
            <TouchableOpacity onPress={() => dismissBlitzAlert(alert.id)}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.alertLocation}>{alert.location}</Text>
          <Text style={styles.alertDates}>
            {new Date(alert.startDate).toLocaleDateString()} - {new Date(alert.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.alertFocus}>Focus: {alert.focus.join(', ')}</Text>
          <View style={styles.alternativeRoutes}>
            <Text style={styles.alternativeTitle}>Alternative Routes:</Text>
            {alert.alternativeRoutes.map((route, index) => (
              <Text key={index} style={styles.alternativeRoute}>• {route}</Text>
            ))}
          </View>
        </View>
      ))}
      
      {/* Current Prediction */}
      {isAnalyzing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryLight} />
          <Text style={styles.loadingText}>Analyzing inspection probability...</Text>
        </View>
      ) : currentPrediction ? (
        <View style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <Brain size={24} color={colors.primaryLight} />
            <Text style={styles.predictionTitle}>AI Inspection Prediction</Text>
          </View>
          
          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>Risk Level:</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(currentPrediction.riskLevel) }]}>
              <Text style={styles.riskText}>{currentPrediction.riskLevel}</Text>
            </View>
            <Text style={styles.probabilityText}>{currentPrediction.probability}%</Text>
          </View>
          
          <View style={styles.predictionDetails}>
            <View style={styles.detailSection}>
              <MapPin size={16} color={colors.primaryLight} />
              <Text style={styles.detailText}>{currentPrediction.nextLikelyLocation}</Text>
            </View>
            <View style={styles.detailSection}>
              <Clock size={16} color={colors.primaryLight} />
              <Text style={styles.detailText}>ETA: {currentPrediction.estimatedTime}</Text>
            </View>
          </View>
          
          <View style={styles.factorsSection}>
            <Text style={styles.sectionTitle}>Risk Factors:</Text>
            {currentPrediction.factors.map((factor, index) => (
              <Text key={index} style={styles.factorItem}>• {factor}</Text>
            ))}
          </View>
          
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>AI Recommendations:</Text>
            {currentPrediction.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
  
  const renderTipsTab = () => (
    <ScrollView style={styles.tabContent}>
      {inspectionTips.map(tip => (
        <View key={tip.id} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipTitleContainer}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(tip.priority) }]} />
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </View>
            <Text style={styles.tipCategory}>{tip.category}</Text>
          </View>
          <Text style={styles.tipDescription}>{tip.description}</Text>
          {tip.actionRequired && (
            <View style={styles.actionRequired}>
              <AlertTriangle size={14} color={colors.warning} />
              <Text style={styles.actionText}>Action Required</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
  
  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent}>
      {inspectionHistory.map(inspection => (
        <View key={inspection.id} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyDate}>{new Date(inspection.date).toLocaleDateString()}</Text>
            <View style={[
              styles.resultBadge,
              { backgroundColor: inspection.result === 'Pass' ? colors.secondary : 
                                inspection.result === 'Warning' ? colors.warning : colors.danger }
            ]}>
              <Text style={styles.resultText}>{inspection.result}</Text>
            </View>
          </View>
          <Text style={styles.historyLocation}>{inspection.location}</Text>
          <Text style={styles.historyInspector}>Inspector: {inspection.inspector}</Text>
          <View style={styles.historyDetails}>
            <Text style={styles.historyType}>Type: {inspection.type}</Text>
            <Text style={styles.historyDuration}>Duration: {inspection.duration}</Text>
            <Text style={styles.historyScore}>Score: {inspection.score}/100</Text>
          </View>
          {inspection.violations.length > 0 && (
            <View style={styles.violationsSection}>
              <Text style={styles.violationsTitle}>Violations:</Text>
              {inspection.violations.map((violation, index) => (
                <View key={index} style={styles.violationItem}>
                  <Text style={styles.violationCode}>{violation.code}</Text>
                  <Text style={styles.violationDescription}>{violation.description}</Text>
                  <Text style={styles.violationSeverity}>Severity: {violation.severity}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
  
  const renderChatTab = () => (
    <View style={styles.chatContainer}>
      <ScrollView style={styles.chatMessages}>
        {chatMessages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <View style={styles.questionBubble}>
              <Text style={styles.questionText}>{message.question}</Text>
            </View>
            <View style={styles.answerBubble}>
              <Text style={styles.answerText}>{message.answer}</Text>
            </View>
          </View>
        ))}
        {isLoadingChat && (
          <View style={styles.loadingMessage}>
            <ActivityIndicator size="small" color={colors.primaryLight} />
            <Text style={styles.loadingMessageText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Ask about DOT inspections..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !chatInput.trim() && styles.sendButtonDisabled]}
          onPress={handleChatSubmit}
          disabled={!chatInput.trim() || isLoadingChat}
        >
          <MessageCircle size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Shield size={24} color={colors.primaryLight} />
            <Text style={styles.title}>DOT Inspection Assistant</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'prediction' && styles.activeTab]}
            onPress={() => setActiveTab('prediction')}
          >
            <TrendingUp size={16} color={activeTab === 'prediction' ? colors.primaryLight : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'prediction' && styles.activeTabText]}>
              Prediction
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
            onPress={() => setActiveTab('tips')}
          >
            <CheckCircle size={16} color={activeTab === 'tips' ? colors.primaryLight : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
              Tips
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <FileText size={16} color={activeTab === 'history' ? colors.primaryLight : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <MessageCircle size={16} color={activeTab === 'chat' ? colors.primaryLight : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
              AI Chat
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'prediction' && renderPredictionTab()}
        {activeTab === 'tips' && renderTipsTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'chat' && renderChatTab()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primaryLight,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  alertCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  alertDates: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  alertFocus: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  alternativeRoutes: {
    marginTop: 8,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  alternativeRoute: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  predictionCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  riskLabel: {
    fontSize: 16,
    color: colors.text,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  probabilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryLight,
  },
  predictionDetails: {
    marginBottom: 16,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  factorsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  factorItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 8,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  recommendationItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  tipCategory: {
    fontSize: 12,
    color: colors.primaryLight,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  historyLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  historyInspector: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyDuration: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyScore: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  violationsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  violationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  violationItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  violationCode: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  violationDescription: {
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  violationSeverity: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  questionBubble: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 12,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: 8,
  },
  questionText: {
    color: colors.text,
    fontSize: 14,
  },
  answerBubble: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 12,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  answerText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  loadingMessageText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 12,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});