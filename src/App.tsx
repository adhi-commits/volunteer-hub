import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Campaigns from './pages/Campaigns';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateCampaign from './pages/CreateCampaign';
import CampaignVolunteers from './pages/CampaignVolunteers';
import CampaignRegistration from './pages/CampaignRegistration';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      <Route path="/create-campaign" element={<CreateCampaign />} />
      <Route path="/campaign-volunteers/:id" element={<CampaignVolunteers />} />
      <Route path="/campaigns/:id/register" element={<CampaignRegistration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
