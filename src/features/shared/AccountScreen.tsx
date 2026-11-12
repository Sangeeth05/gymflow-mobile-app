import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, ListRow, Screen } from '../../components/ui';
import { colors } from '../../theme/tokens';
import { useSession } from '../auth/session';

/** Profile tab — shared by member and trainer for now. */
export function AccountScreen() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  if (!session) return null;

  const initials = session.user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppText variant="title">{initials}</AppText>
        </View>
        <View style={styles.flex}>
          <AppText variant="title">{session.user.name}</AppText>
          <AppText variant="caption" color={colors.muted}>
            +91 {session.user.phone}
          </AppText>
        </View>
      </View>

      <AppText variant="overline" color={colors.muted}>
        Gym
      </AppText>
      <ListRow
        title={session.gym.name}
        subtitle={session.role === 'trainer' ? 'Trainer' : 'Member'}
        left={<Icon name="logo" size={18} color={colors.accent} />}
      />

      <View style={styles.group}>
        <ListRow title="Notifications" left={<Icon name="bell" size={18} color={colors.muted} />} onPress={() => {}} />
        <ListRow title="Contact the gym" left={<Icon name="chat" size={18} color={colors.muted} />} onPress={() => {}} />
      </View>

      <Button
        label="Log out"
        variant="secondary"
        icon={<Icon name="logout" size={18} color={colors.dangerText} />}
        onPress={() => {
          signOut();
          router.replace('/login');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.raised,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, gap: 2 },
  group: { gap: 8 },
});
