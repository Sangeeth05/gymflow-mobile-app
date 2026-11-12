import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, ListRow, Screen, StatTile } from '../../../components/ui';
import { useSession } from '../../../features/auth/session';
import { useIsOffline } from '../../../features/dev/devStore';
import { Banner } from '../../../features/member/components/Banner';
import { PassCard } from '../../../features/member/components/PassCard';
import { StateCard } from '../../../features/member/components/StateCard';
import { useActiveMember, useMemberStore } from '../../../features/member/memberStore';
import { checkInMethodIcon, checkInMethodLabel, summarizeMembership } from '../../../features/member/membership';
import { useCheckIns, useMembership } from '../../../features/member/queries';
import { useUnreadCount } from '../../../features/notifications/store';
import { firstName, formatDate, formatRelativeDay, formatTime, plural } from '../../../lib/format';
import type { CheckIn, Membership } from '../../../mocks/data';
import { colors, fonts, radius, sizes } from '../../../theme/tokens';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Home C · Gym pass */
export default function Pass() {
  const session = useSession((s) => s.session);
  const member = useActiveMember();
  const isChild = member.relation !== 'self';
  const offline = useIsOffline();
  const unread = useUnreadCount();
  const membership = useMembership(member.id);
  const checkIns = useCheckIns(member.id);

  if (!session) return null;
  const gymName = session.gym.name;

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="caption" color={colors.muted}>
            {gymName}
          </AppText>
          <AppText variant="title">
            {greeting()}, {firstName(session.user.name)}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
          onPress={() => router.push('/notifications')}
          style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
        >
          <Icon name="bell" size={20} />
          {unread > 0 ? <View style={styles.dot} /> : null}
        </Pressable>
      </View>

      {isChild ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Viewing ${firstName(member.name)}'s pass. Change whose pass`}
          onPress={() => router.push('/family')}
          style={styles.chip}
        >
          <AppText style={styles.chipText}>Viewing {firstName(member.name)}</AppText>
          <Icon name="chevronDown" size={16} color={colors.onAccent} />
        </Pressable>
      ) : null}

      {offline ? (
        <Banner
          tone="neutral"
          icon="wifiOff"
          title="You're offline"
          body="Your pass still works. The front desk can check you in with the code below."
        />
      ) : null}

      {membership.isPending ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading your pass" />
        </View>
      ) : (
        <PassSection
          membership={membership.data ?? null}
          gymName={gymName}
          memberName={member.name}
          offline={offline}
        />
      )}

      {isChild ? (
        <Banner
          tone="neutral"
          icon="info"
          title={`${firstName(member.name)} can use his printed card`}
          body="No phone needed. The front desk scans the card on his lanyard."
        />
      ) : (
        <SetupChecklist />
      )}

      <VisitTiles checkIns={checkIns.data} loading={checkIns.isPending} />

      {isChild && checkIns.data && checkIns.data.length > 0 ? (
        <View style={styles.section}>
          <AppText variant="overline" color={colors.muted}>
            {firstName(member.name)}’s recent visits
          </AppText>
          {checkIns.data.slice(0, 3).map((c) => (
            <ListRow
              key={c.id}
              title={formatRelativeDay(c.at)}
              subtitle={`${formatTime(c.at)} · ${checkInMethodLabel[c.method]}`}
              left={<Icon name={checkInMethodIcon[c.method]} size={18} color={colors.accent} />}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

type PassSectionProps = { membership: Membership | null; gymName: string; memberName: string; offline: boolean };

function PassSection({ membership, gymName, memberName, offline }: PassSectionProps) {
  if (!membership || membership.status === 'upcoming' || membership.status === 'paused') {
    const card = !membership
      ? { state: 'none' as const, title: 'No active plan', body: 'Pick a plan at the front desk and your pass will appear here.' }
      : membership.status === 'upcoming'
        ? { state: 'upcoming' as const, title: `Starts ${formatDate(membership.startDate)}`, body: `${membership.planName}. Your QR pass appears on the first day.` }
        : {
            state: 'paused' as const,
            title: `Paused until ${formatDate(membership.pausedUntil ?? membership.endDate)}`,
            body: 'Your plan is on hold. Ask the front desk if you want to resume early.',
          };
    return (
      <>
        <StateCard {...card} gymName={gymName} memberName={memberName} />
        <Button label="Contact the gym" variant="secondary" icon={<Icon name="phone" size={18} />} onPress={() => router.push('/gym-info')} />
      </>
    );
  }

  const s = summarizeMembership(membership);
  return (
    <>
      {s.ended ? (
        <Banner
          tone="danger"
          icon="alert"
          title={`Your plan ended on ${formatDate(membership.endDate)}`}
          body="Renew at the front desk (UPI or cash) to keep checking in."
          actionLabel="Details"
          onAction={() => router.push('/payments')}
        />
      ) : s.endsSoon ? (
        <Banner
          tone="warning"
          icon="clock"
          title={s.daysLeft === 0 ? 'Your plan ends today' : `Your plan ends in ${plural(s.daysLeft, 'day')}`}
          body="Renew at the front desk so your pass keeps working."
          actionLabel="Details"
          onAction={() => router.push('/payments')}
        />
      ) : null}

      <PassCard
        gymName={gymName}
        memberName={memberName}
        planLine={s.planLine}
        pillLabel={s.pill.label}
        qrValue={`gymflow:member:${membership.memberCode.replace(' ', '')}`}
        dimmed={s.ended}
        onPressQr={s.ended ? undefined : () => router.push('/check-in')}
        onPressPlan={() => router.push('/payments')}
      />

      {offline ? (
        <>
          <AppText variant="caption" color={colors.muted} align="center">
            Offline code · valid for today. It refreshes when you’re back online.
          </AppText>
          <Card bordered style={styles.codeCard}>
            <AppText variant="overline" color={colors.muted}>
              Member code
            </AppText>
            <AppText style={styles.code} accessibilityLabel={`Member code ${membership.memberCode.split('').join(' ')}`}>
              {membership.memberCode}
            </AppText>
            <AppText variant="caption" color={colors.muted}>
              If the scanner can’t read your screen, tell the front desk this code.
            </AppText>
          </Card>
        </>
      ) : null}
    </>
  );
}

function SetupChecklist() {
  const hasPhoto = useMemberStore((s) => s.profile.hasPhoto);
  const weeklyGoal = useMemberStore((s) => s.weeklyGoal);
  const remindersAnswered = useMemberStore((s) => s.remindersAnswered);
  const dismissed = useMemberStore((s) => s.setupDismissed);
  const dismiss = useMemberStore((s) => s.dismissSetup);

  const items = [
    { key: 'photo', title: 'Add a photo', hint: 'Helps the front desk recognise you', done: hasPhoto, go: () => router.push('/edit-profile') },
    { key: 'goal', title: 'Set a weekly goal', hint: 'Track visits against a target', done: weeklyGoal !== null, go: () => router.push('/goals') },
    { key: 'reminders', title: 'Turn on reminders', hint: 'Before your plan ends', done: remindersAnswered, go: () => router.push('/reminders') },
  ];
  const doneCount = items.filter((i) => i.done).length;
  if (dismissed || doneCount === items.length) return null;

  return (
    <Card>
      <View style={styles.checklistHeader}>
        <View style={styles.flex}>
          <AppText variant="headline">Finish setting up</AppText>
          <AppText variant="caption" color={colors.muted}>
            {doneCount} of {items.length} done
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss setup checklist"
          onPress={dismiss}
          style={styles.dismiss}
        >
          <Icon name="close" size={18} color={colors.muted} />
        </Pressable>
      </View>
      {items.map((item) => (
        <Pressable
          key={item.key}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}${item.done ? ', done' : ''}`}
          accessibilityState={{ checked: item.done }}
          onPress={item.go}
          style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
        >
          <View style={[styles.checkDot, item.done && styles.checkDotDone]}>
            {item.done ? <Icon name="check" size={14} color={colors.onAccent} strokeWidth={3} /> : null}
          </View>
          <View style={styles.flex}>
            <AppText variant="bodyMedium" color={item.done ? colors.muted : colors.text}>
              {item.title}
            </AppText>
            <AppText variant="caption" color={colors.muted}>
              {item.hint}
            </AppText>
          </View>
          <Icon name="chevronRight" size={18} color={colors.muted} />
        </Pressable>
      ))}
    </Card>
  );
}

function VisitTiles({ checkIns, loading }: { checkIns?: CheckIn[]; loading: boolean }) {
  const now = new Date();
  const thisMonth = (checkIns ?? []).filter((c) => {
    const d = new Date(c.at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const last = checkIns?.[0];

  return (
    <View style={styles.tiles}>
      <StatTile label="This month" value={loading ? '–' : String(thisMonth)} caption={thisMonth === 1 ? 'visit' : 'visits'} />
      <StatTile
        label="Last visit"
        value={loading ? '–' : last ? formatRelativeDay(last.at) : 'None yet'}
        caption={last ? formatTime(last.at) : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  bell: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: sizes.touch - 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  chipText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.onAccent },
  loading: {
    height: 340,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeCard: { alignItems: 'center' },
  code: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, letterSpacing: 3 },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dismiss: { width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: sizes.touch, borderRadius: 12 },
  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  tiles: { flexDirection: 'row', gap: 12 },
  section: { gap: 8 },
});
