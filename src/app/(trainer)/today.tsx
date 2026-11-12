import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText, EmptyState, Screen, StatTile } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { SessionCard } from '../../features/trainer/SessionCard';
import { useTrainerToday } from '../../features/trainer/queries';
import { firstName, formatDay } from '../../lib/format';
import { colors } from '../../theme/tokens';

/** Trainer · Today */
export default function Today() {
  const session = useSession((s) => s.session);
  const today = useTrainerToday();
  const sessions = today.data ?? [];
  const done = sessions.filter((s) => s.status === 'done').length;
  const classes = sessions.filter((s) => s.kind === 'class').length;

  return (
    <Screen scroll edges={['top']}>
      <View>
        <AppText variant="caption" color={colors.muted}>
          {session?.gym.name} · {formatDay(new Date())}
        </AppText>
        <AppText variant="title">Today{session ? `, ${firstName(session.user.name)}` : ''}</AppText>
      </View>

      {today.isPending ? (
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading today" />
      ) : sessions.length === 0 ? (
        <EmptyState icon="clock" title="No sessions today" body="Your PT sessions and classes for the day will appear here." />
      ) : (
        <>
          <View style={styles.tiles}>
            <StatTile label="Sessions" value={String(sessions.length)} caption={`${classes} class${classes === 1 ? '' : 'es'}`} />
            <StatTile label="Done" value={`${done} / ${sessions.length}`} caption="so far" />
          </View>
          <AppText variant="overline" color={colors.muted}>
            Schedule
          </AppText>
          <View style={styles.list}>
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 12 },
  list: { gap: 10 },
});
