import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Props = { icon: IconName; title: string; body?: string; action?: ReactNode };

export function EmptyState({ icon, title, body, action }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Icon name={icon} size={36} color={colors.accent} strokeWidth={1.8} />
      </View>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      {body ? (
        <AppText color={colors.muted} align="center" style={styles.body}>
          {body}
        </AppText>
      ) : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 32 },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  body: { maxWidth: 290 },
});
