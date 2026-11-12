import { AppText, EmptyState, Screen } from '../../components/ui';
import { useSession } from '../../features/auth/session';
import { colors } from '../../theme/tokens';

/** Trainer · Today (placeholder until trainer screens are designed) */
export default function Today() {
  const gymName = useSession((s) => s.session?.gym.name);
  return (
    <Screen edges={['top']}>
      <AppText variant="caption" color={colors.muted}>
        {gymName}
      </AppText>
      <AppText variant="title">Today</AppText>
      <EmptyState icon="clock" title="No sessions today" body="Your PT sessions and classes for the day will appear here." />
    </Screen>
  );
}
