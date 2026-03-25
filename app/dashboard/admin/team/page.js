"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FinalTeams() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [team, setTeam] = useState([]);

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
        setEvents(data.events.filter(e => e.status === 'approved' || e.status === 'completed'));
      }
    } catch (err) {}
  };

  const fetchTeam = async (eventId) => {
    try {
      const res = await fetch(`/api/teams?event_id=${eventId}`);
      const data = await res.json();
      if (data.success) {
        setTeam(data.team);
      }
    } catch (err) {}
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    if (id) {
      fetchTeam(id);
    } else {
      setTeam([]);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem' }}>
      {/* Sidebar */}
      <div className="card" style={{ width: '250px', height: 'fit-content', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="text-accent" style={{ padding: '0 0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Admin Menu</h3>
        <Link href="/dashboard/admin" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Events Hub</Link>
        <Link href="/dashboard/admin/trials" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Manage Trials</Link>
        <Link href="/dashboard/admin/team" className="btn-primary" style={{ textAlign: 'left', border: 'none' }}>Final Teams</Link>
        <Link href="/dashboard/admin/logistics" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Logistics</Link>
        <Link href="/dashboard/admin/results" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Declare Results</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h1>Final <span className="text-accent" style={{ color: 'var(--secondary)' }}>Teams</span></h1>
        
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
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Selected Team Roster</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(member => (
                    <tr key={member.id}>
                      <td>{member.student_name}</td>
                      <td>{member.course}</td>
                      <td><span className="status-badge status-approved">Selected</span></td>
                    </tr>
                  ))}
                  {team.length === 0 && (
                    <tr><td colSpan="3" style={{ textAlign: 'center' }}>No team members selected yet. Go to Manage Trials.</td></tr>
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
