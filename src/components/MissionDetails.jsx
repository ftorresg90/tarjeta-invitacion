import React from 'react';
import { Calendar, Clock, MapPin, Navigation, Shirt, Sparkles } from 'lucide-react';

export default function MissionDetails({ details }) {
  // Format readable date in Spanish
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(`${dateString}T00:00:00`);
      return date.toLocaleDateString('es-CL', options);
    } catch {
      return dateString;
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
      
      <div className="text-center mb-6 sm:mb-8">
        <div className="paw-badge mb-2">
          <img src="/assets/skye_badge.jpg" alt="Skye" className="w-5 h-5 object-contain inline-block mr-1" />
          <span>🐾 Datos de la Misión 🐾</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 font-heading">
          ¿Cuándo y Dónde Volaremos?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Date & Time Card */}
        <div className="skye-card hover:border-pink-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-500 shadow-md shrink-0">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-pink-400">Día Especial</span>
                <h3 className="text-base sm:text-xl font-bold text-gray-800 capitalize font-heading leading-snug">
                  {formatDate(details.date)}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-pink-100 mb-2">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-500 shadow-md shrink-0">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                <div>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-500 block">Hora de Inicio</span>
                  <h3 className="text-base sm:text-xl font-bold text-gray-800 font-heading">
                    {details.time}
                  </h3>
                </div>
                {details.endTime && (
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-500 block">Hora de Término</span>
                    <h3 className="text-base sm:text-xl font-bold text-gray-800 font-heading">
                      {details.endTime}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map Card */}
        <div className="skye-card hover:border-sky-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-500 shadow-md shrink-0">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-sky-500">Base de Operaciones</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 font-heading leading-snug">
                  {details.locationName}
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-4 pl-1">
              📍 {details.address}
            </p>
          </div>

          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-skye-secondary w-full py-2.5 sm:py-3 text-xs sm:text-base text-center flex items-center justify-center gap-2 mt-auto"
          >
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Abrir en Google Maps / Waze</span>
          </a>
        </div>

      </div>

      {/* Dress Code & Special Instructions */}
      <div className="mt-4 sm:mt-6 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 p-[3px] rounded-3xl shadow-lg">
        <div className="bg-white rounded-[23px] p-4 sm:p-6 text-center">
          <div className="inline-flex items-center gap-2 text-pink-600 font-bold mb-1.5 sm:mb-2">
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="font-heading text-base sm:text-lg">Código de Vestimenta & Consejos</span>
          </div>
          <p className="text-gray-700 font-medium text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {details.dressCode}
          </p>
        </div>
      </div>

    </section>
  );
}
