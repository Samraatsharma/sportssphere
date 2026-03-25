"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AnimatedSection from '../../components/ui/AnimatedSection';

export default function Login() {
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const registered = searchParams?.get('registered');

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Persistent login check
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') router.push('/dashboard/admin');
        else router.push('/dashboard/student');
      } catch(e) {}
    }
    
    if (registered) toast.success('Registration successful! Please login.');
  }, [registered, router]);

  // Real-time Validation Check
  const isIdentifierValid = formData.identifier.trim().length > 2;
  const isPwdValid = formData.password.length > 3;
  const isFormValid = isIdentifierValid && isPwdValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setAuthError(false);

    const payload = {
      email: formData.identifier.trim(),
      password: formData.password.trim(),
      role
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error && data.error.includes('Invalid')) {
          setAuthError(true);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name ? data.user.name.split(' ')[0] : 'Admin'} 🎉`);
      
      if (data.user.role === 'admin') router.push('/dashboard/admin');
      else router.push('/dashboard/student');

    } catch (err) {
       toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <AnimatedSection className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Login to your CDGI Portal</p>
        
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--surface-border)', position: 'relative' }}>
          {['student', 'admin'].map(r => (
            <button key={r} type="button" onClick={() => { setRole(r); setFormData({identifier:'', password:''}); setAuthError(false); }}
              style={{ flex: 1, background: 'none', border: 'none', padding: '12px', color: role === r ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: role === r ? '600' : '400', transition: 'all 0.3s', textTransform: 'capitalize' }}>
              {r}
            </button>
          ))}
          <div style={{ position: 'absolute', bottom: 0, left: role === 'student' ? '0%' : '50%', width: '50%', height: '2px', background: 'var(--primary)', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>

        {authError && (
          <AnimatedSection animation="fade-up" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Account not found.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Create one in seconds 👇</p>
            <Link href="/register" className="btn-secondary" style={{ display: 'block', width: '100%', padding: '10px' }}>
              Go to Register
            </Link>
          </AnimatedSection>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Floating Input: Identifier */}
          <div className="floating-input">
            <input 
              type="text" 
              name="identifier" 
              id="identifier"
              placeholder=" " 
              value={formData.identifier} 
              onChange={e => { setFormData({...formData, identifier: e.target.value}); setAuthError(false); }}
              className={formData.identifier.length > 0 ? (isIdentifierValid ? 'is-valid' : 'is-invalid') : ''}
              required 
            />
            <label htmlFor="identifier">{role === 'admin' ? 'Admin Username' : 'Email Address'}</label>
            {isIdentifierValid && <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--success)' }}>✓</span>}
          </div>

          {/* Floating Input: Password */}
          <div className="floating-input">
            <input 
              type={showPwd ? "text" : "password"} 
              name="password" 
              id="password"
              placeholder=" " 
              value={formData.password} 
              onChange={e => { setFormData({...formData, password: e.target.value}); setAuthError(false); }}
              className={formData.password.length > 0 ? (isPwdValid ? 'is-valid' : 'is-invalid') : ''}
              required 
            />
            <label htmlFor="password">Password</label>
            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '1rem', opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }} disabled={!isFormValid || loading}>
            {loading ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🔄</span> : `Login as ${role}`}
          </button>
        </form>
      </AnimatedSection>
    </div>
  );
}
