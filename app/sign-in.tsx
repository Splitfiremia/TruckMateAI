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
import Svg, { Path } from 'react-native-svg';
import * as AppleAuthentication from 'expo-apple-authentication';

import { colors } from '@/constants/colors';
import { authService, AuthResult } from '@/services/authService';
import { useUserStore, UserProfile } from '@/store/userStore';
import AppLogo from '@/components/AppLogo';

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(authService.isDevelopmentModeEnabled());
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

  const toggleDevelopmentMode = () => {
    const newMode = !isDevelopmentMode;
    setIsDevelopmentMode(newMode);
    authService.setDevelopmentMode(newMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={styles.appTitle}>TruckMate AI</Text>
            <View style={styles.logoContainer}>
              <AppLogo size={80} />
            </View>
          </View>
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
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <Path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <Path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <Path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </Svg>
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
          
          {/* Development Mode Toggle */}
          <TouchableOpacity 
            style={styles.devModeToggle}
            onPress={toggleDevelopmentMode}
          >
            <Text style={styles.devModeText}>
              Dev Mode: {isDevelopmentMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
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
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(37, 99, 235, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoContainer: {
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  subtitle: {
    fontSize: 17,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  signInOptions: {
    gap: 16,
    marginBottom: 48,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButton: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  appleButton: {
    height: 52,
  },
  appleButtonCustom: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
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
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  signInButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: -0.2,
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
  devModeToggle: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  devModeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});