/**
 * Calendar Utilities for Google Calendar, Outlook Web, and Apple/iCal .ics files
 */

export function parseEventDates(dateStr, timeStr, endTimeStr) {
  let startHour = 16;
  let startMinute = 0;

  if (timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      startHour = parseInt(match[1], 10);
      startMinute = parseInt(match[2], 10);
    }
  }

  let endHour = startHour + 4; // 4 hours duration by default
  let endMinute = startMinute;

  if (endTimeStr) {
    const endMatch = endTimeStr.match(/(\d{1,2}):(\d{2})/);
    if (endMatch) {
      endHour = parseInt(endMatch[1], 10);
      endMinute = parseInt(endMatch[2], 10);
    }
  }

  const [yearStr, monthStr, dayStr] = (dateStr || '2026-10-18').split('-');
  const year = parseInt(yearStr || '2026', 10);
  const month = parseInt(monthStr || '10', 10) - 1; // 0-indexed
  const day = parseInt(dayStr || '18', 10);

  const startDate = new Date(year, month, day, startHour, startMinute);
  const endDate = new Date(year, month, day, endHour, endMinute);

  const formatIsoForCal = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  return {
    startIso: formatIsoForCal(startDate),
    endIso: formatIsoForCal(endDate),
    startDate,
    endDate
  };
}

export function getGoogleCalendarUrl(details = {}) {
  const { startIso, endIso } = parseEventDates(details.date, details.time, details.endTime);
  const childName = details.childName || 'Emma';
  const age = details.age || 2;
  const title = `Cumpleaños ${age} Añitos de ${childName} 🐾`;
  const description = `${details.welcomeMessage || '¡Acompaña a nuestra cachorrita aventurera a celebrar sus 2 añitos!'}\n\nCódigo de vestimenta: ${details.dressCode || '¡Listos para jugar!'}\n\n¡A volar se ha dicho!`;
  const location = `${details.locationName || 'Base de Operaciones'}, ${details.address || ''}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: description,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookWebUrl(details = {}) {
  const { startDate, endDate } = parseEventDates(details.date, details.time, details.endTime);
  const childName = details.childName || 'Emma';
  const age = details.age || 2;
  const title = `Cumpleaños ${age} Añitos de ${childName} 🐾`;
  const description = `${details.welcomeMessage || ''}\n\nCódigo de vestimenta: ${details.dressCode || ''}\n\n¡A volar se ha dicho!`;
  const location = `${details.locationName || ''}, ${details.address || ''}`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: description,
    location: location
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadIcsFile(details = {}) {
  const { startIso, endIso } = parseEventDates(details.date, details.time, details.endTime);
  const childName = details.childName || 'Emma';
  const age = details.age || 2;
  const title = `Cumpleaños ${age} Añitos de ${childName} 🐾`;
  const description = `${details.welcomeMessage || ''} - Vestimenta: ${details.dressCode || ''}`;
  const location = `${details.locationName || ''}, ${details.address || ''}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skye Birthday Invitation//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `cumpleanos_${childName.toLowerCase()}_skye.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
