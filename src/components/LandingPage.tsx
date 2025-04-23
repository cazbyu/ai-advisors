import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url('https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//Lion%20Background-16.png')`
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content Container */}
      <div className="relative h-screen flex items-center justify-center md:justify-start px-4 md:pl-24">
        {/* Circle Container */}
        <div 
          onClick={() => navigate('/advisors')}
          className="group relative w-56 h-56 md:w-96 md:h-96 rounded-full bg-white/90 backdrop-blur-sm 
                   shadow-xl hover:shadow-2xl cursor-pointer 
                   flex flex-col items-center justify-center
                   transform transition-all duration-500 hover:scale-105"
        >
          {/* Logo */}
          <img 
            src="https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AT%20Logo_square_RYG.png"
            alt="Africa Thryves Logo"
            className="w-28 md:w-48 mb-0 transform transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* AI Advisors Text */}
          <span className="text-gray-800 font-bold text-xl md:text-4xl -mt-2 md:-mt-6 tracking-tight">
            AI Advisors
          </span>

          {/* Decorative Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 
                        transform transition-transform duration-1000 group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;