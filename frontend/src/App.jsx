import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import UniversityCommunity from './pages/UniversityCommunity';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/university/:id" element={<UniversityCommunity />} />

      <Route path="/super-admin" element={
        <ProtectedRoute roles={['SUPER_ADMIN']}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute roles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/faculty" element={
        <ProtectedRoute roles={['FACULTY']}>
          <FacultyDashboard />
        </ProtectedRoute>
      } />

      <Route path="/student" element={
        <ProtectedRoute roles={['STUDENT']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
