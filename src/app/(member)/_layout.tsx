import { Redirect, Tabs } from 'expo-router';
import { tabScreenOptions } from '../../components/navigation/tabScreenOptions';
import { Icon } from '../../components/ui';
import { useSession } from '../../features/auth/session';

export default function MemberLayout() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  if (session.role !== 'member') return <Redirect href="/" />;

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="pass" options={{ title: 'Pass', tabBarIcon: ({ color }) => <Icon name="pass" color={color} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ color }) => <Icon name="activity" color={color} /> }} />
      <Tabs.Screen name="classes" options={{ title: 'Classes', tabBarIcon: ({ color }) => <Icon name="calendar" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Icon name="user" color={color} /> }} />
    </Tabs>
  );
}
