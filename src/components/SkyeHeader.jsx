import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Heart } from 'lucide-react';

export default function SkyeHeader({ details }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(`${details.date}T${details.time.split(' ')[0] || '16:00'}:00`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [details.date, details.time]);

  return (
    <header 
      className="relative py-14 px-4 text-center overflow-hidden rounded-b-[48px] shadow-2xl border-b-4 border-pink-300 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/skye_header_sky_bg.png')" }}
    >
      {/* Soft Sky Light Gradient Overlay for Smooth Transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70 z-0 pointer-events-none" />

      {/* Dynamic Flying Skye Characters Over the Magical Sky */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        
        {/* Flying Skye Right */}
        <div className="absolute -right-4 sm:right-6 top-2 w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] animate-cloud-drift">
          <img
            src="/assets/skye_flying_transparent.png"
            alt="Skye PAW Patrol Volando en el Cielo Mágico"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(214,51,132,0.35)]"
          />
        </div>

        {/* Flying Skye Left Duplicate */}
        <div className="absolute -left-8 sm:left-4 bottom-4 w-[220px] sm:w-[340px] h-[220px] sm:h-[340px] animate-float">
          <img
            src="/assets/skye_flying_transparent.png"
            alt="Skye Volando entre Nubes"
            className="w-full h-full object-contain transform -scale-x-100 filter drop-shadow-[0_10px_20px_rgba(79,195,247,0.35)]"
          />
        </div>

      </div>

      {/* Main Content Layer (Crisp Floating Glass Cards over the Sky) */}
      <div className="max-w-3xl mx-auto relative z-20">
        
        {/* Skye PAW Badge Shield Header */}
        <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border-2 border-pink-300 text-pink-600 font-bold mb-4 animate-bounce-slow">
          <img src="/assets/skye_badge.png" alt="Placa Skye" className="w-8 h-8 object-contain" />
          <span className="font-heading text-sm sm:text-base">¡Misión: Celebrar los 2 añitos!</span>
          <span className="text-xl">🌸</span>
        </div>

        {/* Big Stylized Number 2 & Child Name */}
        <div className="my-3">
          <div className="relative inline-block mb-1">
            <div className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 font-heading drop-shadow-xl">
              2
            </div>
            <div className="absolute -top-2 -right-8 bg-pink-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white transform rotate-12">
              ¡Añitos!
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-pink-600 mb-2 tracking-wide font-heading drop-shadow-md">
            ¡{details.childName}!
          </h1>
        </div>

        {/* Hero Quote in Glass Pill */}
        <div className="inline-block bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border-2 border-pink-200 mb-6 max-w-xl mx-auto">
          <p className="text-lg sm:text-xl font-bold text-sky-600 italic font-heading">
            "{details.heroQuote || '¡Este cachorro va a volar a sus 2 añitos!'}"
          </p>
        </div>

        {/* Countdown Timer Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-3 border-pink-200 max-w-lg mx-auto">
          <p className="text-xs font-extrabold text-pink-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2 font-heading">
            <Clock className="w-4 h-4 text-pink-500" />
            Contador de Misión para la Fiesta
          </p>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gradient-to-b from-pink-50 to-pink-100 p-3 rounded-2xl border border-pink-200 shadow-sm">
              <span className="block text-2xl sm:text-3xl font-extrabold text-pink-600 font-heading">{timeLeft.days}</span>
              <span className="text-xs font-bold text-gray-600">Días</span>
            </div>
            <div className="bg-gradient-to-b from-sky-50 to-sky-100 p-3 rounded-2xl border border-sky-200 shadow-sm">
              <span className="block text-2xl sm:text-3xl font-extrabold text-sky-600 font-heading">{timeLeft.hours}</span>
              <span className="text-xs font-bold text-gray-600">Horas</span>
            </div>
            <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-3 rounded-2xl border border-amber-200 shadow-sm">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-600 font-heading">{timeLeft.minutes}</span>
              <span className="text-xs font-bold text-gray-600">Min.</span>
            </div>
            <div className="bg-gradient-to-b from-rose-50 to-rose-100 p-3 rounded-2xl border border-rose-200 shadow-sm">
              <span className="block text-2xl sm:text-3xl font-extrabold text-rose-600 font-heading">{timeLeft.seconds}</span>
              <span className="text-xs font-bold text-gray-600">Seg.</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
