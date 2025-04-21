import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RoundTable } from './pages/RoundTable';
import { Decisions } from './pages/Decisions';
import { Profile } from './pages/Profile';
import { AdvisorPage } from './pages/AdvisorPage';
import { TeamMemberPage } from './pages/TeamMemberPage';
import { Communications } from './pages/Communications';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/round-table" element={<RoundTable />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/advisor/:id" element={<AdvisorPage />} />
            <Route path="/advisor/:advisorId/team/:memberId" element={<TeamMemberPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;