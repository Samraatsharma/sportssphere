"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results');
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading Results...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-accent" style={{ textAlign: 'center', margin: '2rem 0', fontSize: '3rem' }}>Tournament Results</h1>
      
      {results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No results have been declared yet. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {results.map((result, idx) => (
            <div key={result.id} className={`card animate-delay-${(idx % 3) + 1}`} style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'linear-gradient(145deg, var(--surface) 0%, rgba(255,0,229,0.05) 100%)' }}>
              <div style={{ fontSize: '3rem' }}>🏅</div>
              <div>
                <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{result.event_name}</h2>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>{result.sport}</div>
                <div style={{ fontSize: '1.2rem' }}>
                  <strong>Winner:</strong> <span style={{ color: 'var(--success)' }}>{result.winner}</span>
                </div>
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>{result.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
