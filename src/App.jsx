import React, { useState } from 'react';
import { getEventDetails } from './services/storageService';
import SkyeEnvelope from './components/SkyeEnvelope';
import SkyeHeader from './components/SkyeHeader';
import MissionDetails from './components/MissionDetails';
import PawBadgePhotoGallery from './components/PawBadgePhotoGallery';
import PupTimeline from './components/PupTimeline';
import RsvpSkyeForm from './components/RsvpSkyeForm';
import AdminDashboard from './components/admin/AdminDashboard';
import { ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';

export default function App() {
  const [eventDetails, setEventDetails] = useState(getEventDetails());
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleEventDetailsUpdated = (newDetails) => {
    setEventDetails(newDetails);
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
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Main Public Invitation */}
      {isEnvelopeOpen && (
        <>
          {/* Top Quick Bar */}
          <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-200 shadow-sm px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐶</span>
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

              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold flex items-center gap-1 transition-colors"
                title="Acceso Anfitrión"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline">Panel Anfitrión</span>
              </button>
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
              <button
                onClick={() => setIsAdminOpen(true)}
                className="mt-3 text-xs text-pink-500 hover:underline font-semibold"
              >
                ¿Eres el anfitrión? Haz clic aquí para ver la lista de asistentes (PIN: 1234)
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onEventDetailsUpdated={handleEventDetailsUpdated}
      />

    </div>
  );
}
