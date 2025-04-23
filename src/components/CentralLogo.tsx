import React, { useState, useEffect } from 'react';
import { Advisor } from '../types';
import AdvisorNode from './AdvisorNode';
import { advisors } from '../data/advisors';

interface CentralLogoProps {
  onNodeClick: (advisor: Advisor) => void;
  onExpand: (expanded: boolean) => void;
  initialExpanded?: boolean;
}

const CentralLogo: React.FC<CentralLogoProps> = ({ 
  onNodeClick, 
  onExpand,
  initialExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  useEffect(() => {
    if (initialExpanded) {
      setIsExpanded(true);
      onExpand(true);
    }
  }, [initialExpanded, onExpand]);

  const handleLogoClick = () => {
    const newExpandedState = true;
    setIsExpanded(newExpandedState);
    onExpand(newExpandedState);
  };

  const mainAdvisors = advisors.filter(advisor => !advisor.isActionNode);
  const actionAdvisor = advisors.find(advisor => advisor.isActionNode);

  return (
    <div className="relative flex items-center justify-center min-h-[70vh] md:min-h-[85vh] w-full max-w-[90vw] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`
            relative
            w-[280px] h-[280px] md:w-[480px] md:h-[480px]
            transition-all duration-1000
            ${isExpanded ? 'scale-100' : 'scale-0'}
          `}
        >
          {mainAdvisors.map((advisor, index) => (
            <AdvisorNode
              key={advisor.id}
              advisor={advisor}
              index={index}
              isVisible={isExpanded}
              totalNodes={mainAdvisors.length}
              onClick={onNodeClick}
            />
          ))}
        </div>
      </div>

      <div 
        className={`
          relative z-[5]
          rounded-full 
          bg-white
          flex items-center justify-center
          cursor-pointer
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          hover:scale-105
          active:scale-95
          ${isExpanded ? 'w-24 h-24 md:w-36 md:h-36' : 'w-28 h-28 md:w-48 md:h-48'}
        `}
        onClick={handleLogoClick}
      >
        <img 
          src="https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AT%20Logo_square_RYG.png"
          alt="Africa Thryves Logo"
          className={`
            w-full h-full p-3
            transition-all duration-1000
            ${isExpanded ? 'opacity-75 hover:opacity-100' : 'opacity-100'}
          `}
        />
      </div>

      {actionAdvisor && isExpanded && (
        <div 
          className={`
            absolute
            top-4 right-2 md:top-12 md:right-16
            z-30
            transition-all duration-1000 ease-out
            ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
          style={{ transitionDelay: '0.8s' }}
        >
          <AdvisorNode
            advisor={actionAdvisor}
            index={0}
            isVisible={isExpanded}
            totalNodes={1}
            onClick={onNodeClick}
          />
        </div>
      )}
    </div>
  );
};

export default CentralLogo;