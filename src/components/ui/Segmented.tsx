import { Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: Props<T>) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.item, on && styles.itemOn]}
          >
            <AppText style={[styles.label, { color: on ? colors.onAccent : colors.muted }]}>{o.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', padding: 4, borderRadius: radius.control, backgroundColor: colors.surface },
  item: { flex: 1, minHeight: sizes.touch, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  itemOn: { backgroundColor: colors.accent },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
});
