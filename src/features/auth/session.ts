import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
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
      signOut: () => set({ session: null }),
    }),
    { name: 'gymflow.session', storage: createJSONStorage(() => secureStorage) },
  ),
);

/** True once the saved session has been read from secure storage. */
export function useSessionHydrated() {
  const [hydrated, setHydrated] = useState(() => useSession.persist.hasHydrated());
  useEffect(() => {
    const unsubscribe = useSession.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useSession.persist.hasHydrated());
    return unsubscribe;
  }, []);
  return hydrated;
}
