import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, useThemedPaper } from '@/theme/ThemeProvider';
import { AppNavigator } from '@/navigation/AppNavigator';

function Providers() {
  const { paperTheme, navigationTheme } = useThemedPaper();
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Suspense fallback={<ActivityIndicator style={{ marginTop: 32 }} />}>
          <AppNavigator />
        </Suspense>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Providers />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
