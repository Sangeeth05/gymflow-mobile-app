import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, type } from '../../theme/tokens';

export type TextVariant = keyof typeof type;

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function AppText({ variant = 'body', color = colors.text, align, style, ...rest }: Props) {
  return <Text {...rest} style={[type[variant] as TextStyle, { color, textAlign: align }, style]} />;
}
