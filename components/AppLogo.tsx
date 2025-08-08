import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

interface AppLogoProps {
  size?: number;
  animated?: boolean;
}

const LOGO_URL = 'https://r2-pub.rork.com/attachments/yosfnxqh8dxtfxzrefs2f';

export default function AppLogo({ size = 120, animated = true }: AppLogoProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const opacity = useRef<Animated.Value>(new Animated.Value(animated ? 0 : 1)).current;

  const containerStyle = useMemo(() => [styles.container, { width: size, height: size }], [size]);
  const imageStyle = useMemo(() => [styles.image, { width: size, height: size, opacity }], [size, opacity]);

  const handleLoad = useCallback(() => {
    console.log('AppLogo: image loaded');
    if (!animated) return;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animated, opacity]);

  const handleError = useCallback(() => {
    console.error('AppLogo: failed to load logo image');
    setHasError(true);
  }, []);

  return (
    <View style={containerStyle} testID="app-logo-container">
      {!hasError ? (
        <Animated.Image
          testID="app-logo"
          accessibilityLabel="Truck company logo"
          source={{ uri: LOGO_URL }}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode="contain"
          style={imageStyle as any}
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size }]} testID="app-logo-fallback">
          <Text style={styles.fallbackText}>TM</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F0FF',
    borderRadius: 16,
  },
  fallbackText: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#2563eb',
  },
});
