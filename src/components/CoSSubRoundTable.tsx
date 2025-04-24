import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Advisor } from '../types';

interface CoSSubRoundTableProps {
  onBack: () => void;
}

const supportingAdvisors: Advisor[] = [
  {
    id: 'ra',
    name: 'Iris Sinclair',
    role: 'RA',
    title: 'Research Advisor',
    subtitle: 'Research',
    responsibility: 'Strategic research and analysis',
    contributions: ['Research strategy', 'Data analysis', 'Market insights'],
    profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
    route: 'ra',
    bio: 'Leading research initiatives and strategic analysis',
    tags: ['Research', 'Analysis', 'Strategy']
  },
  {
    id: 'ea',
    name: 'Tessa Bennion',
    role: 'EA',
    title: 'Executive Advisor',
    subtitle: 'Executive',
    responsibility: 'Executive support and coordination',
    contributions: ['Executive support', 'Project coordination', 'Strategic planning'],
    profileImage: 'https://images.pexels.com/photos/3760274/pexels-photo-3760274.jpeg',
    route: 'ea',
    bio: 'Providing executive support and strategic coordination',
    tags: ['Executive', 'Coordination', 'Planning']
  },
  {
    id: 'la',
    name: 'Anya Marais',
    role: 'LA',
    title: 'Learning Advisor',
    subtitle: 'Learning',
    responsibility: 'Learning strategy and development',
    contributions: ['Learning programs', 'Development initiatives', 'Knowledge management'],
    profileImage: 'https://images.pexels.com/photos/3760508/pexels-photo-3760508.jpeg',
    route: 'la',
    bio: 'Driving learning and development initiatives',
    tags: ['Learning', 'Development', 'Knowledge']
  }
];

const cosProfile: Advisor = {
  id: 'cos',
  name: 'Rowan Reyes',
  role: 'CoS',
  title: 'Chief of Staff',
  subtitle: 'Strategy & Operations',
  responsibility: 'Strategic coordination and team leadership',
  contributions: ['Strategic planning', 'Team coordination', 'Operational excellence'],
  profileImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
  route: 'cos',
  bio: 'Driving strategic initiatives and team coordination',
  tags: ['Strategy', 'Operations', 'Leadership']
};

const CoSSubRoundTable: React.FC<CoSSubRoundTableProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center"
    >
      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onBack}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to RoundTable</span>
      </motion.button>

      {/* Main Circle Container */}
      <div className="relative w-[280px] h-[280px] md:w-[480px] md:h-[480px]">
        {/* Center CoS Circle */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
            <img 
              src={cosProfile.profileImage}
              alt={cosProfile.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
              <div className="font-bold text-lg md:text-xl">{cosProfile.role}</div>
              <div className="text-xs md:text-sm opacity-90">{cosProfile.name}</div>
            </div>
          </div>
        </motion.div>

        {/* Supporting Advisors */}
        {supportingAdvisors.map((advisor, index) => {
          const angle = (index / supportingAdvisors.length) * 2 * Math.PI - Math.PI / 2;
          const radius = window.matchMedia('(min-width: 768px)').matches ? 180 : 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={advisor.id}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: 1,
                x: x,
                y: y
              }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 * (index + 1)
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                onClick={() => navigate(`/advisors/${advisor.route}`)}
                className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={advisor.profileImage}
                  alt={advisor.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-2">
                  <div className="font-bold text-sm md:text-lg">{advisor.role}</div>
                  <div className="text-[10px] md:text-sm opacity-90">{advisor.name}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CoSSubRoundTable;