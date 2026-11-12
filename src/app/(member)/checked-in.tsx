import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, Screen, StatTile } from '../../components/ui';
import { useActiveMember } from '../../features/member/memberStore';
import { summarizeMembership } from '../../features/member/membership';
import { useCheckIns, useMembership } from '../../features/member/queries';
import { firstName, formatTime } from '../../lib/format';
import { colors } from '../../theme/tokens';

function close() {
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/pass');
}

/** 4.2 · Checked in (success) / plan ended (expired) */
export default function CheckedIn() {
  const { result = 'success' } = useLocalSearchParams<{ result?: 'success' | 'expired' }>();
  const member = useActiveMember();
  const membership = useMembership(member.id);
  const checkIns = useCheckIns(member.id);

  if (result === 'expired') {
    return (
      <Screen>
        <View style={styles.body}>
          <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
            <Icon name="close" size={48} color={colors.danger} strokeWidth={2.6} />
          </View>
          <AppText variant="display" align="center" accessibilityRole="header">
            Your plan has ended
          </AppText>
          <AppText color={colors.muted} align="center" style={styles.copy}>
            We couldn’t check you in. Renew at the front desk (UPI or cash) and your pass works again right away.
          </AppText>
        </View>
        <Button label="See membership" onPress={() => router.replace('/payments')} />
        <Button label="Close" variant="secondary" onPress={close} />
      </Screen>
    );
  }

  const now = new Date();
  // +1: this visit isn't in the cached list yet.
  const visitsThisMonth =
    (checkIns.data ?? []).filter((c) => {
      const d = new Date(c.at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length + 1;
  const daysLeft = membership.data ? summarizeMembership(membership.data).daysLeft : null;

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Icon name="check" size={52} color={colors.onAccent} strokeWidth={3} />
        </View>
        <AppText variant="display" align="center" accessibilityRole="header" accessibilityLiveRegion="assertive">
          You’re in, {firstName(member.name)}!
        </AppText>
        <AppText color={colors.muted} align="center">
          Checked in at {formatTime(now)}. Have a good session.
        </AppText>
        <View style={styles.tiles}>
          <StatTile label="This month" value={String(visitsThisMonth)} caption={visitsThisMonth === 1 ? 'visit' : 'visits'} />
          <StatTile label="Plan" value={daysLeft === null ? '–' : String(Math.max(0, daysLeft))} caption="days left" />
        </View>
      </View>
      <Button label="Done" onPress={close} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  badge: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  copy: { maxWidth: 310 },
  tiles: { flexDirection: 'row', gap: 12, alignSelf: 'stretch', marginTop: 12 },
});
