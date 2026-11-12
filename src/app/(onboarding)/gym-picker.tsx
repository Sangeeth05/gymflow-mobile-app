import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, RadioRow, Screen, ScreenHeader, StatusPill } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { formatRelativeDay } from '../../lib/format';
import { gymInvite, gymOptions, type GymOption } from '../../mocks/data';
import { colors } from '../../theme/tokens';

const roleLabel = (role: GymOption['role']) => (role === 'trainer' ? 'Trainer' : 'Member');

/** 3.2 · Choose a gym (first login, or "Switch" from Profile). */
export default function GymPicker() {
  const session = useSession((s) => s.session);
  const switchGym = useSession((s) => s.switchGym);
  const markOnboarded = useSession((s) => s.markOnboarded);
  const [options, setOptions] = useState<GymOption[]>(gymOptions);
  const [invite, setInvite] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [selectedId, setSelectedId] = useState(session?.gym.id ?? gymOptions[0].id);
  if (!session) return null;

  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  function acceptInvite() {
    const joined: GymOption = { id: gymInvite.id, name: gymInvite.gymName, area: gymInvite.area, role: gymInvite.role };
    setOptions((o) => [...o, joined]);
    setSelectedId(joined.id);
    setInvite('accepted');
  }

  function onContinue() {
    switchGym({ id: selected.id, name: selected.name }, selected.role);
    markOnboarded();
    router.replace('/');
  }

  return (
    <Screen scroll>
      {router.canGoBack() ? <ScreenHeader /> : null}
      <View style={styles.intro}>
        <AppText variant="display">Choose a gym</AppText>
        <AppText color={colors.muted}>Your number is linked to more than one gym. You can switch any time from Profile.</AppText>
      </View>

      <View style={styles.list} accessibilityRole="radiogroup">
        {options.map((o) => (
          <RadioRow
            key={o.id}
            title={o.name}
            subtitle={`${roleLabel(o.role)} · ${o.area}`}
            selected={o.id === selectedId}
            onPress={() => setSelectedId(o.id)}
            left={
              <View style={styles.gymIcon}>
                <Icon name={o.role === 'trainer' ? 'users' : 'logo'} size={18} color={colors.accent} />
              </View>
            }
            right={o.id === session.gym.id ? <StatusPill label="Current" tone="neutral" /> : null}
          />
        ))}
      </View>

      {invite === 'pending' ? (
        <Card bordered>
          <View style={styles.inviteHead}>
            <Icon name="gift" size={20} color={colors.warning} />
            <AppText variant="overline" color={colors.warning}>
              Pending invite
            </AppText>
          </View>
          <AppText variant="headline">
            {gymInvite.gymName}, {gymInvite.area}
          </AppText>
          <AppText color={colors.muted}>
            Invited you to join as a {roleLabel(gymInvite.role).toLowerCase()} · {formatRelativeDay(gymInvite.invitedAt).toLowerCase()}
          </AppText>
          <View style={styles.inviteActions}>
            <Button label="Decline" variant="secondary" onPress={() => setInvite('declined')} style={styles.flex} />
            <Button label="Accept" onPress={acceptInvite} style={styles.flex} />
          </View>
        </Card>
      ) : null}

      <View style={styles.spacer} />
      <Button
        label={`Continue to ${selected.name}`}
        onPress={onContinue}
        accessibilityHint={selected.role === 'trainer' ? 'Opens the trainer app' : undefined}
      />
      {selected.role === 'trainer' ? (
        <AppText variant="caption" color={colors.muted} align="center">
          You’re a trainer at {selected.name}, so this opens the trainer app.
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { gap: 8, marginTop: 8 },
  list: { gap: 10 },
  gymIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inviteActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  spacer: { flex: 1, minHeight: 8 },
});
