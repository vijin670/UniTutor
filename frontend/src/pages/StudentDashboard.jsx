import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, BookOpen, Calendar, CheckSquare, BarChart2, CreditCard, LogOut, GraduationCap } from 'lucide-react';
import AIPanel from '../components/chat/AIPanel';
import { API_URL } from '../config';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/student/dashboard`);
      setData(res.data);
      setBio(res.data.bio || '');
      setPhone(res.data.phone || '');
      setAddress(res.data.address || '');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleProfileSave = async () => {
    try {
      await axios.put(`${API_URL}/api/student/profile`, { bio, phone, address });
      setEditMode(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Loading your academic data...</div>;

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={18} /> },
    { id: 'marks', label: 'Marks', icon: <BarChart2 size={18} /> },
    { id: 'attendance', label: 'Attendance', icon: <CheckSquare size={18} /> },
    { id: 'fees', label: 'Fee Payments', icon: <CreditCard size={18} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
  ];

  const attendanceData = data?.attendance || [];
  const presentCount = attendanceData.filter(a => a.status === 'PRESENT').length;
  const attendancePercent = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="fade-in">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div className="person-avatar" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>{data?.name?.charAt(0)}</div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data?.name}</h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{data?.department} • Year {data?.year} • Sem {data?.semester}</div>
                  </div>
                </div>
                <button className={editMode ? 'btn-primary' : 'btn-secondary'} onClick={() => editMode ? handleProfileSave() : setEditMode(true)}>
                  {editMode ? 'Save' : 'Edit Profile'}
                </button>
              </div>
              <hr className="divider" />
              <div className="detail-row"><div className="detail-label">University</div><div className="detail-value">{data?.university?.name}</div></div>
              <div className="detail-row"><div className="detail-label">Enrollment</div><div className="detail-value"><span className="badge badge-dark">{data?.enrollmentNo}</span></div></div>
              <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">{data?.email}</div></div>
              <div className="detail-row"><div className="detail-label">Phone</div>{editMode ? <input className="input-field" style={{ maxWidth: 300 }} value={phone} onChange={e => setPhone(e.target.value)} /> : <div className="detail-value">{data?.phone || '—'}</div>}</div>
              <div className="detail-row"><div className="detail-label">Address</div>{editMode ? <input className="input-field" style={{ maxWidth: 300 }} value={address} onChange={e => setAddress(e.target.value)} /> : <div className="detail-value">{data?.address || '—'}</div>}</div>
              <div className="detail-row"><div className="detail-label">Bio</div>{editMode ? <textarea className="input-field" rows={2} style={{ maxWidth: 400 }} value={bio} onChange={e => setBio(e.target.value)} /> : <div className="detail-value">{data?.bio || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No bio</span>}</div>}</div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="stat-card"><div className="stat-label">Subjects</div><div className="stat-value">{data?.university?.courses?.length || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Exams</div><div className="stat-value">{data?.marks?.length || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Attendance</div><div className="stat-value">{attendancePercent}%</div></div>
              <div className="stat-card"><div className="stat-label">Fee Status</div><div className="stat-value" style={{ fontSize: '1rem' }}>{data?.feePayments?.[0]?.status || '—'}</div></div>
            </div>
          </div>
        );

      case 'subjects':
        return (
          <div className="fade-in grid-2">
            {(data?.university?.courses || []).map(c => (
              <div key={c.id} className="card">
                <span className="badge badge-dark" style={{ marginBottom: '0.5rem' }}>{c.code}</span>
                <h3 style={{ fontWeight: 700, marginTop: '0.35rem', marginBottom: '0.25rem' }}>{c.title}</h3>
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

      case 'marks':
        return (
          <div className="fade-in">
            {(data?.marks?.length || 0) > 0 ? (
              <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Course</th><th>Exam</th><th>Score</th><th>Max</th><th>Percentage</th></tr></thead>
                  <tbody>
                    {data.marks.map(m => {
                      const pct = Math.round((m.score / m.maxScore) * 100);
                      return (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 600 }}>{m.course.title}</td>
                          <td><span className="badge badge-outline">{m.examName}</span></td>
                          <td style={{ fontWeight: 700 }}>{m.score}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{m.maxScore}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : <div className="empty-state"><p>No marks recorded</p></div>}
          </div>
        );

      case 'attendance':
        return (
          <div className="fade-in">
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
              <div className="stat-card"><div className="stat-label">Total Classes</div><div className="stat-value">{attendanceData.length}</div></div>
              <div className="stat-card"><div className="stat-label">Present</div><div className="stat-value">{presentCount}</div></div>
              <div className="stat-card"><div className="stat-label">Absent</div><div className="stat-value">{attendanceData.filter(a => a.status === 'ABSENT').length}</div></div>
              <div className="stat-card"><div className="stat-label">Percentage</div><div className="stat-value">{attendancePercent}%</div><div className="progress-bar" style={{ marginTop: '0.5rem' }}><div className="progress-fill" style={{ width: `${attendancePercent}%` }}></div></div></div>
            </div>
            {attendanceData.length > 0 && (
              <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Day</th><th>Status</th></tr></thead>
                  <tbody>
                    {attendanceData.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 500 }}>{new Date(a.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(a.date).toLocaleDateString('en', { weekday: 'long' })}</td>
                        <td><span className={`badge ${a.status === 'PRESENT' ? 'badge-success' : a.status === 'ABSENT' ? 'badge-danger' : a.status === 'LATE' ? 'badge-warning' : 'badge-light'}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'fees':
        return (
          <div className="fade-in">
            {(data?.feePayments?.length || 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.feePayments.map(f => {
                  const paidPct = Math.round((f.amountPaid / f.amountDue) * 100);
                  return (
                    <div key={f.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700 }}>Semester Fee</div>
                        <span className={`badge ${f.status === 'PAID' ? 'badge-success' : f.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>{f.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Due:</span> <strong>₹{f.amountDue.toLocaleString()}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Paid:</span> <strong>₹{f.amountPaid.toLocaleString()}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Balance:</span> <strong>₹{(f.amountDue - f.amountPaid).toLocaleString()}</strong></div>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${paidPct}%` }}></div></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Due by: {new Date(f.dueDate).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="empty-state"><p>No fee records</p></div>}
          </div>
        );

      case 'schedule':
        return (
          <div className="fade-in">
            {(data?.university?.schedules?.length || 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.university.schedules.map(s => (
                  <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 50, height: 50, background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.7 }}>{new Date(s.date).toLocaleDateString('en', { month: 'short' })}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{new Date(s.date).getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.eventName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(s.date).toLocaleString('en', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="empty-state"><p>No upcoming events</p></div>}
          </div>
        );

      default: return <div className="empty-state"><p>Section under construction</p></div>;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header"><GraduationCap size={22} /> UniTutor</div>
        <ul className="nav-menu">
          {menuItems.map(item => (
            <li key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
        <div className="user-profile-mini">
          <div className="person-avatar">{user?.name?.charAt(0) || 'S'}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STUDENT</div>
          </div>
          <LogOut size={18} cursor="pointer" color="var(--text-muted)" onClick={handleLogout} />
        </div>
      </aside>
      <main className="main-content">
        <h1 className="page-title">Welcome, {data?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">{data?.department} • {data?.university?.name}</p>
        {renderContent()}
      </main>
      <AIPanel />
    </div>
  );
};

export default StudentDashboard;
