"use client";

import { useEffect, useState, use } from 'react';
import { getStore, FamilyMember } from '@/app/lib/store';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Heart, Pill, Activity, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function DoctorReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const store = getStore();
    const found = store.familyMembers.find(m => m.id === id);
    if (found) setMember(found);
  }, [id]);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate adherence for report
  const totalPossible = member.medications.reduce((sum, med) => sum + med.initialCount, 0);
  const totalTaken = member.medications.reduce((sum, med) => sum + (med.initialCount - med.pillCount), 0);
  const adherence = totalPossible > 0 ? Math.round((totalTaken / totalPossible) * 100) : 0;

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pb-20">
      {/* Navigation Bar - Hidden during print */}
      <nav className="print:hidden bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={`/family/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="bg-primary">
              <Printer className="w-4 h-4 mr-2" /> Print Report
            </Button>
          </div>
        </div>
      </nav>

      {/* Report Content */}
      <main className="max-w-4xl mx-auto p-8 md:my-8 bg-white md:shadow-xl md:rounded-xl print:shadow-none print:m-0 print:p-0">
        {/* Report Header */}
        <header className="flex justify-between items-start border-b-2 border-primary/20 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-black text-primary uppercase tracking-tight">CarePlan Nexus Report</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase">Patient Health Summary</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-muted-foreground uppercase">Report Date</p>
            <p className="text-lg font-bold">{today}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <section className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xs font-black uppercase text-primary/60 tracking-widest mb-4 border-b">Patient Information</h2>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Full Name</p>
                  <p className="text-lg font-bold">{member.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Age</p>
                  <p className="text-lg font-bold">{member.age} Years</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Blood Type</p>
                  <p className="text-lg font-bold">{member.bloodType}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-primary/60 tracking-widest mb-4 border-b">Medical Background</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-xs font-bold text-red-700 uppercase">Allergies & Sensitivities</p>
                  </div>
                  <p className="font-bold text-red-900">{member.allergies || 'No known allergies recorded.'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Chronic Conditions</p>
                  <p className="font-bold">{member.medicalConditions || 'No recorded chronic conditions.'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 p-6 rounded-xl border border-primary/10 self-start">
            <h2 className="text-xs font-black uppercase text-primary tracking-widest mb-4">Adherence Tracking</h2>
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-primary/20">
                <p className="text-4xl font-black text-primary">{adherence}%</p>
                <p className="text-xs font-bold text-primary/60 uppercase">Medication Compliance</p>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Doses Taken:</span>
                  <span className="font-bold">{totalTaken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Prescriptions:</span>
                  <span className="font-bold">{member.medications.length}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mb-10">
          <h2 className="text-xs font-black uppercase text-primary/60 tracking-widest mb-4 border-b flex items-center gap-2">
            <Pill className="w-4 h-4" /> Current Medication Regimen
          </h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Medication</th>
                  <th className="p-4">Dosage</th>
                  <th className="p-4">Frequency</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y">
                {member.medications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground italic">No active medications recorded.</td>
                  </tr>
                ) : (
                  member.medications.map(med => (
                    <tr key={med.id}>
                      <td className="p-4 font-bold">{med.name}</td>
                      <td className="p-4">{med.dosage}</td>
                      <td className="p-4">{med.frequency}</td>
                      <td className="p-4 text-right">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-dashed">
          <div>
            <h2 className="text-xs font-black uppercase text-primary/60 tracking-widest mb-2">Physician Information</h2>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-lg">{member.doctorName}</p>
                <p className="text-sm text-muted-foreground">{member.doctorContact}</p>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] text-muted-foreground italic">Report generated by CarePlan Nexus Health System.</p>
            <p className="text-[10px] text-muted-foreground italic">Verification ID: {member.id.toUpperCase()}</p>
          </div>
        </section>

        {/* Print Only Footer */}
        <footer className="hidden print:block fixed bottom-0 left-0 right-0 p-8 border-t text-center text-[10px] text-muted-foreground">
          This document is a computer-generated summary for medical consultation. Please verify all data with the primary caregiver.
        </footer>
      </main>
    </div>
  );
}