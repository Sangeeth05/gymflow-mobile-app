import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../../theme/tokens';

type Props = { value: number; color?: string; accessibilityLabel?: string };

/** `value` is 0–1. */
export function ProgressBar({ value, color = colors.accent, accessibilityLabel }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
    >
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.raised, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
