import { baseApi } from '../../../store/api/baseApi';
import type { Member, Session, Identity, Profile } from '../domain/account.types';

export interface AuthResponse {
  session: Session;
  member: Member;
}

// Mock Database Tables (Relational Structure)
const mockIdentities: Record<string, Identity & { passwordHash?: string }> = {
  'mem_ravi_1': { id: 'mem_ravi_1', phone: '9999999999', role: 'admin', passwordHash: 'password123' },
  'mem_lead_1': { id: 'mem_lead_1', phone: '8888888888', role: 'member' } // Pre-existing Lead (No password)
};

const mockProfiles: Record<string, Profile> = {
  'mem_ravi_1': { memberId: 'mem_ravi_1', displayName: 'Ravi Rana', cityDistrict: 'Patna', isVerifiedByRavi: true },
  'mem_lead_1': { memberId: 'mem_lead_1', displayName: 'Rahul Setup (Lead)', isVerifiedByRavi: false }
};

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, { phone: string; password: string }>({
      queryFn: ({ phone, password }) => {
        const identity = Object.values(mockIdentities).find(i => i.phone === phone);
        if (!identity || identity.passwordHash !== password) {
          return { error: { status: 401, statusText: 'Unauthorized', data: { message: 'Invalid phone number or password.' } } };
        }
        
        const session: Session = { accessToken: `token_${Date.now()}`, expiresAt: new Date(Date.now() + 86400000).toISOString() };
        const member: Member = { identity, profile: mockProfiles[identity.id] };
        
        return { data: { session, member } };
      },
    }),

    register: builder.mutation<AuthResponse, { displayName: string; phone: string; password: string; cityDistrict?: string }>({
      queryFn: (payload) => {
        let identity = Object.values(mockIdentities).find(i => i.phone === payload.phone);
        
        // CRM Event: Lead -> Customer Activates Account
        if (identity) {
          if (identity.passwordHash) {
            return { error: { status: 400, statusText: 'Bad Request', data: { code: 'ACCOUNT_EXISTS', message: 'An account with this phone number already exists.' } } };
          }
          // Activate existing lead
          identity.passwordHash = payload.password;
          mockProfiles[identity.id].displayName = payload.displayName; // Update with provided name
          if (payload.cityDistrict) mockProfiles[identity.id].cityDistrict = payload.cityDistrict;
        } else {
          // Create brand new identity (Strictly Member role)
          const newId = `mem_${Math.random().toString(36).substring(7)}`;
          identity = { id: newId, phone: payload.phone, role: 'member', passwordHash: payload.password };
          mockIdentities[newId] = identity;
          mockProfiles[newId] = { memberId: newId, displayName: payload.displayName, cityDistrict: payload.cityDistrict, isVerifiedByRavi: false };
        }

        const session: Session = { accessToken: `token_${Date.now()}`, expiresAt: new Date(Date.now() + 86400000).toISOString() };
        const member: Member = { identity, profile: mockProfiles[identity.id] };
        
        return { data: { session, member } };
      },
    }),
  }),
});

export const { useSignInMutation, useRegisterMutation } = accountApi;