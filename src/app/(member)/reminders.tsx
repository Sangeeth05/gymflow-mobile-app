import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, Screen, ScreenHeader, SwitchRow } from '../../components/ui';
import { useMemberStore } from '../../features/member/memberStore';
import { colors, radius } from '../../theme/tokens';

/**
 * 7.6 · Reminders. Only saves preferences for now — asking for OS push
 * permission comes with expo-notifications once the API can send pushes.
 */
export default function Reminders() {
  const saved = useMemberStore((s) => s.reminders);
  const saveReminders = useMemberStore((s) => s.saveReminders);
  const [prefs, setPrefs] = useState(saved);

  return (
    <Screen scroll>
      <ScreenHeader title="Reminders" />

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Icon name="bell" size={30} color={colors.accent} />
        </View>
        <AppText variant="title" align="center">
          Never miss a renewal
        </AppText>
        <AppText color={colors.muted} align="center">
          Choose what we remind you about. You can change this any time in Profile.
        </AppText>
      </View>

      <View style={styles.list}>
        <SwitchRow
          title="Membership reminders"
          subtitle="7 days and 1 day before your plan ends"
          value={prefs.membership}
          onValueChange={(v) => setPrefs((p) => ({ ...p, membership: v }))}
        />
        <SwitchRow
          title="Session updates"
          subtitle="When a trainer moves or cancels a session"
          value={prefs.sessions}
          onValueChange={(v) => setPrefs((p) => ({ ...p, sessions: v }))}
        />
        <SwitchRow
          title="Gym news"
          subtitle="Holiday hours, offers and new classes"
          value={prefs.news}
          onValueChange={(v) => setPrefs((p) => ({ ...p, news: v }))}
        />
      </View>

      <View style={styles.spacer} />
      <Button
        label="Turn on"
        onPress={() => {
          saveReminders(prefs);
          router.back();
        }}
      />
      <Button
        label="Not now"
        variant="text"
        onPress={() => {
          saveReminders({ membership: false, sessions: false, news: false });
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 10, marginVertical: 8 },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: 8, borderRadius: radius.card },
  spacer: { flex: 1, minHeight: 8 },
});
