/**
 * TEMPORARY mock of the OTP endpoints until gymflow-api has them.
 * Replace with the Orval-generated hooks (e.g. useSendOtp / useVerifyOtp).
 */
import type { Role, Session } from './types';

export const MOCK_OTP = '123456';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendOtp(_phone: string): Promise<void> {
  await wait(500);
}

export async function verifyOtp(phone: string, code: string, role: Role): Promise<Session> {
  await wait(600);
  if (code !== MOCK_OTP) throw new Error("That code didn't match. Check the latest message and try again.");
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    role,
    user: { id: `u_${phone}`, name: role === 'trainer' ? 'Demo Trainer' : 'Demo Member', phone },
    gym: { id: 'g_demo', name: 'Demo Fitness' },
  };
}
