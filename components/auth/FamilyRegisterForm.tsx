'use client';

import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Member = {
  name: string;
  email: string;
  password: string;
  gender: string;
  relationship: string;
};

export default function FamilyRegisterForm() {
  const [members, setMembers] = useState<Member[]>([
    { name: '', email: '', password: '', gender: '', relationship: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState<boolean[]>([false]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = [...members];
    updated[index][e.target.name as keyof Member] = e.target.value;
    setMembers(updated);
  };

  const togglePassword = (index: number) => {
    const updated = [...showPassword];
    updated[index] = !updated[index];
    setShowPassword(updated);
  };

  const addMember = () => {
    setMembers([
      ...members,
      { name: '', email: '', password: '', gender: '', relationship: '' },
    ]);
    setShowPassword([...showPassword, false]);
  };

  const removeMember = (index: number) => {
    if (members.length === 1) return; // prevent removing all
    const updated = members.filter((_, i) => i !== index);
    const updatedShow = showPassword.filter((_, i) => i !== index);
    setMembers(updated);
    setShowPassword(updatedShow);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/family/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(members),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Family members registered successfully!');
        setMembers([
          { name: '', email: '', password: '', gender: '', relationship: '' },
        ]);
        setShowPassword([false]);
      } else {
        setMessage(data.message || '❌ Something went wrong.');
      }
    } catch (err) {
      setMessage('⚠️ Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center rounded-lg bg-white/90 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Register Family Members
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm text-gray-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {members.map((member, index) => (
            <div
              key={index}
              className=" p-4 relative shadow-lg rounded-lg bg-blue-0"
            >
              <h3 className="font-semibold text-center text-blue-700 mb-3">
                Member {index + 1}
              </h3>

              {/* Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={member.name}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="w-full border-b-4 border-blue-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Name"
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="w-full border-b-4 border-blue-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword[index] ? 'text' : 'password'}
                    name="password"
                    value={member.password}
                    onChange={(e) => handleChange(index, e)}
                    required
                    placeholder="********"
                    className="w-full border-b-4 border-blue-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword(index)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword[index] ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={member.gender}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="w-full border-b-4 border-blue-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Relationship Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Status
                </label>
                <select
                  name="relationship"
                  value={member.relationship}
                  onChange={(e) => handleChange(index, e)}
                  required
                  className="w-full border-b-4 border-blue-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Remove Button */}
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          {/* Add Member Button */}
          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-2 px-4 py-2 text-blue-900 hover:text-white border border-blue-600 bg-blue-50 hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add Member
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800  text-white font-semibold shadow-sm transition"
          >
            {loading ? 'Registering...' : 'Register All Members'}
          </button>
        </form>
      </div>
    </div>
  );
}
