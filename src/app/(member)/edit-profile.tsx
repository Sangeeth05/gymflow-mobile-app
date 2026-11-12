import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, Icon, Input, Screen, ScreenHeader } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { useMemberStore } from '../../features/member/memberStore';
import { formatPhone } from '../../lib/format';
import { colors } from '../../theme/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 7.2 · Edit profile */
export default function EditProfile() {
  const phone = useSession((s) => s.session?.user.phone ?? '');
  const profile = useMemberStore((s) => s.profile);
  const saveProfile = useMemberStore((s) => s.saveProfile);
  const [draft, setDraft] = useState(profile);
  const [touched, setTouched] = useState<{ email?: boolean; emergencyPhone?: boolean }>({});

  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const emergencyDigits = draft.emergencyPhone.replace(/\D/g, '');
  const errors = {
    name: draft.name.trim().length < 2 ? 'Enter your name' : null,
    email: draft.email.trim() && !EMAIL_RE.test(draft.email.trim()) ? 'Enter a valid email, like name@example.com' : null,
    emergencyPhone: emergencyDigits && emergencyDigits.length !== 10 ? 'Enter a 10-digit mobile number' : null,
  };
  const valid = !errors.name && !errors.email && !errors.emergencyPhone;
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  function onSave() {
    setTouched({ email: true, emergencyPhone: true });
    if (!valid) return;
    saveProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim(), emergencyPhone: emergencyDigits });
    router.back();
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Edit profile" />

      <View style={styles.photo}>
        <Avatar name={draft.name || profile.name} size={96} hasPhoto={draft.hasPhoto} ring={draft.hasPhoto} />
        <View style={styles.photoActions}>
          <Button
            label={draft.hasPhoto ? 'Change photo' : 'Add photo'}
            variant="secondary"
            icon={<Icon name="camera" size={18} />}
            onPress={() => set('hasPhoto', true)}
            style={styles.photoButton}
          />
          {draft.hasPhoto ? (
            <Button label="Remove" variant="text" onPress={() => set('hasPhoto', false)} style={styles.photoButton} />
          ) : null}
        </View>
      </View>

      <Input label="Name" value={draft.name} onChangeText={(v) => set('name', v)} autoCapitalize="words" error={errors.name} />

      <View style={styles.phoneRow}>
        <View style={styles.flex}>
          <Input label="Phone" value={`+91 ${formatPhone(phone)}`} editable={false} hint="Used to sign in" />
        </View>
        <Button
          label="Change"
          variant="text"
          onPress={() =>
            Alert.alert(
              'Change your number',
              'Your gym links your pass to this number. Ask the front desk to update it, then sign in with the new one.',
            )
          }
          style={styles.change}
        />
      </View>

      <Input
        label="Email (optional)"
        value={draft.email}
        onChangeText={(v) => set('email', v)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={touched.email ? errors.email : null}
        hint="For receipts and reminders"
      />

      <AppText variant="overline" color={colors.muted}>
        Emergency contact
      </AppText>
      <Input label="Name" value={draft.emergencyName} onChangeText={(v) => set('emergencyName', v)} autoCapitalize="words" />
      <Input
        label="Mobile number"
        value={draft.emergencyPhone}
        onChangeText={(v) => set('emergencyPhone', v)}
        onBlur={() => setTouched((t) => ({ ...t, emergencyPhone: true }))}
        keyboardType="number-pad"
        maxLength={11}
        error={touched.emergencyPhone ? errors.emergencyPhone : null}
      />

      <Button label="Save" disabled={!dirty} onPress={onSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  photo: { alignItems: 'center', gap: 12 },
  photoActions: { flexDirection: 'row', gap: 8 },
  photoButton: { minHeight: 44 },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  change: { marginTop: 22 },
});
