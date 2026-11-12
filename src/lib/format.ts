/**
 * Formatting helpers. Written by hand instead of Intl so output is identical on
 * Hermes (iOS/Android) and web, regardless of the device's locale data.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** ₹1,50,000 — Indian digit grouping (last 3, then pairs). */
export function formatINR(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const [whole, fraction] = Math.abs(amount).toFixed(2).split('.');
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3;
  return `${sign}₹${grouped}${fraction === '00' ? '' : `.${fraction}`}`;
}

const toDate = (value: string | Date) => (typeof value === 'string' ? new Date(value) : value);

/** 12 Nov 2026 */
export function formatDate(value: string | Date): string {
  const d = toDate(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Thu, 12 Nov */
export function formatDay(value: string | Date): string {
  const d = toDate(value);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** November 2026 */
export function formatMonth(year: number, month: number): string {
  return `${MONTHS_LONG[month]} ${year}`;
}

/** 6:05 am */
export function formatTime(value: string | Date): string {
  const d = toDate(value);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'am' : 'pm'}`;
}

/** "05:30" → 5:30 am */
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return formatTime(d);
}

export function startOfDay(value: string | Date): Date {
  const d = new Date(toDate(value));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/** Whole calendar days from today to `value` (negative = past). */
export function daysUntil(value: string | Date): number {
  return Math.round((startOfDay(value).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
}

/** Today · Yesterday · 3 days ago · 12 Oct 2026 */
export function formatRelativeDay(value: string | Date): string {
  const diff = -daysUntil(value);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1 && diff < 7) return `${diff} days ago`;
  return formatDate(value);
}

/** 98470 12345 */
export function formatPhone(digits: string): string {
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function firstName(name: string): string {
  return name.split(' ')[0];
}
