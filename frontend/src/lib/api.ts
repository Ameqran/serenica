import type { Booking, DashboardData, ManualNote, Patient, Session, SessionEditor } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || `Request failed with status ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getDashboard(token: string): Promise<DashboardData> {
  return apiFetch('/api/dashboard/overview', token);
}

export function getPatients(token: string, search = ''): Promise<Patient[]> {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  return apiFetch(`/api/patients${query}`, token);
}

export function createPatient(token: string, payload: {
  code: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  primaryConcern?: string;
  therapyApproach?: string;
  riskLevel: string;
  active: boolean;
}): Promise<Patient> {
  return apiFetch('/api/patients', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getBookings(token: string, date?: string): Promise<Booking[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiFetch(`/api/bookings${query}`, token);
}

export function createBooking(token: string, payload: {
  patientId: string;
  startsAt: string;
  durationMinutes: number;
  sessionType: string;
  status: string;
  location?: string;
  notes?: string;
}): Promise<Booking> {
  return apiFetch('/api/bookings', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getSessions(token: string, patientId?: string): Promise<Session[]> {
  const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
  return apiFetch(`/api/sessions${query}`, token);
}

export function createSession(token: string, payload: {
  patientId: string;
  bookingId?: string;
  sessionNumber: number;
  occurredAt: string;
  durationMinutes: number;
  focusArea?: string;
  phq9Score?: number;
  gad7Score?: number;
  moodScore?: number;
  riskSummary?: string;
  summary?: string;
}): Promise<Session> {
  return apiFetch('/api/sessions', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getSessionEditor(token: string, sessionId: string): Promise<SessionEditor> {
  return apiFetch(`/api/sessions/${sessionId}/editor`, token);
}

export function createSessionNote(token: string, sessionId: string, payload: {
  title: string;
  format: string;
  content: string;
  signed: boolean;
  aiDrafted: boolean;
}): Promise<ManualNote> {
  return apiFetch(`/api/sessions/${sessionId}/notes`, token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getNotes(token: string, options?: {
  patientId?: string;
  signed?: boolean;
  format?: string;
  search?: string;
}): Promise<ManualNote[]> {
  const params = new URLSearchParams();
  if (options?.patientId) params.set('patientId', options.patientId);
  if (typeof options?.signed === 'boolean') params.set('signed', String(options.signed));
  if (options?.format) params.set('format', options.format);
  if (options?.search?.trim()) params.set('search', options.search.trim());

  const query = params.toString();
  return apiFetch(`/api/notes${query ? `?${query}` : ''}`, token);
}

export function createNote(token: string, payload: {
  patientId: string;
  sessionId?: string;
  title: string;
  format: string;
  content: string;
  signed: boolean;
  aiDrafted: boolean;
}): Promise<ManualNote> {
  return apiFetch('/api/notes', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
