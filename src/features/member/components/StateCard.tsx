import { StyleSheet, View } from 'react-native';
import { AppText, Icon, type IconName } from '../../../components/ui';
import { fonts } from '../../../theme/tokens';

export type PassState = 'none' | 'upcoming' | 'paused';

/**
 * State-specific palettes. These are the one place screens may use raw hex:
 * each state gets its own card colour so it can't be mistaken for a live pass.
 */
const palettes: Record<PassState, { bg: string; fg: string; soft: string; icon: IconName }> = {
  none: { bg: '#23262E', fg: '#F4F5F7', soft: '#9AA0AA', icon: 'pass' },
  upcoming: { bg: '#1D2A3A', fg: '#CFE6FF', soft: '#8DB4DD', icon: 'calendar' },
  paused: { bg: '#3A2E1A', fg: '#FFE2B0', soft: '#D9B577', icon: 'clock' },
};

type Props = { state: PassState; gymName: string; memberName: string; title: string; body: string };

/** Replaces the QR pass when there is nothing to check in with. */
export function StateCard({ state, gymName, memberName, title, body }: Props) {
  const p = palettes[state];
  return (
    <View style={[styles.card, { backgroundColor: p.bg }]} accessible accessibilityLabel={`${title}. ${body}`}>
      <AppText variant="caption" style={{ color: p.soft }}>
        {gymName}
      </AppText>
      <View style={[styles.badge, { borderColor: p.soft }]}>
        <Icon name={p.icon} size={30} color={p.fg} strokeWidth={1.8} />
      </View>
      <View style={styles.text}>
        <AppText style={[styles.title, { color: p.fg }]}>{title}</AppText>
        <AppText style={{ color: p.soft }}>{body}</AppText>
      </View>
      <AppText variant="caption" style={{ color: p.soft }}>
        {memberName}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, padding: 22, gap: 16 },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { gap: 6 },
  title: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28 },
});
