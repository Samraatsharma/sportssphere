"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Logistics() {
  const router = useRouter();
  const [logistics, setLogistics] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    try {
      const res = await fetch('/api/logistics');
      const data = await res.json();
      if (data.success) {
        setLogistics(data.logistics);
      }
    } catch (err) {}
  };

  const assignGround = async (eventId, groundName) => {
    try {
      const res = await fetch('/api/logistics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, ground: groundName })
      });
      if (res.ok) fetchLogistics();
    } catch (err) {}
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem' }}>
      {/* Sidebar */}
      <div className="card" style={{ width: '250px', height: 'fit-content', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="text-accent" style={{ padding: '0 0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Admin Menu</h3>
        <Link href="/dashboard/admin" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Events Hub</Link>
        <Link href="/dashboard/admin/trials" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Manage Trials</Link>
        <Link href="/dashboard/admin/team" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Final Teams</Link>
        <Link href="/dashboard/admin/logistics" className="btn-primary" style={{ textAlign: 'left', border: 'none' }}>Logistics</Link>
        <Link href="/dashboard/admin/results" className="btn-primary" style={{ textAlign: 'left', border: 'none', color: 'var(--text-muted)' }}>Declare Results</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h1>Event <span className="text-accent" style={{ color: 'var(--success)' }}>Logistics</span></h1>
        
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--success)' }}>Auto-Calculated Requirements</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Sport</th>
                  <th>Total Registrations</th>
                  <th>Hostel Rooms Req.</th>
                  <th>Food Packets Req.</th>
                  <th>Ground Allocation</th>
                </tr>
              </thead>
              <tbody>
                {logistics.map(l => (
                  <tr key={l.id}>
                    <td>{l.event_name}</td>
                    <td>{l.sport}</td>
                    <td style={{ fontWeight: 'bold' }}>{l.total_students}</td>
                    <td>{l.rooms} rooms</td>
                    <td>{l.food_required} packets</td>
                    <td>
                      <input 
                        type="text" 
                        value={l.ground || ''} 
                        placeholder="Assign Ground..."
                        onChange={(e) => assignGround(l.event_id, e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                      />
                    </td>
                  </tr>
                ))}
                {logistics.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>No logistics data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
