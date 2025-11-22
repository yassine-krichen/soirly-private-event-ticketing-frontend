import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { googleSignIn, AuthResponse, fetchProfile } from '@/api/auth';
import { setAuthToken } from '@/api/client';
import { clearToken, loadToken, saveToken } from '@/storage/tokenStorage';

type Role = 'INVITER' | 'INVITEE';

interface AuthContextValue {
  user?: AuthResponse['user'];
  token?: string;
  loading: boolean;
  completeGoogleLogin: (googleToken: string, role: Role) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user']>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await loadToken();
      if (storedToken) {
        setAuthToken(storedToken);
        setToken(storedToken);
        try {
          const profile = await fetchProfile();
          setUser(profile);
        } catch (error) {
          await clearToken();
          setAuthToken(undefined);
        }
      }
      setLoading(false);
    })();
  }, []);

  const completeGoogleLogin = async (googleToken: string, role: Role) => {
    try {
      setLoading(true);
      const { jwt, user: profile } = await googleSignIn({ token: googleToken, role });
      await saveToken(jwt);
      setAuthToken(jwt);
      setToken(jwt);
      setUser(profile);
    } catch (error) {
      Alert.alert('Login failed', 'Unable to authenticate with Google.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await clearToken();
    setAuthToken(undefined);
    setToken(undefined);
    setUser(undefined);
    setLoading(false);
  };

  const value = useMemo(() => ({ user, token, loading, completeGoogleLogin, signOut }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
