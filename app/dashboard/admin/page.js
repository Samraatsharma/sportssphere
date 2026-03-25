"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AnimatedSection from '../../../components/ui/AnimatedSection';

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [newEvent, setNewEvent] = useState({ name: '', sport: '', date: '', eligibility: '' });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchRegistrations();
  }, [router]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/registrations');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...newEvent, image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800'}) // Default sports image
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Event Scheduled! Live on Student Portal.');
        setNewEvent({ name: '', sport: '', date: '', eligibility: '' });
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Error creating event');
    }
  };

  const evaluateApplication = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/registrations/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        if (status === 'approved') toast.success('Athlete Approved ✅');
        if (status === 'rejected') toast('Application Rejected ❌', { style: { background: 'var(--danger)', color: '#fff' } });
        setRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r));
      } else {
        toast.error('Failed evaluation');
      }
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast('Logged out securely.', { icon: '👋' });
    router.push('/login');
  };

  if (loading) return <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center' }}><div className="skeleton" style={{ width: '100%', maxWidth: '800px', height: '600px' }}></div></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
      
      {/* V7 Premium ESPN Header Style */}
      <div style={{ padding: '2.5rem 2rem', background: 'linear-gradient(90deg, #020617 0%, rgba(249, 115, 22, 0.05) 100%)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: '800' }}>HQ Dashboard</span>
            <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', letterSpacing: '-1px' }}>Tournament Director</h1>
          </div>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '50px' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>
        
        {/* Main Feed: Applications Grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Live Applications</h2>
            <span className="badge badge-pending">{registrations.filter(r => r.status === 'pending').length} Action Requires</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {registrations.map((reg, idx) => (
              <AnimatedSection key={reg.id} delay={idx * 50}>
                <div className="card card-hoverable" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', borderTop: reg.status === 'pending' ? '3px solid var(--primary)' : '1px solid var(--surface-border)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--text)' }}>{reg.student_name}</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{reg.student_email} • {reg.student_course}</div>
                    </div>
                    <span className={`badge badge-${reg.status === 'pending' ? 'pending' : (reg.status === 'approved' ? 'approved' : 'rejected')}`}>
                      {reg.status}
                    </span>
                  </div>

                  <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '2px solid var(--secondary)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Applying For</div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>{reg.event_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{reg.event_sport} • {new Date(reg.event_date).toLocaleDateString()}</div>
                  </div>

                  {/* Actions Base */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    {reg.status === 'pending' ? (
                      <>
                        <button className="btn-approve" style={{ flex: 1 }} onClick={() => evaluateApplication(reg.id, 'approved')} disabled={actionLoading === reg.id}>
                          {actionLoading === reg.id ? '...' : 'Draft Athlete'}
                        </button>
                        <button className="btn-reject" style={{ flex: 1 }} onClick={() => evaluateApplication(reg.id, 'rejected')} disabled={actionLoading === reg.id}>
                          {actionLoading === reg.id ? '...' : 'Reject'}
                        </button>
                      </>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Evaluated ({reg.status})
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
            {registrations.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: '12px' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                No athletic applications received yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Event Creation */}
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '100px', height: 'fit-content' }}>
          
          <AnimatedSection animation="slide-left" className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>Launch Event</h3>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="floating-input">
                <input type="text" id="ev-name" placeholder=" " value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} required />
                <label htmlFor="ev-name">Tournament Title</label>
              </div>
              <div className="floating-input">
                <input type="text" id="ev-sport" placeholder=" " value={newEvent.sport} onChange={e => setNewEvent({...newEvent, sport: e.target.value})} required />
                <label htmlFor="ev-sport">Sport Division</label>
              </div>
              <div className="floating-input">
                <input type="date" id="ev-date" placeholder=" " value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="is-valid" required />
                <label htmlFor="ev-date" style={{top: '6px', fontSize: '0.7rem'}}>Fixture Date</label>
              </div>
              <div className="floating-input">
                <input type="text" id="ev-el" placeholder=" " value={newEvent.eligibility} onChange={e => setNewEvent({...newEvent, eligibility: e.target.value})} required />
                <label htmlFor="ev-el">Eligibility Logic</label>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '0.5rem' }}>
                Broadcast Event
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection animation="slide-left" delay={100} className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/dashboard/admin/logistics" className="btn-secondary" style={{ textAlign: 'left', border: 'none', background: 'rgba(255,255,255,0.02)' }}>Logistics Engine →</Link>
              <Link href="/dashboard/admin/results" className="btn-secondary" style={{ textAlign: 'left', border: 'none', background: 'rgba(255,255,255,0.02)' }}>Publish Results →</Link>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
}
