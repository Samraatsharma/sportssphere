"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageTrials() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events.filter(e => e.status === 'approved'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrials = async (eventId) => {
    try {
      const res = await fetch(`/api/trials?event_id=${eventId}`);
      const data = await res.json();
      if (data.success) {
        setTrials(data.trials);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    if (id) {
      fetchTrials(id);
    } else {
      setTrials([]);
    }
  };

  const updateTrial = async (trialId, updates) => {
    const trial = trials.find(t => t.id === trialId);
    try {
      const res = await fetch('/api/trials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trial, ...updates })
      });
      if (res.ok) {
        fetchTrials(selectedEventId); // Refresh
      }
    } catch (err) {
      alert('Failed to update trial');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem' }}>
      {/* Sidebar */}
      <div className="card" style={{ width: '250px', height: 'fit-content', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="text-accent" style={{ padding: '0 0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Admin Menu</h3>
        <Link href="/dashboard/admin" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Events Hub</Link>
        <Link href="/dashboard/admin/trials" className="btn-primary" style={{ textAlign: 'left', border: 'none' }}>Manage Trials</Link>
        <Link href="/dashboard/admin/team" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Final Teams</Link>
        <Link href="/dashboard/admin/logistics" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Logistics</Link>
        <Link href="/dashboard/admin/results" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Declare Results</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h1>Manage <span className="text-accent" style={{ color: 'var(--secondary)' }}>Trials</span></h1>

        <div className="card">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <label>Select Event</label>
            <select value={selectedEventId} onChange={handleEventChange}>
              <option value="">-- Choose Event --</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.name} ({e.sport})</option>)}
            </select>
          </div>
        </div>

        {selectedEventId && (
          <div className="card animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Registered Students</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Attendance</th>
                    <th>Selection Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map(trial => (
                    <tr key={trial.id}>
                      <td>{trial.student_name}</td>
                      <td>{trial.course}</td>
                      <td>
                        <select 
                          value={trial.attendance} 
                          onChange={(e) => updateTrial(trial.id, { attendance: e.target.value })}
                          style={{ padding: '6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <option value="absent">Absent</option>
                          <option value="present">Present</option>
                        </select>
                      </td>
                      <td>
                        <select 
                          value={trial.selection_status} 
                          onChange={(e) => updateTrial(trial.id, { selection_status: e.target.value })}
                          style={{ padding: '6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {trials.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No students registered for this event yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
