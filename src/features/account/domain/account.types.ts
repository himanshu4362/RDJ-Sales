// AuthN: Who are you?
export type MemberRole = 'admin' | 'member';

export interface Identity {
  id: string;
  phone: string;
  role: MemberRole;
}

// AuthZ / Operational: What is your business context?
export interface Profile {
  memberId: string;
  displayName: string;
  cityDistrict?: string; // Optional for low-friction V1 onboarding
  isVerifiedByRavi: boolean;
}

export interface Member {
  identity: Identity;
  profile: Profile;
}

export interface Session {
  accessToken: string;
  expiresAt: string;
}