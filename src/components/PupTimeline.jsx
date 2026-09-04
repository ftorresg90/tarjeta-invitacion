import React from 'react';
import { Star, Music, Gift, Sparkles, Cake } from 'lucide-react';

export default function PupTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  const getIcon = (index) => {
    switch (index % 4) {
      case 0: return <Sparkles className="w-5 h-5 text-pink-500" />;
      case 1: return <Music className="w-5 h-5 text-amber-500" />;
      case 2: return <Cake className="w-5 h-5 text-sky-500" />;
      case 3: return <Gift className="w-5 h-5 text-rose-500" />;
      default: return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      <div className="text-center mb-8">
        <div className="paw-badge mb-2">
          <span>🐾 Cronograma de la Fiesta 🐾</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 font-heading">
          Itinerario del Día
        </h2>
      </div>

      <div className="relative border-l-4 border-pink-200 ml-4 sm:ml-32 space-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="relative pl-6 sm:pl-8 group">
            
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[23px] top-1.5 w-10 h-10 bg-white border-3 border-pink-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              {getIcon(index)}
            </div>

            {/* Time Pill Badge */}
            <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-xs px-3 py-1 rounded-full mb-2 shadow-sm font-heading">
              {item.time}
            </div>

            {/* Content Box */}
            <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border-2 border-pink-100 shadow-md group-hover:border-pink-300 transition-all">
              <h3 className="text-lg font-bold text-gray-800 font-heading">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm font-medium mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
