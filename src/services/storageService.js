const EVENT_STORAGE_KEY = 'skye_birthday_event_details_v1';
const RSVP_STORAGE_KEY = 'skye_birthday_rsvps_v1';

const defaultEventDetails = {
  childName: 'Emma',
  age: 2,
  theme: 'Skye (PAW Patrol)',
  date: '2026-10-18',
  time: '16:00 HRS',
  endTime: '20:00 HRS',
  locationName: "Base de Operaciones (Salón Mágico de Fiestas)",
  address: "Av. Las Flores #1234, Providencia",
  googleMapsUrl: "https://maps.google.com/?q=Salón+de+Fiestas",
  dressCode: "¡Listos para volar! (Ropa muy cómoda para jugar)",
  adminPin: "1234",
  welcomeMessage: "¡Hola! Acompaña a nuestra cachorrita aventurera a celebrar sus 2 añitos en una tarde llena de juegos, risas y sorpresas.",
  heroImage: '',
  heroQuote: "¡Este cachorro va a volar a sus 2 añitos!",
  photos: [
    { id: 1, url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop', caption: 'Sonrisas de 1 añito' },
    { id: 2, url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop', caption: 'Lista para la aventura' },
    { id: 3, url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop', caption: '¡Creciendo muy rápido!' }
  ],
  timeline: [
    { time: '16:00', title: 'Llegada de la Patrulla', description: 'Bienvenida a la Base de Operaciones, globos y recepción.' },
    { time: '17:00', title: '¡Misión Juegos & Show!', description: 'Actividades divertidas, pintacaras y juegos voladores con Skye.' },
    { time: '18:30', title: 'Cantar el Cumpleaños', description: 'Momento de soplar las 2 velitas y compartir el delicioso pastel.' },
    { time: '19:30', title: 'Sorpresitas y Despedida', description: 'Entrega de recuerdos y bolsitas de patrulla canina.' }
  ]
};

const defaultRSVPs = [
  {
    id: '1',
    name: 'Tía Carolina y Familia',
    phone: '+56912345678',
    status: 'confirmed',
    adultsCount: 2,
    kidsCount: 2,
    dietary: 'Un niño con alergia al maní',
    songRequest: 'Canción de Paw Patrol Remix',
    message: '¡Felices 2 añitos a la muñeca más linda! Ya queremos darle su abrazo.',
    createdAt: '2026-09-01T14:20:00.000Z'
  },
  {
    id: '2',
    name: 'Tío Gonzalo',
    phone: '+56987654321',
    status: 'confirmed',
    adultsCount: 1,
    kidsCount: 0,
    dietary: 'Ninguna',
    songRequest: 'Baby Shark para bailar',
    message: '¡Ahí estaré con mi regalo volador!',
    createdAt: '2026-09-02T10:15:00.000Z'
  },
  {
    id: '3',
    name: 'Familia Ramírez',
    phone: '+56955554444',
    status: 'declined',
    adultsCount: 0,
    kidsCount: 0,
    dietary: '',
    songRequest: '',
    message: '¡Pásenlo increíble! Lamentablemente tenemos un viaje esa fecha.',
    createdAt: '2026-09-02T16:45:00.000Z'
  }
];

export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen válida'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

import {
  saveEventDetailsToCloud,
  fetchEventDetailsFromCloud,
  savePhotosToCloud,
  fetchPhotosFromCloud,
  saveRSVPToCloud,
  fetchRSVPsFromCloud,
  deleteRSVPFromCloud
} from './cloudStorage';

export const getEventDetails = () => {
  try {
    const data = localStorage.getItem(EVENT_STORAGE_KEY);
    if (!data) return defaultEventDetails;
    const parsed = JSON.parse(data);
    return {
      ...defaultEventDetails,
      ...parsed,
      photos: Array.isArray(parsed.photos) ? parsed.photos : defaultEventDetails.photos,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : defaultEventDetails.timeline
    };
  } catch (error) {
    console.error('Error fetching event details', error);
    return defaultEventDetails;
  }
};

export const saveEventDetails = (details) => {
  try {
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(details));
    // Asynchronously sync to cloud. Photos are pushed as their own (larger, slower)
    // request so a big gallery never delays syncing the PIN, date, address, etc.
    saveEventDetailsToCloud(details);
    savePhotosToCloud(details.photos);
    return true;
  } catch (error) {
    console.error('Error saving event details to localStorage', error);
    return false;
  }
};

export const getRSVPs = () => {
  try {
    const data = localStorage.getItem(RSVP_STORAGE_KEY);
    return data ? JSON.parse(data) : defaultRSVPs;
  } catch (error) {
    console.error('Error fetching RSVPs', error);
    return defaultRSVPs;
  }
};

export const saveRSVP = (rsvpData) => {
  try {
    const current = getRSVPs();
    const newRSVP = {
      ...rsvpData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [newRSVP, ...current];
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
    // Asynchronously sync to cloud, then remember the cloud key so we can delete it later
    saveRSVPToCloud(newRSVP).then((cloudId) => {
      if (!cloudId) return;
      const latest = getRSVPs().map((r) => (r.id === newRSVP.id ? { ...r, cloudId } : r));
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(latest));
    });
    return newRSVP;
  } catch (error) {
    console.error('Error saving RSVP', error);
    return null;
  }
};

/**
 * Synchronize local storage with Cloud Database
 */
export const syncWithCloud = async (onDetailsUpdated, onRSVPsUpdated) => {
  try {
    // Core fields (PIN, date, address, etc.) are small — sync these first so they're
    // never held up waiting on the photo gallery below.
    const cloudDetails = await fetchEventDetailsFromCloud();
    if (cloudDetails) {
      const merged = { ...getEventDetails(), ...cloudDetails };
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(merged));
      if (onDetailsUpdated) onDetailsUpdated(merged);
    }

    const cloudRSVPs = await fetchRSVPsFromCloud();
    if (cloudRSVPs && cloudRSVPs.length > 0) {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(cloudRSVPs));
      if (onRSVPsUpdated) onRSVPsUpdated(cloudRSVPs);
    }
  } catch (err) {
    console.warn('Sync with cloud notice:', err);
  }

  // Photo gallery can be large — fetch it separately so a slow connection never
  // blocks the core event details (and admin PIN) above from updating.
  try {
    const cloudPhotos = await fetchPhotosFromCloud();
    if (cloudPhotos && cloudPhotos.length > 0) {
      const merged = { ...getEventDetails(), photos: cloudPhotos };
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(merged));
      if (onDetailsUpdated) onDetailsUpdated(merged);
    }
  } catch (err) {
    console.warn('Sync photos with cloud notice:', err);
  }
};

export const deleteRSVP = (id) => {
  try {
    const current = getRSVPs();
    const target = current.find(r => r.id === id);
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
    // Asynchronously remove from cloud too, so it doesn't come back on the next sync
    if (target?.cloudId) {
      deleteRSVPFromCloud(target.cloudId);
    }
    return true;
  } catch (error) {
    console.error('Error deleting RSVP', error);
    return false;
  }
};

export const exportRSVPsToCSV = () => {
  const rsvps = getRSVPs();
  if (!rsvps || rsvps.length === 0) return;

  const headers = ['Nombre', 'Teléfono', 'Estado', 'Adultos', 'Niños', 'Dietas/Alergias', 'Canción Sugerida', 'Mensaje', 'Fecha Respuesta'];
  const rows = rsvps.map(r => [
    `"${r.name.replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    r.status === 'confirmed' ? 'Confirmado' : 'No asistirá',
    r.adultsCount || 0,
    r.kidsCount || 0,
    `"${(r.dietary || '').replace(/"/g, '""')}"`,
    `"${(r.songRequest || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    new Date(r.createdAt).toLocaleString('es-CL')
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `asistencia_cumpleanos_skye_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

