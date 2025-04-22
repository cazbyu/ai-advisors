import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chat } from './Chat';
import type { Advisor } from '../types';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface AdvisorCarouselProps {
  advisors: Advisor[];
}

export function AdvisorCarousel({ advisors }: AdvisorCarouselProps) {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!advisors.length) {
    console.warn("No advisors loaded from Supabase.");
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">No advisors available at the moment.</p>
      </div>
    );
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Desktop Navigation Arrows */}
      <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 text-gray-600"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 text-gray-600"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 px-4 -mx-4 snap-x snap-mandatory"
      >
        {advisors.map((advisor) => (
          <div key={advisor.id} className="flex-none w-72 snap-start">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={advisor?.profile_image || DEFAULT_PROFILE_IMAGE}
                    alt={advisor?.name ?? 'Advisor profile'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">
                  {advisor?.name ?? 'Unnamed Advisor'}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {advisor?.title ?? 'No title provided'}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {(advisor?.tags ?? []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/advisor/${advisor.route}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => setSelectedAdvisor(advisor)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Consult
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedAdvisor && (
        <Chat advisor={selectedAdvisor} onClose={() => setSelectedAdvisor(null)} />
      )}
    </div>
  );
}