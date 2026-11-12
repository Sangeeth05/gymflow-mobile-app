import { StyleSheet, Switch, View } from 'react-native';
import { colors, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';

type Props = { title: string; subtitle?: string; value: boolean; onValueChange: (value: boolean) => void };

export function SwitchRow({ title, subtitle, value, onValueChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <AppText variant="bodyMedium">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.muted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={title}
        accessibilityHint={subtitle}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={value ? colors.onAccent : colors.textSoft}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: sizes.control,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  body: { flex: 1, gap: 2 },
});
