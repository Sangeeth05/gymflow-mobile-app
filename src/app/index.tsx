import { Redirect } from 'expo-router';
import { useSession } from '../features/auth/session';

/** Entry: send people to login, or to their role's home tab. */
export default function Index() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  return <Redirect href={session.role === 'trainer' ? '/today' : '/pass'} />;
}
