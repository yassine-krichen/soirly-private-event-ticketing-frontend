import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'event-organizer-theme';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  paperTheme: typeof MD3LightTheme;
  navigationTheme: NavigationTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, theme).catch(() => undefined);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')), []);

  const paperTheme = theme === 'light' ? MD3LightTheme : MD3DarkTheme;
  const navigationTheme = theme === 'light' ? NavigationLightTheme : NavigationDarkTheme;

  const value = useMemo(() => ({ theme, toggleTheme, paperTheme, navigationTheme }), [theme, toggleTheme, paperTheme, navigationTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemedPaper = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemedPaper must be used within ThemeProvider');
  }
  return context;
};
