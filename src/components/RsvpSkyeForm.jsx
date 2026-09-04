import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, CheckCircle2, XCircle, Users, Baby, Utensils, Music, MessageCircle } from 'lucide-react';
import { saveRSVP } from '../services/storageService';
import AddToCalendarButtons from './AddToCalendarButtons';

export default function RsvpSkyeForm({ childName, eventDetails, onRsvpSubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    status: 'confirmed',
    adultsCount: 1,
    kidsCount: 1,
    dietary: '',
    songRequest: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    const saved = saveRSVP(formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger Skye Pink & Gold Confetti Burst if confirmed
      if (formData.status === 'confirmed') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#D63384', '#FFB703', '#4FC3F7', '#FFFFFF']
        });
      }

      if (onRsvpSubmitted) {
        onRsvpSubmitted(saved);
      }
    }, 600);
  };

  return (
    <section id="rsvp" className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-12 relative z-10">
      
      <div className="skye-card border-4 border-pink-300 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 p-4 sm:p-6 text-center text-white mb-4 sm:mb-6">
          <div className="paw-badge mb-2 bg-white/20 border-white text-white">
            <span>🐾 Confirmación de Asistencia (RSVP) 🐾</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading drop-shadow">
            ¡Misión: Confirmar Asistencia!
          </h2>
          <p className="text-white/90 text-xs sm:text-sm font-medium mt-1">
            Por favor confirma antes para organizar la comida, sorpresa y juegos de los cachorritos.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 sm:py-8 text-center animate-glow">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 border-4 border-green-400 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-600 font-heading mb-2">
              ¡Respuesta Registrada con Éxito! 🎉
            </h3>
            
            <p className="text-gray-700 font-medium text-base sm:text-lg mb-6 max-w-md mx-auto px-2">
              Muchas gracias {formData.name}. {formData.status === 'confirmed' ? `¡Los esperamos con mucha emoción para celebrar los 2 añitos de ${childName}!` : `Lamentamos que no puedas asistir, ¡te enviaremos fotos!` }
            </p>

            {formData.status === 'confirmed' && (
              <>
                <div className="max-w-md mx-auto mb-6 p-3.5 sm:p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-sm text-center">
                  <h4 className="text-amber-700 font-bold font-heading mb-1 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                    🎁 Una pequeña nota sobre los regalitos
                  </h4>
                  <p className="text-amber-700/90 text-[11px] sm:text-xs font-medium leading-relaxed">
                    Si deseas sorprender a {childName} con un detallito, te pedimos con mucho cariño evitar regalos voluminosos (ya no tenemos mucho espacio en casa) y también evitar peluches (es un poquito alérgica). ¡Tu compañía es nuestro mejor regalo!
                  </p>
                </div>

                <div className="max-w-xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-pink-50/50 rounded-2xl border-2 border-pink-100">
                  <AddToCalendarButtons eventDetails={eventDetails} />
                </div>
              </>
            )}

            <button
              onClick={() => setSubmitted(false)}
              className="btn-skye-secondary text-xs sm:text-sm"
            >
              Modificar o enviar otra respuesta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Guest Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 font-heading">
                  Nombre Completo / Familia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Familia Torres o Tía Macarena"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none font-medium text-gray-800 text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 font-heading">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none font-medium text-gray-800 text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Attendance Status Buttons */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 font-heading">
                ¿Asistirás a la celebración? *
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'confirmed' })}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center gap-1.5 sm:gap-2 font-bold transition-all ${
                    formData.status === 'confirmed'
                      ? 'bg-pink-500 text-white border-pink-600 shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="font-heading text-xs sm:text-base">¡Sí, ahí estaré! 💖</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'declined' })}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center gap-1.5 sm:gap-2 font-bold transition-all ${
                    formData.status === 'declined'
                      ? 'bg-gray-700 text-white border-gray-900 shadow-lg scale-[1.02]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="font-heading text-xs sm:text-base">No podré asistir 😢</span>
                </button>
              </div>
            </div>

            {/* Optional Details (Only Shown if Status is Confirmed) */}
            {formData.status === 'confirmed' && (
              <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                
                {/* Adults & Kids Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 sm:p-4 bg-pink-50/80 rounded-2xl border-2 border-pink-200">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-pink-600 mb-1 flex items-center gap-1 font-heading">
                      <Users className="w-4 h-4" /> Número de Adultos
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, adultsCount: Math.max(1, formData.adultsCount - 1) })}
                        className="w-10 h-10 rounded-full bg-pink-200 text-pink-700 font-bold text-xl flex items-center justify-center hover:bg-pink-300"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold font-heading text-pink-600 min-w-[2rem] text-center">
                        {formData.adultsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, adultsCount: formData.adultsCount + 1 })}
                        className="w-10 h-10 rounded-full bg-pink-200 text-pink-700 font-bold text-xl flex items-center justify-center hover:bg-pink-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-sky-600 mb-1 flex items-center gap-1 font-heading">
                      <Baby className="w-4 h-4" /> Número de Niños/Cachorritos
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, kidsCount: Math.max(0, formData.kidsCount - 1) })}
                        className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 font-bold text-xl flex items-center justify-center hover:bg-sky-300"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold font-heading text-sky-600 min-w-[2rem] text-center">
                        {formData.kidsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, kidsCount: formData.kidsCount + 1 })}
                        className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 font-bold text-xl flex items-center justify-center hover:bg-sky-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 flex items-center gap-1 font-heading">
                    <Utensils className="w-4 h-4 text-pink-500 shrink-0" /> Alergias o dietas especiales (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Niña celíaca, opción vegetariana, etc."
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none font-medium text-gray-800 text-base sm:text-sm"
                  />
                </div>

                {/* DJ Song Request */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 flex items-center gap-1 font-heading">
                    <Music className="w-4 h-4 text-amber-500 shrink-0" /> Canción favorita para bailar en la fiesta (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Paw Patrol Theme, La Vaca Lola, Baby Shark..."
                    value={formData.songRequest}
                    onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none font-medium text-gray-800 text-base sm:text-sm"
                  />
                </div>

                {/* Congratulation Message */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1 flex items-center gap-1 font-heading">
                    <MessageCircle className="w-4 h-4 text-rose-500 shrink-0" /> Mensajito especial para {childName} (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escribe aquí unas bellas palabras para la cumpleañera..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none font-medium text-gray-800 text-base sm:text-sm"
                  />
                </div>

              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-skye-primary py-3.5 sm:py-4 text-lg sm:text-xl flex items-center justify-center gap-2 shadow-xl"
            >
              {isSubmitting ? (
                <span>Enviando respuesta...</span>
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Enviar Confirmación 🚀</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </section>
  );
}
