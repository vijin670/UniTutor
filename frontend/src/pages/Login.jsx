import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Check, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const role = await login(email, password);
      if (role === 'SUPER_ADMIN') navigate('/super-admin');
      else if (role === 'ADMIN') navigate('/admin');
      else if (role === 'FACULTY') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
    }
  };

  const setTestCreds = (type) => {
    const creds = {
      'STUDENT': ['arun.kumar@srm.edu.in', 'password123', 'STUDENT'],
      'FACULTY': ['priya.cs@srm.edu.in', 'password123', 'FACULTY'],
      'ADMIN': ['admin@srm.edu.in', 'password123', 'ADMIN'],
      'SUPER_ADMIN': ['superadmin@unitutor.com', 'superadmin123', 'SUPER_ADMIN'],
      'SJU_STUDENT': ['rahul.jain@sju.edu.in', 'password123', 'STUDENT'],
      'VIT_STUDENT': ['pradeep.v@vit.ac.in', 'password123', 'STUDENT'],
      'ANNA_STUDENT': ['tamil.selvan@annauniv.edu', 'password123', 'STUDENT'],
    };
    const [e, p, r] = creds[type];
    setEmail(e);
    setPassword(p);
    setActiveTab(r);
  };

  const tabs = [
    { id: 'STUDENT', label: 'Student' },
    { id: 'FACULTY', label: 'Faculty' },
    { id: 'ADMIN', label: 'College Admin' },
    { id: 'SUPER_ADMIN', label: 'Super Admin' },
  ];

  const featureItems = [
    'AI-powered academic tutoring',
    'Multi-university management',
    'Real-time analytics & tracking',
    'Role-based access control',
    'Intelligent query escalation',
  ];

  return (
    <div className="login-page">
      <div className="login-splash">
        <div style={{ marginBottom: '1rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.5)', padding: '0.5rem 0' }}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
        <h1><GraduationCap size={36} /> UniTutor</h1>
        <p>Your intelligent, AI-powered academic companion. Access your entire academic life — marks, attendance, fees, schedule — all in one place.</p>
        <div className="login-features">
          {featureItems.map((f, i) => (
            <div key={i} className="login-feature-item">
              <Check size={16} /> {f}
            </div>
          ))}
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <div className="login-sub">Sign in to access your dashboard</div>

          <div className="auth-tabs">
            {tabs.map(t => (
              <div key={t.id} className={`auth-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          <div className="demo-btns">
            <button className="demo-btn" onClick={() => setTestCreds('STUDENT')}>SRM Student</button>
            <button className="demo-btn" onClick={() => setTestCreds('SJU_STUDENT')}>SJU Student</button>
            <button className="demo-btn" onClick={() => setTestCreds('VIT_STUDENT')}>VIT Student</button>
            <button className="demo-btn" onClick={() => setTestCreds('ANNA_STUDENT')}>Anna Student</button>
            <button className="demo-btn" onClick={() => setTestCreds('FACULTY')}>Faculty</button>
            <button className="demo-btn" onClick={() => setTestCreds('ADMIN')}>College Admin</button>
            <button className="demo-btn" onClick={() => setTestCreds('SUPER_ADMIN')}>Super Admin</button>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '0.25rem', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
