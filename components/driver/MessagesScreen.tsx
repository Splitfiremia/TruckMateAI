import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  MessageCircle,
  Send,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Paperclip,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useDriverStore, Message } from '@/store/driverStore';

export default function MessagesScreen() {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const { messages, sendMessage, markMessageAsRead, driver } = useDriverStore();

  useEffect(() => {
    // Mark all messages as read when screen is opened
    messages.forEach(message => {
      if (!message.read && message.to === driver?.id) {
        markMessageAsRead(message.id);
      }
    });
  }, [messages, driver?.id, markMessageAsRead]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    sendMessage(messageText.trim(), 'dispatcher');
    setMessageText('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAttachment = () => {
    Alert.alert(
      'Add Attachment',
      'Choose attachment type',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => handleCamera() },
        { text: 'Location', onPress: () => handleLocation() },
      ]
    );
  };

  const handleCamera = () => {
    Alert.alert('Camera', 'Camera functionality would open here');
  };

  const handleLocation = () => {
    Alert.alert('Location', 'Current location would be shared');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'urgent':
        return colors.danger;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      default:
        return colors.text.tertiary;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isFromDriver = item.from === driver?.id;
    const priorityColor = getPriorityColor(item.priority);

    return (
      <View style={[
        styles.messageContainer,
        isFromDriver ? styles.messageFromDriver : styles.messageFromDispatcher
      ]}>
        <View style={[
          styles.messageBubble,
          isFromDriver ? styles.bubbleFromDriver : styles.bubbleFromDispatcher,
          item.priority === 'urgent' && styles.urgentMessage
        ]}>
          {/* Priority indicator for high/urgent messages */}
          {(item.priority === 'high' || item.priority === 'urgent') && (
            <View style={styles.priorityIndicator}>
              <AlertTriangle color={priorityColor} size={12} />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
          )}
          
          <Text style={[
            styles.messageText,
            isFromDriver ? styles.messageTextFromDriver : styles.messageTextFromDispatcher
          ]}>
            {item.content}
          </Text>
          
          {/* Attachments */}
          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {item.attachments.map((attachment, index) => (
                <View key={index} style={styles.attachment}>
                  <Paperclip color={colors.text.tertiary} size={14} />
                  <Text style={styles.attachmentText}>{attachment.name}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isFromDriver ? styles.messageTimeFromDriver : styles.messageTimeFromDispatcher
            ]}>
              {formatMessageTime(item.timestamp)}
            </Text>
            
            {isFromDriver && (
              <View style={styles.messageStatus}>
                {item.read ? (
                  <CheckCircle color={colors.success} size={12} />
                ) : (
                  <Clock color={colors.text.tertiary} size={12} />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MessageCircle color={colors.text.tertiary} size={64} />
      <Text style={styles.emptyStateTitle}>No Messages</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start a conversation with your dispatcher
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.dispatcherAvatar}>
            <MessageCircle color={colors.primary} size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Dispatcher</Text>
            <Text style={styles.headerSubtitle}>Fleet Operations</Text>
          </View>
        </View>
        <View style={styles.onlineIndicator} />
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Dispatcher is typing...</Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleAttachment}
          >
            <Paperclip color={colors.text.tertiary} size={20} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send 
              color={messageText.trim() ? colors.white : colors.text.tertiary} 
              size={20} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  dispatcherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageFromDriver: {
    alignItems: 'flex-end',
  },
  messageFromDispatcher: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleFromDriver: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleFromDispatcher: {
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgentMessage: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextFromDriver: {
    color: colors.white,
  },
  messageTextFromDispatcher: {
    color: colors.text.primary,
  },
  attachmentsContainer: {
    marginTop: 8,
    gap: 4,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textDecorationLine: 'underline',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  messageTimeFromDriver: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeFromDispatcher: {
    color: colors.text.tertiary,
  },
  messageStatus: {
    marginLeft: 8,
  },
  typingIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  attachmentButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: colors.background.primary,
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