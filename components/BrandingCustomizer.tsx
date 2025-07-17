import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, TextInput } from 'react-native';
import { Palette, Type, Image, Save, Upload, Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { BrandingSettings, brandingPresets, useBrandingStore } from '@/store/brandingStore';
import ValidatedTextInput from '@/components/ValidatedTextInput';
import { useFormValidation, commonValidationRules } from '@/utils/validation';

interface BrandingCustomizerProps {
  onClose?: () => void;
}

export default function BrandingCustomizer({ onClose }: BrandingCustomizerProps) {
  const { settings, updateBranding, resetToDefaults, applyPreset } = useBrandingStore();
  
  const validationRules = {
    companyName: commonValidationRules.companyName,
    appName: { required: true, minLength: 2, maxLength: 30 },
    welcomeMessage: { maxLength: 200 },
    logoUrl: commonValidationRules.url,
    primaryColor: commonValidationRules.colorHex,
    secondaryColor: commonValidationRules.colorHex,
    accentColor: commonValidationRules.colorHex,
    supportEmail: commonValidationRules.email,
    supportPhone: commonValidationRules.phone,
  };

  const {
    formData: localSettings,
    errors,
    touched,
    hasErrors,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
    setFormData: setLocalSettings,
  } = useFormValidation(
    {
      companyName: settings.companyName,
      appName: settings.appName,
      welcomeMessage: settings.welcomeMessage,
      logoUrl: settings.logoUrl || '',
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      showCompanyLogo: settings.showCompanyLogo.toString(),
      customSplashScreen: settings.customSplashScreen.toString(),
      hideDefaultBranding: settings.hideDefaultBranding.toString(),
    },
    validationRules
  );
  
  const handleSave = () => {
    if (!validateAllFields()) {
      Alert.alert('Validation Error', 'Please fix the errors below before saving.');
      return;
    }
    
    const brandingSettings: BrandingSettings = {
      ...settings,
      companyName: localSettings.companyName,
      appName: localSettings.appName,
      welcomeMessage: localSettings.welcomeMessage,
      logoUrl: localSettings.logoUrl,
      primaryColor: localSettings.primaryColor,
      secondaryColor: localSettings.secondaryColor,
      accentColor: localSettings.accentColor,
      supportEmail: localSettings.supportEmail,
      supportPhone: localSettings.supportPhone,
      showCompanyLogo: localSettings.showCompanyLogo === 'true',
      customSplashScreen: localSettings.customSplashScreen === 'true',
      hideDefaultBranding: localSettings.hideDefaultBranding === 'true',
    };
    
    updateBranding(brandingSettings);
    Alert.alert('Success', 'Branding settings saved successfully!');
    onClose?.();
  };
  
  const handleReset = () => {
    Alert.alert(
      'Reset Branding',
      'Are you sure you want to reset all branding settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            const defaultSettings = {
              companyName: 'Your Company',
              appName: 'TruckMate AI',
              welcomeMessage: 'Welcome to TruckMate AI',
              logoUrl: '',
              primaryColor: '#3B82F6',
              secondaryColor: '#10B981',
              accentColor: '#F59E0B',
              supportEmail: 'support@truckmateai.com',
              supportPhone: '(555) 123-4567',
              showCompanyLogo: 'false',
              customSplashScreen: 'false',
              hideDefaultBranding: 'false',
            };
            setLocalSettings(defaultSettings);
          },
        },
      ]
    );
  };
  
  const handlePresetApply = (preset: any) => {
    setLocalSettings(prev => ({
      ...prev,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
    }));
  };
  
  const updateSetting = (key: string, value: string | boolean) => {
    if (key === 'showCompanyLogo' || key === 'customSplashScreen' || key === 'hideDefaultBranding') {
      setLocalSettings(prev => ({ ...prev, [key]: value.toString() }));
    } else {
      setLocalSettings(prev => ({ ...prev, [key]: value as string }));
    }
  };
  

  
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
            onChangeText={(text: string) => updateSetting('companyName', text)}
            placeholder="Enter company name"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>App Name</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.appName}
            onChangeText={(text: string) => updateSetting('appName', text)}
            placeholder="Enter custom app name"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Welcome Message</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={localSettings.welcomeMessage}
            onChangeText={(text: string) => updateSetting('welcomeMessage', text)}
            placeholder="Enter welcome message for drivers"
            placeholderTextColor={colors.text.secondary}
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
            onChangeText={(text: string) => updateSetting('logoUrl', text)}
            placeholder="Enter logo image URL"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        
        <TouchableOpacity style={styles.uploadButton}>
          <Upload size={20} color={colors.text.primary} />
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
          {brandingPresets.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.colorPreset}
              onPress={() => handlePresetApply(preset)}
            >
              <View style={styles.colorPresetColors}>
                <View style={[styles.colorSwatch, { backgroundColor: preset.primaryColor }]} />
                <View style={[styles.colorSwatch, { backgroundColor: preset.secondaryColor }]} />
                <View style={[styles.colorSwatch, { backgroundColor: preset.accentColor }]} />
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
                onChangeText={(text: string) => updateSetting('primaryColor', text)}
                placeholder="#1E3A8A"
                placeholderTextColor={colors.text.secondary}
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
                onChangeText={(text: string) => updateSetting('secondaryColor', text)}
                placeholder="#10B981"
                placeholderTextColor={colors.text.secondary}
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
                onChangeText={(text: string) => updateSetting('accentColor', text)}
                placeholder="#F59E0B"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Advanced Settings</Text>
        </View>
        
        <View style={styles.switchGroup}>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Show Company Logo</Text>
            <Switch
              value={localSettings.showCompanyLogo === 'true'}
              onValueChange={(value) => updateSetting('showCompanyLogo', value)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
            />
          </View>
          
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Custom Splash Screen</Text>
            <Switch
              value={localSettings.customSplashScreen === 'true'}
              onValueChange={(value) => updateSetting('customSplashScreen', value)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
            />
          </View>
          
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Hide Default Branding</Text>
            <Switch
              value={localSettings.hideDefaultBranding === 'true'}
              onValueChange={(value) => updateSetting('hideDefaultBranding', value)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
            />
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
            onChangeText={(text: string) => updateSetting('supportEmail', text)}
            placeholder="support@company.com"
            placeholderTextColor={colors.text.secondary}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Support Phone</Text>
          <TextInput
            style={styles.textInput}
            value={localSettings.supportPhone}
            onChangeText={(text: string) => updateSetting('supportPhone', text)}
            placeholder="(555) 123-4567"
            placeholderTextColor={colors.text.secondary}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color={colors.text.primary} />
          <Text style={styles.primarySaveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
      
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
    color: colors.text.primary,
    marginLeft: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
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
    color: colors.text.primary,
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
    color: colors.text.secondary,
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
    backgroundColor: colors.background.primary,
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
    color: colors.text.primary,
    fontSize: 16,
    padding: 8,
  },
  primarySaveButton: {
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
  primarySaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  switchGroup: {
    gap: 16,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  preview: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
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
    color: colors.text.secondary,
    marginBottom: 8,
  },
  previewMessage: {
    fontSize: 14,
    color: colors.text.primary,
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
    color: colors.text.primary,
  },
});