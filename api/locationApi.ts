// src/api/chatApi.ts
import { Location } from '../types/location';
import { apiClient } from './apiClient';

export const getLocation = (): Promise<Location> => {
  return apiClient(`/location/getLocation`, { method: 'GET' });
};
