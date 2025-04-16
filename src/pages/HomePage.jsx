import React, { memo } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import MarqueeSlider from '../components/home/MarqueeSlider';
import EventsSlider from '../components/home/EventsSlider';
import RecentStreams from '../components/home/RecentStreams';
import FeaturedSection from '../components/home/FeaturedSection';
import VisitUsSection from '../components/home/VisitUsSection';
import useBanners from '../hooks/useBanner';

/**
 * HomePage Component
 * Manages all sections of the home page, including data fetching
 */
const HomePage = () => {
  // Fetch banners for hero slider
  const { 
    banners, 
    isLoading: bannersLoading, 
    error: bannersError 
  } = useBanners({
    page: 1,
    platform: 'EL',
    status: 'active',
    current: true,
    orderBy: 'display_order',
    orderDir: 'asc'
  });

  return (
    <div className="w-full">
      {/* Hero section - Full width and full height */}
      <div className="w-full relative h-screen bg-white">
        <HeroSlider 
          banners={banners} 
          isLoading={bannersLoading} 
          error={bannersError} 
        />
      </div>
      
      {/* CTA Section - Full width white background */}
      <div className="w-full bg-white py-16 cta-area style-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="section-title">
            <div className="sec-content">
              <p className="title text-gray-800
                text-4xl leading-tight tracking-tighter
                sm:text-5xl sm:leading-snug
                md:text-5xl md:leading-relaxed
                lg:text-6xl lg:leading-tight lg:tracking-tight
                xl:text-center 2xl:text-center">
                Our Mission is to provide you with the Tools for the activation and free expression of your innate potentials for the realization of your inner peace. Simple, We are the restorers of PEACE.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other sections */}
      <MarqueeSlider />
      <FeaturedSection />
      
      {/* EventsSlider now uses the API endpoint */}
      <EventsSlider />
      
      <RecentStreams />
      <VisitUsSection />
    </div>
  );
};

export default memo(HomePage);