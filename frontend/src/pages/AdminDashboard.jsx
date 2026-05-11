import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, BookOpen, GraduationCap, LogOut, UserCheck, Calendar, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard')
      .then(r => setData(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Loading university data...</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 size={18} /> },
    { id: 'students', label: 'Students', icon: <GraduationCap size={18} /> },
    { id: 'faculty', label: 'Faculty', icon: <UserCheck size={18} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
  ];

  const students = data?.students || [];
  const faculty = data?.faculty || [];
  const courses = data?.courses || [];
  const departments = data?.departments || [];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNo?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="fade-in">
            <div className="card" style={{ background: 'var(--black)', color: 'var(--white)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '0.5rem' }}>University</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{data?.name}</h2>
              <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{data?.location} • {data?.domain} • Est. {data?.established}</div>
              {data?.description && <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.75rem', lineHeight: 1.6 }}>{data.description}</p>}
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">{students.length}</div></div>
              <div className="stat-card"><div className="stat-label">Faculty</div><div className="stat-value">{faculty.length}</div></div>
              <div className="stat-card"><div className="stat-label">Courses</div><div className="stat-value">{courses.length}</div></div>
              <div className="stat-card"><div className="stat-label">Departments</div><div className="stat-value">{departments.length}</div></div>
            </div>

            <div className="section-header"><div className="section-title">Departments</div></div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {departments.map(d => (
                <span key={d} className="badge badge-light" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>{d}</span>
              ))}
            </div>

            <div className="section-header"><div className="section-title">Recent Faculty</div></div>
            <div className="grid-3">
              {faculty.slice(0, 6).map(f => (
                <div key={f.id} className="person-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className="person-avatar">{f.name.charAt(0)}</div>
                  <div className="person-info">
                    <div className="person-name">{f.name}</div>
                    <div className="person-detail">{f.designation} • {f.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="fade-in">
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Enrollment</th><th>Department</th><th>Year</th><th>Semester</th><th>Email</th></tr></thead>
                <tbody>
                  {filteredStudents.map(s => (
                    <tr key={s.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><div className="person-avatar" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>{s.name.charAt(0)}</div><span style={{ fontWeight: 600 }}>{s.name}</span></div></td>
                      <td><span className="badge badge-outline">{s.enrollmentNo}</span></td>
                      <td>{s.department}</td>
                      <td>{s.year}</td>
                      <td>{s.semester}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filteredStudents.length} students</div>
          </div>
        );

      case 'faculty':
        return (
          <div className="fade-in">
            <div className="grid-2">
              {faculty.map(f => (
                <div key={f.id} className="card">
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div className="person-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>{f.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{f.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{f.designation} • {f.department}</div>
                      <div className="detail-row"><div className="detail-label">Qualification</div><div className="detail-value">{f.qualification || '—'}</div></div>
                      <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">{f.email}</div></div>
                      <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value">{f.phone || '—'}</div></div>
                      {f.bio && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6 }}>{f.bio}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="fade-in">
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Course</th><th>Code</th><th>Faculty</th><th>Credits</th><th>Semester</th><th>Department</th></tr></thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td><div><div style={{ fontWeight: 600 }}>{c.title}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description}</div></div></td>
                      <td><span className="badge badge-dark">{c.code}</span></td>
                      <td>{c.faculty?.name}</td>
                      <td>{c.credits}</td>
                      <td>Sem {c.semester}</td>
                      <td>{c.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="fade-in">
            {(data?.schedules || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.schedules.map(s => (
                  <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 50, height: 50, background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleDateString('en', { month: 'short' })}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{new Date(s.date).getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.eventName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(s.date).toLocaleString('en', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="empty-state"><p>No scheduled events</p></div>}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header"><Building2 size={22} /> College Admin</div>
        <ul className="nav-menu">
          {tabs.map(t => (
            <li key={t.id} className={`nav-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </li>
          ))}
        </ul>
        <div className="user-profile-mini">
          <div className="person-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ADMIN</div>
          </div>
          <LogOut size={18} cursor="pointer" color="var(--text-muted)" onClick={handleLogout} />
        </div>
      </aside>
      <main className="main-content">
        <h1 className="page-title">{data?.name || 'University'}</h1>
        <p className="page-subtitle">College administration dashboard</p>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
