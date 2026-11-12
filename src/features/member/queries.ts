import { useQuery } from '@tanstack/react-query';
import {
  checkIns,
  daysFromNow,
  gym,
  memberships,
  payments,
  type CheckIn,
  type Gym,
  type MemberId,
  type Membership,
  type Payment,
} from '../../mocks/data';
import { useDevStore, type MembershipScenario } from '../dev/devStore';

/**
 * Member data hooks. MOCK for now: each resolves the fixtures after ~300 ms so
 * screens show real loading states. When gymflow-api is ready, swap the
 * queryFns for the Orval-generated calls — screens should not need to change.
 */

const LATENCY_MS = 300;
const mock = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

export const memberKeys = {
  membership: (memberId: MemberId, scenario: MembershipScenario) => ['membership', memberId, scenario] as const,
  checkIns: (memberId: MemberId, scenario: MembershipScenario) => ['checkIns', memberId, scenario] as const,
  payments: ['payments'] as const,
  gym: ['gym'] as const,
};

/** Dev gallery: rewrites the fixture's dates/status to preview each membership state. */
function applyScenario(base: Membership, scenario: MembershipScenario): Membership | null {
  switch (scenario) {
    case 'real':
      return base;
    case 'active':
      return { ...base, status: 'active', startDate: daysFromNow(-10), endDate: daysFromNow(80) };
    case 'endsSoon':
      return { ...base, status: 'active', startDate: daysFromNow(-86), endDate: daysFromNow(4) };
    case 'expired':
      return { ...base, status: 'expired', startDate: daysFromNow(-94), endDate: daysFromNow(-3) };
    case 'upcoming':
      return { ...base, status: 'upcoming', startDate: daysFromNow(4), endDate: daysFromNow(94) };
    case 'paused':
      return { ...base, status: 'paused', pausedUntil: daysFromNow(12) };
    case 'none':
      return null;
  }
}

/** Current plan for a member, or null when they have none. */
export function useMembership(memberId: MemberId) {
  const scenario = useDevStore((s) => s.scenario);
  return useQuery({
    queryKey: memberKeys.membership(memberId, scenario),
    queryFn: () => mock(applyScenario(memberships[memberId], scenario)),
  });
}

/** Visits, newest first. */
export function useCheckIns(memberId: MemberId) {
  const scenario = useDevStore((s) => s.scenario);
  return useQuery({
    queryKey: memberKeys.checkIns(memberId, scenario),
    queryFn: (): Promise<CheckIn[]> => {
      // A member with no plan yet (or one that hasn't started) has no visits.
      const empty = scenario === 'none' || scenario === 'upcoming';
      const list = empty ? [] : checkIns.filter((c) => c.memberId === memberId);
      return mock([...list].sort((a, b) => b.at.localeCompare(a.at)));
    },
  });
}

/** Payments for the whole family account, newest first. */
export function usePayments() {
  return useQuery({
    queryKey: memberKeys.payments,
    queryFn: (): Promise<Payment[]> => mock([...payments].sort((a, b) => b.paidAt.localeCompare(a.paidAt))),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: [...memberKeys.payments, id],
    queryFn: (): Promise<Payment | null> => mock(payments.find((p) => p.id === id) ?? null),
  });
}

export function useGym() {
  return useQuery({ queryKey: memberKeys.gym, queryFn: (): Promise<Gym> => mock(gym) });
}
