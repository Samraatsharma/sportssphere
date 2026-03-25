"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ParallaxHero from '../components/ui/ParallaxHero';
import AnimatedSection from '../components/ui/AnimatedSection';
import CountUp from '../components/ui/CountUp';

export default function Home() {
  const [stats, setStats] = useState({ athletes: 0, events: 0, teams: 0 });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => {
      if (data.success) setStats(data.stats);
    });
    fetch('/api/events').then(res => res.json()).then(data => {
      if (data.success) {
        setFeatured(data.events.filter(e => e.status !== 'completed').slice(0, 3));
      }
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      
      {/* V7 ESPN/Nike Layered Hero */}
      <ParallaxHero 
        title="GLORY AWAITS<br/><span style='color: var(--primary)'>ON THE FIELD.</span>"
        subtitle="The Official Athletics Portal for Chameli Devi Group of Institutions. Dominate the qualifiers. Draft your legacy."
        ctaText="ENTER TOURNAMENTS ⚡"
        ctaLink="/sports"
        bgImage="https://images.unsplash.com/photo-1543326162-8534015fbe8e?q=80&w=2000&auto=format&fit=crop"
      />

      {/* V7 Premium ESPN Stats Banner */}
      <section style={{ 
        background: 'linear-gradient(90deg, #020617 0%, rgba(249, 115, 22, 0.05) 100%)', 
        borderBottom: '1px solid var(--surface-border)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)' 
      }}>
        <div className="container" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem', textAlign: 'center' }}>
            
            <AnimatedSection delay={100} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', lineHeight: '1', textShadow: '0 0 20px rgba(249,115,22,0.4)', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                <CountUp end={stats.athletes || 124} />
              </div>
              <div style={{ color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800', marginTop: '0.5rem' }}>Active Athletes</div>
            </AnimatedSection>
            
            <AnimatedSection delay={200} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid var(--surface-border)', borderRight: '1px solid var(--surface-border)' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', lineHeight: '1', textShadow: '0 0 20px rgba(249,115,22,0.4)', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                <CountUp end={stats.events || 8} />
              </div>
              <div style={{ color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800', marginTop: '0.5rem' }}>Live Tournaments</div>
            </AnimatedSection>
            
            <AnimatedSection delay={300} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', lineHeight: '1', textShadow: '0 0 20px rgba(249,115,22,0.4)', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                <CountUp end={stats.teams || 12} />
              </div>
              <div style={{ color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800', marginTop: '0.5rem' }}>Varsity Drafts</div>
            </AnimatedSection>
            
          </div>
        </div>
      </section>

      {/* V7 Nike Cards Layout: Active Fixtures */}
      <section className="container" style={{ padding: '6rem 2rem' }}>
        <AnimatedSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px', textTransform: 'uppercase', lineHeight: '1' }}>The Drafting<br/>Phase is Open.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '500px' }}>CDGI Varsity teams are looking for unmatched talent. Select your sport to enter the arena.</p>
            </div>
          </div>
        </AnimatedSection>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          <AnimatedSection animation="slide-right" delay={100}>
            <Link href="/events?sport=Football">
              <div className="card tilt-card" style={{ padding: 0, height: '450px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7 }} className="event-bg" />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(11,15,25,0.8) 60%, rgba(11,15,25,1) 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', padding: '2rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Division 1</span>
                  <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', margin: '0.5rem 0' }}>Football Combine</h3>
                  <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontWeight: '700' }}>ENTER NOW</button>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <Link href="/events?sport=Cricket">
               <div className="card tilt-card" style={{ padding: 0, height: '450px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7 }} className="event-bg" />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(11,15,25,0.8) 60%, rgba(11,15,25,1) 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', padding: '2rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Division 1</span>
                  <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', margin: '0.5rem 0' }}>Cricket Trials</h3>
                  <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontWeight: '700' }}>ENTER NOW</button>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          <AnimatedSection animation="slide-left" delay={300}>
            <Link href="/events?sport=Basketball">
               <div className="card tilt-card" style={{ padding: 0, height: '450px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7 }} className="event-bg" />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(11,15,25,0.8) 60%, rgba(11,15,25,1) 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', padding: '2rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Varsity Series</span>
                  <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', margin: '0.5rem 0' }}>Hoops Draft</h3>
                  <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontWeight: '700' }}>ENTER NOW</button>
                </div>
              </div>
            </Link>
          </AnimatedSection>

        </div>
      </section>

      {/* V7 Massive CTA Section */}
      <section style={{ padding: '6rem 2rem', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <AnimatedSection>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px', marginBottom: '1rem' }}>Your Journey<br/>Starts Here.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>Register as a CDGI athlete today and gain exclusive access to all upcoming tournament qualifiers.</p>
            
            <Link href="/register" className="btn-primary" style={{ padding: '20px 40px', fontSize: '1.2rem', boxShadow: '0 10px 30px -10px rgba(249,115,22,0.6)' }}>
              CREATE ATHLETE PROFILE
            </Link>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
