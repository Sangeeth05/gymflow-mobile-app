/**
 * Fictional mock data for reviewing the UI before gymflow-api exists.
 * All dates are relative to "today" so the screens always look current.
 * Only `src/features/*\/queries.ts` and the stores should import this file.
 */

// ---------- date helpers ----------

/** ISO string for local midnight + `days` (negative = past), at an optional time. */
export function daysFromNow(days: number, hour = 0, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ---------- types ----------

export type MemberId = 'm_arjun' | 'm_aarav';

export type Member = {
  id: MemberId;
  name: string;
  phone: string | null;
  email: string | null;
  relation: 'self' | 'son';
  emergencyContact: { name: string; relation: string; phone: string } | null;
};

export type MembershipStatus = 'active' | 'upcoming' | 'paused' | 'expired';

export type Membership = {
  id: string;
  memberId: MemberId;
  planName: string;
  price: number;
  startDate: string;
  endDate: string;
  memberCode: string;
  status: MembershipStatus;
  /** Only for `paused`. */
  pausedUntil?: string;
};

export type CheckInMethod = 'pass' | 'scan' | 'desk' | 'card' | 'parent';

export type CheckIn = { id: string; memberId: MemberId; at: string; method: CheckInMethod };

export type PaymentMethod = 'UPI' | 'Cash';

export type Payment = {
  id: string;
  receiptNo: string;
  memberId: MemberId;
  amount: number;
  paidAt: string;
  planName: string;
  periodStart: string;
  periodEnd: string;
  method: PaymentMethod;
  recordedBy: string;
};

export type NotificationKind = 'gym' | 'offer' | 'payment' | 'class';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** In-app route opened on tap. */
  href: string;
};

/** 0 = Sunday … 6 = Saturday (matches Date#getDay). */
export type OpeningHours = { day: number; open: string; close: string };

export type Gym = {
  id: string;
  name: string;
  addressLines: string[];
  mapsQuery: string;
  phone: string;
  whatsapp: string;
  gstin: string;
  hours: OpeningHours[];
  holiday: { date: string; title: string; note: string } | null;
};

export type GymOption = { id: string; name: string; area: string; role: 'member' | 'trainer' };

export type GymInvite = { id: string; gymName: string; area: string; role: 'member' | 'trainer'; invitedAt: string };

// ---------- gym ----------

const weekdayHours = [1, 2, 3, 4, 5, 6].map((day) => ({ day, open: '05:30', close: '22:00' }));

export const gym: Gym = {
  id: 'g_ipf',
  name: 'Iron Paradise Fitness',
  addressLines: ['TC 9/1203 Kowdiar Road', 'Kowdiar, Thiruvananthapuram 695003'],
  mapsQuery: 'Iron Paradise Fitness, Kowdiar Road, Kowdiar, Thiruvananthapuram 695003',
  phone: '04712345678',
  whatsapp: '919895012345',
  gstin: '32AAKFI4821Q1Z7',
  hours: [{ day: 0, open: '06:00', close: '12:00' }, ...weekdayHours],
  holiday: {
    date: daysFromNow(6),
    title: 'Closed for staff training',
    note: 'The gym is closed all day. Regular hours resume the next morning.',
  },
};

export const gymOptions: GymOption[] = [
  { id: 'g_ipf', name: 'Iron Paradise Fitness', area: 'Kowdiar', role: 'member' },
  { id: 'g_fzp', name: 'FitZone Pattom', area: 'Pattom', role: 'trainer' },
];

export const gymInvite: GymInvite = {
  id: 'inv_pulse',
  gymName: 'Pulse Studio',
  area: 'Vazhuthacaud',
  role: 'member',
  invitedAt: daysFromNow(-1, 17, 40),
};

// ---------- members ----------

