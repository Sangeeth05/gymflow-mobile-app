import { AppText, EmptyState, Screen } from '../../components/ui';

/** Trainer · My members (placeholder) */
export default function Clients() {
  return (
    <Screen edges={['top']}>
      <AppText variant="title">My members</AppText>
      <EmptyState icon="users" title="No members assigned" body="Members your gym assigns to you will be listed here." />
    </Screen>
  );
}
