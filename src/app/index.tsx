import { Redirect } from 'expo-router';
import { useSession } from '../features/auth/session';

/** Entry: login → first-login onboarding → the role's home tab. */
export default function Index() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  if (!session.onboarded) return <Redirect href="/confirm-profile" />;
  return <Redirect href={session.role === 'trainer' ? '/today' : '/pass'} />;
}
