import type { ComponentProps } from 'react';
import type { Tabs } from 'expo-router';
import { colors, fonts } from '../../theme/tokens';

type TabsScreenOptions = NonNullable<ComponentProps<typeof Tabs>['screenOptions']>;

/** Shared bottom-tab look for both the member and trainer apps. */
export const tabScreenOptions: TabsScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.muted,
  tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.border },
  tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
  sceneStyle: { backgroundColor: colors.ground },
};
