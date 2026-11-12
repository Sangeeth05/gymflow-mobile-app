import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, type IconName } from '../../../components/ui';
import { colors, fonts, radius, sizes } from '../../../theme/tokens';

type Tone = 'warning' | 'danger' | 'neutral' | 'accent';

const tones: Record<Tone, { bg: string; fg: string; border: string }> = {
  warning: { bg: colors.warningSoft, fg: colors.warning, border: colors.warningSoft },
  danger: { bg: colors.dangerSoft, fg: colors.dangerText, border: colors.dangerSoft },
  neutral: { bg: colors.surface, fg: colors.textSoft, border: colors.border },
  accent: { bg: colors.accentSoft, fg: colors.accent, border: colors.accentSoft },
};

type Props = {
  tone: Tone;
  icon: IconName;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function Banner({ tone, icon, title, body, actionLabel, onAction }: Props) {
  const t = tones[tone];
  return (
    <View
      style={[styles.wrap, { backgroundColor: t.bg, borderColor: t.border }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Icon name={icon} size={20} color={t.fg} />
      <View style={styles.body}>
        <AppText style={[styles.title, { color: t.fg }]}>{title}</AppText>
        {body ? (
          <AppText variant="caption" color={colors.textSoft}>
            {body}
          </AppText>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={styles.action}>
          <AppText style={[styles.actionText, { color: t.fg }]}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.control,
    borderWidth: 1,
  },
  body: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  action: { minHeight: sizes.touch, justifyContent: 'center', paddingHorizontal: 4 },
  actionText: { fontFamily: fonts.semibold, fontSize: 14 },
});
