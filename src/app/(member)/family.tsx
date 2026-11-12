import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, RadioRow, Screen, ScreenHeader } from '../../components/ui';
import { useMemberStore } from '../../features/member/memberStore';
import { firstName } from '../../lib/format';
import { members, type MemberId } from '../../mocks/data';
import { colors } from '../../theme/tokens';

/** 5.2 · Whose pass? (modal) */
export default function Family() {
  const profileName = useMemberStore((s) => s.profile.name);
  const hasPhoto = useMemberStore((s) => s.profile.hasPhoto);
  const activeMemberId = useMemberStore((s) => s.activeMemberId);
  const setActiveMember = useMemberStore((s) => s.setActiveMember);
  const [selected, setSelected] = useState<MemberId>(activeMemberId);

  const people: { id: MemberId; name: string; subtitle: string }[] = [
    { id: 'm_arjun', name: profileName, subtitle: 'You' },
    { id: 'm_aarav', name: members.m_aarav.name, subtitle: 'Son · uses a printed card' },
  ];
  const chosen = people.find((p) => p.id === selected) ?? people[0];

  return (
    <Screen>
      <ScreenHeader title="Whose pass?" variant="close" />
      <AppText color={colors.muted}>Show a family member’s pass on this phone, for example when they’ve forgotten their card.</AppText>

      <View style={styles.list} accessibilityRole="radiogroup">
        {people.map((p) => (
          <RadioRow
            key={p.id}
            title={p.name}
            subtitle={p.subtitle}
            selected={p.id === selected}
            onPress={() => setSelected(p.id)}
            left={<Avatar name={p.name} size={40} hasPhoto={p.id === 'm_arjun' && hasPhoto} />}
          />
        ))}
      </View>

      <View style={styles.spacer} />
      <Button
        label={chosen.id === 'm_arjun' ? 'Show my pass' : `Show ${firstName(chosen.name)}’s pass`}
        onPress={() => {
          setActiveMember(chosen.id);
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  spacer: { flex: 1 },
});