export const members: Record<MemberId, Member> = {
  m_arjun: {
    id: 'm_arjun',
    name: 'Arjun Nair',
    phone: '9847012345',
    email: 'arjun.nair@example.com',
    relation: 'self',
    emergencyContact: { name: 'Meera Nair', relation: 'Spouse', phone: '9847098765' },
  },
  m_aarav: {
    id: 'm_aarav',
    name: 'Aarav Nair',
    phone: null,
    email: null,
    relation: 'son',
    emergencyContact: null,
  },
};

export const memberships: Record<MemberId, Membership> = {
  m_arjun: {
    id: 'ms_arjun',
    memberId: 'm_arjun',
    planName: 'Quarterly · Strength + Cardio',
    price: 6500,
    startDate: daysFromNow(-58),
    endDate: daysFromNow(33),
    memberCode: '4821 7730',
    status: 'active',
  },
  m_aarav: {
    id: 'ms_aarav',
    memberId: 'm_aarav',
    planName: 'Junior Fitness · Monthly',
    price: 1500,
    startDate: daysFromNow(-12),
    endDate: daysFromNow(18),
    memberCode: '4821 7731',
    status: 'active',
  },
};

// ---------- check-ins ----------

const arjunVisits: [daysAgo: number, hour: number, minute: number, method: CheckInMethod][] = [
  [1, 6, 12, 'pass'], [2, 18, 47, 'pass'], [4, 6, 5, 'scan'], [5, 6, 20, 'pass'],
  [7, 19, 2, 'pass'], [8, 6, 31, 'desk'], [9, 6, 8, 'pass'], [11, 18, 15, 'scan'],
  [12, 6, 14, 'pass'], [14, 7, 40, 'pass'], [15, 6, 3, 'pass'], [16, 19, 21, 'scan'],
  [18, 6, 11, 'pass'], [19, 6, 26, 'desk'], [21, 8, 2, 'pass'], [22, 6, 18, 'pass'],
  [24, 18, 55, 'pass'], [26, 6, 9, 'scan'], [28, 7, 12, 'pass'], [29, 6, 16, 'pass'],
  [31, 19, 10, 'desk'], [33, 6, 22, 'pass'],
];

const aaravVisits: [number, number, number, CheckInMethod][] = [
  [2, 17, 5, 'card'], [6, 17, 12, 'parent'], [9, 16, 58, 'card'], [13, 17, 20, 'parent'], [20, 9, 30, 'card'],
];

export const checkIns: CheckIn[] = [
  ...arjunVisits.map(([d, h, m, method], i) => ({ id: `ci_a${i}`, memberId: 'm_arjun' as const, at: daysFromNow(-d, h, m), method })),
  ...aaravVisits.map(([d, h, m, method], i) => ({ id: `ci_k${i}`, memberId: 'm_aarav' as const, at: daysFromNow(-d, h, m), method })),
];

// ---------- payments ----------

const frontDesk = 'Anjali S (Front desk)';

export const payments: Payment[] = [
  {
    id: 'p_0142',
    receiptNo: 'IPF/26-27/0142',
    memberId: 'm_arjun',
    amount: 6500,
    paidAt: daysFromNow(-58, 7, 15),
    planName: 'Quarterly · Strength + Cardio',
    periodStart: daysFromNow(-58),
    periodEnd: daysFromNow(33),
    method: 'UPI',
    recordedBy: frontDesk,
  },
  {
    id: 'p_0187',
    receiptNo: 'IPF/26-27/0187',
    memberId: 'm_aarav',
    amount: 1500,
    paidAt: daysFromNow(-12, 17, 30),
    planName: 'Junior Fitness · Monthly',
    periodStart: daysFromNow(-12),
    periodEnd: daysFromNow(18),
    method: 'Cash',
    recordedBy: frontDesk,
  },
  {
    id: 'p_0119',
    receiptNo: 'IPF/26-27/0119',
    memberId: 'm_aarav',
    amount: 1500,
    paidAt: daysFromNow(-42, 18, 5),
    planName: 'Junior Fitness · Monthly',
    periodStart: daysFromNow(-42),
    periodEnd: daysFromNow(-13),
    method: 'UPI',
    recordedBy: frontDesk,
  },
  {
    id: 'p_0031',
    receiptNo: 'IPF/26-27/0031',
    memberId: 'm_arjun',
    amount: 6500,
    paidAt: daysFromNow(-149, 6, 50),
    planName: 'Quarterly · Strength + Cardio',
    periodStart: daysFromNow(-149),
    periodEnd: daysFromNow(-59),
    method: 'Cash',
    recordedBy: frontDesk,
  },
];

