import React, { useState, useEffect } from 'react';
import { useUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import familyProfile from '../assets/images/familyProfile.webp';
import { Trash2 } from 'lucide-react';
import { FamilyMember, User } from '../types/user';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user: data, getAllFamilyMembersByUserId } = useUser();

  const [user, setUser] = useState({
    name: data?.firstName || '',
    email: data?.email || '',
    userId: data?.id || '',
  });

  const [familyMembers, setFamilyMembers] = useState(data?.familyMembers || []);

  const [loading, setLoading] = useState(false);
  const [AllFamilyMembers, setAllFamilyMembers] = useState<FamilyMember[]>([]);

  const [message, setMessage] = useState('');

  const getAllFamilyMembers = async (userId: string) => {
    setLoading(true);
    setMessage('');

    try {
      if (!userId) {
        setMessage('User not found.');
        return;
      }

      const res = await getAllFamilyMembersByUserId(userId);

      setAllFamilyMembers(res as FamilyMember[]);
      setMessage('Family members fetched successfully!');
    } catch (err) {
      console.error('Error fetching family members:', err);
      setMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      (async () => {
        await getAllFamilyMembers(user?.userId);
      })();
    }
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setFamilyMembers(updated);
  };

  const handleAddMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: '', age: '', gender: '', relationship: '', needs: '' },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updated);
  };

  const handleSave = () => {
    console.log('User:', user);
    console.log('Family Members:', familyMembers);
    alert('Profile Updated Successfully!');
  };

  useEffect(() => {
    if (!data) {
      navigate('/login');
    }
  }, [data, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-500 via-30% to-emerald-500 to-90% p-6">
      <div className="h-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="h-[420px] bg-white shadow-md rounded-lg p-6 flex flex-col">
          <img
            src={data?.profilePicture || familyProfile}
            alt="Profile"
            className="w-full h-30 rounded-lg object-cover mb-4"
          />
          <h2 className="text-start text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Right Form Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">User Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleUserChange}
                placeholder="Name"
                className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Email"
                className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mt-6 mb-4">Family Members</h3>
          <div className="space-y-6">
            {familyMembers.map((member, index) => (
              <div
                key={index}
                className="border border-blue-700 rounded-lg shadow-lg"
              >
                <div className="flex items-center justify-between p-4 bg-blue-800 rounded-t-lg">
                  <h4 className="font-medium text-white">Member {index + 1}</h4>
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="text-sm text-white hover:bg-white hover:text-red-500 px-3 py-1 rounded shadow"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Member Name"
                        className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        min={10}
                        max={100}
                        value={member.age}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Age"
                        className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={member.gender}
                        onChange={(e) => handleMemberChange(index, e)}
                        className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1">
                        Relationship Status
                      </label>
                      <input
                        type="text"
                        name="relationship"
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Relationship Status"
                        className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-full">
                      <label className="block text-sm font-bold text-blue-800 mb-1 ">
                        Needs
                      </label>
                      <textarea
                        name="needs"
                        value={member.needs}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Needs"
                        className="w-full bg-gray-100 border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={handleAddMember}
              className="py-2 px-4 text-xs md:text-md bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-sm transition"
            >
              + Add Member
            </button>

            <button
              onClick={handleSave}
              className="py-2 px-4 text-xs md:text-md bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-sm transition"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
