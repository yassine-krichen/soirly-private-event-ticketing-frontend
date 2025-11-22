import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, SegmentedButtons, Text } from 'react-native-paper';
import { CreateEventScreen } from './CreateEventScreen';
import { JoinEventScreen } from './JoinEventScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useThemedPaper } from '@/theme/ThemeProvider';

export const DashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<'create' | 'join'>(user?.role === 'INVITER' ? 'create' : 'join');
  const { toggleTheme, theme } = useThemedPaper();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <Appbar.Header>
        <Appbar.Content title="Event Organizer" subtitle={user?.email} />
        <Appbar.Action icon={theme === 'light' ? 'weather-night' : 'white-balance-sunny'} onPress={toggleTheme} accessibilityLabel="Toggle theme" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <SegmentedButtons
          value={tab}
          onValueChange={(value) => setTab(value as 'create' | 'join')}
          buttons={[
            { value: 'create', label: 'Create', disabled: user?.role !== 'INVITER' },
            { value: 'join', label: 'Join' },
          ]}
        />
      </View>

      {tab === 'create' ? <CreateEventScreen /> : <JoinEventScreen />}

      <View style={{ paddingHorizontal: 16 }}>
        <Button mode="outlined" onPress={signOut} style={{ marginTop: 16 }}>
          Sign out
        </Button>
      </View>
    </ScrollView>
  );
};
