import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '../../theme/tokens';
import { AppText } from './AppText';

export type PillTone = 'active' | 'warning' | 'danger' | 'neutral' | 'onAccent';

const tones: Record<PillTone, { bg: string; fg: string }> = {
  active: { bg: colors.accentSoft, fg: colors.accent },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.border, fg: colors.textSoft },
  /** For pills sitting on the lime pass card. */
  onAccent: { bg: colors.onAccent, fg: colors.accent },
};

export function StatusPill({ label, tone = 'active' }: { label: string; tone?: PillTone }) {
  const t = tones[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <AppText style={[styles.text, { color: t.fg }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  text: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
});
