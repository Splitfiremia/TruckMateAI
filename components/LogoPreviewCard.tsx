import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Download, Heart, Share } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface LogoPreviewCardProps {
  logoUri: string;
  logoName: string;
  onDownload?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  isFavorite?: boolean;
}

export default function LogoPreviewCard({
  logoUri,
  logoName,
  onDownload,
  onFavorite,
  onShare,
  isFavorite = false,
}: LogoPreviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logoUri }}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.logoName}>{logoName}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={onFavorite}
          >
            <Heart 
              size={18} 
              color={isFavorite ? '#ef4444' : colors.textSecondary}
              fill={isFavorite ? '#ef4444' : 'none'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onShare}
          >
            <Share size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={onDownload}
          >
            <Download size={18} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* App Interface Preview */}
      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>Preview in App</Text>
        <View style={styles.mockInterface}>
          <View style={styles.mockHeader}>
            <Image
              source={{ uri: logoUri }}
              style={styles.mockLogo}
              resizeMode="contain"
            />
            <Text style={styles.mockAppName}>TruckMate AI</Text>
          </View>
          <View style={styles.mockContent}>
            <View style={styles.mockCard} />
            <View style={styles.mockCard} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  favoriteButton: {
    borderColor: colors.border,
  },
  downloadButton: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  previewSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  mockInterface: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 12,
  },
  mockLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  mockAppName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mockContent: {
    gap: 8,
  },
  mockCard: {
    height: 40,
    backgroundColor: colors.backgroundLight,
    borderRadius: 6,
  },
});