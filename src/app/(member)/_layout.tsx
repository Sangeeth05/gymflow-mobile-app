import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../features/auth/session';
import { colors } from '../../theme/tokens';

/** Member app: tabs plus the screens pushed or presented over them. */
export default function MemberLayout() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  if (session.role !== 'member') return <Redirect href="/" />;
  if (!session.onboarded) return <Redirect href="/confirm-profile" />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ground } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="check-in" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="checked-in" options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="family" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
