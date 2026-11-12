import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { useSession } from '../features/auth/session';

/**
 * Set in .env:  EXPO_PUBLIC_API_URL=http://<your-PC-LAN-IP>:<port>/api
 * (Not "localhost" — on a phone, localhost is the phone itself.)
 */
const baseURL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

export const api = axios.create({ baseURL, timeout: 15000 });

api.interceptors.request.use((config) => {
  // Orval paths already start with /api — strip it so we don't call /api/api/... (same fix as web)
  if (config.url?.startsWith('/api/') && baseURL.endsWith('/api')) {
    config.url = config.url.slice(4);
  }
  const token = useSession.getState().session?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const session = useSession.getState().session;
  if (!session) return null;
  try {
    // TODO: match the real endpoint/shape once gymflow-api has it.
    const res = await axios.post<{ accessToken: string; refreshToken: string }>(`${baseURL}/auth/refresh`, {
      refreshToken: session.refreshToken,
    });
    useSession.getState().setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data.accessToken;
  } catch {
    useSession.getState().signOut();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      // Many requests can 401 at once — share one refresh call.
      refreshing = refreshing ?? refreshAccessToken().finally(() => (refreshing = null));
      const token = await refreshing;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Orval mutator — point orval.config.ts at this (name: 'customInstance'). */
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> =>
  api({ ...config, ...options }).then((res) => res.data as T);

export type ErrorType<E> = AxiosError<E>;
export type BodyType<B> = B;
