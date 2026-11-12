import type { IconName, PillTone } from '../../components/ui';
import { daysUntil, formatDate, plural } from '../../lib/format';
import type { CheckIn, Membership } from '../../mocks/data';

/** Show the "ends in N days" banner from this many days out. */
export const ENDS_SOON_DAYS = 7;

export type MembershipSummary = {
  daysLeft: number;
  endsSoon: boolean;
  ended: boolean;
  /** 0–1, how much of the plan period has passed. */
  progress: number;
  pill: { label: string; tone: PillTone };
  /** e.g. "Quarterly · Strength + Cardio · until 15 Dec 2026" */
  planLine: string;
};

/** One place that turns a membership into the labels every screen shows. */
export function summarizeMembership(m: Membership): MembershipSummary {
  const daysLeft = daysUntil(m.endDate);
  const total = Math.max(1, daysUntil(m.endDate) - daysUntil(m.startDate));
  const elapsed = -daysUntil(m.startDate);
  const ended = m.status === 'expired' || daysLeft < 0;
  const endsSoon = !ended && m.status === 'active' && daysLeft <= ENDS_SOON_DAYS;

  let pill: MembershipSummary['pill'];
  let planLine: string;
  if (m.status === 'upcoming') {
    pill = { label: 'Starts soon', tone: 'neutral' };
    planLine = `${m.planName} · starts ${formatDate(m.startDate)}`;
  } else if (m.status === 'paused') {
    pill = { label: 'Paused', tone: 'warning' };
    planLine = `${m.planName} · paused until ${formatDate(m.pausedUntil ?? m.endDate)}`;
  } else if (ended) {
    pill = { label: 'Ended', tone: 'danger' };
    planLine = `${m.planName} · ended ${formatDate(m.endDate)}`;
  } else {
    pill = endsSoon ? { label: `${plural(daysLeft, 'day')} left`, tone: 'warning' } : { label: 'Active', tone: 'active' };
    planLine = `${m.planName} · until ${formatDate(m.endDate)}`;
  }

  return {
    daysLeft,
    endsSoon,
    ended,
    progress: Math.min(1, Math.max(0, elapsed / total)),
    pill,
    planLine,
  };
}

export const checkInMethodLabel: Record<CheckIn['method'], string> = {
  pass: 'Showed pass',
  scan: 'Scanned gym code',
  desk: 'Front desk',
  card: 'Printed card',
  parent: 'With parent',
};

export const checkInMethodIcon: Record<CheckIn['method'], IconName> = {
  pass: 'qr',
  scan: 'scan',
  desk: 'user',
  card: 'pass',
  parent: 'users',
};
