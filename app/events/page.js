"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EventsPage() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const sportFilter = searchParams?.get('sport');
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.role === 'student') {
        fetch(`/api/registrations?student_id=${parsed.id}`)
          .then(res => res.json())
          .then(data => { if (data.success) setRegistrations(data.registrations); });
      }
    }

    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          let filtered = data.events.filter(e => e.status === 'approved');
          if (sportFilter) {
            filtered = filtered.filter(e => e.sport.toLowerCase() === sportFilter.toLowerCase());
          }
          setEvents(filtered);
        }
      })
      .finally(() => setLoading(false));
  }, [sportFilter]);

  const handleApply = async (eventId) => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: user.id, event_id: eventId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Applied successfully!');
        // Locally update state to show "Already Applied"
        setRegistrations([...registrations, { event_id: eventId }]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error applying');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <section className="parallax-section" style={{ height: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop)' }}>
        <div className="parallax-overlay"></div>
        <div className="parallax-content animate-fade-in" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', textTransform: 'uppercase' }}>
            {sportFilter ? <><span className="text-accent">{sportFilter}</span> Events</> : <>All <span className="text-accent">Events</span></>}
          </h1>
        </div>
      </section>

      <main className="container" style={{ padding: '4rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--primary)' }}>Loading Action...</div>
        ) : events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No upcoming events currently found for {sportFilter || 'any sport'}.</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {events.map((event, idx) => {
              const hasApplied = registrations.some(r => r.event_id === event.id);

              return (
                <div key={event.id} className={`card animate-fade-in animate-delay-${(idx%3)+1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.sport}</div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{event.name}</h2>
                    <div style={{ color: 'var(--text-muted)' }}>📅 {new Date(event.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ margin: '1rem 0', flex: 1 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}><strong>Eligibility:</strong> {event.eligibility}</p>
                  </div>
                  
                  {user?.role === 'admin' ? (
                     <div style={{ color: 'var(--secondary)', textAlign: 'center', padding: '10px', background: 'rgba(255,145,0,0.1)', borderRadius: '8px' }}>Admin View</div>
                  ) : hasApplied ? (
                    <button className="btn-primary" disabled style={{ width: '100%', borderColor: 'var(--text-muted)', color: 'var(--text)', background: 'rgba(255,255,255,0.05)' }}>
                      Already Applied ✓
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleApply(event.id)}>
                      Apply for Trial
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
