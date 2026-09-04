import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function SkyeEnvelope({ childName, age, heroImage, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ${isOpen ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
         style={{ background: 'linear-gradient(135deg, #FF69B4 0%, #D63384 50%, #4FC3F7 100%)' }}>
      
      {/* Floating Paw & Star Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-white/40 text-4xl animate-bounce-slow">🐾</div>
        <div className="absolute top-1/4 right-12 text-white/50 text-3xl animate-float">✨</div>
        <div className="absolute bottom-16 left-16 text-white/40 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🐾</div>
        <div className="absolute bottom-20 right-20 text-white/40 text-4xl animate-bounce-slow" style={{ animationDelay: '1s' }}>🎈</div>
      </div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 text-center shadow-2xl border-4 border-pink-200 animate-glow mx-2 sm:mx-0">
        
        {/* Hero Photo: Birthday girl or Skye */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-pink-400 to-amber-300 transform hover:scale-105 transition-transform">
          <img
            src={heroImage || '/assets/skye_birthday.png'}
            alt={heroImage ? `Foto de ${childName}` : 'Skye PAW Patrol'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="paw-badge mb-2 sm:mb-3 text-xs sm:text-sm">
          <span>🐾 ¡Misión Especial Skye! 🐾</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-pink-600 mb-2 font-heading tracking-wide leading-tight">
          ¡{childName} cumple {age} añitos!
        </h1>
        
        <p className="text-gray-600 text-xs sm:text-base mb-5 sm:mb-6 font-medium leading-relaxed">
          ¡A volar se ha dicho! Skye y la Patrulla Canina te invitan a una fiesta inolvidable.
        </p>

        {/* Envelope Touch Button */}
        <button
          onClick={handleOpen}
          className="w-full btn-skye-primary py-3.5 sm:py-4 text-base sm:text-xl flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-amber-200" style={{ animationDuration: '4s' }} />
          <span>Toca para abrir la invitación</span>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-200 fill-pink-300 group-hover:scale-125 transition-transform" />
        </button>

        <p className="text-[11px] sm:text-xs text-pink-400 mt-3 sm:mt-4 font-semibold">
          ✨ Toca para desvelar la fiesta de la patrulla ✨
        </p>
      </div>
    </div>
  );
}
