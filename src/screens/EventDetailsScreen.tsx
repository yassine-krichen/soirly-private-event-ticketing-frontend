import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchEventById, EventPayload } from '@/api/events';
import { startPayment } from '@/api/payments';
import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/navigation/AppNavigator';

export type EventDetailsProps = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

export const EventDetailsScreen: React.FC<EventDetailsProps> = ({ route }) => {
  const { user } = useAuth();
  const [event, setEvent] = useState<EventPayload>();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchEventById(route.params.eventId)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [route.params.eventId]);

  const handlePay = async () => {
    if (!event) return;
    setPaying(true);
    try {
      const { paymentUrl, paymentId } = await startPayment(event.id);
      await Linking.openURL(paymentUrl);
      Alert.alert('Payment session created', `Reference: ${paymentId}`);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge">{event.title}</Text>
      <Text variant="bodyMedium" style={{ marginVertical: 12 }}>
        {event.description}
      </Text>
      <View style={{ marginVertical: 8 }}>
        <Text>Date & Time: {new Date(event.dateTime).toLocaleString()}</Text>
        <Text>Location: {event.location}</Text>
        <Text>Entry price: ${event.entryPrice.toFixed(2)}</Text>
        <Text>Invitees joined: {event.inviteeCount}</Text>
      </View>
      {user?.role === 'INVITEE' && (
        <Button mode="contained" onPress={handlePay} loading={paying} disabled={paying}>
          Pay & Join
        </Button>
      )}
      <View style={{ marginTop: 24, padding: 12, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8 }}>
        <Text variant="bodyMedium">
          Share this event ID with trusted invitees only: {event.id}
        </Text>
      </View>
    </ScrollView>
  );
};
