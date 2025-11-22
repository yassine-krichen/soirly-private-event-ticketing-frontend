import api from './client';

export const startPayment = (eventId: string) =>
  api.post<{ paymentId: string; paymentUrl: string; konnectReference: string }>('/payments', { eventId }).then((res) => res.data);

export const fetchPaymentStatus = (paymentId: string) =>
  api.get<{ status: string }>(`/payments/${paymentId}/status`).then((res) => res.data);
