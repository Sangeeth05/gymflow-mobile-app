import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon } from '../../../components/ui';
import { formatMonth, isSameDay } from '../../../lib/format';
import { colors, fonts, radius, sizes } from '../../../theme/tokens';

const WEEK_HEADER = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_HEADER_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Props = {
  year: number;
  /** 0–11 */
  month: number;
  /** ISO timestamps of visits (any month; only this month's are drawn). */
  visits: string[];
  onPrev: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

/** Monday-first month grid. Visited days are lime; today is outlined. */
export function MonthCalendar({ year, month, visits, onPrev, onNext, nextDisabled }: Props) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7; // Monday = 0
  const visited = new Set(
    visits
      .map((v) => new Date(v))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate()),
  );
  const today = new Date();
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const title = formatMonth(year, month);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <NavButton icon="chevronLeft" label="Previous month" onPress={onPrev} />
        <AppText variant="headline" accessibilityRole="header">
          {title}
        </AppText>
        <NavButton icon="chevronRight" label="Next month" onPress={onNext} disabled={nextDisabled} />
      </View>

      <View style={styles.grid}>
        {WEEK_HEADER.map((d, i) => (
          <View key={`h${i}`} style={styles.cell} accessibilityLabel={WEEK_HEADER_LONG[i]}>
            <AppText variant="caption" color={colors.muted}>
              {d}
            </AppText>
          </View>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <View key={`e${i}`} style={styles.cell} />;
          const isVisited = visited.has(day);
          const isToday = isSameDay(new Date(year, month, day), today);
          return (
            <View
              key={day}
              style={styles.cell}
              accessible
              accessibilityLabel={`${day} ${title}${isToday ? ', today' : ''}${isVisited ? ', visited' : ''}`}
            >
              <View style={[styles.day, isVisited && styles.visited, isToday && styles.today, isToday && isVisited && styles.todayVisited]}>
                <AppText style={[styles.dayText, { color: isVisited ? colors.onAccent : colors.textSoft }]}>{day}</AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function NavButton({ icon, label, onPress, disabled }: { icon: 'chevronLeft' | 'chevronRight'; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.nav, pressed && { backgroundColor: colors.border }]}
    >
      <Icon name={icon} size={18} color={disabled ? colors.placeholder : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.surface, borderRadius: radius.card, padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nav: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radius.pill,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  day: { width: '82%', aspectRatio: 1, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  visited: { backgroundColor: colors.accent },
  today: { borderWidth: 2, borderColor: colors.accent },
  todayVisited: { borderColor: colors.text },
  dayText: { fontFamily: fonts.medium, fontSize: 14 },
});
