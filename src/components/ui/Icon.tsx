import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/tokens';

/** Stroke icons matching the canvas designs (24x24 grid). */
type Shape =
  | { t: 'path'; d: string }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx: number }
  | { t: 'circle'; cx: number; cy: number; r: number };

const icons = {
  logo: [{ t: 'path', d: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12' }],
  pass: [
    { t: 'rect', x: 2, y: 5, w: 20, h: 14, rx: 3 },
    { t: 'path', d: 'M7 10h4M7 14h7' },
  ],
  activity: [{ t: 'path', d: 'M22 12h-4l-3 9L9 3l-3 9H2' }],
  calendar: [
    { t: 'rect', x: 3, y: 4, w: 18, h: 17, rx: 2 },
    { t: 'path', d: 'M3 9h18M8 2v4M16 2v4' },
  ],
  user: [
    { t: 'circle', cx: 12, cy: 8, r: 4 },
    { t: 'path', d: 'M4 21a8 8 0 0 1 16 0' },
  ],
  users: [
    { t: 'circle', cx: 9, cy: 7, r: 4 },
    { t: 'path', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  ],
  clock: [
    { t: 'circle', cx: 12, cy: 12, r: 9 },
    { t: 'path', d: 'M12 7v5l3 2' },
  ],
  bell: [{ t: 'path', d: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0' }],
  qr: [
    { t: 'rect', x: 3, y: 3, w: 7, h: 7, rx: 1 },
    { t: 'rect', x: 14, y: 3, w: 7, h: 7, rx: 1 },
    { t: 'rect', x: 3, y: 14, w: 7, h: 7, rx: 1 },
    { t: 'path', d: 'M14 14h3v3M21 21h-4' },
  ],
  chevronRight: [{ t: 'path', d: 'm9 18 6-6-6-6' }],
  chevronLeft: [{ t: 'path', d: 'm15 18-6-6 6-6' }],
  check: [{ t: 'path', d: 'M20 6 9 17l-5-5' }],
  close: [{ t: 'path', d: 'M18 6 6 18M6 6l12 12' }],
  logout: [{ t: 'path', d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' }],
  chat: [{ t: 'path', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof icons;

type Props = { name: IconName; size?: number; color?: ColorValue; strokeWidth?: number };

export function Icon({ name, size = 22, color = colors.text, strokeWidth = 2 }: Props) {
  const shapes: Shape[] = icons[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {shapes.map((s, i) =>
        s.t === 'path' ? (
          <Path key={i} d={s.d} />
        ) : s.t === 'rect' ? (
          <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />
        ) : (
          <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
        ),
      )}
    </Svg>
  );
}
