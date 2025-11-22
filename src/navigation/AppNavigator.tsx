import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { EventDetailsScreen } from '@/screens/EventDetailsScreen';
import { LoginScreen } from '@/screens/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  EventDetails: { eventId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event details' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};
