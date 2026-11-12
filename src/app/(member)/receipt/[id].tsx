import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, Share, StyleSheet, View } from 'react-native';
import { AppText, Button, EmptyState, Icon, Screen, ScreenHeader, StatusPill } from '../../../components/ui';
import { useGym, usePayment } from '../../../features/member/queries';
import { formatDate, formatINR, formatTime } from '../../../lib/format';
import { members } from '../../../mocks/data';
import { colors, fonts, radius } from '../../../theme/tokens';

/** 6.2 · Receipt */
export default function Receipt() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const payment = usePayment(id);
  const gym = useGym();

  if (payment.isPending) {
    return (
      <Screen>
        <ScreenHeader title="Receipt" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading receipt" />
        </View>
      </Screen>
    );
  }

  const p = payment.data;
  if (!p) {
    return (
      <Screen>
        <ScreenHeader title="Receipt" />
        <EmptyState icon="receipt" title="Receipt not found" body="It may have been removed by the gym." />
      </Screen>
    );
  }

  const rows: [string, string][] = [
    ['Receipt no.', p.receiptNo],
    ['Member', members[p.memberId].name],
    ['Date', `${formatDate(p.paidAt)}, ${formatTime(p.paidAt)}`],
    ['Plan', p.planName],
    ['Period', `${formatDate(p.periodStart)} – ${formatDate(p.periodEnd)}`],
    ['Method', p.method],
    ['Recorded by', p.recordedBy],
    ['GSTIN', gym.data?.gstin ?? '…'],
  ];

  async function onShare() {
    if (!p) return;
    const text = [
      `${gym.data?.name ?? 'GymFlow'} — payment receipt`,
      `Amount: ${formatINR(p.amount)}`,
      ...rows.map(([k, v]) => `${k}: ${v}`),
    ].join('\n');
    try {
      await Share.share({ message: text, title: `Receipt ${p.receiptNo}` });
    } catch {
      Alert.alert('Couldn’t share', 'Try again in a moment.');
    }
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Receipt" />

      <View style={styles.hero}>
        <AppText variant="caption" color={colors.muted}>
          {gym.data?.name}
        </AppText>
        <AppText style={styles.amount} accessibilityLabel={`Amount paid ${formatINR(p.amount)}`}>
          {formatINR(p.amount)}
        </AppText>
        <StatusPill label="Paid" />
      </View>

      <View style={styles.rows}>
        {rows.map(([label, value], i) => (
          <View key={label} style={[styles.row, i > 0 && styles.divider]} accessible accessibilityLabel={`${label}: ${value}`}>
            <AppText color={colors.muted}>{label}</AppText>
            <AppText style={styles.value}>{value}</AppText>
          </View>
        ))}
      </View>

      {gym.data ? (
        <AppText variant="caption" color={colors.muted} align="center">
          {gym.data.addressLines.join(', ')}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        <Button label="Share" variant="secondary" icon={<Icon name="share" size={18} />} onPress={onShare} style={styles.flex} />
        <Button
          label="Download PDF"
          variant="secondary"
          icon={<Icon name="download" size={18} />}
          onPress={() => Alert.alert('Coming soon', 'PDF receipts are on the way. Use Share for now.')}
          style={styles.flex}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  amount: { fontFamily: fonts.displayBold, fontSize: 40, lineHeight: 46 },
  rows: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 14 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  value: { flexShrink: 1, textAlign: 'right', fontFamily: fonts.medium },
  actions: { flexDirection: 'row', gap: 10 },
});
