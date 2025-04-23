import React from 'react';
import CentralLogo from './CentralLogo';
import { Advisor } from '../types';

interface HomePageProps {
  onNodeClick: (advisor: Advisor) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNodeClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 md:p-6">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center">
        <CentralLogo 
          onNodeClick={onNodeClick} 
          onExpand={() => {}} 
          initialExpanded={true}
        />
      </div>
    </div>
  );
};

export default HomePage;