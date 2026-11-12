import { Tabs } from 'expo-router';
import { tabScreenOptions } from '../../../components/navigation/tabScreenOptions';
import { Icon } from '../../../components/ui';

export default function MemberTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="pass" options={{ title: 'Pass', tabBarIcon: ({ color }) => <Icon name="pass" color={color} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ color }) => <Icon name="activity" color={color} /> }} />
      <Tabs.Screen name="classes" options={{ title: 'Classes', tabBarIcon: ({ color }) => <Icon name="calendar" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Icon name="user" color={color} /> }} />
    </Tabs>
  );
}
