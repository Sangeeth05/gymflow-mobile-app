import { StyleSheet, View } from 'react-native';
import { AppText, Icon, StatusPill, type PillTone } from '../../components/ui';
import { formatTime } from '../../lib/format';
import type { SessionStatus, TrainerSession } from '../../mocks/data';
import { colors, fonts, radius } from '../../theme/tokens';

const STATUS: Record<SessionStatus, { label: string; tone: PillTone }> = {
  done: { label: 'Done', tone: 'neutral' },
  next: { label: 'Next', tone: 'active' },
  later: { label: 'Later', tone: 'neutral' },
};

/** One PT session or class in the trainer's day. */
export function SessionCard({ session, showStatus = true }: { session: TrainerSession; showStatus?: boolean }) {
  const s = STATUS[session.status];
  const isNext = showStatus && session.status === 'next';
  const isDone = showStatus && session.status === 'done';
  return (
    <View
      style={[styles.card, isNext && styles.next, isDone && styles.done]}
      accessible
      accessibilityLabel={`${formatTime(session.start)}, ${session.title}, ${session.detail}, ${session.durationMin} minutes${showStatus ? `, ${s.label}` : ''}`}
    >
      <View style={styles.time}>
        <AppText style={styles.timeText}>{formatTime(session.start)}</AppText>
        <AppText variant="caption" color={colors.muted}>
          {session.durationMin} min
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="bodyMedium">{session.title}</AppText>
        <View style={styles.detail}>
          <Icon name={session.kind === 'class' ? 'users' : 'user'} size={14} color={colors.muted} />
          <AppText variant="caption" color={colors.textSoft}>
            {session.detail}
          </AppText>
        </View>
      </View>
      {showStatus ? <StatusPill label={s.label} tone={s.tone} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  next: { borderColor: colors.accent },
  done: { opacity: 0.6 },
  time: { width: 68, gap: 2 },
  timeText: { fontFamily: fonts.displaySemi, fontSize: 15 },
  body: { flex: 1, gap: 4 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
