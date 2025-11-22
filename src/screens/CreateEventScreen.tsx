import { useState, useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { createEvent, fetchInviterEvents, EventPayload } from '@/api/events';
import { useAuth } from '@/contexts/AuthContext';
import { EventCard } from '@/components/EventCard';

const initialForm = {
  title: '',
  description: '',
  dateTime: '',
  location: '',
  entryPrice: '',
};

export const CreateEventScreen: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [events, setEvents] = useState<EventPayload[]>([]);

  const isInviter = user?.role === 'INVITER';

  const loadEvents = async () => {
    if (!user?.id) return;
    const data = await fetchInviterEvents(user.id);
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, [user?.id]);

  const onChange = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const parsedDate = Date.parse(form.dateTime);
  const entryPriceValue = Number(form.entryPrice);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        dateTime: new Date(parsedDate).toISOString(),
        location: form.location,
        entryPrice: entryPriceValue,
      });
      setForm(initialForm);
      await loadEvents();
      Alert.alert('Event created', 'Share the event ID with your invitees.');
    } catch (error) {
      Alert.alert('Failed to create event', 'Please double-check the fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isInviter) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="bodyLarge">Only inviters can create private events.</Text>
      </View>
    );
  }

  const disabled =
    !form.title ||
    !form.description ||
    !form.dateTime ||
    Number.isNaN(parsedDate) ||
    !form.location ||
    Number.isNaN(entryPriceValue) ||
    entryPriceValue <= 0;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Create Private Event
      </Text>
      <TextInput label="Title" value={form.title} onChangeText={(text) => onChange('title', text)} style={{ marginBottom: 12 }} />
      <TextInput
        label="Description"
        value={form.description}
        onChangeText={(text) => onChange('description', text)}
        multiline
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Date & Time"
        placeholder="2025-01-01T18:30"
        value={form.dateTime}
        onChangeText={(text) => onChange('dateTime', text)}
        style={{ marginBottom: 12 }}
      />
      <HelperText type={Number.isNaN(parsedDate) ? 'error' : 'info'}>
        {Number.isNaN(parsedDate) ? 'Enter a valid ISO date (e.g. 2025-01-01T18:30)' : 'Use ISO format to keep backend validation simple.'}
      </HelperText>
      <TextInput label="Location" value={form.location} onChangeText={(text) => onChange('location', text)} style={{ marginBottom: 12 }} />
      <TextInput
        label="Entry Price"
        value={form.entryPrice}
        onChangeText={(text) => onChange('entryPrice', text)}
        keyboardType="decimal-pad"
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={handleCreate} disabled={disabled || submitting} loading={submitting}>
        Save event
      </Button>

      <Text variant="titleMedium" style={{ marginVertical: 16 }}>
        Your events
      </Text>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {events.length === 0 && <Text>No events yet. Share the generated IDs with invitees.</Text>}
    </ScrollView>
  );
};
