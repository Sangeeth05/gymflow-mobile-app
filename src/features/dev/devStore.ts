import { create } from 'zustand';

/**
 * Dev-only overrides driven by the Screen gallery. Lets us preview every state
 * of a screen with the mock data. Remove (or keep for QA builds) once the API exists.
 */
export type MembershipScenario = 'real' | 'active' | 'endsSoon' | 'expired' | 'upcoming' | 'paused' | 'none';

export const scenarioLabels: Record<MembershipScenario, string> = {
  real: 'Real dates',
  active: 'Active',
  endsSoon: 'Ends soon',
  expired: 'Expired',
  upcoming: 'Upcoming',
  paused: 'Paused',
  none: 'No plan',
};

type DevState = {
  scenario: MembershipScenario;
  offline: boolean;
  setScenario: (scenario: MembershipScenario) => void;
  setOffline: (offline: boolean) => void;
  reset: () => void;
};

export const useDevStore = create<DevState>()((set) => ({
  scenario: 'real',
  offline: false,
  setScenario: (scenario) => set({ scenario }),
  setOffline: (offline) => set({ offline }),
  reset: () => set({ scenario: 'real', offline: false }),
}));

/**
 * Network status. Simulated from the gallery for now; swap the body for a real
 * connectivity check (e.g. @react-native-community/netinfo) when we add one.
 */
export function useIsOffline(): boolean {
  return useDevStore((s) => s.offline);
}
