import { AppText, EmptyState, Screen } from '../../components/ui';

/** 5.3 · Activity (placeholder) */
export default function Activity() {
  return (
    <Screen edges={['top']}>
      <AppText variant="title">Activity</AppText>
      <EmptyState
        icon="activity"
        title="No visits yet"
        body="Show your pass at the front desk and your first visit will appear here."
      />
    </Screen>
  );
}
