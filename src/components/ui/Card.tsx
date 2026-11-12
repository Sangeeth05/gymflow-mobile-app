import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '../../theme/tokens';

type Props = {
  children: ReactNode;
  tone?: 'surface' | 'accent' | 'raised';
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

const bg = { surface: colors.surface, accent: colors.accent, raised: colors.raised } as const;

export function Card({ children, tone = 'surface', bordered = false, style }: Props) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bg[tone] },
        bordered && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: 20, gap: 12 },
});
