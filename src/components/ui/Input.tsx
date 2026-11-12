import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type TextStyle } from 'react-native';
import { colors, fonts, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
  left?: ReactNode;
  inputStyle?: StyleProp<TextStyle>;
};

export function Input({ label, error, hint, left, inputStyle, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.accent : colors.border;

  return (
    <View style={styles.wrap}>
      <AppText variant="caption" color={colors.muted}>
        {label}
      </AppText>
      <View style={[styles.field, { borderColor }]}>
        {left}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, inputStyle]}
          {...rest}
        />
      </View>
      {error ? (
        <AppText variant="caption" color={colors.dangerText} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.muted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: {
    minHeight: sizes.control,
    borderRadius: radius.control,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 16,
    paddingVertical: 12,
  },
});
