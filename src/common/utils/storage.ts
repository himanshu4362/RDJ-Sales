import type { Session, Member } from '../../features/account/domain/account.types';

const KEYS = {
  SESSION: 'rdj_session_v1',
  MEMBER: 'rdj_member_v1',
};

export const SessionStorageService = {
  save: (session: Session, member: Member): void => {
    try {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
      localStorage.setItem(KEYS.MEMBER, JSON.stringify(member));
    } catch (e) {
      console.error('SessionStorage: Failed to persist session', e);
    }
  },
  get: (): { session: Session; member: Member } | null => {
    try {
      const session = localStorage.getItem(KEYS.SESSION);
      const member = localStorage.getItem(KEYS.MEMBER);
      if (session && member) {
        return { session: JSON.parse(session), member: JSON.parse(member) };
      }
      return null;
    } catch (e) {
      console.error('SessionStorage: Failed to read session', e);
      return null;
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(KEYS.SESSION);
      localStorage.removeItem(KEYS.MEMBER);
    } catch (e) {
      console.error('SessionStorage: Failed to clear session', e);
    }
  }
};