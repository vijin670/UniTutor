import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, BookOpen, Calendar, CheckSquare, 
  MessageCircle, BarChart2, CreditCard, LogOut, GraduationCap
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <CheckSquare size={20} /> },
    { id: 'marks', label: 'Marks', icon: <BarChart2 size={20} /> },
    { id: 'fees', label: 'Fee Payments', icon: <CreditCard size={20} /> },
    { id: 'faculty', label: 'Contact Faculty', icon: <MessageCircle size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <GraduationCap size={28} /> UniTutor
      </div>
      
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
      
      <div className="user-profile-mini">
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.role}</div>
        </div>
        <LogOut size={20} cursor="pointer" color="var(--text-secondary)" onClick={logout} />
      </div>
    </aside>
  );
};

export default Sidebar;
