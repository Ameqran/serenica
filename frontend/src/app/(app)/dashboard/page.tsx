'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CalendarClock, FileText, UsersRound } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { PageHeader } from '@/components/page-header';
import { ErrorState, LoadingState } from '@/components/state';
import { getDashboard } from '@/lib/api';
import { formatDateTime, initials } from '@/lib/format';
import type { DashboardData } from '@/lib/types';

export default function DashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    getDashboard(token)
      .then((result) => {
        setDashboard(result);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;
  if (!dashboard) return <ErrorState message="No dashboard data available." />;

  const cards = [
    { title: 'Active Patients', value: dashboard.metrics.activePatients, icon: UsersRound },
    { title: 'Today Bookings', value: dashboard.metrics.todayBookings, icon: CalendarClock },
    { title: 'Unsigned Notes', value: dashboard.metrics.unsignedNotes, icon: FileText },
    { title: 'Sessions This Week', value: dashboard.metrics.sessionsThisWeek, icon: BarChart3 }
  ];

  return (
    <section className="page-wrap">
      <PageHeader
        title="Dashboard"
        subtitle="Realtime operational overview from the backend"
        Icon={BarChart3}
      />

      <div className="card-grid metrics-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="card metric-card" key={card.title}>
              <div className="metric-top">
                <h3>{card.title}</h3>
                <Icon size={17} />
              </div>
              <p className="metric-value">{card.value}</p>
            </article>
          );
        })}
      </div>

      <div className="card-grid two-columns">
        <article className="card">
          <div className="card-header-row">
            <h3>Today&apos;s Bookings</h3>
            <span>{dashboard.todayBookings.length} sessions</span>
          </div>
          <div className="list-stack">
            {dashboard.todayBookings.length === 0 ? (
              <p className="empty-text">No bookings created yet.</p>
            ) : (
              dashboard.todayBookings.map((booking) => (
                <div className="list-row" key={booking.id}>
                  <div className="row-avatar">{initials(booking.patientName)}</div>
                  <div>
                    <strong>{booking.patientName}</strong>
                    <p>{booking.sessionType}</p>
                  </div>
                  <div className="row-meta">{formatDateTime(booking.startsAt)}</div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="card">
          <div className="card-header-row">
            <h3>Recent Manual Notes</h3>
            <span>{dashboard.recentNotes.length} notes</span>
          </div>
          <div className="list-stack">
            {dashboard.recentNotes.length === 0 ? (
              <p className="empty-text">No notes available.</p>
            ) : (
              dashboard.recentNotes.map((note) => (
                <div className="list-row" key={note.id}>
                  <div>
                    <strong>{note.title}</strong>
                    <p>{note.patientName}</p>
                  </div>
                  <div className={`pill ${note.signed ? 'pill-ok' : 'pill-warn'}`}>
                    {note.signed ? 'Signed' : 'Unsigned'}
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
