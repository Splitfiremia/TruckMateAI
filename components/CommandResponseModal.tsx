import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CommandResponseModalProps {
  visible: boolean;
  onClose: () => void;
  command: string | null;
  response: string | null;
}

export default function CommandResponseModal({ 
  visible, 
  onClose, 
  command, 
  response 
}: CommandResponseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Command</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {command && (
            <View style={styles.commandContainer}>
              <Text style={styles.commandLabel}>You said:</Text>
              <Text style={styles.commandText}>"{command}"</Text>
            </View>
          )}
          
          {response && (
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <MessageSquare size={20} color={colors.primaryLight} />
                <Text style={styles.responseLabel}>Assistant Response:</Text>
              </View>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onClose}
          >
            <Text style={styles.actionButtonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  commandContainer: {
    marginBottom: 16,
  },
  commandLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  commandText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  responseContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '500',
    marginLeft: 8,
  },
  responseText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});