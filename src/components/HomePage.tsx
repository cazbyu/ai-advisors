import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CentralLogo from './CentralLogo';
import CoSSubRoundTable from './CoSSubRoundTable';
import { Advisor } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showCoSTeam, setShowCoSTeam] = useState(false);

  const handleAdvisorClick = (advisor: Advisor) => {
    if (advisor.role === 'CoS') {
      setShowCoSTeam(true);
    } else {
      navigate(`/advisors/${advisor.route}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 md:p-6">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center">
        {showCoSTeam ? (
          <CoSSubRoundTable onBack={() => setShowCoSTeam(false)} />
        ) : (
          <CentralLogo 
            onNodeClick={handleAdvisorClick} 
            onExpand={() => {}} 
            initialExpanded={true}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;