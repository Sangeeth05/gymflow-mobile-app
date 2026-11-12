import { AppText, EmptyState, Screen } from '../../components/ui';

/** Trainer · Schedule (placeholder) */
export default function Schedule() {
  return (
    <Screen edges={['top']}>
      <AppText variant="title">Schedule</AppText>
      <EmptyState icon="calendar" title="Nothing scheduled" body="Your week of sessions will show up here." />
    </Screen>
  );
}
