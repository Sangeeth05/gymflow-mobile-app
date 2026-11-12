import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  title?: string;
  /** `close` for modals, `back` for pushed screens. */
  variant?: 'back' | 'close';
  onBack?: () => void;
  right?: ReactNode;
};

/** Top bar for stack screens: round back/close button, centred title, optional right slot. */
export function ScreenHeader({ title, variant = 'back', onBack, right }: Props) {
  const label = variant === 'close' ? 'Close' : 'Back';
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={4}
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Icon name={variant === 'close' ? 'close' : 'chevronLeft'} size={20} />
      </Pressable>
      <AppText variant="headline" align="center" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title ?? ''}
      </AppText>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: sizes.touch },
  button: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.raised },
  title: { flex: 1 },
  side: { minWidth: sizes.touch, alignItems: 'flex-end' },
});
