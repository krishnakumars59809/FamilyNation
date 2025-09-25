// src/hooks/useUser.ts
import { useState } from 'react';
import { apiClient } from '../api/apiClient'; // your fetch wrapper
import { FamilyMember, User } from '../types/user';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  dateOfBirth?: string;
}

interface AddFamilyMembersData extends Array<FamilyMember> {}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ===== Auth =====
  const registerUser = async (data: RegisterData) => {
    const res = (await apiClient('/user/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })) as { error?: string; token?: string; user?: User };
    if (res.error) throw new Error(res.error);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const loginUser = async (data: LoginData) => {
    const res = (await apiClient('/user/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })) as { error?: string; token?: string; user?: User };
    if (res.error) throw new Error(res.error);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const getCurrentUser = async () => {
    const res = await apiClient('/user/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res);
    return res;
  };

  // ===== Admin CRUD =====
  const createUser = async (data: RegisterData) =>
    apiClient('/user', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

  const getUsers = async () =>
    apiClient('/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

  const getUserById = async (id: string) =>
    apiClient(`/user/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

  const updateUser = async (id: string, data: Partial<User>) =>
    apiClient(`/user/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });

  const deleteUser = async (id: string) =>
    apiClient(`/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

  // ===== Family Members =====
  const addFamilyMembers = async (
    userId: string,
    members: AddFamilyMembersData
  ) =>
    apiClient(`/user/${userId}/family`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(members),
    });

  const updateFamilyMember = async (
    userId: string,
    memberId: string,
    updates: Partial<FamilyMember>
  ) =>
    apiClient(`/user/${userId}/family/${memberId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });

  const deleteFamilyMember = async (userId: string, memberId: string) =>
    apiClient(`/user/${userId}/family/${memberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

  return {
    user,
    token,
    setToken,
    setUser,
    registerUser,
    loginUser,
    getCurrentUser,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addFamilyMembers,
    updateFamilyMember,
    deleteFamilyMember,
  };
};
