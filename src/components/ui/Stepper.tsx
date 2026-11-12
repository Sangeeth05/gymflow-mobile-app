import { Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius, sizes } from '../../theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** What is being counted, for screen readers (e.g. "visits per week"). */
  label: string;
};

export function Stepper({ value, onChange, min = 0, max = 99, label }: Props) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <View style={styles.row}>
      <StepButton icon="minus" label={`Fewer ${label}`} disabled={!canDec} onPress={() => onChange(value - 1)} />
      <AppText style={styles.value} accessibilityLabel={`${value} ${label}`} accessibilityLiveRegion="polite">
        {value}
      </AppText>
      <StepButton icon="plus" label={`More ${label}`} disabled={!canInc} onPress={() => onChange(value + 1)} />
    </View>
  );
}

type StepButtonProps = { icon: 'plus' | 'minus'; label: string; disabled: boolean; onPress: () => void };

function StepButton({ icon, label, disabled, onPress }: StepButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={disabled ? colors.placeholder : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20, alignSelf: 'center' },
  button: {
    width: sizes.control,
    height: sizes.control,
    borderRadius: radius.control,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.border },
  value: { fontFamily: fonts.displayBold, fontSize: 40, lineHeight: 46, minWidth: 48, textAlign: 'center' },
});
