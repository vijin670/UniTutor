import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';

const UniversityCommunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/universities/${id}/community`)
      .then(r => setData(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Loading university data...</div>;
  if (!data) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>University not found</div>;

  const tabs = ['overview', 'students', 'faculty', 'courses'];

  return (
    <div className="community-page">
      <div className="community-header">
        <button onClick={() => navigate('/')} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1rem', cursor: 'pointer', border: 'none', fontFamily: 'var(--font)' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1>{data.name}</h1>
        <p>{data.location} • {data.domain}</p>
        <div className="community-meta">
          <span>Est. {data.established}</span>
          <span>{data.type}</span>
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      <div className="community-body">
        {data.description && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '700px' }}>{data.description}</p>
        )}

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
          <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">{data.students?.length || 0}</div></div>
          <div className="stat-card"><div className="stat-label">Faculty</div><div className="stat-value">{data.faculty?.length || 0}</div></div>
          <div className="stat-card"><div className="stat-label">Courses</div><div className="stat-value">{data.courses?.length || 0}</div></div>
          <div className="stat-card"><div className="stat-label">Departments</div><div className="stat-value">{data.departments?.length || 0}</div></div>
        </div>

        <div className="community-tabs">
          {tabs.map(t => (
            <div key={t} className={`community-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="fade-in">
            <div className="section-header"><div className="section-title">Departments</div></div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {data.departments?.map(d => <span key={d} className="badge badge-light" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>{d}</span>)}
            </div>

            <div className="section-header"><div className="section-title">Upcoming Events</div></div>
            {(data.schedules?.length || 0) > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {data.schedules.map(s => (
                  <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                    <div style={{ width: 44, height: 44, background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.7 }}>{new Date(s.date).toLocaleDateString('en', { month: 'short' })}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{new Date(s.date).getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.eventName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleString('en', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming events</p>}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="fade-in">
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Enrollment</th><th>Department</th><th>Year</th><th>Semester</th></tr></thead>
                <tbody>
                  {data.students?.map(s => (
                    <tr key={s.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><div className="person-avatar" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>{s.name.charAt(0)}</div><span style={{ fontWeight: 600 }}>{s.name}</span></div></td>
                      <td><span className="badge badge-outline">{s.enrollmentNo}</span></td>
                      <td>{s.department}</td>
                      <td>Year {s.year}</td>
                      <td>Sem {s.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="fade-in grid-2">
            {data.faculty?.map(f => (
              <div key={f.id} className="card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <div className="person-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>{f.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{f.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{f.designation} • {f.department}</div>
                    {f.qualification && <div className="detail-row"><div className="detail-label">Qualification</div><div className="detail-value" style={{ fontSize: '0.85rem' }}>{f.qualification}</div></div>}
                    {f.bio && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>{f.bio}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="fade-in">
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Course</th><th>Code</th><th>Faculty</th><th>Credits</th><th>Semester</th><th>Department</th></tr></thead>
                <tbody>
                  {data.courses?.map(c => (
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
        )}
      </div>
    </div>
  );
};

export default UniversityCommunity;
