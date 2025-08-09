import React, { useRef, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Platform,
  Pressable,
} from 'react-native';
import { AlertCircle, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ValidatedTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  showValidIcon?: boolean;
  helpText?: string;
  enablesReturnKeyAutomatically?: boolean;
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
}

const ValidatedTextInput = forwardRef<TextInput, ValidatedTextInputProps>((
  {
    label,
    error,
    touched,
    required,
    icon,
    containerStyle,
    inputStyle,
    labelStyle,
    showValidIcon = true,
    helpText,
    enablesReturnKeyAutomatically = true,
    blurOnSubmit = true,
    onSubmitEditing,
    ...textInputProps
  },
  ref
) => {
  const internalRef = useRef<TextInput>(null);
  const inputRef = ref || internalRef;
  const hasError = touched && error && error.trim && error.trim().length > 0;
  const isValid = touched && !hasError && textInputProps.value && textInputProps.value.length > 0;

  const handleContainerPress = () => {
    if (typeof inputRef === 'object' && inputRef?.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
          {helpText && helpText.trim() && <Text style={styles.helpText}>{helpText}</Text>}
        </View>
      )}
      
      <Pressable 
        style={[
          styles.inputContainer,
          hasError && styles.inputContainerError,
          isValid && styles.inputContainerValid,
        ]}
        onPress={handleContainerPress}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            hasError && styles.inputError,
            inputStyle,
          ]}
          placeholderTextColor={colors.text.secondary}
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          blurOnSubmit={blurOnSubmit}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={onSubmitEditing ? 'next' : 'done'}
          textContentType={getTextContentType(textInputProps.keyboardType, label)}
          autoComplete={getAutoComplete(textInputProps.keyboardType, label)}
          {...textInputProps}
        />
        
        {showValidIcon && (
          <View style={styles.validationIcon}>
            {hasError && <AlertCircle size={16} color={colors.error} />}
            {isValid && <CheckCircle size={16} color={colors.success} />}
          </View>
        )}
      </Pressable>
      
      {hasError && error && error.trim() && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
});

ValidatedTextInput.displayName = 'ValidatedTextInput';

export default ValidatedTextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  required: {
    color: colors.error,
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '20',
    borderLeftColor: colors.error,
    borderLeftWidth: 4,
  },
  inputContainerValid: {
    borderColor: colors.success,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  inputError: {
    color: colors.text.primary,
  },
  validationIcon: {
    marginLeft: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 4,
    flex: 1,
  },
});

// Helper functions for better mobile UX
function getTextContentType(keyboardType?: string, label?: string): TextInputProps['textContentType'] {
  if (Platform.OS !== 'ios') return undefined;
  
  if (keyboardType === 'email-address' || label?.toLowerCase().includes('email')) {
    return 'emailAddress';
  }
  if (keyboardType === 'phone-pad' || label?.toLowerCase().includes('phone')) {
    return 'telephoneNumber';
  }
  if (label?.toLowerCase().includes('name')) {
    return 'name';
  }
  if (label?.toLowerCase().includes('company')) {
    return 'organizationName';
  }
  
  return undefined;
}

function getAutoComplete(keyboardType?: string, label?: string): TextInputProps['autoComplete'] {
  if (Platform.OS !== 'android') return undefined;
  
  if (keyboardType === 'email-address' || label?.toLowerCase().includes('email')) {
    return 'email';
  }
  if (keyboardType === 'phone-pad' || label?.toLowerCase().includes('phone')) {
    return 'tel';
  }
  if (label?.toLowerCase().includes('name')) {
    return 'name';
  }
  
  return 'off';
}