import { StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, Screen, StatusPill } from '../../../components/ui';
import { previewClasses } from '../../../mocks/data';
import { colors, radius } from '../../../theme/tokens';

/** Classes — booking is Phase 1.5; this previews what's coming. */
export default function Classes() {
  return (
    <Screen scroll edges={['top']}>
      <AppText variant="title">Classes</AppText>

      <Card bordered>
        <View style={styles.badge}>
          <Icon name="calendar" size={26} color={colors.accent} />
        </View>
        <AppText variant="headline">Booking coming soon</AppText>
        <AppText color={colors.muted}>
          Soon you’ll book a spot in group classes right here. Until then, ask the front desk to save you a place.
        </AppText>
      </Card>

      <AppText variant="overline" color={colors.muted}>
        A preview of classes at your gym
      </AppText>
      {previewClasses.map((c) => (
        <Card key={c.id}>
          <View style={styles.row}>
            <AppText variant="headline" style={styles.flex}>
              {c.title}
            </AppText>
            <StatusPill label="Preview" tone="neutral" />
          </View>
          <View style={styles.meta}>
            <Meta icon="clock" text={`${c.when} · ${c.durationMin} min`} />
            <Meta icon="user" text={`with ${c.trainer}`} />
            <Meta icon="users" text={c.spots} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

function Meta({ icon, text }: { icon: 'clock' | 'user' | 'users'; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Icon name={icon} size={16} color={colors.muted} />
      <AppText variant="caption" color={colors.textSoft}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.control,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  meta: { gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
