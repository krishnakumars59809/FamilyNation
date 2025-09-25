import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState({
    name: 'John son',
    email: 'johnson@gmail.com',
  });

  const [familyMembers, setFamilyMembers] = useState([
    {
      name: 'Alice Doe',
      age: 30,
      gender: 'Female',
      relationship: 'Wife',
      needs: 'Health insurance, Job support',
    },
    {
      name: 'Bob Doe',
      age: 10,
      gender: 'Male',
      relationship: 'Son',
      needs: 'School supplies, Tuition',
    },
    {
      name: 'Eve Doe',
      age: 65,
      gender: 'Female',
      relationship: 'Mother',
      needs: 'Medical care, Financial support',
    },
  ]);

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

  const handleSave = () => {
    console.log('User:', user);
    console.log('Family Members:', familyMembers);
    alert('Profile Updated Successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
          <img
            src="https://i.pravatar.cc/150?img=7"
            alt="Profile"
            className="w-full h-30 rounded-lg object-cover mb-4"
          />
          <h2 className="text-start text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Right Form Section */}
        <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">User Information</h3>
          <div className="space-y-4">
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              placeholder="Name"
              className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <label className="block text-sm font-bold text-blue-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              placeholder="Email"
              className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <h3 className="text-lg font-bold mt-6 mb-4">Family Members</h3>
          <div className="space-y-6">
            {familyMembers.map((member, index) => (
              <div className="border border-blue-700 rounded-lg shadow-lg">
                <h4 className="p-4 bg-blue-800 rounded-t-lg font-medium text-white">
                  Member {index + 1}
                </h4>

                <div key={index} className="p-4 space-y-3">
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
                        className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={member.age}
                        onChange={(e) => handleMemberChange(index, e)}
                        placeholder="Age"
                        className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
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
                        className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
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
                        className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
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
                        className="w-full border-b px-4 py-2 text-gray-800 focus:ring-b-4 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-4 py-2 px-4 text-xs md:text-md bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-sm transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
