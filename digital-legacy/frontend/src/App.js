import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Vault from './components/Vault';
import Beneficiaries from './components/Beneficiaries';
import LegacyPlans from './components/LegacyPlans';
import SettingsPage from './components/Settings';
import AuditLogPage from './components/AuditLog';
import DeliveryTrackingPage from './components/DeliveryTracking';
import AIAssistantPage from './components/AIAssistant';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      axios.get(`${API_URL}/auth/profile/`)
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <Layout user={user} setUser={setUser}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/beneficiaries" element={<Beneficiaries />} />
        <Route path="/legacy" element={<LegacyPlans />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/delivery-tracking" element={<DeliveryTrackingPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
