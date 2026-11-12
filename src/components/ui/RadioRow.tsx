import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  left?: ReactNode;
  /** Shown before the radio dot (e.g. a pill). */
  right?: ReactNode;
};

export function RadioRow({ title, subtitle, selected, onPress, left, right }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.row, selected && styles.rowOn]}
    >
      {left}
      <View style={styles.body}>
        <AppText variant="bodyMedium">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.muted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      <View style={[styles.dot, selected && styles.dotOn]}>{selected ? <View style={styles.inner} /> : null}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: sizes.control,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowOn: { borderColor: colors.accent },
  body: { flex: 1, gap: 2 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { borderColor: colors.accent },
  inner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
});
