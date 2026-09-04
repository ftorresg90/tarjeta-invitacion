import React, { useState } from 'react';
import { getEventDetails } from './services/storageService';
import SkyeEnvelope from './components/SkyeEnvelope';
import SkyeLoadingScreen from './components/SkyeLoadingScreen';
import SkyeHeader from './components/SkyeHeader';
import MissionDetails from './components/MissionDetails';
import PawBadgePhotoGallery from './components/PawBadgePhotoGallery';
import PupTimeline from './components/PupTimeline';
import RsvpSkyeForm from './components/RsvpSkyeForm';
import AdminDashboard from './components/admin/AdminDashboard';
import { Heart } from 'lucide-react';

export default function App() {
  const [eventDetails, setEventDetails] = useState(getEventDetails());
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleEventDetailsUpdated = (newDetails) => {
    setEventDetails(newDetails);
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    setIsLoading(true);
  };

  // Secret triple-click on the dog emoji to open admin panel
  const handleDogClick = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen relative pb-20">
      
      {/* Animated Sky Pattern Background */}
      <div className="bg-sky-pattern" />

      {/* Landing Envelope */}
      {!isEnvelopeOpen && (
        <SkyeEnvelope
          childName={eventDetails.childName}
          age={eventDetails.age}
          heroImage={eventDetails.heroImage}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Skye PAW Patrol Loading Transition Screen */}
      {isLoading && (
        <SkyeLoadingScreen
          childName={eventDetails.childName}
          onFinished={() => setIsLoading(false)}
        />
      )}

      {/* Main Public Invitation (Pre-rendered in DOM so images and styles are 100% ready behind loading screen) */}
      <div className={!isEnvelopeOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}>
        {/* Top Quick Bar */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-200 shadow-sm px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Triple-click secret to open admin */}
            <span
              className="text-xl cursor-default select-none"
              onClick={handleDogClick}
              title=""
            >🐶</span>
            <span className="font-heading font-bold text-pink-600 text-sm hidden sm:inline">
              {eventDetails.childName} Cumple {eventDetails.age} Añitos
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#rsvp"
              className="btn-skye-primary py-1.5 px-3 text-xs sm:text-sm gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Confirmar Asistencia</span>
            </a>
          </div>
        </nav>

        {/* Hero & Countdown */}
        <SkyeHeader details={eventDetails} />

        {/* Event Venue & Date Details */}
        <MissionDetails details={eventDetails} />

        {/* Photo Gallery with Paw Badges */}
        <PawBadgePhotoGallery photos={eventDetails.photos} childName={eventDetails.childName} />

        {/* Rescue Mission Timeline */}
        <PupTimeline timeline={eventDetails.timeline} />

        {/* RSVP Form */}
        <RsvpSkyeForm childName={eventDetails.childName} eventDetails={eventDetails} />

        {/* Footer */}
        <footer className="text-center py-8 px-4 text-gray-500 text-sm font-medium border-t border-pink-200 bg-white/60 backdrop-blur-sm mt-12">
          <div className="max-w-md mx-auto">
            <p className="flex items-center justify-center gap-1 text-pink-600 font-bold font-heading text-base mb-1">
              <span>🐾 ¡A volar se ha dicho! 🐾</span>
            </p>
            <p className="text-xs text-gray-500">
              Invitación Digital creada con mucho amor para la celebración de {eventDetails.childName}.
            </p>
          </div>
        </footer>
      </div>

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onEventDetailsUpdated={handleEventDetailsUpdated}
      />

    </div>
  );
}
