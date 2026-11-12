import { Redirect, Tabs } from 'expo-router';
import { tabScreenOptions } from '../../components/navigation/tabScreenOptions';
import { Icon } from '../../components/ui';
import { useSession } from '../../features/auth/session';

export default function TrainerLayout() {
  const session = useSession((s) => s.session);
  if (!session) return <Redirect href="/login" />;
  if (session.role !== 'trainer') return <Redirect href="/" />;

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: ({ color }) => <Icon name="clock" color={color} /> }} />
      <Tabs.Screen name="clients" options={{ title: 'Members', tabBarIcon: ({ color }) => <Icon name="users" color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarIcon: ({ color }) => <Icon name="calendar" color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Icon name="user" color={color} /> }} />
    </Tabs>
  );
}
