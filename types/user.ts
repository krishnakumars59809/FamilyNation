// src/types/user.ts
export interface FamilyMember {
  _id?: string; // MongoDB ID
  name: string;
  relation: 'wife' | 'husband' | 'son' | 'daughter' | 'other' | any;
  age?: number; // ISO date string
  email?: string;
  phone?: string;
  needs?: string[]; // e.g. ["learning-impairment"]
  isPrimaryContact?: boolean;
}

export interface User {
  _id?: string; // MongoDB ID
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // ISO date string
  role: 'user' | 'admin';
  familyId?: string; // generated family ID
  family?: FamilyMember[];
}
