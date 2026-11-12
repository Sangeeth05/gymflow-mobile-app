import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, EmptyState, Icon, Screen, ScreenHeader, type IconName } from '../../components/ui';
import { useNotifications, useUnreadCount } from '../../features/notifications/store';
import { formatRelativeDay, formatTime, isSameDay } from '../../lib/format';
import type { AppNotification, NotificationKind } from '../../mocks/data';
import { colors, radius } from '../../theme/tokens';

const KIND_ICON: Record<NotificationKind, IconName> = {
  gym: 'clock',
  offer: 'gift',
  payment: 'receipt',
  class: 'calendar',
};

/** 7.4 · Notifications */
export default function Notifications() {
  const items = useNotifications((s) => s.items);
  const markRead = useNotifications((s) => s.markRead);
  const markAllRead = useNotifications((s) => s.markAllRead);
  const unread = useUnreadCount();

  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const groups = [
    { title: 'Today', items: sorted.filter((n) => isSameDay(n.createdAt, new Date())) },
    { title: 'Earlier', items: sorted.filter((n) => !isSameDay(n.createdAt, new Date())) },
  ].filter((g) => g.items.length > 0);

  function open(n: AppNotification) {
    markRead(n.id);
    // Hrefs come from the server payload, so they are plain strings here.
    router.push(n.href as Href);
  }

  return (
    <Screen scroll>
      <ScreenHeader title="Notifications" />
      {unread > 0 ? (
        <View style={styles.toolbar}>
          <AppText variant="caption" color={colors.muted}>
            {unread} unread
          </AppText>
          <Button label="Mark all read" variant="text" onPress={markAllRead} />
        </View>
      ) : null}

      {groups.length === 0 ? (
        <EmptyState icon="bell" title="No notifications" body="Updates from your gym will show up here." />
      ) : (
        groups.map((g) => (
          <View key={g.title} style={styles.group}>
            <AppText variant="overline" color={colors.muted}>
              {g.title}
            </AppText>
            {g.items.map((n) => (
              <Pressable
                key={n.id}
                accessibilityRole="button"
                accessibilityLabel={`${n.read ? '' : 'Unread. '}${n.title}. ${n.body}`}
                onPress={() => open(n)}
                style={({ pressed }) => [styles.row, !n.read && styles.unreadRow, pressed && styles.pressed]}
              >
                <View style={[styles.icon, !n.read && styles.iconUnread]}>
                  <Icon name={KIND_ICON[n.kind]} size={18} color={n.read ? colors.muted : colors.accent} />
                </View>
                <View style={styles.body}>
                  <AppText variant="bodyMedium">{n.title}</AppText>
                  <AppText variant="caption" color={colors.textSoft}>
                    {n.body}
                  </AppText>
                  <AppText variant="caption" color={colors.muted}>
                    {g.title === 'Today' ? formatTime(n.createdAt) : formatRelativeDay(n.createdAt)}
                  </AppText>
                </View>
                {!n.read ? <View style={styles.dot} /> : null}
              </Pressable>
            ))}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: -8 },
  group: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  unreadRow: { backgroundColor: colors.raised },
  pressed: { opacity: 0.85 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUnread: { backgroundColor: colors.accentSoft },
  body: { flex: 1, gap: 3 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent, marginTop: 6 },
});
