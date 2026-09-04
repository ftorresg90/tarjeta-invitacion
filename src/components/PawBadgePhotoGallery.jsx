import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Heart, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PawBadgePhotoGallery({ photos, childName }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const scrollRef = useRef(null);

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    if (activeIndex === null) return;
    
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, photos?.length]);

  if (!photos || photos.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 relative">
      <div className="text-center mb-6 sm:mb-8">
        <div className="paw-badge mb-2">
          <span>🐾 Galería de Recuerdos 🐾</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 font-heading">
          Los 2 Añitos de {childName} en Fotos
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm font-medium mt-1 px-2">
          ¡Acompaña a nuestra pequeña aviadora en sus momentos más lindos! (Toca la foto para ampliarla)
        </p>
      </div>

      {/* Native Swipe Carousel */}
      <div className="relative w-full mx-auto group/carousel">
        
        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border-2 border-pink-300 rounded-full items-center justify-center text-pink-500 hover:bg-pink-50 hover:scale-110 transition-transform shadow-xl opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
            >
              <ChevronLeft className="w-8 h-8 -ml-1" />
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border-2 border-pink-300 rounded-full items-center justify-center text-pink-500 hover:bg-pink-50 hover:scale-110 transition-transform shadow-xl opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
            >
              <ChevronRight className="w-8 h-8 ml-1" />
            </button>
          </>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-6 px-3 sm:px-[5%] pb-6 pt-3 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth"
        >
          {photos.map((photo, index) => (
            <div 
              key={photo.id || index}
              className="shrink-0 w-[85%] sm:w-[50%] md:w-[40%] lg:w-[35%] snap-center relative cursor-pointer group"
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative p-2.5 sm:p-3 bg-gradient-to-b from-pink-400 via-rose-300 to-amber-300 rounded-[28px] sm:rounded-[35px] shadow-xl border-3 sm:border-4 border-white transition-all duration-300 hover:-translate-y-2">
                
                {/* Top Badge Icon */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white font-extrabold text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 rounded-full border-2 border-white shadow-md flex items-center gap-1 z-10">
                  <span>🐾</span>
                  <span>PAW PHOTO</span>
                </div>

                {/* Photo Image Container */}
                <div className="overflow-hidden rounded-[22px] sm:rounded-[26px] aspect-square relative bg-pink-50">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Foto de ${childName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/40 text-xs sm:text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg">
                      <Camera className="w-4 h-4" /> Toca para ampliar
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="text-center pt-2 pb-1 px-2 sm:px-4">
                  <p className="text-sm sm:text-base font-bold text-white drop-shadow font-heading truncate">
                    {photo.caption || `Recuerdo #${index + 1}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Zoom Rendered via Portal to document.body (z-[99999] Top Level) */}
      {activeIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn h-[100dvh] w-screen overflow-hidden"
          onClick={() => setActiveIndex(null)}
        >
          {/* Modal Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => prev > 0 ? prev - 1 : photos.length - 1); }}
                className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur transition-all z-[100000]"
                title="Anterior (Flecha Izquierda)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(prev => prev < photos.length - 1 ? prev + 1 : 0); }}
                className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-16 sm:h-16 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur transition-all z-[100000]"
                title="Siguiente (Flecha Derecha)"
              >
                <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl p-3 sm:p-6 shadow-2xl border-4 border-pink-300 animate-glow mx-8 sm:mx-24 max-h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white font-bold transition-transform hover:scale-110 z-50"
              title="Cerrar foto (Esc)"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            <div className="rounded-2xl overflow-hidden mb-3 bg-gray-100 border-2 border-pink-100 flex items-center justify-center min-h-[30vh] max-h-[65vh]">
              <img
                src={photos[activeIndex].url}
                alt={photos[activeIndex].caption}
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <p className="text-center font-bold text-pink-600 text-base sm:text-2xl font-heading truncate px-2">
              {photos[activeIndex].caption || `Foto de ${childName}`}
            </p>
            <p className="text-center text-pink-400 font-medium text-xs sm:text-sm mt-0.5">
              Foto {activeIndex + 1} de {photos.length}
            </p>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
