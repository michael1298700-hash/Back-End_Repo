import BASE_URL from '../api.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const Appointments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctorId || '');
  const [appointmentDate, setAppointmentDate] = useState(location.state?.selectedDate || '');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(location.state?.selectedSlot || '');
  const [gejala, setGejala] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, appointmentDate]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/doctors`);
      setDoctors(response.data.doctors);
    } catch {
      toast.error('Gagal memuat data dokter');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/doctors/${selectedDoctor}/available-slots?date=${appointmentDate}`);
      setAvailableSlots(response.data.slots);
      // Jangan reset slot jika sudah dipilih dari halaman jadwal
      if (!location.state?.selectedSlot) setSelectedSlot('');
    } catch {
      toast.error('Gagal memuat jadwal tersedia');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    if (!selectedSlot) {
      toast.error('Pilih waktu terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/appointments`, {
        id_dokter: selectedDoctor,
        id_pasien: user.id,
        waktu_janji: selectedSlot,
        gejala: gejala,
        catatan: '',
      }, getAuthHeaders());
      toast.success('Janji temu berhasil dibuat!');
      navigate('/appointment-history');
    } catch {
      toast.error('Gagal membuat janji temu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Buat Janji Temu</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Pilih Dokter</label>
              <select value={selectedDoctor} onChange={(e) => { setSelectedDoctor(e.target.value); setAvailableSlots([]); setSelectedSlot(''); }} className="input-field" required>
                <option value="">Pilih dokter</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.nama_lengkap} - {d.sub_spesialisasi}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Tanggal Kunjungan</label>
              <input type="date" value={appointmentDate} onChange={(e) => { setAppointmentDate(e.target.value); setSelectedSlot(''); }}
                min={format(new Date(), 'yyyy-MM-dd')} className="input-field" required />
            </div>

            {availableSlots.length > 0 && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Pilih Waktu</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot, idx) => (
                    <button key={idx} type="button" onClick={() => setSelectedSlot(slot.waktu)}
                      className={`py-2 rounded-lg border transition ${selectedSlot === slot.waktu ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-600'}`}>
                      {slot.waktu_display}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSlot && (
              <div className="bg-blue-50 rounded-lg p-3 text-blue-700 text-sm">
                Waktu terpilih: <strong>{new Date(selectedSlot).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short', timeZone: 'UTC' })}</strong>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Gejala / Keluhan</label>
              <textarea rows="4" value={gejala} onChange={(e) => setGejala(e.target.value)}
                className="input-field" placeholder="Jelaskan gejala atau keluhan Anda..."></textarea>
            </div>

            <button type="submit" disabled={loading || !selectedSlot} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Memproses...' : 'Buat Janji Temu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
