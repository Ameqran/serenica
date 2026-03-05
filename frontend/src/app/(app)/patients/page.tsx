'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, Search, UsersRound } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { PageHeader } from '@/components/page-header';
import { ErrorState, LoadingState } from '@/components/state';
import { createPatient, getPatients } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Patient, RiskLevel } from '@/lib/types';

const initialForm = {
  code: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  primaryConcern: '',
  therapyApproach: '',
  riskLevel: 'LOW' as RiskLevel,
  active: true
};

export default function PatientsPage() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const riskClass = useMemo(
    () => ({ LOW: 'pill-ok', MEDIUM: 'pill-mid', HIGH: 'pill-bad', WATCH: 'pill-watch' }),
    []
  );

  async function loadPatientsData(term = '') {
    if (!token) return;
    setLoading(true);
    try {
      const result = await getPatients(token, term);
      setPatients(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatientsData();
  }, [token]);

  useEffect(() => {
    const id = setTimeout(() => {
      loadPatientsData(search);
    }, 250);

    return () => clearTimeout(id);
  }, [search]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      await createPatient(token, form);
      setForm(initialForm);
      setFormOpen(false);
      await loadPatientsData(search);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading && !patients.length) return <LoadingState message="Loading patients..." />;
  if (error && !patients.length) return <ErrorState message={error} />;

  return (
    <section className="page-wrap">
      <PageHeader
        title="Patients"
        subtitle="Create and manage your clinical patient records"
        Icon={UsersRound}
        actions={
          <button className="btn-primary" onClick={() => setFormOpen((prev) => !prev)} type="button">
            <Plus size={16} />
            New Patient
          </button>
        }
      />

      {formOpen ? (
        <article className="card">
          <form className="grid-form" onSubmit={handleSubmit}>
            <input placeholder="Code (e.g. C-1001)" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <input placeholder="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input placeholder="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Primary concern" value={form.primaryConcern} onChange={(e) => setForm({ ...form, primaryConcern: e.target.value })} />
            <input placeholder="Therapy approach" value={form.therapyApproach} onChange={(e) => setForm({ ...form, therapyApproach: e.target.value })} />
            <select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value as RiskLevel })}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="WATCH">WATCH</option>
            </select>
            <label className="checkbox-field">
              <input checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} type="checkbox" />
              Active patient
            </label>
            <button className="btn-primary" type="submit">Create Patient</button>
          </form>
        </article>
      ) : null}

      <article className="card">
        <div className="toolbar-row">
          <div className="search-box">
            <Search size={15} />
            <input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients by name, concern, or code"
              value={search}
            />
          </div>
        </div>

        {error ? <p className="error-inline">{error}</p> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Sessions</th>
                <th>Next Booking</th>
                <th>Approach</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-text">No patients yet. Create your first patient above.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <strong>{patient.fullName}</strong>
                      <p>#{patient.code}</p>
                    </td>
                    <td>{patient.sessionCount}</td>
                    <td>{formatDateTime(patient.nextBookingAt)}</td>
                    <td>{patient.therapyApproach || patient.primaryConcern || '-'}</td>
                    <td>
                      <span className={`pill ${riskClass[patient.riskLevel]}`}>{patient.riskLevel}</span>
                    </td>
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
