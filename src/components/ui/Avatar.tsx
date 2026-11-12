import { StyleSheet, View } from 'react-native';
import { initials } from '../../lib/format';
import { colors, fonts } from '../../theme/tokens';
import { AppText } from './AppText';

type Props = {
  name: string;
  size?: number;
  /** Stand-in for a real photo until image upload exists: lime fill. */
  hasPhoto?: boolean;
  /** Lime ring, e.g. for the profile header. */
  ring?: boolean;
};

export function Avatar({ name, size = 56, hasPhoto = false, ring = false }: Props) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: hasPhoto ? colors.accent : colors.raised,
          borderColor: ring ? colors.accent : colors.border,
          borderWidth: ring ? 2 : 1,
        },
      ]}
    >
      <AppText
        style={{
          fontFamily: fonts.displayBold,
          fontSize: Math.round(size * 0.36),
          lineHeight: Math.round(size * 0.44),
          color: hasPhoto ? colors.onAccent : colors.text,
        }}
      >
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
