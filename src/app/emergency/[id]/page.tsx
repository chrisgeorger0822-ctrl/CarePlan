"use client";

import { useEffect, useState, use } from 'react';
import { getStore, FamilyMember } from '@/app/lib/store';
import { ShieldAlert, Droplets, AlertCircle, Phone, Pill, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmergencyCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const store = getStore();
    const found = store.familyMembers.find(m => m.id === id);
    if (found) setMember(found);
    
    // In a real app, we'd persist this to IndexedDB here for offline use
  }, [id]);

  const formatPhoneForDialing = (phone: string) => phone.replace(/\D/g, '');

  if (!member) return null;

  return (
    <div className="min-h-screen bg-red-600 text-white p-4 font-body">
      <div className="max-w-lg mx-auto space-y-4">
        <header className="flex items-center justify-between pb-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-8 h-8" />
            <h1 className="text-2xl font-bold">MEDICAL SOS</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Emergency Contact</p>
            <p className="text-lg font-bold">{member.doctorContact}</p>
          </div>
        </header>

        <section className="bg-white text-black rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-4xl font-bold">
              {member.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">{member.name}</h2>
              <p className="text-lg font-medium opacity-60">{member.age} YEARS OLD</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <Droplets className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-xs font-bold text-red-600 uppercase mb-1">Blood Type</p>
              <p className="text-3xl font-black text-red-700">{member.bloodType}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-xs font-bold text-orange-600 uppercase mb-1">Allergies</p>
              <p className="text-sm font-black text-orange-700 break-words">{member.allergies || 'NONE KNOWN'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Medical Conditions
              </h3>
              <p className="text-xl font-bold leading-tight">{member.medicalConditions || 'NO RECORDED CONDITIONS'}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" /> Active Medications
              </h3>
              <div className="space-y-2">
                {member.medications.length === 0 ? (
                  <p className="text-sm font-medium opacity-50 italic">No daily medications recorded</p>
                ) : (
                  member.medications.map(med => (
                    <div key={med.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border">
                      <p className="font-bold">{med.name}</p>
                      <p className="text-xs font-medium text-muted-foreground">{med.dosage} • {med.frequency}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-dashed">
               <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" /> Physician
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{member.doctorName}</p>
                  <p className="text-sm opacity-60">{member.doctorContact}</p>
                </div>
                <Button size="lg" className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg border-2 border-white" asChild>
                  <a href={`tel:${formatPhoneForDialing(member.doctorContact)}`}><Phone className="w-6 h-6" /></a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center pt-8 pb-12">
          <p className="text-xs opacity-60 font-medium">THIS INFORMATION IS STORED LOCALLY FOR EMERGENCY USE.</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="ghost" onClick={() => window.history.back()} className="text-white hover:bg-white/10">Return to App</Button>
          </div>
        </footer>
      </div>
    </div>
  );
}