// ---------- notifications ----------

export const notifications: AppNotification[] = [
  {
    id: 'n_holiday',
    kind: 'gym',
    title: 'Holiday hours',
    body: 'Iron Paradise is closed for a day of staff training. Tap to see the date and hours.',
    createdAt: daysFromNow(0, 8, 0),
    read: false,
    href: '/gym-info',
  },
  {
    id: 'n_friend',
    kind: 'offer',
    title: 'Bring a friend this Saturday',
    body: 'Your friend trains free with you this Saturday. Just come in together.',
    createdAt: daysFromNow(0, 7, 10),
    read: false,
    href: '/gym-info',
  },
  {
    id: 'n_pay_aarav',
    kind: 'payment',
    title: 'Payment recorded · ₹1,500',
    body: 'Aarav’s Junior Fitness plan was renewed. Receipt IPF/26-27/0187.',
    createdAt: daysFromNow(-12, 17, 31),
    read: false,
    href: '/receipt/p_0187',
  },
  {
    id: 'n_class',
    kind: 'class',
    title: 'New class: Saturday HIIT',
    body: 'A 45-minute HIIT class starts this Saturday at 7:00 am with Rahul.',
    createdAt: daysFromNow(-3, 12, 0),
    read: true,
    href: '/classes',
  },
  {
    id: 'n_pay_arjun',
    kind: 'payment',
    title: 'Payment recorded · ₹6,500',
    body: 'Your Quarterly plan is active. Receipt IPF/26-27/0142.',
    createdAt: daysFromNow(-58, 7, 16),
    read: true,
    href: '/receipt/p_0142',
  },
];

// ---------- trainer ----------

export type SessionStatus = 'done' | 'next' | 'later';

export type TrainerSession = {
  id: string;
  start: string;
  durationMin: number;
  kind: 'pt' | 'class';
  title: string;
  /** Member name for PT, or "12 / 15 booked" for classes. */
  detail: string;
  status: SessionStatus;
};

export type TrainerClient = {
  id: string;
  name: string;
  plan: string;
  goal: string;
  lastVisit: string;
  sessionsLeft: number;
};

export const trainer = { id: 't_rahul', name: 'Rahul Menon', phone: '9846055501' };

export const trainerToday: TrainerSession[] = [
  { id: 's1', start: daysFromNow(0, 6, 0), durationMin: 60, kind: 'pt', title: 'PT · Strength', detail: 'Arjun Nair', status: 'done' },
  { id: 's2', start: daysFromNow(0, 7, 30), durationMin: 45, kind: 'pt', title: 'PT · Fat loss', detail: 'Divya Pillai', status: 'next' },
  { id: 's3', start: daysFromNow(0, 18, 0), durationMin: 45, kind: 'class', title: 'HIIT class', detail: '12 / 15 booked', status: 'later' },
  { id: 's4', start: daysFromNow(0, 19, 30), durationMin: 60, kind: 'pt', title: 'PT · Mobility', detail: 'Joseph Mathew', status: 'later' },
];

