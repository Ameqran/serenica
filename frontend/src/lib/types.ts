export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'WATCH';
export type BookingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type NoteFormat = 'FREE' | 'SOAP' | 'DAP';

export interface Patient {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  primaryConcern: string | null;
  therapyApproach: string | null;
  riskLevel: RiskLevel;
  active: boolean;
  sessionCount: number;
  nextBookingAt: string | null;
  lastSessionAt: string | null;
}

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  startsAt: string;
  durationMinutes: number;
  sessionType: string;
  status: BookingStatus;
  location: string | null;
  notes: string | null;
}

export interface Session {
  id: string;
  patientId: string;
  patientName: string;
  bookingId: string | null;
  sessionNumber: number;
  occurredAt: string;
  durationMinutes: number;
  focusArea: string | null;
  phq9Score: number | null;
  gad7Score: number | null;
  moodScore: number | null;
  riskSummary: string | null;
  summary: string | null;
}

export interface ManualNote {
  id: string;
  patientId: string;
  patientName: string;
  sessionId: string | null;
  title: string;
  format: NoteFormat;
  content: string;
  signed: boolean;
  aiDrafted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionEditor {
  session: Session;
  notes: ManualNote[];
}

export interface DashboardMetrics {
  activePatients: number;
  todayBookings: number;
  unsignedNotes: number;
  sessionsThisWeek: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  todayBookings: Booking[];
  recentNotes: ManualNote[];
}
