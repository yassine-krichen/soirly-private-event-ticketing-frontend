import { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/AppNavigator';

export const JoinEventScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [eventId, setEventId] = useState('');

  const canJoin = Boolean(user);
  const isInvitee = user?.role === 'INVITEE';

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Join private event
      </Text>
      <TextInput
        label="Event ID"
        value={eventId}
        onChangeText={setEventId}
        autoCapitalize="none"
        style={{ marginBottom: 8 }}
      />
      <HelperText type={isInvitee ? 'info' : 'error'}>
        {isInvitee ? 'Ask the inviter for their private ID.' : 'Switch to invitee role to join events.'}
      </HelperText>
      <Button
        mode="contained"
        style={{ marginTop: 16 }}
        disabled={!eventId || !canJoin || !isInvitee}
        onPress={() => navigation.navigate('EventDetails', { eventId })}
      >
        View event
      </Button>
    </View>
  );
};
