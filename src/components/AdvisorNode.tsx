import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvisorNodeProps } from '../types';

const AdvisorNode: React.FC<AdvisorNodeProps> = ({
  advisor,
  index,
  isVisible,
  totalNodes,
  onClick
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!nodeRef.current || advisor.isActionNode) return;
    
    const updatePosition = () => {
      const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
      const baseRadius = 135;
      const radius = window.matchMedia('(min-width: 768px)').matches ? 180 :
                    window.matchMedia('(min-width: 640px)').matches ? 150 :
                    baseRadius;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (nodeRef.current) {
        nodeRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      }
    };

    updatePosition();

    const mediaQueryList = window.matchMedia('(min-width: 768px)');
    mediaQueryList.addListener(updatePosition);

    return () => {
      mediaQueryList.removeListener(updatePosition);
    };
  }, [index, isVisible, totalNodes, advisor.isActionNode]);

  const handleClick = () => {
    console.log('Clicked:', advisor.route);
    if (advisor.route) {
      navigate(`/dashboard/${advisor.route}`);
    } else {
      onClick(advisor);
    }
  };

  const delay = 0.1 * index;

  return (
    <div 
      ref={nodeRef}
      className="absolute left-1/2 top-1/2 z-20"
      style={{
        transformOrigin: 'center',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}s`,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div 
        className={`
          w-20 h-20 md:w-28 md:h-28
          bg-gradient-to-br
          rounded-full
          flex items-center justify-center
          cursor-pointer
          shadow-md
          transition-all duration-300 ease-in-out
          hover:scale-110
          hover:shadow-xl
          active:scale-95
          ${advisor.isActionNode 
            ? 'from-orange-600 to-orange-500 hover:shadow-orange-200/50' 
            : 'from-blue-700 to-blue-600 hover:shadow-blue-200/50'
          }
        `}
        onClick={handleClick}
      >
        <div className="absolute inset-0 rounded-full bg-white/10 transition-opacity duration-300 hover:bg-white/20"></div>
        
        <div className="relative z-10 text-center leading-tight px-1 md:px-2">
          <div className="text-white font-bold text-sm md:text-lg">
            {advisor.role}
          </div>
          <div className="text-white/90 text-[10px] md:text-sm font-medium mt-0.5">
            {advisor.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorNode;