import api from './client';

export interface AuthResponse {
  jwt: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'INVITER' | 'INVITEE';
  };
}

export const googleSignIn = (payload: { token: string; role?: 'INVITER' | 'INVITEE' }) =>
  api.post<AuthResponse>('/auth/google', payload).then((res) => res.data);

export const fetchProfile = () => api.get<AuthResponse['user']>('/auth/me').then((res) => res.data);
