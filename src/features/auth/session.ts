import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { Session } from './types';

/** Tokens live in the device keychain/keystore, not plain storage. */
const secureStorage: StateStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

type SessionState = {
  session: Session | null;
  setSession: (session: Session) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  markOnboarded: () => void;
  /** Switch the active gym (and the role held there). */
  switchGym: (gym: Session['gym'], role: Session['role']) => void;
  signOut: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (session) => set({ session }),
      setTokens: (accessToken, refreshToken) => {
        const current = get().session;
        if (current) set({ session: { ...current, accessToken, refreshToken } });
      },
      markOnboarded: () => {
        const current = get().session;
        if (current) set({ session: { ...current, onboarded: true } });
      },
      switchGym: (gym, role) => {
        const current = get().session;
        if (current) set({ session: { ...current, gym, role } });
      },
      signOut: () => set({ session: null }),
    }),
    { name: 'gymflow.session', storage: createJSONStorage(() => secureStorage) },
  ),
);

/** True once the saved session has been read from secure storage. */
export function useSessionHydrated() {
  return useSyncExternalStore(
    (onChange) => useSession.persist.onFinishHydration(onChange),
    () => useSession.persist.hasHydrated(),
  );
}
