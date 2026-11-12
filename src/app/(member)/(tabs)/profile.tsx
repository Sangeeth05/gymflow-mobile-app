import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button, Icon, ListRow, Screen, StatusPill } from '../../../components/ui';
import { useSession } from '../../../features/auth/session';
import { useMemberStore } from '../../../features/member/memberStore';
import { resetMemberState } from '../../../features/member/resetMemberState';
import { useUnreadCount } from '../../../features/notifications/store';
import { formatPhone } from '../../../lib/format';
import { members, type MemberId } from '../../../mocks/data';
import { colors, radius, sizes } from '../../../theme/tokens';

/** 7.1 · Profile */
export default function Profile() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);
  const profile = useMemberStore((s) => s.profile);
  const activeMemberId = useMemberStore((s) => s.activeMemberId);
  const setActiveMember = useMemberStore((s) => s.setActiveMember);
  const unread = useUnreadCount();
  if (!session) return null;

  const family: { id: MemberId; name: string; label: string }[] = [
    { id: 'm_arjun', name: profile.name, label: 'You' },
    { id: 'm_aarav', name: members.m_aarav.name, label: 'Son · no phone' },
  ];

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <Avatar name={profile.name} size={64} hasPhoto={profile.hasPhoto} ring />
        <View style={styles.flex}>
          <AppText variant="title">{profile.name}</AppText>
          <AppText variant="caption" color={colors.muted}>
            +91 {formatPhone(session.user.phone)}
          </AppText>
        </View>
        <Button label="Edit" variant="secondary" onPress={() => router.push('/edit-profile')} style={styles.edit} />
      </View>

      <Section title="Family">
        {family.map((f) => {
          const viewing = f.id === activeMemberId;
          return (
            <ListRow
              key={f.id}
              title={f.name}
              subtitle={f.label}
              left={<Avatar name={f.name} size={36} hasPhoto={f.id === 'm_arjun' && profile.hasPhoto} />}
              right={viewing ? <StatusPill label="Viewing" /> : <Icon name="chevronRight" size={18} color={colors.muted} />}
              onPress={() => {
                setActiveMember(f.id);
                router.navigate('/pass');
              }}
            />
          );
        })}
      </Section>

      <Section title="Gym">
        <ListRow
          title={session.gym.name}
          subtitle={session.role === 'trainer' ? 'Trainer' : 'Member'}
          left={<Icon name="logo" size={18} color={colors.accent} />}
          right={<AppText color={colors.accent}>Switch</AppText>}
          onPress={() => router.push('/gym-picker')}
        />
      </Section>

      <Section title="Account">
        <ListRow title="Membership & payments" left={<Icon name="receipt" size={18} color={colors.muted} />} onPress={() => router.push('/payments')} />
        <ListRow
          title="Notifications"
          subtitle={unread > 0 ? `${unread} unread` : undefined}
          left={<Icon name="bell" size={18} color={colors.muted} />}
          onPress={() => router.push('/notifications')}
        />
        <ListRow title="Contact the gym" left={<Icon name="phone" size={18} color={colors.muted} />} onPress={() => router.push('/gym-info')} />
        <ListRow title="Privacy & data" left={<Icon name="shield" size={18} color={colors.muted} />} onPress={() => router.push('/delete-account')} />
      </Section>

      {__DEV__ ? (
        <Section title="Developer">
          <ListRow
            title="Screen gallery"
            subtitle="Open any screen, switch states"
            left={<Icon name="code" size={18} color={colors.warning} />}
            onPress={() => router.push('/gallery')}
          />
        </Section>
      ) : null}

      <Button
        label="Log out"
        variant="secondary"
        icon={<Icon name="logout" size={18} color={colors.dangerText} />}
        onPress={() => {
          resetMemberState();
          signOut();
          router.replace('/login');
        }}
      />
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" color={colors.muted}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  edit: { minHeight: sizes.touch, paddingHorizontal: 16, borderRadius: radius.pill },
  section: { gap: 8 },
});
