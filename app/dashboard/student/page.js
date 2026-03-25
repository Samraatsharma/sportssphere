"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AnimatedSection from '../../../components/ui/AnimatedSection';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usrStr = localStorage.getItem('user');
    if (!usrStr) {
      router.push('/login');
      return;
    }
    const usr = JSON.parse(usrStr);
    setUser(usr);
    fetchData(usr.id);
  }, [router]);

  const fetchData = async (studentId) => {
    try {
      const dbRes = await Promise.all([
        fetch('/api/events').then(r => r.json()),
        fetch(`/api/registrations?studentId=${studentId}`).then(r => r.json())
      ]);
      
      if (dbRes[0].success) {
        setEvents(dbRes[0].events);
      }
      if (dbRes[1].success) {
        // Map regs by eventId for O(1) lookup
        const regMap = {};
        dbRes[1].registrations.forEach(r => {
          regMap[r.event_id] = r.status;
        });
        setMyRegs(regMap);
      }
    } catch (err) {
      toast.error('Failed to load portal');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (eventId) => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, eventId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Application Sent! Awaiting confirmation ⚡');
        setMyRegs({ ...myRegs, [eventId]: 'pending' });
      } else {
        toast.error(data.error);
      }
    } catch(err) {
      toast.error('Failed to connect.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast('Logged out securely.', { icon: '👋' });
    router.push('/login');
  };

  if (loading || !user) return <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center' }}><div className="skeleton" style={{ width: '100%', maxWidth: '1000px', height: '600px' }}></div></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--background)' }}>
      
      {/* V7 Premium ESPN Header Style */}
      <div style={{ padding: '2.5rem 2rem', background: 'linear-gradient(90deg, #020617 0%, rgba(249, 115, 22, 0.08) 100%)', borderBottom: '1px solid var(--surface-border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <span style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: '800' }}>Athlete Portal</span>
            <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', letterSpacing: '-1px' }}>Welcome back, <span style={{ color: 'var(--text)'}}>{user.name.split(' ')[0]}</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Find your next tournament. Show your strength.</p>
          </div>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Live Tournaments</h2>
          <span className="badge" style={{ background: 'var(--primary)', color: '#fff', padding: '6px 14px' }}>{events.filter(e => e.status !== 'completed').length} Open</span>
        </div>

        {/* V7 ESPN Image Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {events.map((ev, idx) => {
            const isCompleted = ev.status === 'completed';
            const regStatus = myRegs[ev.id];
            // Default aggressive sports imagery if map fails
            const bgImage = ev.image_url || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800';

            return (
              <AnimatedSection key={ev.id} delay={idx * 100}>
                <div className="card tilt-card" style={{ 
                  padding: 0, 
                  height: '420px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--background)'
                }}>
                  {/* Image Background */}
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundImage: `url(${bgImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    opacity: 0.6,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} className="event-bg" />
                  
                  {/* Gradient Math for Readability */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(11,15,25,0.8) 60%, rgba(11,15,25,1) 100%)' }} />

                  {/* Top Tags */}
                  <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ 
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', 
                      padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', 
                      fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--primary)'
                    }}>
                      {ev.sport}
                    </span>
                    {isCompleted && <span style={{ background: 'var(--surface-border)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>Concluded</span>}
                  </div>

                  {/* Content Chunk */}
                  <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', padding: '2rem 1.5rem 1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.5rem', color: '#fff' }}>{ev.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📅 {new Date(ev.date).toLocaleDateString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🎯 {ev.eligibility}</span>
                    </div>

                    {/* Huge Action Button */}
                    {!isCompleted ? (
                      !regStatus ? (
                        <button 
                          className="btn-primary" 
                          onClick={() => handleApply(ev.id)} 
                          style={{ width: '100%', padding: '16px', background: 'var(--primary)', color: '#fff', fontSize: '1.1rem', boxShadow: '0 8px 20px -6px rgba(249,115,22,0.5)' }}
                        >
                          APPLY TO ENTER ⚡
                        </button>
                      ) : (
                        <button disabled style={{ 
                          width: '100%', padding: '16px', borderRadius: '6px', border: 'none', fontWeight: '700', fontSize: '1rem',
                          background: regStatus === 'pending' ? 'rgba(255, 255, 255, 0.1)' : (regStatus === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                          color: regStatus === 'pending' ? 'var(--text)' : (regStatus === 'approved' ? 'var(--success)' : 'var(--danger)'),
                          cursor: 'not-allowed'
                        }}>
                          {regStatus === 'pending' ? 'Application Under Review ⏳' : 
                           regStatus === 'approved' ? 'Roster Confirmed ✅' : 'Application Unsuccessful ❌'}
                        </button>
                      )
                    ) : (
                      <button disabled style={{ width: '100%', padding: '16px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '1rem' }}>
                        Tournament Finished
                      </button>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
        
        {events.length === 0 && (
          <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: '12px' }}>
            There are no tournaments currently available.
          </div>
        )}
      </div>
    </div>
  );
}
