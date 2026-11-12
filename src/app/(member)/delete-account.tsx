import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Checkbox, Icon, Screen, ScreenHeader, type IconName } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { Banner } from '../../features/member/components/Banner';
import { resetMemberState } from '../../features/member/resetMemberState';
import { colors } from '../../theme/tokens';

const DELETED = ['Your profile, photo and email', 'Goals and reminder settings', 'Sign-in on all your devices'];
const KEPT = [
  'Membership and payment records (needed for GST and accounts)',
  'Visit history, kept by the gym for its records',
];

/** 7.7 · Privacy & data → delete account */
export default function DeleteAccount() {
  const signOut = useSession((s) => s.signOut);
  const [confirmed, setConfirmed] = useState(false);

  function onDelete() {
    Alert.alert('Delete your account?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Mock: the API call goes here. Then clear everything local.
          resetMemberState();
          signOut();
          router.replace('/login');
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Privacy & data" />
      <AppText variant="title">Delete your account</AppText>

      <Card>
        <AppText variant="headline">What gets deleted</AppText>
        {DELETED.map((t) => (
          <Bullet key={t} icon="trash" color={colors.dangerText} text={t} />
        ))}
      </Card>

      <Card>
        <AppText variant="headline">What your gym keeps</AppText>
        {KEPT.map((t) => (
          <Bullet key={t} icon="lock" color={colors.muted} text={t} />
        ))}
      </Card>

      <Banner
        tone="warning"
        icon="alert"
        title="Aarav’s pass is managed from your account"
        body="He’ll lose app access too. His printed card keeps working at the desk."
      />

      <Checkbox checked={confirmed} onChange={setConfirmed} label="I understand this can’t be undone" />

      <Button label="Delete my account" variant="danger" disabled={!confirmed} onPress={onDelete} />
    </Screen>
  );
}

function Bullet({ icon, color, text }: { icon: IconName; color: string; text: string }) {
  return (
    <View style={styles.bullet}>
      <Icon name={icon} size={18} color={color} />
      <AppText color={colors.textSoft} style={styles.flex}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
});
