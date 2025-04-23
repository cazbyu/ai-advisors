import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Library from './components/Library';
import Communications from './components/Communications';
import Navigation from './components/Navigation';
import { Advisor } from './types';

function App() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  const handleAdvisorClick = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
  };

  const handleBack = () => {
    setSelectedAdvisor(null);
  };

  return (
    <BrowserRouter>
      <div className="font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/advisors" element={<HomePage onNodeClick={handleAdvisorClick} />} />
          <Route path="/dashboard/:route" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/comms" element={<Communications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;