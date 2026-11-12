import { ActivityIndicator, Alert, Linking, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Icon, Screen, ScreenHeader, StatusPill } from '../../components/ui';
import { Banner } from '../../features/member/components/Banner';
import { useGym } from '../../features/member/queries';
import { WEEKDAYS_LONG, daysUntil, formatClock, formatDay, isSameDay } from '../../lib/format';
import type { Gym } from '../../mocks/data';
import { colors, fonts, radius } from '../../theme/tokens';

const MON_FIRST = [1, 2, 3, 4, 5, 6, 0];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

function openStatus(gym: Gym, now = new Date()): { open: boolean; label: string } {
  if (gym.holiday && isSameDay(gym.holiday.date, now)) return { open: false, label: 'Closed today' };
  const today = gym.hours.find((h) => h.day === now.getDay());
  const mins = now.getHours() * 60 + now.getMinutes();
  if (today && mins >= toMinutes(today.open) && mins < toMinutes(today.close)) {
    return { open: true, label: `Open now · until ${formatClock(today.close)}` };
  }
  return { open: false, label: today && mins < toMinutes(today.open) ? `Closed · opens ${formatClock(today.open)}` : 'Closed now' };
}

async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Couldn’t open that', 'Check that the app is installed and try again.');
  }
}

/** 7.3 · Contact the gym */
export default function GymInfo() {
  const gym = useGym();

  if (gym.isPending || !gym.data) {
    return (
      <Screen>
        <ScreenHeader title="Contact the gym" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading gym details" />
        </View>
      </Screen>
    );
  }

  const g = gym.data;
  const status = openStatus(g);
  const todayIndex = new Date().getDay();
  const holidayDays = g.holiday ? daysUntil(g.holiday.date) : -1;

  return (
    <Screen scroll>
      <ScreenHeader title="Contact the gym" />

      <View style={styles.head}>
        <AppText variant="title">{g.name}</AppText>
        <StatusPill label={status.label} tone={status.open ? 'active' : 'neutral'} />
      </View>

      <Card>
        <View style={styles.address}>
          <Icon name="mapPin" size={20} color={colors.accent} />
          <View style={styles.flex}>
            {g.addressLines.map((l) => (
              <AppText key={l}>{l}</AppText>
            ))}
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            label="Call"
            variant="secondary"
            icon={<Icon name="phone" size={18} />}
            onPress={() => openUrl(`tel:${g.phone}`)}
            accessibilityHint={`Calls ${g.name}`}
            style={styles.flex}
          />
          <Button
            label="WhatsApp"
            variant="secondary"
            icon={<Icon name="message" size={18} />}
            onPress={() => openUrl(`https://wa.me/${g.whatsapp}`)}
            style={styles.flex}
          />
        </View>
        <Button
          label="Directions"
          icon={<Icon name="mapPin" size={18} color={colors.onAccent} />}
          onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.mapsQuery)}`)}
        />
      </Card>

      {g.holiday && holidayDays >= 0 ? (
        <Banner
          tone="warning"
          icon="calendar"
          title={`${g.holiday.title} · ${formatDay(g.holiday.date)}`}
          body={g.holiday.note}
        />
      ) : null}

      <AppText variant="overline" color={colors.muted}>
        Opening hours
      </AppText>
      <View style={styles.hours}>
        {MON_FIRST.map((day, i) => {
          const h = g.hours.find((x) => x.day === day);
          const isToday = day === todayIndex;
          const text = h ? `${formatClock(h.open)} – ${formatClock(h.close)}` : 'Closed';
          return (
            <View
              key={day}
              style={[styles.hourRow, i > 0 && styles.divider]}
              accessible
              accessibilityLabel={`${WEEKDAYS_LONG[day]}${isToday ? ', today' : ''}: ${text}`}
            >
              <View style={styles.dayCell}>
                <AppText style={isToday ? styles.todayText : undefined}>{WEEKDAYS_LONG[day]}</AppText>
                {isToday ? <StatusPill label="Today" /> : null}
              </View>
              <AppText color={isToday ? colors.text : colors.textSoft} style={isToday ? styles.todayText : undefined}>
                {text}
              </AppText>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  head: { gap: 8 },
  address: { flexDirection: 'row', gap: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  hours: { backgroundColor: colors.surface, borderRadius: radius.card, paddingHorizontal: 16 },
  hourRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, gap: 8 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  dayCell: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  todayText: { fontFamily: fonts.semibold },
});
