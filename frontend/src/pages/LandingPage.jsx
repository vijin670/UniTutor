import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Brain, Building2, Users, BookOpen, Shield, BarChart3, MessageSquare, ChevronRight, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [stats, setStats] = useState({ universities: 0, students: 0, faculty: 0, courses: 0 });
  const [animatedStats, setAnimatedStats] = useState({ universities: 0, students: 0, faculty: 0, courses: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/universities').then(r => setUniversities(r.data)).catch(() => {});
    axios.get('http://localhost:5000/api/universities/stats/global').then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        universities: Math.round(stats.universities * progress),
        students: Math.round(stats.students * progress),
        faculty: Math.round(stats.faculty * progress),
        courses: Math.round(stats.courses * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  const features = [
    { icon: <Brain size={20} />, title: 'AI-Powered Tutoring', desc: 'Context-aware AI assistant that understands each student\'s academic data — marks, attendance, fees, and schedule.' },
    { icon: <Building2 size={20} />, title: 'Multi-University', desc: 'Supports multiple universities with isolated data, independent administration, and cross-platform analytics.' },
    { icon: <Shield size={20} />, title: 'Role-Based Access', desc: 'Four access tiers — Super Admin, College Admin, Faculty, and Student — each with tailored dashboards.' },
    { icon: <BarChart3 size={20} />, title: 'Real-time Analytics', desc: 'Live dashboards with enrollment stats, attendance tracking, grade analytics, and fee management.' },
    { icon: <MessageSquare size={20} />, title: 'Query Escalation', desc: 'AI automatically escalates unresolved queries to faculty, creating a seamless support pipeline.' },
    { icon: <Zap size={20} />, title: 'Modern Stack', desc: 'Built with React, Express, Prisma ORM, SQLite, and Google Gemini AI for blazing-fast performance.' },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo"><GraduationCap size={24} /> UniTutor</div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#universities">Universities</a>
          <a href="#tech">Technology</a>
          <button className="btn-primary" onClick={() => navigate('/login')}>Sign In <ChevronRight size={16} /></button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge"><Zap size={14} /> Academic SaaS Platform</div>
        <h1 className="hero-title">The Intelligent Academic Companion</h1>
        <p className="hero-subtitle">
          UniTutor is an AI-powered multi-university academic management platform. 
          It connects students, faculty, and administrators through intelligent automation, 
          real-time analytics, and a context-aware AI tutor.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            Explore Platform <ChevronRight size={18} />
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            Learn More
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-section">
        <div className="stats-row">
          <div className="stat-item"><div className="stat-num">{animatedStats.universities}</div><div className="stat-name">Universities</div></div>
          <div className="stat-item"><div className="stat-num">{animatedStats.students}</div><div className="stat-name">Students</div></div>
          <div className="stat-item"><div className="stat-num">{animatedStats.faculty}</div><div className="stat-name">Faculty</div></div>
          <div className="stat-item"><div className="stat-num">{animatedStats.courses}</div><div className="stat-name">Courses</div></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="features-header">
          <h2>Built for Modern Education</h2>
          <p>Every feature designed to streamline academic management and enhance the learning experience.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Universities */}
      <section className="universities-section" id="universities">
        <div className="features-header">
          <h2>Partner Universities</h2>
          <p>Click on a university to explore its community — students, faculty, courses, and departments.</p>
        </div>
        <div className="universities-grid">
          {universities.map(u => (
            <div key={u.id} className="uni-card" onClick={() => navigate(`/university/${u.id}`)}>
              <span className="uni-card-badge">{u.type || 'University'} • Est. {u.established || 'N/A'}</span>
              <h3>{u.name}</h3>
              <div className="uni-location">{u.location || u.domain}</div>
              <div className="uni-card-stats">
                <span><strong>{u._count?.users || 0}</strong> Members</span>
                <span><strong>{u._count?.courses || 0}</strong> Courses</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section" id="tech">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Technology Stack</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Built with industry-standard, production-grade technologies</p>
        <div className="tech-grid">
          {['React 19', 'Express.js', 'Prisma ORM', 'SQLite', 'Google Gemini AI', 'JWT Auth', 'Vite', 'Lucide Icons'].map(t => (
            <div key={t} className="tech-chip">{t}</div>
          ))}
        </div>
      </section>

      {/* About Project */}
      <section style={{ padding: '4rem', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>About This Project</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            UniTutor is a full-stack academic SaaS platform designed to demonstrate how AI can transform 
            university management. The platform features a <strong>multi-tenant architecture</strong> supporting 
            multiple universities, each with their own isolated student, faculty, and course data. 
            The AI tutor leverages <strong>Google Gemini</strong> to provide intelligent, 
            context-aware responses based on each student's actual academic records.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              Get Started <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--black)' }}>
          <GraduationCap size={18} /> UniTutor
        </div>
        <div>© 2026 UniTutor. Academic SaaS Platform.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
