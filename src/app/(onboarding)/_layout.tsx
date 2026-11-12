import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../features/auth/session';
import { colors } from '../../theme/tokens';

/** First-login flow (confirm profile → pick gym). Gym picker is also reachable later from Profile. */
export default function OnboardingLayout() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }} />;
}