export const trainerClients: TrainerClient[] = [
  { id: 'c1', name: 'Arjun Nair', plan: 'Quarterly · Strength + Cardio', goal: 'Build strength', lastVisit: daysFromNow(-1, 6, 12), sessionsLeft: 7 },
  { id: 'c2', name: 'Divya Pillai', plan: 'Monthly · PT 12', goal: 'Lose weight', lastVisit: daysFromNow(-2, 7, 30), sessionsLeft: 4 },
  { id: 'c3', name: 'Joseph Mathew', plan: 'Half-yearly · Gym', goal: 'Mobility', lastVisit: daysFromNow(-3, 19, 30), sessionsLeft: 9 },
  { id: 'c4', name: 'Lakshmi Varma', plan: 'Monthly · PT 8', goal: 'Tone up', lastVisit: daysFromNow(-1, 17, 0), sessionsLeft: 2 },
  { id: 'c5', name: 'Fathima Rasheed', plan: 'Quarterly · PT 24', goal: 'Post-natal fitness', lastVisit: daysFromNow(-5, 10, 0), sessionsLeft: 15 },
  { id: 'c6', name: 'Vishnu Prasad', plan: 'Monthly · PT 12', goal: 'Muscle gain', lastVisit: daysFromNow(-9, 18, 20), sessionsLeft: 6 },
  { id: 'c7', name: 'Anoop Krishnan', plan: 'Annual · Gym + PT', goal: 'Marathon prep', lastVisit: daysFromNow(-4, 6, 0), sessionsLeft: 21 },
  { id: 'c8', name: 'Sneha Thomas', plan: 'Monthly · PT 8', goal: 'Lose weight', lastVisit: daysFromNow(-16, 7, 0), sessionsLeft: 0 },
];

type DayPlan = [hour: number, minute: number, durationMin: number, kind: 'pt' | 'class', title: string, detail: string][];

const weekPlan: DayPlan[] = [
  [], // today — filled from trainerToday
  [[6, 0, 60, 'pt', 'PT · Strength', 'Arjun Nair'], [7, 30, 45, 'pt', 'PT · Tone up', 'Lakshmi Varma'], [18, 0, 60, 'pt', 'PT · Muscle gain', 'Vishnu Prasad']],
  [[6, 30, 60, 'pt', 'PT · Marathon prep', 'Anoop Krishnan'], [10, 0, 45, 'pt', 'PT · Post-natal', 'Fathima Rasheed']],
  [[6, 0, 60, 'pt', 'PT · Strength', 'Arjun Nair'], [7, 30, 45, 'pt', 'PT · Fat loss', 'Divya Pillai'], [18, 0, 45, 'class', 'HIIT class', '9 / 15 booked'], [19, 30, 60, 'pt', 'PT · Mobility', 'Joseph Mathew']],
  [[7, 0, 45, 'pt', 'PT · Tone up', 'Lakshmi Varma']],
  [[7, 0, 45, 'class', 'HIIT class', '15 / 15 booked'], [9, 0, 60, 'pt', 'PT · Muscle gain', 'Vishnu Prasad']],
  [],
];

export const trainerWeek: { date: string; sessions: TrainerSession[] }[] = weekPlan.map((plan, day) => ({
  date: daysFromNow(day),
  sessions:
    day === 0
      ? trainerToday
      : plan.map(([h, m, durationMin, kind, title, detail], i) => ({
          id: `w${day}_${i}`,
          start: daysFromNow(day, h, m),
          durationMin,
          kind,
          title,
          detail,
          status: 'later' as const,
        })),
}));

// ---------- classes (preview only, booking is Phase 1.5) ----------

export type PreviewClass = { id: string; title: string; when: string; trainer: string; durationMin: number; spots: string };

export const previewClasses: PreviewClass[] = [
  { id: 'cl_hiit', title: 'Saturday HIIT', when: 'Saturdays · 7:00 am', trainer: 'Rahul Menon', durationMin: 45, spots: '15 spots' },
  { id: 'cl_yoga', title: 'Morning Yoga', when: 'Tue & Thu · 6:30 am', trainer: 'Sreeja K', durationMin: 60, spots: '12 spots' },
];
