import BASE_URL from '../api.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaEnvelope, FaLock, FaUser, FaUserTie,
  FaHeartbeat, FaEye, FaEyeSlash,
} from 'react-icons/fa';

const Login = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '' });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = activeTab === 'staff'
        ? `${BASE_URL}/api/users/staff/login`
        : `${BASE_URL}/api/users/login`;

      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success === false) throw new Error(response.data.message);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(
        activeTab === 'staff'
          ? `Selamat datang, ${response.data.user.nama_lengkap}!`
          : 'Login berhasil!'
      );
      navigate(activeTab === 'staff' ? '/staff-dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const isStaff = activeTab === 'staff';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <FaHeartbeat className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Smart<span className="text-blue-600">Health</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Sistem Informasi Kesehatan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Tab Switcher */}
          <div className="flex">
            <button
              onClick={() => handleTabSwitch('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                !isStaff
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FaUser className="text-base" />
              Login Pasien
            </button>
            <button
              onClick={() => handleTabSwitch('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                isStaff
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FaUserTie className="text-base" />
              Login Staff
            </button>
          </div>

          {/* Form */}
          <div className="p-8">

            {/* Header */}
            <div className="mb-6 text-center">
              {isStaff ? (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
                    <FaUserTie className="text-indigo-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Portal Staff</h2>
                  <p className="text-gray-500 text-sm mt-1">Masuk dengan akun staff Anda</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Selamat Datang</h2>
                  <p className="text-gray-500 text-sm mt-1">Masuk ke akun pasien Anda</p>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isStaff ? 'Email staff Anda' : 'Email pasien Anda'}
                    className="input-field pl-10 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="input-field pl-10 pr-10 text-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isStaff
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  `Masuk sebagai ${isStaff ? 'Staff' : 'Pasien'}`
                )}
              </button>
            </form>

            {/* Footer link — hanya tampil di tab pasien */}
            {!isStaff && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Daftar di sini
                  </Link>
                </p>
              </div>
            )}

            {isStaff && (
              <p className="mt-5 text-center text-xs text-gray-400">
                Hubungi administrator jika mengalami kendala login.
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} SmartHealth. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
