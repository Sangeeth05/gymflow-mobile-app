import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, ListRow, ProgressBar, Screen, ScreenHeader, StatusPill } from '../../components/ui';
import { Banner } from '../../features/member/components/Banner';
import { useActiveMember } from '../../features/member/memberStore';
import { summarizeMembership } from '../../features/member/membership';
import { useMembership, usePayments } from '../../features/member/queries';
import { firstName, formatDate, formatINR, plural } from '../../lib/format';
import { members, type Membership } from '../../mocks/data';
import { colors, fonts } from '../../theme/tokens';

/** 6.1 · Membership & payments */
export default function Payments() {
  const member = useActiveMember();
  const membership = useMembership(member.id);
  const payments = usePayments();

  return (
    <Screen scroll>
      <ScreenHeader title="Membership & payments" />

      {membership.isPending ? (
        <Card style={styles.loading}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading membership" />
        </Card>
      ) : membership.data ? (
        <PlanCard membership={membership.data} memberName={member.name} />
      ) : (
        <Card bordered>
          <AppText variant="headline">No active plan</AppText>
          <AppText color={colors.muted}>{firstName(member.name)} doesn’t have a plan right now. Pick one at the front desk.</AppText>
        </Card>
      )}

      <Banner
        tone="neutral"
        icon="info"
        title="Renew at the front desk (UPI or cash)"
        body="Your receipt shows up here as soon as the desk records the payment."
      />

      <AppText variant="overline" color={colors.muted}>
        Payment history
      </AppText>
      {payments.isPending ? (
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading payments" />
      ) : (
        <View style={styles.list}>
          {(payments.data ?? []).map((p) => (
            <ListRow
              key={p.id}
              title={`${formatINR(p.amount)} · ${firstName(members[p.memberId].name)}`}
              subtitle={`${formatDate(p.paidAt)} · ${p.method} · ${p.receiptNo}`}
              left={<Icon name="receipt" size={18} color={colors.accent} />}
              onPress={() => router.push({ pathname: '/receipt/[id]', params: { id: p.id } })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function PlanCard({ membership: m, memberName }: { membership: Membership; memberName: string }) {
  const s = summarizeMembership(m);
  const daysText =
    m.status === 'upcoming'
      ? `Starts ${formatDate(m.startDate)}`
      : m.status === 'paused'
        ? `Paused until ${formatDate(m.pausedUntil ?? m.endDate)}`
        : s.ended
          ? `Ended ${formatDate(m.endDate)}`
          : `${plural(s.daysLeft, 'day')} left`;
  return (
    <Card>
      <View style={styles.planTop}>
        <AppText variant="caption" color={colors.muted} style={styles.flex}>
          {memberName}
        </AppText>
        <StatusPill label={s.pill.label} tone={s.pill.tone} />
      </View>
      <AppText variant="title">{m.planName}</AppText>
      <AppText style={styles.price}>{formatINR(m.price)}</AppText>
      <ProgressBar
        value={m.status === 'upcoming' ? 0 : s.progress}
        color={s.ended ? colors.danger : s.endsSoon ? colors.warning : colors.accent}
        accessibilityLabel="Plan used so far"
      />
      <View style={styles.planTop}>
        <AppText variant="caption" color={colors.muted} style={styles.flex}>
          {formatDate(m.startDate)} – {formatDate(m.endDate)}
        </AppText>
        <AppText variant="caption" color={s.ended ? colors.dangerText : s.endsSoon ? colors.warning : colors.textSoft}>
          {daysText}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { height: 180, alignItems: 'center', justifyContent: 'center' },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34 },
  list: { gap: 8 },
});
