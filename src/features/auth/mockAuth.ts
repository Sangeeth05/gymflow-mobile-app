/**
 * TEMPORARY mock of the OTP endpoints until gymflow-api has them.
 * Replace with the Orval-generated hooks (e.g. useSendOtp / useVerifyOtp).
 */
import { gym, members, trainer } from '../../mocks/data';
import type { Role, Session } from './types';

export const MOCK_OTP = '123456';
/** Signing in with this number simulates "no gym has added this number". */
export const MOCK_NO_ACCOUNT_PHONE = '9999999999';

export class NoAccountError extends Error {
  constructor() {
    super('No gym has added this number yet.');
    this.name = 'NoAccountError';
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendOtp(_phone: string): Promise<void> {
  await wait(500);
}

export async function verifyOtp(phone: string, code: string, role: Role): Promise<Session> {
  await wait(600);
  if (code !== MOCK_OTP) throw new Error("That code didn't match. Check the latest message and try again.");
  if (phone === MOCK_NO_ACCOUNT_PHONE) throw new NoAccountError();
  const user = role === 'trainer' ? trainer : members.m_arjun;
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    role,
    user: { id: user.id, name: user.name, phone },
    gym: { id: gym.id, name: gym.name },
    // Members confirm their profile on first login; trainers go straight in.
    onboarded: role === 'trainer',
  };
}
