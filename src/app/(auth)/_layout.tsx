import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../features/auth/session';
import { colors } from '../../theme/tokens';

export default function AuthLayout() {
  const session = useSession((s) => s.session);
  if (session) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }} />;
}
