// Cloud Storage Service for Firebase Realtime Database / Supabase REST API
// Allows real-time synchronization between Computer, Mobile devices, and Guest RSVPs.

const DEFAULT_FIREBASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL || '';

/**
 * Fetch latest Event Details from Cloud Database
 */
export async function fetchEventDetailsFromCloud(firebaseUrl = DEFAULT_FIREBASE_URL) {
  if (!firebaseUrl) return null;
  try {
    const cleanUrl = firebaseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/eventDetails.json`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Cloud Fetch Event Details notice:', error);
    return null;
  }
}

/**
 * Save Event Details to Cloud Database
 */
export async function saveEventDetailsToCloud(details, firebaseUrl = DEFAULT_FIREBASE_URL) {
  if (!firebaseUrl) return false;
  try {
    const cleanUrl = firebaseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/eventDetails.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return response.ok;
  } catch (error) {
    console.error('Cloud Save Event Details error:', error);
    return false;
  }
}

/**
 * Fetch all Guest RSVPs from Cloud Database
 */
export async function fetchRSVPsFromCloud(firebaseUrl = DEFAULT_FIREBASE_URL) {
  if (!firebaseUrl) return null;
  try {
    const cleanUrl = firebaseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/rsvps.json`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data) return [];
    // Convert object or array format to array
    if (Array.isArray(data)) return data;
    return Object.keys(data).map(key => ({ ...data[key], cloudId: key }));
  } catch (error) {
    console.warn('Cloud Fetch RSVPs notice:', error);
    return null;
  }
}

/**
 * Save new Guest RSVP to Cloud Database
 */
export async function saveRSVPToCloud(rsvpData, firebaseUrl = DEFAULT_FIREBASE_URL) {
  if (!firebaseUrl) return false;
  try {
    const cleanUrl = firebaseUrl.replace(/\/$/, '');
    const response = await fetch(`${cleanUrl}/rsvps.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    });
    return response.ok;
  } catch (error) {
    console.error('Cloud Save RSVP error:', error);
    return false;
  }
}
