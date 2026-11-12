import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, Screen, ScreenHeader, Stepper } from '../../components/ui';
import { GOAL_OPTIONS, useMemberStore, type Goal } from '../../features/member/memberStore';
import { colors, fonts, radius, sizes } from '../../theme/tokens';

/** 7.5 · Goals */
export default function Goals() {
  const savedGoals = useMemberStore((s) => s.goals);
  const savedWeekly = useMemberStore((s) => s.weeklyGoal);
  const saveGoals = useMemberStore((s) => s.saveGoals);
  const [goals, setGoals] = useState<Goal[]>(savedGoals);
  const [weekly, setWeekly] = useState(savedWeekly ?? 3);

  const toggle = (g: Goal) => setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]));

  return (
    <Screen scroll>
      <ScreenHeader title="Your goals" />

      <View style={styles.section}>
        <AppText variant="headline">What are you training for?</AppText>
        <AppText variant="caption" color={colors.muted}>
          Pick any that fit. Your trainer sees these too.
        </AppText>
        <View style={styles.chips}>
          {GOAL_OPTIONS.map((g) => {
            const on = goals.includes(g);
            return (
              <Pressable
                key={g}
                accessibilityRole="checkbox"
                accessibilityLabel={g}
                accessibilityState={{ checked: on }}
                onPress={() => toggle(g)}
                style={[styles.chip, on && styles.chipOn]}
              >
                {on ? <Icon name="check" size={16} color={colors.onAccent} strokeWidth={3} /> : null}
                <AppText style={[styles.chipText, { color: on ? colors.onAccent : colors.text }]}>{g}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Card>
        <AppText variant="headline">Visits per week</AppText>
        <AppText variant="caption" color={colors.muted}>
          We’ll show your progress on the Activity tab.
        </AppText>
        <Stepper value={weekly} onChange={setWeekly} min={1} max={7} label="visits per week" />
      </Card>

      <Button
        label="Save"
        onPress={() => {
          saveGoals(goals, weekly);
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: sizes.touch,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 14 },
});
