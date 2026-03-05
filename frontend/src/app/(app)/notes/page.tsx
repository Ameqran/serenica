'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { NotebookTabs, Plus, Search } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { PageHeader } from '@/components/page-header';
import { ErrorState, LoadingState } from '@/components/state';
import { createNote, getNotes, getPatients, getSessions } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { ManualNote, NoteFormat, Patient, Session } from '@/lib/types';

type NoteFilter = 'all' | 'unsigned' | 'ai';

export default function NotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<ManualNote[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<NoteFilter>('all');
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    patientId: '',
    sessionId: '',
    title: '',
    format: 'FREE' as NoteFormat,
    content: '',
    signed: false,
    aiDrafted: false
  });

  const selectedPatientSessions = useMemo(
    () => sessions.filter((session) => session.patientId === form.patientId),
    [form.patientId, sessions]
  );

  async function loadData(currentSearch: string, currentFilter: NoteFilter) {
    if (!token) return;

    setLoading(true);
    try {
      const [notesData, patientsData, sessionsData] = await Promise.all([
        getNotes(token, {
          search: currentSearch,
          signed: currentFilter === 'unsigned' ? false : undefined
        }),
        getPatients(token),
        getSessions(token)
      ]);

      const filtered = currentFilter === 'ai' ? notesData.filter((note) => note.aiDrafted) : notesData;

      setNotes(filtered);
      setPatients(patientsData);
      setSessions(sessionsData);
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
    loadData(search, filter);
  }, [token]);

  useEffect(() => {
    const id = setTimeout(() => {
      loadData(search, filter);
    }, 250);
    return () => clearTimeout(id);
  }, [search, filter]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !form.patientId) return;

    try {
      await createNote(token, {
        patientId: form.patientId,
        sessionId: form.sessionId || undefined,
        title: form.title,
        format: form.format,
        content: form.content,
        signed: form.signed,
        aiDrafted: form.aiDrafted
      });

      setOpen(false);
      setForm({
        patientId: form.patientId,
        sessionId: '',
        title: '',
        format: 'FREE',
        content: '',
        signed: false,
        aiDrafted: false
      });
      await loadData(search, filter);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading && !notes.length) return <LoadingState message="Loading notes..." />;
  if (error && !notes.length) return <ErrorState message={error} />;

  return (
    <section className="page-wrap">
      <PageHeader
        title="Note Library"
        subtitle="Browse and create manual clinical notes"
        Icon={NotebookTabs}
        actions={
          <button className="btn-primary" onClick={() => setOpen((prev) => !prev)} type="button">
            <Plus size={16} />
            New Note
          </button>
        }
      />

      <article className="card toolbar-row notes-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search notes" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="filter-row">
          <button className={`pill-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} type="button">All</button>
          <button className={`pill-btn ${filter === 'unsigned' ? 'active' : ''}`} onClick={() => setFilter('unsigned')} type="button">Unsigned</button>
          <button className={`pill-btn ${filter === 'ai' ? 'active' : ''}`} onClick={() => setFilter('ai')} type="button">AI Drafted</button>
        </div>
      </article>

      {open ? (
        <article className="card">
          <form className="grid-form" onSubmit={handleCreate}>
            <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value, sessionId: '' })}>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName}</option>
              ))}
            </select>
            <select value={form.sessionId} onChange={(e) => setForm({ ...form, sessionId: e.target.value })}>
              <option value="">No linked session</option>
              {selectedPatientSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  Session #{session.sessionNumber} - {formatDateTime(session.occurredAt)}
                </option>
              ))}
            </select>
            <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as NoteFormat })}>
              <option value="FREE">FREE</option>
              <option value="SOAP">SOAP</option>
              <option value="DAP">DAP</option>
            </select>
            <label className="checkbox-field"><input checked={form.signed} onChange={(e) => setForm({ ...form, signed: e.target.checked })} type="checkbox" />Signed</label>
            <label className="checkbox-field"><input checked={form.aiDrafted} onChange={(e) => setForm({ ...form, aiDrafted: e.target.checked })} type="checkbox" />AI drafted</label>
            <textarea className="editor-textarea compact" placeholder="Manual note content" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <button className="btn-primary" type="submit">Create Note</button>
          </form>
        </article>
      ) : null}

      <article className="card">
        {error ? <p className="error-inline">{error}</p> : null}
        <div className="list-stack">
          {notes.length === 0 ? (
            <p className="empty-text">No notes found with current filters.</p>
          ) : (
            notes.map((note) => (
              <div className="list-row note-row" key={note.id}>
                <div>
                  <strong>{note.title}</strong>
                  <p>{note.patientName} • {formatDateTime(note.createdAt)}</p>
                  <p className="note-preview">{note.content}</p>
                </div>
                <div className="note-tags">
                  <span className="pill pill-mid">{note.format}</span>
                  <span className={`pill ${note.signed ? 'pill-ok' : 'pill-warn'}`}>{note.signed ? 'Signed' : 'Unsigned'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
