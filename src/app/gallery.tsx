import { Redirect, router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, ListRow, Screen, ScreenHeader, Segmented, SwitchRow } from '../components/ui';
import type { Role } from '../features/auth/types';
import { useSession } from '../features/auth/session';
import { scenarioLabels, useDevStore, type MembershipScenario } from '../features/dev/devStore';
import { useMemberStore } from '../features/member/memberStore';
import { resetMemberState } from '../features/member/resetMemberState';
import { colors, fonts, radius, sizes } from '../theme/tokens';

type Entry = { title: string; href: Href; route: string; role?: Role };

/** Every screen, grouped. `role` = the screen needs that role (the gallery switches it for you). */
const SECTIONS: { title: string; entries: Entry[] }[] = [
  {
    title: 'Root',
    entries: [
      { title: 'No account', route: '/no-account', href: { pathname: '/no-account', params: { phone: '9999999999' } } },
      { title: 'Update required', route: '/update-required', href: '/update-required' },
    ],
  },
  {
    title: 'Onboarding',
    entries: [
      { title: 'Is this you?', route: '/confirm-profile', href: '/confirm-profile' },
      { title: 'Choose a gym', route: '/gym-picker', href: '/gym-picker' },
    ],
  },
  {
    title: 'Member tabs',
    entries: [
      { title: 'Pass', route: '/pass', href: '/pass', role: 'member' },
      { title: 'Activity', route: '/activity', href: '/activity', role: 'member' },
      { title: 'Classes', route: '/classes', href: '/classes', role: 'member' },
      { title: 'Profile', route: '/profile', href: '/profile', role: 'member' },
    ],
  },
  {
    title: 'Check-in',
    entries: [
      { title: 'Check in', route: '/check-in', href: '/check-in', role: 'member' },
      { title: 'Checked in · success', route: '/checked-in?result=success', href: { pathname: '/checked-in', params: { result: 'success' } }, role: 'member' },
      { title: 'Checked in · plan ended', route: '/checked-in?result=expired', href: { pathname: '/checked-in', params: { result: 'expired' } }, role: 'member' },
    ],
  },
  {
    title: 'Membership',
    entries: [
      { title: 'Membership & payments', route: '/payments', href: '/payments', role: 'member' },
      { title: 'Receipt', route: '/receipt/p_0142', href: { pathname: '/receipt/[id]', params: { id: 'p_0142' } }, role: 'member' },
      { title: 'Notifications', route: '/notifications', href: '/notifications', role: 'member' },
    ],
  },
  {
    title: 'Profile & settings',
    entries: [
      { title: 'Edit profile', route: '/edit-profile', href: '/edit-profile', role: 'member' },
      { title: 'Contact the gym', route: '/gym-info', href: '/gym-info', role: 'member' },
      { title: 'Whose pass?', route: '/family', href: '/family', role: 'member' },
      { title: 'Goals', route: '/goals', href: '/goals', role: 'member' },
      { title: 'Reminders', route: '/reminders', href: '/reminders', role: 'member' },
      { title: 'Delete account', route: '/delete-account', href: '/delete-account', role: 'member' },
    ],
  },
  {
    title: 'Trainer',
    entries: [
      { title: 'Today', route: '/today', href: '/today', role: 'trainer' },
      { title: 'Members', route: '/clients', href: '/clients', role: 'trainer' },
      { title: 'Schedule', route: '/schedule', href: '/schedule', role: 'trainer' },
      { title: 'Profile', route: '/account', href: '/account', role: 'trainer' },
    ],
  },
];

const SCENARIOS = Object.keys(scenarioLabels) as MembershipScenario[];

/** Dev-only: open any screen and flip mock states. */
export default function Gallery() {
  const session = useSession((s) => s.session);
  const switchGym = useSession((s) => s.switchGym);
  const markOnboarded = useSession((s) => s.markOnboarded);
  const scenario = useDevStore((s) => s.scenario);
  const setScenario = useDevStore((s) => s.setScenario);
  const offline = useDevStore((s) => s.offline);
  const setOffline = useDevStore((s) => s.setOffline);
  const resetDev = useDevStore((s) => s.reset);
  const activeMemberId = useMemberStore((s) => s.activeMemberId);
  const setActiveMember = useMemberStore((s) => s.setActiveMember);

  if (!__DEV__) return <Redirect href="/" />;

  function open(entry: Entry) {
    if (entry.role && session) {
      if (session.role !== entry.role) switchGym(session.gym, entry.role);
      if (!session.onboarded) markOnboarded();
    }
    router.push(entry.href);
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Screen gallery" />

      <View style={styles.section}>
        <AppText variant="overline" color={colors.muted}>
          Membership state
        </AppText>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {SCENARIOS.map((s) => {
            const on = s === scenario;
            return (
              <Pressable
                key={s}
                accessibilityRole="radio"
                accessibilityLabel={scenarioLabels[s]}
                accessibilityState={{ checked: on }}
                onPress={() => setScenario(s)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <AppText style={[styles.chipText, { color: on ? colors.onAccent : colors.text }]}>{scenarioLabels[s]}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="overline" color={colors.muted}>
          Whose pass
        </AppText>
        <Segmented
          accessibilityLabel="Whose pass"
          options={[
            { value: 'm_arjun', label: 'Arjun' },
            { value: 'm_aarav', label: 'Aarav' },
          ]}
          value={activeMemberId}
          onChange={setActiveMember}
        />
      </View>

      <SwitchRow title="Simulate offline" subtitle="Pass and Activity offline states" value={offline} onValueChange={setOffline} />
      <Button
        label="Reset everything"
        variant="secondary"
        accessibilityHint="Resets mock state, profile edits, notifications and the query cache"
        onPress={() => {
          resetDev();
          resetMemberState();
        }}
      />

      {!session ? (
        <AppText variant="caption" color={colors.warning}>
          Sign in first to open member and trainer screens. Root screens work signed out.
        </AppText>
      ) : (
        <AppText variant="caption" color={colors.muted}>
          Signed in as {session.role}. Opening a screen for the other role switches it for you.
        </AppText>
      )}

      {/* Signed out, only root screens can open; the rest redirect to login. */}
      {SECTIONS.filter((section) => session || section.title === 'Root').map((section) => (
        <View key={section.title} style={styles.section}>
          <AppText variant="overline" color={colors.muted}>
            {section.title}
          </AppText>
          {section.entries.map((e) => (
            <ListRow key={e.route} title={e.title} subtitle={e.route} onPress={() => open(e)} />
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: sizes.touch,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.medium, fontSize: 14 },
});
