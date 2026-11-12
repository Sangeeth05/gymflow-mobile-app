import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, Input, Screen } from '../../components/ui';
import { MOCK_NO_ACCOUNT_PHONE, MOCK_OTP, NoAccountError, verifyOtp } from '../../features/auth/mockAuth';
import { useSession } from '../../features/auth/session';
import type { Role } from '../../features/auth/types';
import { colors, fonts, radius, sizes } from '../../theme/tokens';

/** 2.2 · OTP */
export default function Otp() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const setSession = useSession((s) => s.setSession);
  const [code, setCode] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const digits = code.replace(/\D/g, '').slice(0, 6);

  async function onVerify() {
    setBusy(true);
    setError(null);
    try {
      const session = await verifyOtp(phone, digits, role);
      setSession(session);
      router.replace('/');
    } catch (e) {
      if (e instanceof NoAccountError) {
        router.replace({ pathname: '/no-account', params: { phone } });
        return;
      }
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}>
        <Icon name="chevronLeft" size={20} />
      </Pressable>

      <View style={styles.intro}>
        <AppText variant="display" style={styles.title}>
          Enter the code
        </AppText>
        <AppText color={colors.muted}>Sent to +91 {phone}</AppText>
      </View>

      <Input
        label="6-digit code"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={6}
        value={digits}
        onChangeText={setCode}
        error={error}
        inputStyle={styles.code}
        autoFocus
      />

      {__DEV__ ? (
        <Card bordered>
          <AppText variant="overline" color={colors.warning}>
            Dev only · mock login
          </AppText>
          <AppText variant="caption" color={colors.textSoft}>
            Use code {MOCK_OTP} (phone {MOCK_NO_ACCOUNT_PHONE} shows the no-account screen). Pick which side of the app to open:
          </AppText>
          <View style={styles.segment}>
            {(['member', 'trainer'] as const).map((r) => {
              const on = role === r;
              return (
                <Pressable
                  key={r}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => setRole(r)}
                  style={[styles.segmentItem, on && styles.segmentOn]}
                >
                  <AppText style={[styles.segmentText, { color: on ? colors.onAccent : colors.muted }]}>
                    {r === 'member' ? 'Member' : 'Trainer'}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ) : null}

      <View style={styles.spacer} />

      <Button label="Verify" disabled={digits.length !== 6} loading={busy} onPress={onVerify} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: { gap: 8, marginVertical: 8 },
  title: { fontSize: 30 },
  code: { fontFamily: fonts.displayBold, fontSize: 26, letterSpacing: 10 },
  segment: { flexDirection: 'row', padding: 4, borderRadius: radius.control, backgroundColor: colors.raised },
  segmentItem: { flex: 1, minHeight: sizes.touch, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.accent },
  segmentText: { fontFamily: fonts.semibold, fontSize: 14 },
  spacer: { flex: 1 },
});
