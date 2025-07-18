import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'apple' | 'email';
  profilePicture?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

class AuthService {
  private googleClientId = Platform.select({
    ios: 'YOUR_IOS_CLIENT_ID',
    android: 'YOUR_ANDROID_CLIENT_ID',
    web: 'YOUR_WEB_CLIENT_ID',
  });

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      if (Platform.OS === 'web') {
        return this.signInWithGoogleWeb();
      } else {
        return this.signInWithGoogleNative();
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: 'Failed to sign in with Google. Please try again.',
      };
    }
  }

  private async signInWithGoogleWeb(): Promise<AuthResult> {
    const redirectUri = AuthSession.makeRedirectUri();
    
    // Generate a random code verifier (43-128 characters)
    const codeVerifier = Crypto.randomUUID() + Crypto.randomUUID();
    
    // Create code challenge from verifier
    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    const request = new AuthSession.AuthRequest({
      clientId: this.googleClientId!,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      codeChallenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      // Exchange code for tokens
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: this.googleClientId!,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: codeVerifier,
          },
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      );

      // Get user info
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResult.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      return {
        success: true,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          provider: 'google',
          profilePicture: userInfo.picture,
        },
      };
    }

    return {
      success: false,
      error: 'Google Sign-In was cancelled',
    };
  }

  private async signInWithGoogleNative(): Promise<AuthResult> {
    // For native platforms, we'll use a mock implementation
    // In a real app, you would use @react-native-google-signin/google-signin
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: 'google_' + Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            provider: 'google',
            profilePicture: 'https://via.placeholder.com/100',
          },
        });
      }, 1000);
    });
  }

  async signInWithApple(): Promise<AuthResult> {
    try {
      if (Platform.OS === 'web') {
        // For web, provide a mock Apple Sign-In experience
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              user: {
                id: 'apple_' + Date.now(),
                email: 'user@privaterelay.appleid.com',
                name: 'Apple User',
                provider: 'apple',
              },
            });
          }, 1000);
        });
      }

      if (Platform.OS !== 'ios') {
        return {
          success: false,
          error: 'Apple Sign-In is only available on iOS devices',
        };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        return {
          success: true,
          user: {
            id: credential.user,
            email: credential.email || 'user@privaterelay.appleid.com',
            name: credential.fullName 
              ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
              : 'Apple User',
            provider: 'apple',
          },
        };
      }

      return {
        success: false,
        error: 'Apple Sign-In failed',
      };
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          error: 'Apple Sign-In was cancelled',
        };
      }

      console.error('Apple Sign-In Error:', error);
      return {
        success: false,
        error: 'Failed to sign in with Apple. Please try again.',
      };
    }
  }

  async signOut(): Promise<void> {
    // Clear any stored tokens or session data
    // In a real app, you might need to revoke tokens
    console.log('User signed out');
  }

  async isAppleSignInAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return true; // Show Apple Sign-In on web for demo
    if (Platform.OS !== 'ios') return false;
    
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();