import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppText, Card, Icon, Screen, StatusPill } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { colors, fonts, radius, sizes } from '../../theme/tokens';

/** 2.5 / Home C · Gym pass (placeholder data until the API exists) */
export default function Pass() {
  const session = useSession((s) => s.session);
  if (!session) return null;
  const firstName = session.user.name.split(' ')[0];

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <View>
          <AppText variant="caption" color={colors.muted}>
            {session.gym.name}
          </AppText>
          <AppText variant="title">Hi, {firstName}</AppText>
        </View>
        <View style={styles.bell} accessibilityLabel="Notifications" accessibilityRole="button">
          <Icon name="bell" size={20} />
        </View>
      </View>

      <Card tone="accent" style={styles.pass}>
        <View style={styles.passTop}>
          <AppText style={styles.onAccentStrong}>{session.gym.name}</AppText>
          <StatusPill label="Active" tone="onAccent" />
        </View>
        <View style={styles.qrWrap} accessible accessibilityLabel="Your check-in QR code">
          <QRCode value={`gymflow:${session.user.id}`} size={168} backgroundColor={colors.white} color={colors.onAccent} />
        </View>
        <View>
          <AppText style={styles.memberName}>{session.user.name}</AppText>
          <AppText variant="caption" color={colors.onAccent}>
            [Plan name] · until [end date]
          </AppText>
        </View>
      </Card>

      <AppText variant="caption" color={colors.muted} align="center">
        Placeholder pass — real plan and rotating code come from the API.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bell: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pass: { borderRadius: 26, gap: 18 },
  passTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  onAccentStrong: { fontFamily: fonts.semibold, fontSize: 14, color: colors.onAccent },
  qrWrap: { alignSelf: 'center', backgroundColor: colors.white, padding: 14, borderRadius: 18 },
  memberName: { fontFamily: fonts.displayBold, fontSize: 20, color: colors.onAccent },
});
