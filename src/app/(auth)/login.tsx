import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Icon, Input, Screen } from '../../components/ui';
import { sendOtp } from '../../features/auth/mockAuth';
import { colors, fonts } from '../../theme/tokens';

/** 2.1 · Phone number */
export default function Login() {
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const digits = phone.replace(/\D/g, '').slice(0, 10);
  const ready = digits.length === 10;

  async function onSend() {
    setBusy(true);
    try {
      await sendOtp(digits);
      router.push({ pathname: '/otp', params: { phone: digits } });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Icon name="logo" size={22} color={colors.onAccent} strokeWidth={2.4} />
        </View>
        <AppText style={styles.brandName}>GymFlow</AppText>
      </View>

      <View style={styles.intro}>
        <AppText variant="display">Your gym pass,{'\n'}one code away</AppText>
        <AppText color={colors.muted}>
          Enter the phone number you gave your gym. We’ll send you a 6-digit code.
        </AppText>
      </View>

      <Input
        label="Phone number"
        left={<AppText style={styles.prefix}>+91</AppText>}
        placeholder="98765 43210"
        keyboardType="number-pad"
        autoComplete="tel-national"
        textContentType="telephoneNumber"
        maxLength={10}
        value={digits}
        onChangeText={setPhone}
        hint="Code arrives on WhatsApp or SMS"
      />

      <View style={styles.spacer} />

      <Button label="Send code" disabled={!ready} loading={busy} onPress={onSend} />
      <AppText variant="caption" color={colors.muted} align="center">
        Gym owner? Sign in on the web portal.
      </AppText>
      {__DEV__ ? <Button label="Screen gallery (dev)" variant="text" onPress={() => router.push('/gallery')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  logo: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontFamily: fonts.displayBold, fontSize: 20 },
  intro: { gap: 10, marginVertical: 12 },
  prefix: { fontFamily: fonts.semibold, fontSize: 16, paddingRight: 10, borderRightWidth: 1, borderRightColor: colors.border },
  spacer: { flex: 1 },
});
