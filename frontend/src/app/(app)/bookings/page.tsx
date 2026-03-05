'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { PageHeader } from '@/components/page-header';
import { ErrorState, LoadingState } from '@/components/state';
import { createBooking, getBookings, getPatients } from '@/lib/api';
import { formatDateInput, formatDateTime, toIsoLocal } from '@/lib/format';
import type { Booking, Patient } from '@/lib/types';

export default function BookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    patientId: '',
    date,
    time: '10:00',
    durationMinutes: 50,
    sessionType: 'CBT',
    status: 'SCHEDULED',
    location: '',
    notes: ''
  });

  async function loadData(targetDate: string) {
    if (!token) return;
    setLoading(true);
    try {
      const [bookingsData, patientsData] = await Promise.all([
        getBookings(token, targetDate),
        getPatients(token)
      ]);
      setBookings(bookingsData);
      setPatients(patientsData);
      if (!form.patientId && patientsData.length > 0) {
        setForm((prev) => ({ ...prev, patientId: patientsData[0].id }));
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(date);
  }, [token, date]);

  async function handleCreateBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !form.patientId) return;

    try {
      await createBooking(token, {
        patientId: form.patientId,
        startsAt: toIsoLocal(form.date, form.time),
        durationMinutes: Number(form.durationMinutes),
        sessionType: form.sessionType,
        status: form.status,
        location: form.location,
        notes: form.notes
      });
      setOpen(false);
      await loadData(date);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading && !bookings.length) return <LoadingState message="Loading bookings..." />;
  if (error && !bookings.length) return <ErrorState message={error} />;

  return (
    <section className="page-wrap">
      <PageHeader
        title="Bookings"
        subtitle="Plan and track appointment slots"
        Icon={CalendarClock}
        actions={
          <button className="btn-primary" onClick={() => setOpen((prev) => !prev)} type="button">
            <Plus size={16} />
            New Booking
          </button>
        }
      />

      <article className="card toolbar-row">
        <label className="field-label" htmlFor="booking-date">Date</label>
        <input id="booking-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </article>

      {open ? (
        <article className="card">
          <form className="grid-form" onSubmit={handleCreateBooking}>
            <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName}</option>
              ))}
            </select>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <input type="number" min={15} placeholder="Duration" required value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
            <input placeholder="Session type" required value={form.sessionType} onChange={(e) => setForm({ ...form, sessionType: e.target.value })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button className="btn-primary" type="submit">Create Booking</button>
          </form>
        </article>
      ) : null}

      <article className="card">
        {error ? <p className="error-inline">{error}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Start</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-text">No bookings on this date.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.patientName}</td>
                    <td>{formatDateTime(booking.startsAt)}</td>
                    <td>{booking.durationMinutes} min</td>
                    <td>{booking.sessionType}</td>
                    <td><span className="pill pill-mid">{booking.status}</span></td>
                    <td>{booking.location || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
