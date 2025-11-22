import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { useAuth } from '@/contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

type Role = 'INVITER' | 'INVITEE';

export const LoginScreen: React.FC = () => {
  const { completeGoogleLogin, loading } = useAuth();
  const [role, setRole] = useState<Role>('INVITEE');
  const authConfig = useMemo(
    () => {
      // Manually construct the proxy URL because makeRedirectUri with useProxy is unreliable/deprecated in newer SDKs
      // If you have an Expo account, replace 'anonymous' with your username if it's not auto-detected.
      const slug = Constants.expoConfig?.slug || 'frontend';
      const owner = Constants.expoConfig?.owner || 'anonymous';
      const redirectUri = `https://auth.expo.io/@${owner}/${slug}`;
      
      console.log('Using Redirect URI:', redirectUri);
      return {
        expoClientId: googleClientId ?? '',
        iosClientId: googleClientId ?? '',
        androidClientId: googleClientId ?? '',
        webClientId: googleClientId ?? '',
        redirectUri,
      };
    },
    [],
  );

  useEffect(() => {
    if (!googleClientId) {
      console.warn('EXPO_PUBLIC_GOOGLE_CLIENT_ID is not defined. Google login will fail.');
    }
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest(authConfig);

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        completeGoogleLogin(idToken, role).catch(() => undefined);
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [response, role]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
        Welcome to Event Organizer
      </Text>
      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        Pick your role and authenticate via Google. Events stay private and can be accessed only by ID.
      </Text>
      <SegmentedButtons
        value={role}
        onValueChange={(value) => setRole(value as Role)}
        buttons={[
          { label: 'Invitee', value: 'INVITEE' },
          { label: 'Inviter', value: 'INVITER' },
        ]}
        style={{ marginBottom: 24 }}
      />
      {/* @ts-ignore: redirectUri is valid in runtime but missing in some type definitions */}
      <Button mode="contained" disabled={!request || loading} onPress={() => promptAsync({ redirectUri: authConfig.redirectUri })}>
        Continue with Google
      </Button>
    </View>
  );
};
