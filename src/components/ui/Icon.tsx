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
  chevronDown: [{ t: 'path', d: 'm6 9 6 6 6-6' }],
  phone: [
    {
      t: 'path',
      d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
    },
  ],
  message: [{ t: 'path', d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z' }],
  mapPin: [
    { t: 'path', d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z' },
    { t: 'circle', cx: 12, cy: 10, r: 3 },
  ],
  camera: [
    { t: 'path', d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z' },
    { t: 'circle', cx: 12, cy: 13, r: 3 },
  ],
  receipt: [{ t: 'path', d: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM8 8h8M8 12h8M8 16h5' }],
  share: [{ t: 'path', d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13' }],
  download: [{ t: 'path', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' }],
  shield: [{ t: 'path', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }],
  plus: [{ t: 'path', d: 'M12 5v14M5 12h14' }],
  minus: [{ t: 'path', d: 'M5 12h14' }],
  wifiOff: [
    {
      t: 'path',
      d: 'M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 13a10 10 0 0 1 5.24-2.76M12 20h.01',
    },
  ],
  gift: [
    { t: 'rect', x: 3, y: 8, w: 18, h: 4, rx: 1 },
    { t: 'path', d: 'M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5' },
  ],
  info: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    { t: 'path', d: 'M12 16v-4M12 8h.01' },
  ],
  alert: [{ t: 'path', d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01' }],
  trash: [{ t: 'path', d: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
  edit: [{ t: 'path', d: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z' }],
  search: [
    { t: 'circle', cx: 11, cy: 11, r: 8 },
    { t: 'path', d: 'm21 21-4.35-4.35' },
  ],
  scan: [{ t: 'path', d: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10' }],
  sun: [
    { t: 'circle', cx: 12, cy: 12, r: 4 },
    { t: 'path', d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' },
  ],
  target: [
    { t: 'circle', cx: 12, cy: 12, r: 10 },
    { t: 'circle', cx: 12, cy: 12, r: 6 },
    { t: 'circle', cx: 12, cy: 12, r: 2 },
  ],
  lock: [
    { t: 'rect', x: 3, y: 11, w: 18, h: 11, rx: 2 },
    { t: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
  ],
  swap: [{ t: 'path', d: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3' }],
  code: [{ t: 'path', d: 'm16 18 6-6-6-6M8 6l-6 6 6 6' }],
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
