import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, Icon, ListRow, Screen, StatTile } from '../../components/ui';
import { formatPhone } from '../../lib/format';
import { colors } from '../../theme/tokens';
import { useSession } from '../auth/session';
import { resetMemberState } from '../member/resetMemberState';
import { useTrainerClients, useTrainerWeek } from '../trainer/queries';

/** Trainer · Profile tab. (Members have their own Profile screen.) */
export function AccountScreen() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  const clients = useTrainerClients();
  const week = useTrainerWeek();
  if (!session) return null;

  const sessionsThisWeek = (week.data ?? []).reduce((n, d) => n + d.sessions.length, 0);

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <Avatar name={session.user.name} size={64} ring />
        <View style={styles.flex}>
          <AppText variant="title">{session.user.name}</AppText>
          <AppText variant="caption" color={colors.muted}>
            +91 {formatPhone(session.user.phone)}
          </AppText>
        </View>
      </View>

      <View style={styles.tiles}>
        <StatTile label="Members" value={clients.data ? String(clients.data.length) : '–'} caption="assigned" />
        <StatTile label="Next 7 days" value={week.data ? String(sessionsThisWeek) : '–'} caption="sessions" />
      </View>

      <AppText variant="overline" color={colors.muted}>
        Gym
      </AppText>
      <ListRow
        title={session.gym.name}
        subtitle={session.role === 'trainer' ? 'Trainer' : 'Member'}
        left={<Icon name="logo" size={18} color={colors.accent} />}
        right={<AppText color={colors.accent}>Switch</AppText>}
        onPress={() => router.push('/gym-picker')}
      />

      {__DEV__ ? (
        <View style={styles.group}>
          <AppText variant="overline" color={colors.muted}>
            Developer
          </AppText>
          <ListRow
            title="Screen gallery"
            subtitle="Open any screen, switch states"
            left={<Icon name="code" size={18} color={colors.warning} />}
            onPress={() => router.push('/gallery')}
          />
        </View>
      ) : null}

      <Button
        label="Log out"
        variant="secondary"
        icon={<Icon name="logout" size={18} color={colors.dangerText} />}
        onPress={() => {
          resetMemberState();
          signOut();
          router.replace('/login');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  flex: { flex: 1, gap: 2 },
  tiles: { flexDirection: 'row', gap: 12 },
  group: { gap: 8 },
});
