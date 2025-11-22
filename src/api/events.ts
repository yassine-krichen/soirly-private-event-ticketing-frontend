import api from './client';

export interface EventPayload {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  entryPrice: number;
  inviteeCount: number;
  inviterId: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  entryPrice: number;
}

export const createEvent = (data: CreateEventInput) =>
  api.post<EventPayload>('/events', data).then((res) => res.data);

export const fetchEventById = (id: string) => api.get<EventPayload>(`/events/${id}`).then((res) => res.data);

export const fetchInviterEvents = (inviterId: string) =>
  api.get<EventPayload[]>(`/users/${inviterId}/events`).then((res) => res.data);
