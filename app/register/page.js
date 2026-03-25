"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AnimatedSection from '../../components/ui/AnimatedSection';

export default function Register() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', email: '', course: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time Validations
  const vName = formData.name.trim().length > 2;
  const vEmail = formData.email.includes('@');
  const vCourse = formData.course.trim().length > 0;
  const vPwd = formData.password.length >= 6;
  const vMatch = formData.confirmPassword === formData.password && vPwd;
  
  const isFormValid = vName && vEmail && vCourse && vPwd && vMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          course: formData.course.trim(),
          password: formData.password
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      toast.success('Registration Successful 🎉');
      router.push('/login?registered=true');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', course: '', password: '', confirmPassword: '' });
    toast('Form Reset', { icon: '🧹' });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
      <AnimatedSection className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Athlete Registration</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>Join the CDGI athletics portal to compete.</p>
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="floating-input">
            <input type="text" name="name" id="reg-name" placeholder=" " value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={formData.name.length > 0 ? (vName ? 'is-valid' : 'is-invalid') : ''} required />
            <label htmlFor="reg-name">Full Name</label>
            {vName && <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--success)' }}>✓</span>}
          </div>

          {/* Email */}
          <div className="floating-input">
            <input type="email" name="email" id="reg-email" placeholder=" " value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={formData.email.length > 0 ? (vEmail ? 'is-valid' : 'is-invalid') : ''} required />
            <label htmlFor="reg-email">College Email Address</label>
            {vEmail && <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--success)' }}>✓</span>}
          </div>

          {/* Course */}
          <div className="floating-input">
            <select name="course" id="reg-course" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required className={formData.course ? 'is-valid' : ''}>
              <option value="" disabled hidden></option>
              <option value="B.Tech CS">B.Tech (Computer Science)</option>
              <option value="B.Tech IT">B.Tech (Information Technology)</option>
              <option value="B.Tech EC">B.Tech (Electronics)</option>
              <option value="B.Tech ME">B.Tech (Mechanical)</option>
              <option value="MBA">MBA</option>
              <option value="BBA">BBA</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
            <label htmlFor="reg-course" style={{ top: formData.course ? '6px' : '16px', fontSize: formData.course ? '0.70rem' : '0.95rem' }}>Department / Course</label>
          </div>

          {/* Passwords Flex */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="floating-input">
              <input type={showPwd ? "text" : "password"} name="password" id="reg-password" placeholder=" " value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={formData.password.length > 0 ? (vPwd ? 'is-valid' : 'is-invalid') : ''} required />
              <label htmlFor="reg-password">Password (6+ chars)</label>
            </div>
            <div className="floating-input">
              <input type={showPwd ? "text" : "password"} name="confirmPassword" id="reg-confirm" placeholder=" " value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className={formData.confirmPassword.length > 0 ? (vMatch ? 'is-valid' : 'is-invalid') : ''} required />
              <label htmlFor="reg-confirm">Confirm Password</label>
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}>
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {formData.confirmPassword.length > 0 && !vMatch && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1.5rem', textAlign: 'right' }}>Passwords do not match.</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2, opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }} disabled={!isFormValid || loading}>
              {loading ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🔄</span> : 'Complete Registration'}
            </button>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </AnimatedSection>
    </div>
  );
}
