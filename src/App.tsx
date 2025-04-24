import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Library from './components/Library';
import Communications from './components/Communications';
import Navigation from './components/Navigation';

const AppRoutes: React.FC = () => {
  return (
    <div className="font-sans text-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/advisors" element={<HomePage />} />
        <Route path="/advisors/:id" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/comms" element={<Communications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;