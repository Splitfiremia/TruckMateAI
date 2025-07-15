import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Palette, Type, Image, Save } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BrandingSettings } from '@/store/fleetStore';

interface BrandingCustomizerProps {
  settings: BrandingSettings;
  onUpdate: (updates: Partial<BrandingSettings>) => void;
}

export default function BrandingCustomizer({ settings, onUpdate }: BrandingCustomizerProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleSave = () => {
    onUpdate(localSettings);
  };
  
  const updateSetting = (key: keyof BrandingSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const colorPresets = [
    { name: 'Ocean Blue', primary: '#1E3A8A', secondary: '#10B981', accent: '#F59E0B' },
    { name: 'Forest Green', primary: '#065F46', secondary: '#059669', accent: '#D97706' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#DC2626', accent: '#7C3AED' },
    { name: 'Royal Purple', primary: '#7C3AED', secondary: '#EC4899', accent: '#F59E0B' },
    { name: 'Steel Gray', primary: '#374151', secondary: '#6B7280', accent: '#3B82F6' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Type size={20} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Company Information</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Company Name</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.companyName}
            onChangeText={(text) => updateSetting('companyName', text)}
            placeholder="Enter company name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>App Name</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.appName}
            onChangeText={(text) => updateSetting('appName', text)}
            placeholder="Enter custom app name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Welcome Message</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={localSettings.welcomeMessage}
            onChangeText={(text) => updateSetting('welcomeMessage', text)}
            placeholder="Enter welcome message for drivers"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image size={20} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Logo & Branding</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Logo URL</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.logoUrl || ''}
            onChangeText={(text) => updateSetting('logoUrl', text)}
            placeholder="Enter logo image URL"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <TouchableOpacity style={styles.uploadButton}>
          <Image size={20} color={colors.text} />
          <Text style={styles.uploadButtonText}>Upload Logo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Palette size={20} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Color Scheme</Text>
        </View>
        
        <Text style={styles.subsectionTitle}>Quick Presets</Text>
        <View style={styles.colorPresets}>
          {colorPresets.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.colorPreset}
              onPress={() => {
                updateSetting('primaryColor', preset.primary);
                updateSetting('secondaryColor', preset.secondary);
                updateSetting('accentColor', preset.accent);
              }}
            >
              <View style={styles.colorPresetColors}>
                <View style={[styles.colorSwatch, { backgroundColor: preset.primary }]} />
                <View style={[styles.colorSwatch, { backgroundColor: preset.secondary }]} />
                <View style={[styles.colorSwatch, { backgroundColor: preset.accent }]} />
              </View>
              <Text style={styles.colorPresetName}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.subsectionTitle}>Custom Colors</Text>
        
        <View style={styles.colorInputs}>
          <View style={styles.colorInputGroup}>
            <Text style={styles.inputLabel}>Primary Color</Text>
            <View style={styles.colorInputContainer}>
              <View style={[styles.colorPreview, { backgroundColor: localSettings.primaryColor }]} />
              <TextInput
                style={styles.colorInput}
                value={localSettings.primaryColor}
                onChangeText={(text) => updateSetting('primaryColor', text)}
                placeholder="#1E3A8A"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.colorInputGroup}>
            <Text style={styles.inputLabel}>Secondary Color</Text>
            <View style={styles.colorInputContainer}>
              <View style={[styles.colorPreview, { backgroundColor: localSettings.secondaryColor }]} />
              <TextInput
                style={styles.colorInput}
                value={localSettings.secondaryColor}
                onChangeText={(text) => updateSetting('secondaryColor', text)}
                placeholder="#10B981"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.colorInputGroup}>
            <Text style={styles.inputLabel}>Accent Color</Text>
            <View style={styles.colorInputContainer}>
              <View style={[styles.colorPreview, { backgroundColor: localSettings.accentColor }]} />
              <TextInput
                style={styles.colorInput}
                value={localSettings.accentColor}
                onChangeText={(text) => updateSetting('accentColor', text)}
                placeholder="#F59E0B"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Support Information</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Support Email</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.supportEmail}
            onChangeText={(text) => updateSetting('supportEmail', text)}
            placeholder="support@company.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Support Phone</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.supportPhone}
            onChangeText={(text) => updateSetting('supportPhone', text)}
            placeholder="(555) 123-4567"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Save size={20} color={colors.text} />
        <Text style={styles.saveButtonText}>Save Branding Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={[styles.previewCard, { borderLeftColor: localSettings.primaryColor }]}>
          <Text style={[styles.previewAppName, { color: localSettings.primaryColor }]}>
            {localSettings.appName}
          </Text>
          <Text style={styles.previewCompanyName}>{localSettings.companyName}</Text>
          <Text style={styles.previewMessage}>{localSettings.welcomeMessage}</Text>
          
          <View style={styles.previewButtons}>
            <View style={[styles.previewButton, { backgroundColor: localSettings.primaryColor }]}>
              <Text style={styles.previewButtonText}>Primary</Text>
            </View>
            <View style={[styles.previewButton, { backgroundColor: localSettings.secondaryColor }]}>
              <Text style={styles.previewButtonText}>Secondary</Text>
            </View>
            <View style={[styles.previewButton, { backgroundColor: localSettings.accentColor }]}>
              <Text style={styles.previewButtonText}>Accent</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  colorPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorPreset: {
    alignItems: 'center',
    minWidth: 80,
  },
  colorPresetColors: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  colorPresetName: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  colorInputs: {
    gap: 16,
  },
  colorInputGroup: {
    flex: 1,
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 8,
  },
  colorInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    padding: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  preview: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  previewAppName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewCompanyName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },
  previewButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
});