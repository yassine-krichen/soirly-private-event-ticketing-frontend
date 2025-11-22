import { Card, Text } from 'react-native-paper';
import { View } from 'react-native';
import { EventPayload } from '@/api/events';

interface Props {
  event: EventPayload;
  onPress?: () => void;
}

export const EventCard: React.FC<Props> = ({ event, onPress }) => (
  <Card style={{ marginBottom: 12 }} mode="outlined" onPress={onPress}>
    <Card.Title title={event.title} subtitle={new Date(event.dateTime).toLocaleString()} />
    <Card.Content>
      <Text variant="bodyMedium">{event.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text variant="bodyLarge">${event.entryPrice.toFixed(2)}</Text>
        <Text variant="bodyMedium">Invitees: {event.inviteeCount}</Text>
      </View>
    </Card.Content>
  </Card>
);
