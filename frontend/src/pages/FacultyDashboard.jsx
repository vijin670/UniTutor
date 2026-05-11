import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, MessageSquare, LogOut, User, AlertCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/faculty/dashboard')
      .then(r => setData(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Loading faculty data...</div>;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
    { id: 'students', label: 'Students', icon: <Users size={18} /> },
    { id: 'escalations', label: 'Escalations', icon: <MessageSquare size={18} /> },
  ];

  const courses = data?.coursesTaught || [];
  const escalations = data?.escalations || [];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="fade-in">
            <div className="card">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                <div className="person-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>{data?.name?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.15rem' }}>{data?.name}</h2>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{data?.designation} • {data?.department}</div>
                  
                  <div className="detail-row"><div className="detail-label">University</div><div className="detail-value">{data?.university?.name}</div></div>
                  <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">{data?.email}</div></div>
                  <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value">{data?.phone || '—'}</div></div>
                  <div className="detail-row"><div className="detail-label">Qualification</div><div className="detail-value">{data?.qualification || '—'}</div></div>
                  <div className="detail-row"><div className="detail-label">Joined</div><div className="detail-value">{data?.joinDate ? new Date(data.joinDate).toLocaleDateString('en', { year: 'numeric', month: 'long' }) : '—'}</div></div>
                  {data?.bio && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.7, paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>{data.bio}</p>}
                </div>
              </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="stat-card"><div className="stat-label">Courses</div><div className="stat-value">{courses.length}</div></div>
              <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">{data?.totalStudents || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Escalations</div><div className="stat-value">{escalations.length}</div></div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="fade-in grid-2">
            {courses.map(c => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge badge-dark" style={{ marginBottom: '0.5rem' }}>{c.code}</span>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.35rem' }}>{c.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{c.description}</p>
                <hr className="divider" />
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Credits:</span> <strong>{c.credits}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Semester:</span> <strong>{c.semester}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Dept:</span> <strong>{c.department}</strong></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'students':
        return (
          <div className="fade-in">
            {courses.map(c => {
              const uniqueStudents = [];
              const seen = new Set();
              c.marks?.forEach(m => {
                if (!seen.has(m.student.id)) {
                  seen.add(m.student.id);
                  uniqueStudents.push(m.student);
                }
              });
              if (uniqueStudents.length === 0) return null;
              return (
                <div key={c.id} style={{ marginBottom: '1.5rem' }}>
                  <div className="section-header">
                    <div>
                      <div className="section-title">{c.title}</div>
                      <div className="section-subtitle">{c.code} • {uniqueStudents.length} students</div>
                    </div>
                  </div>
                  <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table">
                      <thead><tr><th>Student</th><th>Enrollment</th><th>Department</th><th>Year</th></tr></thead>
                      <tbody>
                        {uniqueStudents.map(s => (
                          <tr key={s.id}>
                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><div className="person-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>{s.name.charAt(0)}</div><span style={{ fontWeight: 600 }}>{s.name}</span></div></td>
                            <td><span className="badge badge-outline">{s.enrollmentNo}</span></td>
                            <td>{s.department}</td>
                            <td>Year {s.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'escalations':
        return (
          <div className="fade-in">
            {escalations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {escalations.map(e => (
                  <div key={e.id} className="card" style={{ borderLeft: '3px solid var(--black)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} />
                        <span style={{ fontWeight: 600 }}>{e.student?.name}</span>
                        {e.student?.enrollmentNo && <span className="badge badge-outline">{e.student.enrollmentNo}</span>}
                      </div>
                      <span className="badge badge-warning">Pending</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{e.question}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{new Date(e.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><AlertCircle size={40} /><p>No pending escalations</p></div>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header"><BookOpen size={22} /> Faculty</div>
        <ul className="nav-menu">
          {tabs.map(t => (
            <li key={t.id} className={`nav-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </li>
          ))}
        </ul>
        <div className="user-profile-mini">
          <div className="person-avatar">{user?.name?.charAt(0) || 'F'}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FACULTY</div>
          </div>
          <LogOut size={18} cursor="pointer" color="var(--text-muted)" onClick={handleLogout} />
        </div>
      </aside>
      <main className="main-content">
        <h1 className="page-title">Welcome, {data?.name?.split(' ').pop()}</h1>
        <p className="page-subtitle">{data?.designation} — {data?.department}, {data?.university?.name}</p>
        {renderContent()}
      </main>
    </div>
  );
};

export default FacultyDashboard;
