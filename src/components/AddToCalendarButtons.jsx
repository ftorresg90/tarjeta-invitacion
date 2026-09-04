import React from 'react';
import { Calendar, Monitor, Smartphone, Download } from 'lucide-react';
import { getGoogleCalendarUrl, getOutlookWebUrl, downloadIcsFile } from '../utils/calendarUtils';

export default function AddToCalendarButtons({ eventDetails, className = "" }) {
  if (!eventDetails) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm font-bold text-gray-600 mb-2 font-heading">
        Agendar en tu Calendario:
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
        <a
          href={getGoogleCalendarUrl(eventDetails)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-pink-200 text-pink-600 rounded-xl hover:bg-pink-50 hover:border-pink-400 transition-colors font-semibold text-sm shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar</span>
        </a>
        
        <button
          type="button"
          onClick={() => downloadIcsFile(eventDetails)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-sky-200 text-sky-600 rounded-xl hover:bg-sky-50 hover:border-sky-400 transition-colors font-semibold text-sm shadow-sm"
        >
          <Smartphone className="w-4 h-4" />
          <span>Apple / iCal</span>
        </button>

        <a
          href={getOutlookWebUrl(eventDetails)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-amber-200 text-amber-600 rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-colors font-semibold text-sm shadow-sm"
        >
          <Monitor className="w-4 h-4" />
          <span>Outlook Web</span>
        </a>
      </div>
    </div>
  );
}
