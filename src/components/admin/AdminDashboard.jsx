import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Lock, KeyRound, Download, Trash2, Edit3, Save, X, Search, Plus, Image, Upload,
  Users, Baby, CheckCircle2, XCircle, AlertCircle, Music, MapPin, Calendar, Clock, RefreshCw 
} from 'lucide-react';
import { getEventDetails, saveEventDetails, getRSVPs, deleteRSVP, exportRSVPsToCSV, compressImage } from '../../services/storageService';

// Toast component
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999999] animate-fadeIn`}>
      <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl border-2 backdrop-blur-md font-bold text-sm ${
        isSuccess
          ? 'bg-green-50/95 border-green-300 text-green-700'
          : 'bg-red-50/95 border-red-300 text-red-700'
      }`}>
        {isSuccess ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ isOpen, onClose, onEventDetailsUpdated }) {
  const [eventDetails, setEventDetails] = useState(getEventDetails());
  const [rsvps, setRsvps] = useState([]);
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs: 'list', 'settings', 'timeline', 'photos'
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit Event State
  const [editForm, setEditForm] = useState(getEventDetails());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const currentDetails = getEventDetails();
      setEventDetails(currentDetails);
      setEditForm(currentDetails);
      setRsvps(getRSVPs());
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === eventDetails.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setLoginError('');
      setRsvps(getRSVPs());
    } else {
      setLoginError('PIN incorrecto. Usa el PIN "1234".');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro de invitado?')) {
      deleteRSVP(id);
      setRsvps(getRSVPs());
    }
  };

  const showToast = useCallback((message, type = 'success') => {
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    if (type === 'success') {
      setSaveSuccessMsg(message);
    } else {
      setSaveErrorMsg(message);
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const success = saveEventDetails(editForm);
    if (success) {
      setEventDetails(editForm);
      if (onEventDetailsUpdated) {
        onEventDetailsUpdated(editForm);
      }
      showToast('¡Los cambios han sido guardados con éxito!', 'success');
    } else {
      showToast('No se pudieron guardar los cambios. Intenta optimizar o eliminar alguna imagen.', 'error');
    }
  };

  // Timeline helper functions
  const handleTimelineChange = (index, field, value) => {
    const updated = [...editForm.timeline];
    updated[index][field] = value;
    setEditForm({ ...editForm, timeline: updated });
  };

  const addTimelineItem = () => {
    const newItem = { time: '20:00', title: 'Nueva Actividad', description: 'Descripción de la actividad' };
    setEditForm({ ...editForm, timeline: [...(editForm.timeline || []), newItem] });
  };

  const removeTimelineItem = (index) => {
    const updated = editForm.timeline.filter((_, i) => i !== index);
    setEditForm({ ...editForm, timeline: updated });
  };

  // Photo gallery helper functions
  const handlePhotoChange = (index, field, value) => {
    const updated = [...editForm.photos];
    updated[index][field] = value;
    setEditForm({ ...editForm, photos: updated });
  };

  const addPhotoItem = () => {
    const newPhoto = { 
      id: Date.now(), 
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop', 
      caption: 'Nueva Foto de la Cumpleañera' 
    };
    setEditForm({ ...editForm, photos: [...(editForm.photos || []), newPhoto] });
  };

  const removePhotoItem = (index) => {
    const updated = editForm.photos.filter((_, i) => i !== index);
    setEditForm({ ...editForm, photos: updated });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file);
      handlePhotoChange(index, 'url', compressedUrl);
    } catch (err) {
      console.error('Error al cargar la foto', err);
      alert('No se pudo procesar la imagen. Intenta con otra imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewPhotoUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const compressedUrl = await compressImage(file);
      const newPhoto = {
        id: Date.now(),
        url: compressedUrl,
        caption: 'Foto de mi pequeña'
      };
      setEditForm(prev => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }));
    } catch (err) {
      console.error('Error al cargar la foto', err);
      alert('No se pudo procesar la imagen. Intenta con otra imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate Metrics
  const confirmedList = rsvps.filter(r => r.status === 'confirmed');
  const declinedList = rsvps.filter(r => r.status === 'declined');
  const totalAdults = confirmedList.reduce((acc, curr) => acc + (parseInt(curr.adultsCount) || 0), 0);
  const totalKids = confirmedList.reduce((acc, curr) => acc + (parseInt(curr.kidsCount) || 0), 0);
  const totalPeople = totalAdults + totalKids;

  // Filtered Guests
  const filteredRSVPs = rsvps.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.phone && r.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return createPortal(
    <>
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 h-[100dvh] w-screen overflow-hidden">
      <div className="relative w-full max-w-5xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-4 border-pink-300 overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="shrink-0 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 p-3 sm:p-4 text-white flex items-center justify-between z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0">
              🐶
            </div>
            <div>
              <h2 className="text-sm sm:text-xl font-bold font-heading">Base de Operaciones - Anfitrión</h2>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium">Panel de Control y Configuración</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-md mx-auto text-center flex flex-col justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 border-2 border-pink-300 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-heading mb-2">Acceso Anfitrión</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium">
              Ingresa el PIN de seguridad (PIN por defecto: <strong className="text-pink-600">1234</strong>)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="PIN Secreto"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none text-center font-bold text-lg sm:text-xl tracking-widest text-base sm:text-lg"
                />
              </div>

              {loginError && (
                <p className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg">{loginError}</p>
              )}

              <button type="submit" className="w-full btn-skye-primary py-3 text-base">
                Ingresar al Dashboard 🚀
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            
            {/* Top Navigation Tabs */}
            <div className="shrink-0 px-3 py-2 sm:px-6 sm:py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 z-10">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'list'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  📋 Asistentes ({rsvps.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'settings'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  ⚙️ Evento
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  ⏰ Itinerario
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                    activeTab === 'photos'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🖼️ Fotos
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportRSVPsToCSV}
                  className="btn-skye-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Scrollable Tab Content Container */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 pb-28 sm:pb-8">

            {/* Tab 1: Guest List & Metrics */}
            {activeTab === 'list' && (
              <div>
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-pink-50 rounded-2xl border-2 border-pink-200 text-center">
                    <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block">Confirmados</span>
                    <span className="text-3xl font-extrabold text-pink-600 font-heading">{confirmedList.length}</span>
                    <span className="text-[11px] text-gray-500 block font-medium">familias</span>
                  </div>

                  <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 text-center">
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">Total Personas</span>
                    <span className="text-3xl font-extrabold text-sky-600 font-heading">{totalPeople}</span>
                    <span className="text-[11px] text-gray-500 block font-medium">{totalAdults} Adultos + {totalKids} Niños</span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Niños/Cachorritos</span>
                    <span className="text-3xl font-extrabold text-amber-600 font-heading">{totalKids}</span>
                    <span className="text-[11px] text-gray-500 block font-medium">para sorpresas</span>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 text-center">
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">Rechazados</span>
                    <span className="text-3xl font-extrabold text-rose-600 font-heading">{declinedList.length}</span>
                    <span className="text-[11px] text-gray-500 block font-medium">no podrán asistir</span>
                  </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-pink-500 font-medium"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="confirmed">Sólo Confirmados</option>
                    <option value="declined">Sólo Rechazados</option>
                  </select>
                </div>

                {/* RSVPs Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm max-h-[50vh]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-pink-100 text-pink-800 font-heading uppercase text-xs sticky top-0">
                      <tr>
                        <th className="p-3">Nombre / Familia</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3 text-center">Estado</th>
                        <th className="p-3 text-center">Adultos</th>
                        <th className="p-3 text-center">Niños</th>
                        <th className="p-3">Dietas / Alergias</th>
                        <th className="p-3">Canción / Mensaje</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {filteredRSVPs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-gray-500 italic">
                            No se encontraron confirmaciones registradas.
                          </td>
                        </tr>
                      ) : (
                        filteredRSVPs.map((r) => (
                          <tr key={r.id} className="hover:bg-pink-50/50 transition-colors">
                            <td className="p-3 font-bold text-gray-800">{r.name}</td>
                            <td className="p-3 text-gray-600 text-xs">{r.phone || '-'}</td>
                            <td className="p-3 text-center">
                              {r.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-bold">
                                  <XCircle className="w-3.5 h-3.5" /> Rechazado
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center font-bold text-pink-600">{r.status === 'confirmed' ? r.adultsCount : 0}</td>
                            <td className="p-3 text-center font-bold text-sky-600">{r.status === 'confirmed' ? r.kidsCount : 0}</td>
                            <td className="p-3 text-xs text-gray-600 max-w-[150px] truncate">{r.dietary || 'Ninguna'}</td>
                            <td className="p-3 text-xs text-gray-600 max-w-[200px]">
                              {r.songRequest && <p className="text-amber-600 font-bold">🎵 {r.songRequest}</p>}
                              {r.message && <p className="italic text-gray-500">"{r.message}"</p>}
                              {!r.songRequest && !r.message && '-'}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Tab 2: General Event Details */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">

                {/* Hero Image Uploader */}
                <div className="p-4 bg-pink-50/60 rounded-2xl border-2 border-pink-200 space-y-3">
                  <h4 className="font-bold text-gray-800 font-heading text-sm">📸 Foto de la Cumpleañera (Pantalla de Bienvenida)</h4>
                  <p className="text-xs text-gray-500">Esta foto aparecerá en el círculo de la pantalla de bienvenida (el "sobre").</p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-tr from-pink-300 to-amber-200 flex-shrink-0">
                      <img
                        src={editForm.heroImage || '/assets/skye_birthday.png'}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label className="btn-skye-primary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer shadow-md justify-center">
                        <Upload className="w-4 h-4" />
                        <span>{editForm.heroImage ? 'Cambiar foto de Rafaela' : 'Subir foto de Rafaela'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setIsUploading(true);
                            try {
                              const compressed = await compressImage(file, 600, 600, 0.82);
                              setEditForm(prev => ({ ...prev, heroImage: compressed }));
                            } catch (err) {
                              showToast('No se pudo procesar la imagen.', 'error');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        />
                      </label>
                      {editForm.heroImage && (
                        <button
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, heroImage: '' }))}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline text-center"
                        >
                          Quitar foto y usar imagen de Skye
                        </button>
                      )}
                    </div>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-pink-600 text-xs font-bold">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Optimizando imagen...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de la Cumpleañera</label>
                    <input
                      type="text"
                      required
                      value={editForm.childName}
                      onChange={(e) => setEditForm({ ...editForm, childName: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Edad a Celebrar</label>
                    <input
                      type="number"
                      required
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 2 })}
                      className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Día del Evento</label>
                    <input
                      type="date"
                      required
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Hora de Inicio</label>
                    <input
                      type="text"
                      required
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                      placeholder="Ej: 16:00 HRS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Hora de Término</label>
                    <input
                      type="text"
                      value={editForm.endTime || ''}
                      onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                      className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                      placeholder="Ej: 20:00 HRS"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Lugar / Salón</label>
                  <input
                    type="text"
                    required
                    value={editForm.locationName}
                    onChange={(e) => setEditForm({ ...editForm, locationName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    required
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Enlace de Google Maps / Waze</label>
                  <input
                    type="url"
                    required
                    value={editForm.googleMapsUrl}
                    onChange={(e) => setEditForm({ ...editForm, googleMapsUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Código de Vestimenta / Notas</label>
                  <input
                    type="text"
                    value={editForm.dressCode}
                    onChange={(e) => setEditForm({ ...editForm, dressCode: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PIN Secreto del Anfitrión</label>
                  <input
                    type="text"
                    required
                    value={editForm.adminPin}
                    onChange={(e) => setEditForm({ ...editForm, adminPin: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-medium text-base sm:text-sm font-bold tracking-widest text-center"
                  />
                </div>

                <button type="submit" className="w-full btn-skye-primary py-3 flex items-center justify-center gap-2 mt-4">
                  <Save className="w-5 h-5" />
                  <span>Guardar Cambios Principales</span>
                </button>
              </form>
            )}

            {/* Tab 3: Itinerary Editor */}
            {activeTab === 'timeline' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800 font-heading">Modificar Itinerario de la Fiesta</h4>
                  <button
                    type="button"
                    onClick={addTimelineItem}
                    className="btn-skye-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Añadir Hora
                  </button>
                </div>



                {(editForm.timeline || []).map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative group space-y-2">
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(index)}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
                      title="Eliminar hora"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600">Hora</label>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleTimelineChange(index, 'time', e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm font-bold text-pink-600"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-gray-600">Título de la Actividad</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                          className="w-full p-2 border rounded-lg text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600">Descripción</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}

                <button type="submit" className="w-full btn-skye-primary py-3 flex items-center justify-center gap-2 mt-4">
                  <Save className="w-5 h-5" />
                  <span>Guardar Nuevo Itinerario</span>
                </button>
              </form>
            )}

            {/* Tab 4: Photo Gallery Editor */}
            {activeTab === 'photos' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800 font-heading text-lg">Galería de Fotos de la Cumpleañera</h4>
                    <p className="text-xs text-gray-500 font-medium">Puedes cargar fotos desde tu dispositivo o añadir una por URL.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={addPhotoItem}
                      className="btn-skye-secondary text-xs py-2 px-4 flex items-center gap-2 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir foto por URL</span>
                    </button>

                    <label className="btn-skye-primary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>Subir foto (Celular/PC)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleNewPhotoUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {isUploading && (
                  <div className="p-3 bg-pink-100 border border-pink-300 text-pink-700 text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Optimizando e insertando imagen...</span>
                  </div>
                )}



                {(editForm.photos || []).map((photo, index) => (
                  <div key={photo.id || index} className="p-4 bg-pink-50/60 rounded-2xl border-2 border-pink-200 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removePhotoItem(index)}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1 bg-white rounded-full shadow-sm"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md flex-shrink-0 relative bg-gray-100">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Frase / Texto de la Foto</label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => handlePhotoChange(index, 'caption', e.target.value)}
                            placeholder="Ej: Sonrisas de 1 añito, Con su vestido favorito..."
                            className="w-full p-2.5 border rounded-xl text-sm font-bold"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="btn-skye-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>Cambiar esta foto desde el PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(index, e.target.files[0])}
                              className="hidden"
                            />
                          </label>

                          <span className="text-xs font-semibold text-gray-400">o por URL web</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="submit" className="w-full btn-skye-primary py-3 flex items-center justify-center gap-2 mt-4 shadow-xl">
                  <Save className="w-5 h-5" />
                  <span>Guardar Galería de Fotos</span>
                </button>
              </form>
            )}

            </div>
          </div>
        )}

      </div>
    </div>

    {/* Toast Notifications */}
    {saveSuccessMsg && <Toast message={saveSuccessMsg} type="success" onClose={() => setSaveSuccessMsg('')} />}
    {saveErrorMsg && <Toast message={saveErrorMsg} type="error" onClose={() => setSaveErrorMsg('')} />}
    </>,
    document.body
  );
}
