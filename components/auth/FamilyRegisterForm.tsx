'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../api/userApi';
import { RELATIONSHIPS } from '../constants/relationship';
import logo from '../../assets/images/logo.png';

type Member = {
  name: string;
  email: string;
  age: number;
  gender: string;
  relationship: string;
  needs: string[];
};

export default function FamilyRegisterForm() {
  const { user, addFamilyMembers } = useUser();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([
    { name: '', email: '', age: 0, gender: '', relationship: '', needs: [''] },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updated = [...members];
    let { name, value } = e.target;

    // normalize gender to lowercase
    if (name === 'gender') {
      updated[index].relationship = ''; // reset relationship
    }

    // convert textarea for needs into array (keep spaces)
    if (name === 'needs') {
      updated[index].needs = value.split('\n').filter((item) => item !== ''); // no .trim(), spaces remain
    } else {
      updated[index][name as Exclude<keyof Member, 'needs'>] = value as never;
    }

    setMembers(updated);
  };

  const addMember = () => {
    setMembers([
      ...members,
      {
        name: '',
        email: '',
        age: 0,
        gender: '',
        relationship: '',
        needs: [''],
      },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length === 1) return; // prevent removing all
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      console.log('kk user id', user?.id);
      await addFamilyMembers(user?.id || '', members as never);
      setMessage('Family members added successfully ✅');
      navigate('/');
    } catch (error) {
      console.error('Error adding family members:', error);
      alert('Something went wrong ❌');
      setLoading(false);
      setMessage('');
    }
  };

  const Skip = 'Skip >';
  // if(!user) return navigate('/login');
  return (
    // <div className="min-h-screen flex items-center justify-center rounded-lg bg-white/90 px-4">
    //     <div className="w-full max-w-2xl bg-white shadow-xl p-8">
    //         <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
    //             Register Family Members
    //         </h2>

    //         {message && (
    //             <p className="text-center mb-4 text-sm text-gray-600">{message}</p>
    //         )}

    //         <form onSubmit={handleSubmit} className="space-y-8">
    //             {members.map((member, index) => (
    //                 <div
    //                     key={index}
    //                     className="p-4 relative shadow-lg rounded-lg bg-emerald-0"
    //                 >
    //                     <h3 className="font-semibold text-center text-emerald-700 mb-3">
    //                         Member {index + 1}
    //                     </h3>

    //                     {/* Name */}
    //                     <div className="mb-3">
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Name
    //                         </label>
    //                         <input
    //                             type="text"
    //                             name="name"
    //                             value={member.name}
    //                             onChange={(e) => handleChange(index, e)}
    //                             required
    //                             className="w-full border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                             placeholder="Name"
    //                         />
    //                     </div>

    //                     {/* Email */}
    //                     <div className="mb-3">
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Email
    //                         </label>
    //                         <input
    //                             type="email"
    //                             name="email"
    //                             value={member.email}
    //                             onChange={(e) => handleChange(index, e)}
    //                             required
    //                             className="w-full border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                             placeholder="xyz@gmail.com"
    //                         />
    //                     </div>

    //                     {/* Age */}
    //                     <div className="mb-3">
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Age
    //                         </label>
    //                         <input
    //                             type="number"
    //                             name="age"
    //                             min={10}
    //                             max={100}
    //                             value={member.age}
    //                             onChange={(e) => handleChange(index, e)}
    //                             required
    //                             className="w-full border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                             placeholder="25"
    //                         />
    //                     </div>

    //                     {/* Gender */}
    //                     <div className="mb-3">
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Gender
    //                         </label>
    //                         <select
    //                             name="gender"
    //                             value={member.gender}
    //                             onChange={(e) => handleChange(index, e)}
    //                             required
    //                             className="w-full border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                         >
    //                             <option value="">Select</option>
    //                             <option value="Male">Male</option>
    //                             <option value="Female">Female</option>
    //                             <option value="Other">Other</option>
    //                         </select>
    //                     </div>

    //                     {/* Relationship Status */}
    //                     {/* Relationship Status */}
    //                     <div>
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Relationship Status
    //                         </label>
    //                         <select
    //                             name="relationship"
    //                             value={member?.relationship}
    //                             onChange={(e) => handleChange(index, e)}
    //                             required
    //                             className="w-full border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                         >
    //                             <option value="">Select</option>
    //                             {(
    //                                 RELATIONSHIPS[
    //                                 member?.gender as keyof typeof RELATIONSHIPS
    //                                 ] || [
    //                                     'Father',
    //                                     'Mother',
    //                                     'Brother',
    //                                     'Sister',
    //                                     'Daughter',
    //                                     'Son',
    //                                     'Other',
    //                                 ]
    //                             ).map((rel) => (
    //                                 <option key={rel} value={rel.toLowerCase()}>
    //                                     {rel}
    //                                 </option>
    //                             ))}
    //                         </select>
    //                     </div>

    //                     {/* Needs */}
    //                     <div className="mb-3">
    //                         <label className="block text-sm font-bold text-gray-700 mb-1">
    //                             Needs
    //                         </label>
    //                         <textarea
    //                             name="needs"
    //                             value={member.needs.join('\n')} // join array into new lines
    //                             onChange={(e) => handleChange(index, e)}
    //                             placeholder="Enter each need on a new line"
    //                             className="w-full bg-gray-100 border-b-4 border-emerald-300 px-4 py-2 text-gray-800 focus:ring-b-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    //                             rows={3}
    //                         />
    //                     </div>

    //                     {/* Remove Button */}
    //                     {members.length > 1 && (
    //                         <button
    //                             type="button"
    //                             onClick={() => removeMember(index)}
    //                             className="absolute top-2 right-2 text-red-500 hover:text-red-700"
    //                         >
    //                             <Trash2 size={18} />
    //                         </button>
    //                     )}
    //                 </div>
    //             ))}

    //             {/* Add Member Button */}
    //             <button
    //                 type="button"
    //                 onClick={addMember}
    //                 className="flex items-center gap-2 px-4 py-2 text-emerald-900 hover:text-white border border-emerald-600 bg-emerald-50 hover:bg-emerald-700 transition"
    //             >
    //                 <Plus size={18} /> Add Member
    //             </button>

    //             {/* Submit */}
    //             <button
    //                 type="submit"
    //                 disabled={loading}
    //                 className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-800 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold shadow-sm transition"
    //             >
    //                 {loading ? 'Registering...' : 'Register All Members'}
    //             </button>
    //             <div className="text-center font-bold underline text-green-700">
    //                 <Link to="/login">{Skip}</Link>
    //             </div>
    //         </form>
    //     </div>
    // </div>

    <div className="items-center justify-center">
      <div className="w-full shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Welcome */}
        <div className="md:w-1/2 w-full bg-gradient-to-r from-emerald-500 to-emerald-900 text-white flex flex-col items-center justify-center p-10">
          <div className="text-center flex justify-center">
            <Link to="/">
              <div className="text-2xl font-bold font-montserrat pl-7">
                <img
                  src={logo}
                  width={70}
                  height={70}
                  className="invert brightness-0 mb-4"
                />
              </div>
              <div className="text-xs md:text-md text-white font-lato mt-1 font-bold">
                "It Starts at Home."
              </div>
            </Link>
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Family Nation</h2>
          <p className="text-sm text-emerald-100 text-center">
            Register your family members with details and manage easily.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 w-full bg-white shadow-xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-emerald-900 text-center">
            Register Family Members
          </h2>

          {message && (
            <p className="text-center mb-4 text-sm text-gray-600">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            {/* Scrollable member cards */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 max-h-[500px]">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="p-4 relative shadow-lg rounded-lg bg-emerald-0 space-y-4"
                >
                  <h3 className="font-semibold text-center text-emerald-700 mb-3">
                    Member {index + 1}
                  </h3>

                  {/* Grid for two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={member.name}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={member.email}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="xyz@gmail.com"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        min={10}
                        max={100}
                        value={member.age}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="25"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={member.gender}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Relationship */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Relationship Status
                      </label>
                      <select
                        name="relationship"
                        value={member?.relationship}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Select</option>
                        {(
                          RELATIONSHIPS[
                            member?.gender as keyof typeof RELATIONSHIPS
                          ] || [
                            'Father',
                            'Mother',
                            'Brother',
                            'Sister',
                            'Daughter',
                            'Son',
                            'Other',
                          ]
                        ).map((rel) => (
                          <option key={rel} value={rel.toLowerCase()}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Needs - full row */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Needs
                    </label>
                    <textarea
                      name="needs"
                      value={member.needs.join('\n')}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Enter each need on a new line"
                      className="w-full bg-gray-100 border-b border-gray-300 px-4 py-2 text-gray-800 focus:ring-b-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      rows={3}
                    />
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
            </div>

            {/* Buttons - fixed bottom */}
            <div className="flex justify-between items-center gap-4 my-2">
              <button
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 px-4 py-2 text-sm md:text-md text-white border border-gray-600 bg-black hover:bg-emerald-700 transition"
              >
                <Plus size={18} /> Add Member
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 text-sm md:text-md bg-gradient-to-r from-emerald-500 to-emerald-800 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold shadow-sm transition"
              >
                {loading ? 'Registering...' : 'Register All Members'}
              </button>
            </div>

            <div className="text-center font-bold underline text-green-700">
              <Link to="/login">{Skip}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
