import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function GameButton({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  style
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'success' && styles.success,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  primary: {
    backgroundColor: '#FF6B6B'
  },
  secondary: {
    backgroundColor: '#4ECDC4'
  },
  success: {
    backgroundColor: '#95E1D3'
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    elevation: 0
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  disabledText: {
    color: '#999999'
  }
});
