import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, EmptyState, Screen } from '../../components/ui';
import { SessionCard } from '../../features/trainer/SessionCard';
import { useTrainerWeek } from '../../features/trainer/queries';
import { WEEKDAYS, WEEKDAYS_LONG, formatDay, plural } from '../../lib/format';
import { colors, fonts, radius, sizes } from '../../theme/tokens';

/** Trainer · Schedule — the next 7 days. */
export default function Schedule() {
  const week = useTrainerWeek();
  const [index, setIndex] = useState(0);
  const days = week.data ?? [];
  const selected = days[index];

  return (
    <Screen scroll edges={['top']}>
      <AppText variant="title">Schedule</AppText>

      {week.isPending ? (
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading schedule" />
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
            {days.map((d, i) => {
              const date = new Date(d.date);
              const on = i === index;
              return (
                <Pressable
                  key={d.date}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${i === 0 ? 'Today, ' : ''}${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()}, ${plural(d.sessions.length, 'session')}`}
                  onPress={() => setIndex(i)}
                  style={[styles.day, on && styles.dayOn]}
                >
                  <AppText variant="caption" color={on ? colors.onAccent : colors.muted}>
                    {i === 0 ? 'Today' : WEEKDAYS[date.getDay()]}
                  </AppText>
                  <AppText style={[styles.dayNum, { color: on ? colors.onAccent : colors.text }]}>{date.getDate()}</AppText>
                  <View style={[styles.dot, { backgroundColor: d.sessions.length ? (on ? colors.onAccent : colors.accent) : 'transparent' }]} />
                </Pressable>
              );
            })}
          </ScrollView>

          {selected ? (
            <>
              <AppText variant="overline" color={colors.muted}>
                {formatDay(selected.date)} · {plural(selected.sessions.length, 'session')}
              </AppText>
              {selected.sessions.length === 0 ? (
                <EmptyState icon="calendar" title="Nothing scheduled" body="A free day. Sessions your gym books will show up here." />
              ) : (
                <View style={styles.list}>
                  {selected.sessions.map((s) => (
                    <SessionCard key={s.id} session={s} showStatus={index === 0} />
                  ))}
                </View>
              )}
            </>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  strip: { gap: 8, paddingRight: 4 },
  day: {
    width: 58,
    minHeight: sizes.touch + 30,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 10,
  },
  dayOn: { backgroundColor: colors.accent },
  dayNum: { fontFamily: fonts.displayBold, fontSize: 20, lineHeight: 24 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  list: { gap: 10 },
});
