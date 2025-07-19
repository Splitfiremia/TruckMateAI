import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Filter, FeDropShadow, Circle, Ellipse } from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  animated?: boolean;
}

export default function AppLogo({ size = 120, animated = true }: AppLogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          {/* Main eye gradient */}
          <RadialGradient id="eyeGradient" cx="0.3" cy="0.3" r="0.8">
            <Stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
            <Stop offset="50%" stopColor="#1e40af" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
          </RadialGradient>
          
          {/* Iris gradient */}
          <RadialGradient id="irisGradient" cx="0.5" cy="0.5" r="0.6">
            <Stop offset="0%" stopColor="#1e40af" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
          </RadialGradient>
          
          {/* Pupil gradient */}
          <RadialGradient id="pupilGradient" cx="0.3" cy="0.3" r="0.7">
            <Stop offset="0%" stopColor="#334155" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </RadialGradient>
          
          {/* Shadow filter */}
          <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.3"/>
          </Filter>
        </Defs>
        
        {/* Outer pulse ring */}
        <Circle cx="60" cy="60" r="50" fill="none" stroke="#1e40af" strokeWidth="2" opacity="0.3" />
        
        {/* Middle pulse ring */}
        <Circle cx="60" cy="60" r="45" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.4" />
        
        {/* Main eye sphere */}
        <Circle cx="60" cy="60" r="40" fill="url(#eyeGradient)" filter="url(#shadow)" />
        
        {/* Iris */}
        <Circle cx="60" cy="60" r="28" fill="url(#irisGradient)"/>
        
        {/* Pupil */}
        <Circle cx="60" cy="60" r="16" fill="url(#pupilGradient)"/>
        
        {/* Highlight/Reflection */}
        <Ellipse cx="54" cy="54" rx="6" ry="8" fill="rgba(255,255,255,0.9)" opacity="0.8"/>
        <Circle cx="52" cy="52" r="3" fill="rgba(255,255,255,0.6)"/>
        
        {/* Additional depth rings */}
        <Circle cx="60" cy="60" r="28" fill="none" stroke="rgba(30,64,175,0.3)" strokeWidth="1"/>
        <Circle cx="60" cy="60" r="35" fill="none" stroke="rgba(30,64,175,0.2)" strokeWidth="0.5"/>
      </Svg>
    </View>
  );
}