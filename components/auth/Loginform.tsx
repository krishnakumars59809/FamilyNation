'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../api/userApi';

export default function LoginForm() {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Example API call (adjust URL)
      const data = await loginUser(form);
      if (data?.token) {
        setMessage('✅ Login successful!');
        // Save token or redirect
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setMessage(data.error || '❌ Invalid credentials');
      }
    } catch (err) {
      setMessage('⚠️ Server error.');
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center rounded-lg bg-white/90 px-4">
      <div className="w-full max-w-md bg-white shadow-xl p-8">
        <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
          <div className="text-center flex items-center justify-center">
            <Link to="/dashboard">
              <div className="text-2xl font-bold font-montserrat pl-3">
                <img src={logo} width={50} height={50} className="bg-white " />
              </div>
            </Link>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          User Login
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm text-gray-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border-b-4 border-green-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="xyz@gmail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full border-b-4 border-green-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-emerald-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-800 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold shadow-sm transition"
            // className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-800 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-lg font-semibold shadow-sm transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="hover:underline text-blue-500 hover:blue-800"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
