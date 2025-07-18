import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Smartphone } from 'lucide-react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { colors } from '@/constants/colors';
import { authService, AuthResult } from '@/services/authService';
import { useUserStore, UserProfile } from '@/store/userStore';

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const { setUser } = useUserStore();

  useEffect(() => {
    checkAppleSignInAvailability();
  }, []);

  const checkAppleSignInAvailability = async () => {
    const available = await authService.isAppleSignInAvailable();
    setIsAppleAvailable(available);
  };

  const handleAuthResult = (result: AuthResult) => {
    if (result.success && result.user) {
      const userProfile: UserProfile = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        profilePicture: result.user.profilePicture,
        authProvider: result.user.provider,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
      };
      
      setUser(userProfile);
      router.replace('/onboarding');
    } else {
      Alert.alert('Sign In Failed', result.error || 'An unknown error occurred');
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await authService.signInWithGoogle();
    handleAuthResult(result);
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    const result = await authService.signInWithApple();
    handleAuthResult(result);
  };

  const handleEmailSignIn = () => {
    // For demo purposes, create a mock email user
    const mockUser: UserProfile = {
      id: 'email_' + Date.now(),
      name: 'Demo User',
      email: 'demo@truckmate.com',
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };
    
    setUser(mockUser);
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to TruckMate AI</Text>
          <Text style={styles.subtitle}>
            Your intelligent trucking companion for compliance, efficiency, and success
          </Text>
        </View>

        <View style={styles.signInOptions}>
          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.signInButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.signInButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Apple Sign In */}
          {isAppleAvailable && (
            Platform.OS === 'ios' ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            ) : (
              <TouchableOpacity
                style={[styles.signInButton, styles.appleButtonCustom]}
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.text.primary} />
                ) : (
                  <>
                    <View style={styles.appleIconContainer}>
                      <View style={styles.silverAppleLeaf} />
                      <View style={styles.silverAppleBody} />
                      <View style={styles.silverAppleBite} />
                    </View>
                    <Text style={[styles.signInButtonText, styles.appleButtonText]}>
                      Continue with Apple
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )
          )}

          {/* Email Sign In (Demo) */}
          <TouchableOpacity
            style={[styles.signInButton, styles.emailButton]}
            onPress={handleEmailSignIn}
            disabled={isLoading}
          >
            <Mail size={20} color={colors.primary} />
            <Text style={[styles.signInButtonText, styles.emailButtonText]}>
              Continue with Email (Demo)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  signInOptions: {
    gap: 16,
    marginBottom: 48,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  appleButton: {
    height: 52,
  },
  appleButtonCustom: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
  },
  appleIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  silverAppleLeaf: {
    position: 'absolute',
    top: 0,
    right: 6,
    width: 4,
    height: 6,
    backgroundColor: '#B8B8B8',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  silverAppleBody: {
    width: 16,
    height: 18,
    backgroundColor: '#C0C0C0',
    borderRadius: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  silverAppleBite: {
    position: 'absolute',
    top: 4,
    right: -1,
    width: 6,
    height: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  emailButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emailButtonText: {
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});