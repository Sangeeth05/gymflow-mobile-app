import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, EmptyState, Icon, ListRow, ProgressBar, Screen } from '../../../components/ui';
import { useIsOffline } from '../../../features/dev/devStore';
import { MonthCalendar } from '../../../features/member/components/MonthCalendar';
import { useActiveMember, useMemberStore } from '../../../features/member/memberStore';
import { checkInMethodIcon, checkInMethodLabel } from '../../../features/member/membership';
import { useCheckIns } from '../../../features/member/queries';
import { firstName, formatDay, formatMonth, formatTime, startOfDay } from '../../../lib/format';
import { colors, fonts } from '../../../theme/tokens';

/** Monday 00:00 of the current week. */
function startOfWeek(): Date {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/** 5.3 · Activity */
export default function Activity() {
  const member = useActiveMember();
  const isChild = member.relation !== 'self';
  const weeklyGoal = useMemberStore((s) => s.weeklyGoal);
  const offline = useIsOffline();
  const checkIns = useCheckIns(member.id);

  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const isCurrentMonth = cursor.year === today.getFullYear() && cursor.month === today.getMonth();
  const shiftMonth = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const title = isChild ? `${firstName(member.name)}'s activity` : 'Activity';

  if (offline) {
    return (
      <Screen edges={['top']}>
        <AppText variant="title">{title}</AppText>
        <EmptyState
          icon="wifiOff"
          title="No internet"
          body="Connect to see your visits. Your pass still works offline."
          action={<Button label="Try again" variant="secondary" onPress={() => checkIns.refetch()} />}
        />
      </Screen>
    );
  }

  if (checkIns.isPending) {
    return (
      <Screen edges={['top']}>
        <AppText variant="title">{title}</AppText>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading visits" />
        </View>
      </Screen>
    );
  }

  const visits = checkIns.data ?? [];
  if (visits.length === 0) {
    return (
      <Screen edges={['top']}>
        <AppText variant="title">{title}</AppText>
        <EmptyState
          icon="activity"
          title="No visits yet"
          body="Show your pass at the front desk and your first visit will appear here."
        />
      </Screen>
    );
  }

  const inMonth = visits.filter((v) => {
    const d = new Date(v.at);
    return d.getFullYear() === cursor.year && d.getMonth() === cursor.month;
  });
  const weekStart = startOfWeek().getTime();
  const thisWeek = visits.filter((v) => new Date(v.at).getTime() >= weekStart).length;

  return (
    <Screen scroll edges={['top']}>
      <AppText variant="title">{title}</AppText>

      <MonthCalendar
        year={cursor.year}
        month={cursor.month}
        visits={visits.map((v) => v.at)}
        onPrev={() => shiftMonth(-1)}
        onNext={() => shiftMonth(1)}
        nextDisabled={isCurrentMonth}
      />

      <Card>
        <View style={styles.countRow}>
          <AppText style={styles.count}>{inMonth.length}</AppText>
          <AppText color={colors.muted} style={styles.flex}>
            {inMonth.length === 1 ? 'visit' : 'visits'} in {formatMonth(cursor.year, cursor.month)}
          </AppText>
        </View>
        {isChild ? null : weeklyGoal ? (
          <View style={styles.goal}>
            <View style={styles.goalRow}>
              <AppText variant="caption" color={colors.textSoft}>
                This week
              </AppText>
              <AppText variant="caption" color={thisWeek >= weeklyGoal ? colors.accent : colors.textSoft}>
                {thisWeek} of {weeklyGoal} {thisWeek >= weeklyGoal ? '· goal met' : ''}
              </AppText>
            </View>
            <ProgressBar value={thisWeek / weeklyGoal} accessibilityLabel={`Weekly goal: ${thisWeek} of ${weeklyGoal} visits`} />
          </View>
        ) : (
          <Button
            label="Set a weekly goal"
            variant="text"
            icon={<Icon name="target" size={18} color={colors.accent} />}
            onPress={() => router.push('/goals')}
            style={styles.goalButton}
          />
        )}
      </Card>

      <AppText variant="overline" color={colors.muted}>
        Recent visits
      </AppText>
      <View style={styles.list}>
        {visits.slice(0, 12).map((v) => (
          <ListRow
            key={v.id}
            title={formatDay(v.at)}
            subtitle={`${formatTime(v.at)} · ${checkInMethodLabel[v.method]}`}
            left={<Icon name={checkInMethodIcon[v.method]} size={18} color={colors.accent} />}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  count: { fontFamily: fonts.displayBold, fontSize: 36, lineHeight: 42 },
  goal: { gap: 8 },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  goalButton: { alignSelf: 'flex-start', marginLeft: -8 },
  list: { gap: 8 },
});
