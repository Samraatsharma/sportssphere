"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DeclareResults() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [resultData, setResultData] = useState({ winner: '', details: '' });

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
        // Find approved events that are not yet completed
        setEvents(data.events.filter(e => e.status === 'approved'));
      }
    } catch (err) {}
  };

  const handleDeclareResult = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert("Please select an event.");
      return;
    }
    if (!resultData.winner) {
      alert("Please enter a winner.");
      return;
    }

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: selectedEventId, ...resultData })
      });
      const data = await res.json();
      if (data.success) {
        alert('Result declared successfully! Event is now completed.');
        setResultData({ winner: '', details: '' });
        setSelectedEventId('');
        fetchEvents();
      } else {
        alert(data.error || 'Failed to declare results');
      }
    } catch (err) {
      alert('Error declaring results');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem' }}>
      {/* Sidebar */}
      <div className="card" style={{ width: '250px', height: 'fit-content', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="text-accent" style={{ padding: '0 0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Admin Menu</h3>
        <Link href="/dashboard/admin" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Events Hub</Link>
        <Link href="/dashboard/admin/trials" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Manage Trials</Link>
        <Link href="/dashboard/admin/team" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Final Teams</Link>
        <Link href="/dashboard/admin/logistics" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Logistics</Link>
        <Link href="/dashboard/admin/results" className="btn-primary" style={{ textAlign: 'left', border: 'none' }}>Declare Results</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h1>Declare <span className="text-accent" style={{ color: 'var(--primary)' }}>Results</span></h1>

        <div className="card">
          <form onSubmit={handleDeclareResult} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div className="input-group">
              <label>Select Event</label>
              <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} required>
                <option value="">-- Choose Event --</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.name} ({e.sport})</option>)}
              </select>
            </div>
            
            <div className="input-group">
              <label>Winner(s)</label>
              <input type="text" value={resultData.winner} onChange={e => setResultData({...resultData, winner: e.target.value})} placeholder="e.g. Red House, Team A, John Doe" required />
            </div>

            <div className="input-group">
              <label>Match Details / Additional Info</label>
              <input type="text" value={resultData.details} onChange={e => setResultData({...resultData, details: e.target.value})} placeholder="e.g. Won by 3 goals, Man of the Match: XYZ" />
            </div>

            <button type="submit" className="btn-primary">Declare Final Results</button>
          </form>
        </div>
      </div>
    </div>
  );
}
