import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, Icon, Input, Screen } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { useMemberStore } from '../../features/member/memberStore';
import { useMembership } from '../../features/member/queries';
import { formatDate } from '../../lib/format';
import { colors, fonts, radius } from '../../theme/tokens';

/** 3.1 · Is this you? — first login, confirm what the gym entered. */
export default function ConfirmProfile() {
  const session = useSession((s) => s.session);
  const profile = useMemberStore((s) => s.profile);
  const saveProfile = useMemberStore((s) => s.saveProfile);
  const membership = useMembership('m_arjun');
  const [name, setName] = useState(profile.name);
  const [hasPhoto, setHasPhoto] = useState(profile.hasPhoto);
  if (!session) return null;

  const plan = membership.data;
  const rows = [
    { label: 'Gym', value: session.gym.name },
    { label: 'Plan', value: membership.isPending ? '…' : (plan?.planName ?? 'No plan yet') },
    { label: 'Valid until', value: membership.isPending ? '…' : plan ? formatDate(plan.endDate) : '—' },
  ];

  return (
    <Screen scroll>
      <View style={styles.intro}>
        <AppText variant="display">Is this you?</AppText>
        <AppText color={colors.muted}>{session.gym.name} added you as a member. Check your details before you start.</AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hasPhoto ? 'Remove photo' : 'Add a photo'}
        onPress={() => setHasPhoto((v) => !v)}
        style={styles.photo}
      >
        <Avatar name={name || profile.name} size={104} hasPhoto={hasPhoto} ring={hasPhoto} />
        <View style={styles.photoBadge}>
          <Icon name={hasPhoto ? 'close' : 'camera'} size={16} color={colors.onAccent} />
        </View>
      </Pressable>
      <AppText variant="caption" color={colors.muted} align="center">
        {hasPhoto ? 'Photo added · tap to remove' : 'Add a photo so the front desk recognises you'}
      </AppText>

      <Input label="Your name" value={name} onChangeText={setName} autoCapitalize="words" textContentType="name" />

      <View style={styles.rows}>
        {rows.map((r, i) => (
          <View
            key={r.label}
            style={[styles.row, i > 0 && styles.rowDivider]}
            accessible
            accessibilityLabel={`${r.label}: ${r.value}`}
          >
            <AppText color={colors.muted}>{r.label}</AppText>
            <AppText style={styles.rowValue} numberOfLines={2}>
              {r.value}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color={colors.muted}>
        Plan details are set by your gym. If something’s wrong, tell the front desk.
      </AppText>

      <Button
        label="Looks good"
        disabled={name.trim().length < 2}
        onPress={() => {
          saveProfile({ ...profile, name: name.trim(), hasPhoto });
          router.push('/gym-picker');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 8, marginTop: 8 },
  photo: { alignSelf: 'center', marginTop: 8 },
  photoBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.ground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 14 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  rowValue: { flexShrink: 1, textAlign: 'right', fontFamily: fonts.medium },
});
