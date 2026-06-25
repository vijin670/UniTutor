import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Users, BookOpen, GraduationCap, LogOut, Shield, Search, ChevronRight, Globe, BarChart3 } from 'lucide-react';
import { API_URL } from '../config';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allUnis, setAllUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, users, unis] = await Promise.all([
          axios.get(`${API_URL}/api/super-admin/dashboard`),
          axios.get(`${API_URL}/api/super-admin/users`),
          axios.get(`${API_URL}/api/super-admin/universities`),
        ]);
        setData(dash.data);
        setAllUsers(users.data);
        setAllUnis(unis.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Loading platform data...</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'universities', label: 'Universities', icon: <Building2 size={18} /> },
    { id: 'users', label: 'All Users', icon: <Users size={18} /> },
  ];

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    (u.university?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="fade-in">
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              <div className="stat-card"><div className="stat-label">Universities</div><div className="stat-value">{data?.totalUniversities}</div></div>
              <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{data?.totalUsers}</div></div>
              <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">{data?.totalStudents}</div></div>
              <div className="stat-card"><div className="stat-label">Faculty</div><div className="stat-value">{data?.totalFaculty}</div></div>
              <div className="stat-card"><div className="stat-label">Courses</div><div className="stat-value">{data?.totalCourses}</div></div>
            </div>

            <div className="section-header" style={{ marginTop: '1rem' }}>
              <div><div className="section-title">University Overview</div><div className="section-subtitle">Quick stats for each university on the platform</div></div>
            </div>

            <div className="grid-2">
              {data?.universities?.map(u => (
                <div key={u.id} className="card" style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('universities'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.location || u.domain}</div>
                    </div>
                    <span className="badge badge-light">{u.type || 'University'}</span>
                  </div>
                  <hr className="divider" />
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Members</div><div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{u._count?.users}</div></div>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Courses</div><div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{u._count?.courses}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'universities':
        return (
          <div className="fade-in">
            {allUnis.map(u => (
              <div key={u.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.15rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.location} • {u.domain} • Est. {u.established}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-light">{u.type}</span>
                    <button className="btn-ghost" onClick={() => navigate(`/university/${u.id}`)}>View Community <ChevronRight size={14} /></button>
                  </div>
                </div>
                {u.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>{u.description}</p>}
                
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div className="stat-card" style={{ flex: 1, padding: '0.75rem' }}>
                    <div className="stat-label" style={{ fontSize: '0.65rem' }}>Students</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>{u.users?.filter(x => x.role === 'STUDENT').length}</div>
                  </div>
                  <div className="stat-card" style={{ flex: 1, padding: '0.75rem' }}>
                    <div className="stat-label" style={{ fontSize: '0.65rem' }}>Faculty</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>{u.users?.filter(x => x.role === 'FACULTY').length}</div>
                  </div>
                  <div className="stat-card" style={{ flex: 1, padding: '0.75rem' }}>
                    <div className="stat-label" style={{ fontSize: '0.65rem' }}>Courses</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>{u.courses?.length}</div>
                  </div>
                </div>

                {u.courses?.length > 0 && (
                  <table className="data-table">
                    <thead><tr><th>Course</th><th>Code</th><th>Faculty</th><th>Credits</th><th>Dept</th></tr></thead>
                    <tbody>
                      {u.courses.map(c => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600 }}>{c.title}</td>
                          <td><span className="badge badge-outline">{c.code}</span></td>
                          <td>{c.faculty?.name}</td>
                          <td>{c.credits}</td>
                          <td>{c.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="fade-in">
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" placeholder="Search users by name, email, role, or university..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>University</th><th>Department</th></tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'SUPER_ADMIN' ? 'badge-dark' : u.role === 'ADMIN' ? 'badge-light' : u.role === 'FACULTY' ? 'badge-outline' : 'badge-light'}`}>{u.role}</span></td>
                      <td>{u.university?.name || '—'}</td>
                      <td>{u.department || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {filteredUsers.length} of {allUsers.length} users</div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header"><Shield size={22} /> Super Admin</div>
        <ul className="nav-menu">
          {tabs.map(t => (
            <li key={t.id} className={`nav-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </li>
          ))}
        </ul>
        <div className="user-profile-mini">
          <div className="person-avatar">{user?.name?.charAt(0) || 'S'}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SUPER ADMIN</div>
          </div>
          <LogOut size={18} cursor="pointer" color="var(--text-muted)" onClick={handleLogout} />
        </div>
      </aside>
      <main className="main-content">
        <h1 className="page-title">Platform Administration</h1>
        <p className="page-subtitle">Manage all universities, users, and platform analytics</p>
        {renderContent()}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
