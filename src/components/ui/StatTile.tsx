import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '../../theme/tokens';
import { AppText } from './AppText';

type Props = { label: string; value: string; caption?: string };

export function StatTile({ label, value, caption }: Props) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={[label, value, caption].filter(Boolean).join(', ')}>
      <AppText variant="caption" color={colors.muted}>
        {label}
      </AppText>
      <AppText style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      {caption ? (
        <AppText variant="caption" color={colors.muted} numberOfLines={1}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.card, padding: 16, gap: 4 },
  value: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 30 },
});
