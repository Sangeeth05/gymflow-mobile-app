import { AppText, EmptyState, Screen } from '../../components/ui';

/** Classes — Phase 1.5 (placeholder) */
export default function Classes() {
  return (
    <Screen edges={['top']}>
      <AppText variant="title">Classes</AppText>
      <EmptyState icon="calendar" title="Coming soon" body="Class schedules and booking will show up here." />
    </Screen>
  );
}
