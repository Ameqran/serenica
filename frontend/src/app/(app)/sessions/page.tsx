'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Plus, Save } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { PageHeader } from '@/components/page-header';
import { ErrorState, LoadingState } from '@/components/state';
import { createSession, createSessionNote, getPatients, getSessionEditor, getSessions } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Patient, Session, SessionEditor } from '@/lib/types';

export default function SessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editor, setEditor] = useState<SessionEditor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [newSession, setNewSession] = useState({
    patientId: '',
    sessionNumber: 1,
    occurredAt: new Date().toISOString().slice(0, 16),
    durationMinutes: 50,
    focusArea: 'General follow-up',
    summary: ''
  });

  const [noteDraft, setNoteDraft] = useState('');

  const selectedSessionId = useMemo(() => editor?.session.id ?? null, [editor]);

  async function loadSessionsData() {
    if (!token) return;
    setLoading(true);
    try {
      const [sessionsData, patientsData] = await Promise.all([getSessions(token), getPatients(token)]);
      setSessions(sessionsData);
      setPatients(patientsData);

      if (!newSession.patientId && patientsData.length > 0) {
        setNewSession((prev) => ({ ...prev, patientId: patientsData[0].id }));
      }

      if (sessionsData.length > 0) {
        const first = await getSessionEditor(token, sessionsData[0].id);
        setEditor(first);
        setNoteDraft(first.notes[0]?.content || first.session.summary || '');
      } else {
        setEditor(null);
        setNoteDraft('');
      }

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessionsData();
  }, [token]);

  async function selectSession(sessionId: string) {
    if (!token) return;
    try {
      const sessionEditor = await getSessionEditor(token, sessionId);
      setEditor(sessionEditor);
      setNoteDraft(sessionEditor.notes[0]?.content || sessionEditor.session.summary || '');
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !newSession.patientId) return;

    try {
      await createSession(token, {
        patientId: newSession.patientId,
        sessionNumber: Number(newSession.sessionNumber),
        occurredAt: new Date(newSession.occurredAt).toISOString(),
        durationMinutes: Number(newSession.durationMinutes),
        focusArea: newSession.focusArea,
        summary: newSession.summary
      });

      setOpen(false);
      await loadSessionsData();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function saveManualNote() {
    if (!token || !selectedSessionId || !noteDraft.trim()) return;

    try {
      await createSessionNote(token, selectedSessionId, {
        title: `Session ${editor?.session.sessionNumber ?? ''} - Manual note`,
        format: 'FREE',
        content: noteDraft.trim(),
        signed: false,
        aiDrafted: false
      });

      await selectSession(selectedSessionId);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading && !sessions.length) return <LoadingState message="Loading sessions..." />;
  if (error && !sessions.length) return <ErrorState message={error} />;

  return (
    <section className="page-wrap">
      <PageHeader
        title="Sessions Editor"
        subtitle="Clinical session timeline and manual note editor"
        Icon={ClipboardCheck}
        actions={
          <button className="btn-primary" onClick={() => setOpen((prev) => !prev)} type="button">
            <Plus size={16} />
            New Session
          </button>
        }
      />

      {open ? (
        <article className="card">
          <form className="grid-form" onSubmit={handleCreateSession}>
            <select required value={newSession.patientId} onChange={(e) => setNewSession({ ...newSession, patientId: e.target.value })}>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.fullName}</option>
              ))}
            </select>
            <input type="number" min={1} value={newSession.sessionNumber} onChange={(e) => setNewSession({ ...newSession, sessionNumber: Number(e.target.value) })} />
            <input type="datetime-local" value={newSession.occurredAt} onChange={(e) => setNewSession({ ...newSession, occurredAt: e.target.value })} />
            <input type="number" min={15} value={newSession.durationMinutes} onChange={(e) => setNewSession({ ...newSession, durationMinutes: Number(e.target.value) })} />
            <input placeholder="Focus area" value={newSession.focusArea} onChange={(e) => setNewSession({ ...newSession, focusArea: e.target.value })} />
            <input placeholder="Summary" value={newSession.summary} onChange={(e) => setNewSession({ ...newSession, summary: e.target.value })} />
            <button className="btn-primary" type="submit">Create Session</button>
          </form>
        </article>
      ) : null}

      {error ? <p className="error-inline">{error}</p> : null}

      <div className="card-grid two-columns sessions-layout">
        <article className="card">
          <div className="card-header-row">
            <h3>Session List</h3>
            <span>{sessions.length} total</span>
          </div>
          <div className="list-stack">
            {sessions.length === 0 ? (
              <p className="empty-text">No sessions created yet.</p>
            ) : (
              sessions.map((session) => (
                <button
                  className={`list-row list-row-button ${selectedSessionId === session.id ? 'selected' : ''}`}
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  type="button"
                >
                  <div>
                    <strong>{session.patientName}</strong>
                    <p>Session #{session.sessionNumber} • {session.focusArea || 'General'}</p>
                  </div>
                  <div className="row-meta">{formatDateTime(session.occurredAt)}</div>
                </button>
              ))
            )}
          </div>
        </article>

        <article className="card">
          <div className="card-header-row">
            <h3>Manual Notes Editor</h3>
            {editor ? <span>{editor.session.patientName}</span> : null}
          </div>

          {editor ? (
            <>
              <textarea
                className="editor-textarea"
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write manual clinical notes for this session..."
                value={noteDraft}
              />
              <div className="editor-actions">
                <button className="btn-primary" onClick={saveManualNote} type="button">
                  <Save size={16} />
                  Save Manual Note
                </button>
              </div>
            </>
          ) : (
            <p className="empty-text">Create a session to start using the editor.</p>
          )}
        </article>
      </div>
    </section>
  );
}
