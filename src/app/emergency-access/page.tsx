"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStore, FamilyMember } from '@/app/lib/store';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, ChevronRight, Droplets, AlertCircle } from 'lucide-react';

export default function EmergencyHub() {
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    setMembers(getStore().familyMembers);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Emergency SOS Cards</h1>
          <p className="text-muted-foreground">Quick access to critical medical information even without internet connection.</p>
        </div>

        <div className="space-y-4">
          {members.map(member => (
            <Link key={member.id} href={`/emergency/${member.id}`}>
              <Card className="hover:border-destructive/50 transition-colors shadow-md border-2 border-transparent">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-destructive/5 flex items-center justify-center text-destructive font-bold text-2xl border border-destructive/10">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center">
                          <Droplets className="w-3 h-3 mr-1" /> {member.bloodType}
                        </span>
                        {member.allergies && (
                           <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Allergies
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}

          {members.length === 0 && (
            <p className="text-center text-muted-foreground">No family profiles created yet.</p>
          )}
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl shadow-inner text-sm text-muted-foreground border">
           <p className="flex gap-2 items-start">
             <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
             These cards are designed for paramedics and emergency responders. They contain critical life-saving data and primary doctor contact info.
           </p>
        </div>
      </main>
    </div>
  );
}