import { create } from 'zustand';
import { members, type MemberId } from '../../mocks/data';

/**
 * Local member state that has no API yet: profile edits, goals, reminder
 * prefs, whose pass is showing, and the "Finish setting up" checklist.
 */
export type Profile = {
  name: string;
  email: string;
  hasPhoto: boolean;
  emergencyName: string;
  emergencyPhone: string;
};

export type ReminderPrefs = { membership: boolean; sessions: boolean; news: boolean };

export const GOAL_OPTIONS = [
  'Build strength',
  'Lose weight',
  'Stay active',
  'Build muscle',
  'Improve stamina',
  'Flexibility',
  'Reduce stress',
  'Sports training',
] as const;
export type Goal = (typeof GOAL_OPTIONS)[number];

type MemberState = {
  profile: Profile;
  goals: Goal[];
  /** Visits per week; null until the member sets one. */
  weeklyGoal: number | null;
  reminders: ReminderPrefs;
  /** True once the member has answered the reminders screen (on or not now). */
  remindersAnswered: boolean;
  activeMemberId: MemberId;
  setupDismissed: boolean;
  saveProfile: (profile: Profile) => void;
  saveGoals: (goals: Goal[], weeklyGoal: number) => void;
  saveReminders: (reminders: ReminderPrefs) => void;
  setActiveMember: (id: MemberId) => void;
  dismissSetup: () => void;
  reset: () => void;
};

const arjun = members.m_arjun;

const initial = {
  profile: {
    name: arjun.name,
    email: arjun.email ?? '',
    hasPhoto: false,
    emergencyName: arjun.emergencyContact?.name ?? '',
    emergencyPhone: arjun.emergencyContact?.phone ?? '',
  },
  goals: [] as Goal[],
  weeklyGoal: null,
  reminders: { membership: true, sessions: true, news: false },
  remindersAnswered: false,
  activeMemberId: 'm_arjun' as MemberId,
  setupDismissed: false,
};

export const useMemberStore = create<MemberState>()((set) => ({
  ...initial,
  saveProfile: (profile) => set({ profile }),
  saveGoals: (goals, weeklyGoal) => set({ goals, weeklyGoal }),
  saveReminders: (reminders) => set({ reminders, remindersAnswered: true }),
  setActiveMember: (activeMemberId) => set({ activeMemberId }),
  dismissSetup: () => set({ setupDismissed: true }),
  reset: () => set(initial),
}));

/** Whose pass is showing (Arjun or Aarav), with Arjun's local profile edits applied. */
export function useActiveMember() {
  const id = useMemberStore((s) => s.activeMemberId);
  const profile = useMemberStore((s) => s.profile);
  const base = members[id];
  return id === 'm_arjun' ? { ...base, name: profile.name } : base;
}
