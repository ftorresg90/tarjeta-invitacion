import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function SkyeLoadingScreen({ childName, onFinished }) {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress bar fill up
    const timer1 = setTimeout(() => setProgress(55), 300);
    const timer2 = setTimeout(() => setProgress(90), 800);
    const timer3 = setTimeout(() => setProgress(100), 1200);

    // Fade out and finish callback
    const timerFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 1400);

    const timerFinish = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFade);
      clearTimeout(timerFinish);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 transition-all duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #FF69B4 0%, #E83E8C 40%, #4FC3F7 100%)' }}
    >
      {/* Floating Magic Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-10 text-white/40 text-4xl animate-bounce-slow">🐾</div>
        <div className="absolute top-1/4 right-10 text-white/50 text-3xl animate-float">✨</div>
        <div className="absolute bottom-20 left-12 text-white/40 text-5xl animate-float" style={{ animationDelay: '1s' }}>🐾</div>
        <div className="absolute bottom-16 right-16 text-white/50 text-4xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🎈</div>
        <div className="absolute top-1/3 left-1/4 text-white/30 text-2xl animate-float" style={{ animationDelay: '2s' }}>💖</div>
      </div>

      {/* Skye Flying Hero Illustration with Motion */}
      <div className="relative w-48 sm:w-64 h-48 sm:h-64 mb-4 animate-float flex items-center justify-center">
        <img
          src="/assets/skye_flying_transparent.png"
          alt="Skye PAW Patrol Despegando"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
        />
        
        {/* Glow Ring Behind Skye */}
        <div className="absolute inset-4 rounded-full border-4 border-amber-300/40 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
      </div>

      {/* Main Text Card */}
      <div className="text-center text-white max-w-sm px-4">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 text-amber-200 font-bold text-xs sm:text-sm mb-3 shadow-md">
          <Sparkles className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '3s' }} />
          <span>¡Misión Especial Despegando!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2 drop-shadow-md">
          ¡Cargando los 2 Añitos de {childName}!
        </h2>

        <p className="text-white/90 text-xs sm:text-sm font-medium mb-5 drop-shadow">
          ¡A volar se ha dicho! Preparando la fiesta de la Patrulla Canina... 🐶💖
        </p>

        {/* Progress Bar Container */}
        <div className="w-60 sm:w-72 h-4 bg-black/20 backdrop-blur rounded-full border-2 border-white/80 p-0.5 shadow-inner mx-auto overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 via-pink-300 to-white transition-all duration-500 ease-out shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-white/80 text-[11px] font-bold mt-2">
          <span>{progress}%</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span>Listos para el despegue</span>
            <Heart className="w-3 h-3 text-pink-200 fill-current animate-pulse" />
          </span>
        </div>
      </div>
    </div>
  );
}
