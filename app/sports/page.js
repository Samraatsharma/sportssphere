"use client";

import Link from 'next/link';
import ParallaxHero from '../../components/ui/ParallaxHero';
import TiltCard from '../../components/ui/TiltCard';
import AnimatedSection from '../../components/ui/AnimatedSection';

export default function SportsPage() {
  const sports = [
    { name: 'Cricket', desc: 'Join the campus leagues and inter-department tournaments. Trials held at the main CDGI Ground.', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000' },
    { name: 'Football', desc: 'Participate in 11-a-side full ground matches to represent CDGI at nodal levels.', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000' },
    { name: 'Basketball', desc: 'Sign up for fast-paced 3v3 games or the major full-court annual basketball championship.', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000' },
    { name: 'Volleyball', desc: 'Register for seasonal volleyball circuits. Tryouts start next month.', img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      <ParallaxHero 
        title="CDGI Sports <span class='text-accent'>Hub</span>"
        subtitle="Select a sport to view upcoming event fixtures, tournament rules, and registration deadlines."
        bgImage="https://images.unsplash.com/photo-1518605368461-1e180dcc1c10?q=80&w=2000&auto=format&fit=crop"
      />

      <main className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {sports.map((sp, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 150}>
              <Link href={`/events?sport=${sp.name}`} style={{ display: 'block' }}>
                <TiltCard className="card-hoverable" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '380px' }}>
                  <div style={{ height: '200px', width: '100%', backgroundImage: `url(${sp.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, background: 'var(--surface)' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text)' }}>{sp.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{sp.desc}</p>
                    <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      View Trials <span>→</span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </main>
    </div>
  );
}
