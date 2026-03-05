import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BoardroomSession } from './pages/BoardroomSession';
import { RoundTable } from './pages/RoundTable';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { AdvisorPage } from './pages/AdvisorPage';
import { TeamMemberPage } from './pages/TeamMemberPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<BoardroomSession />} />
            <Route path="/team" element={<RoundTable />} />
            <Route path="/history" element={<History />} />
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
