import { Alert, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, Screen } from '../components/ui';
import { useSession } from '../features/auth/session';
import { useMembership } from '../features/member/queries';
import { colors, fonts } from '../theme/tokens';

/** 1.3 · Update required (forced update). The member code still gets them in today. */
export default function UpdateRequired() {
  const signedIn = useSession((s) => s.session !== null);
  const membership = useMembership('m_arjun');
  const code = signedIn ? membership.data?.memberCode : undefined;

  return (
    <Screen>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Icon name="download" size={36} color={colors.accent} strokeWidth={1.8} />
        </View>
        <AppText variant="display" align="center" accessibilityRole="header">
          Update GymFlow
        </AppText>
        <AppText color={colors.muted} align="center" style={styles.copy}>
          This version is no longer supported. Update to keep using your pass. It only takes a minute.
        </AppText>
      </View>

      {code ? (
        <Card bordered style={styles.codeCard}>
          <AppText variant="overline" color={colors.muted}>
            At the gym right now?
          </AppText>
          <AppText style={styles.code} accessibilityLabel={`Member code ${code.split('').join(' ')}`}>
            {code}
          </AppText>
          <AppText variant="caption" color={colors.muted} align="center">
            Tell the front desk your member code to check in.
          </AppText>
        </Card>
      ) : null}

      <Button
        label="Update now"
        onPress={() => Alert.alert('Store link', 'This opens the App Store or Play Store once the app is published.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  copy: { maxWidth: 300 },
  codeCard: { alignItems: 'center' },
  code: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, letterSpacing: 3 },
});
