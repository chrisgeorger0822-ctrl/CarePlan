import { create } from 'react';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  pillCount: number;
  initialCount: number;
  pharmacyNumber: string;
  lastTaken?: string;
  startDate: string;
  reminders: string[]; // Array of times in HH:mm format
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  bloodType: BloodType;
  allergies: string;
  medicalConditions: string;
  doctorName: string;
  doctorContact: string;
  medications: Medication[];
}

export interface AppState {
  familyMembers: FamilyMember[];
  currentUserRole: 'caregiver' | 'patient';
  currentPatientId?: string;
}

// Simple singleton-like mock store for demo
let state: AppState = {
  familyMembers: [],
  currentUserRole: 'caregiver',
};

export const getStore = () => state;

export const addFamilyMember = (member: Omit<FamilyMember, 'id' | 'medications'>) => {
  const newMember: FamilyMember = {
    ...member,
    id: Math.random().toString(36).substr(2, 9),
    medications: [],
  };
  state.familyMembers.push(newMember);
  return newMember;
};

export const addMedication = (memberId: string, medication: Omit<Medication, 'id'>) => {
  const member = state.familyMembers.find(m => m.id === memberId);
  if (member) {
    const newMed = { ...medication, id: Math.random().toString(36).substr(2, 9) };
    member.medications.push(newMed);
    return newMed;
  }
};

export const markAsTaken = (memberId: string, medId: string) => {
  const member = state.familyMembers.find(m => m.id === memberId);
  if (member) {
    const med = member.medications.find(m => m.id === medId);
    if (med && med.pillCount > 0) {
      med.pillCount -= 1;
      med.lastTaken = new Date().toISOString();
      return true;
    }
  }
  return false;
};
