export type Role = 'member' | 'trainer';

export type Session = {
  accessToken: string;
  refreshToken: string;
  /** Role at the active gym (comes from the JWT once the real API exists). */
  role: Role;
  user: { id: string; name: string; phone: string };
  gym: { id: string; name: string };
  /** False on a member's first login, until they confirm their profile. */
  onboarded: boolean;
};
