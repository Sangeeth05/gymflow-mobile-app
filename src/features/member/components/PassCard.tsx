import { Pressable, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppText, Icon, StatusPill } from '../../../components/ui';
import { colors, fonts } from '../../../theme/tokens';

type Props = {
  gymName: string;
  memberName: string;
  planLine: string;
  pillLabel: string;
  qrValue: string;
  /** Tap the QR block (opens check-in). */
  onPressQr?: () => void;
  /** Tap the plan line (opens payments). */
  onPressPlan?: () => void;
  /** Ended plans: fade the QR so it doesn't look scannable. */
  dimmed?: boolean;
};

/** The lime "gym pass": gym, white QR block, member name, plan line and a dark status pill. */
export function PassCard({ gymName, memberName, planLine, pillLabel, qrValue, onPressQr, onPressPlan, dimmed }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <AppText style={styles.gym} numberOfLines={1}>
          {gymName}
        </AppText>
        <StatusPill label={pillLabel} tone="onAccent" />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Check-in QR code"
        accessibilityHint="Opens your full-screen check-in code"
        disabled={!onPressQr}
        onPress={onPressQr}
        style={({ pressed }) => [styles.qr, (pressed || dimmed) && styles.qrDim]}
      >
        <QRCode value={qrValue} size={176} backgroundColor={colors.white} color={colors.onAccent} />
      </Pressable>

      <View style={styles.bottom}>
        <AppText style={styles.name} numberOfLines={1}>
          {memberName}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${planLine}. Membership and payments`}
          disabled={!onPressPlan}
          onPress={onPressPlan}
          hitSlop={8}
          style={styles.planRow}
        >
          <AppText variant="caption" color={colors.onAccent} style={styles.plan} numberOfLines={1}>
            {planLine}
          </AppText>
          {onPressPlan ? <Icon name="chevronRight" size={16} color={colors.onAccent} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.accent, borderRadius: 26, padding: 20, gap: 18 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  gym: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.onAccent },
  qr: { alignSelf: 'center', backgroundColor: colors.white, padding: 14, borderRadius: 18 },
  qrDim: { opacity: 0.4 },
  bottom: { gap: 2 },
  name: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28, color: colors.onAccent },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 28 },
  plan: { flexShrink: 1, fontFamily: fonts.medium },
});
