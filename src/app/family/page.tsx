"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStore, FamilyMember } from '@/app/lib/store';
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ChevronRight, Droplets, AlertCircle, PlusCircle } from 'lucide-react';

export default function FamilyOverview() {
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    setMembers(getStore().familyMembers);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Family Hub
            </h1>
            <p className="text-muted-foreground">Manage health profiles for your loved ones.</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <Users className="w-16 h-16 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No family members yet</h2>
            <p className="text-muted-foreground mb-6">Start by adding your first profile.</p>
            <Link href="/">
              <Button className="bg-primary">Get Started</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map(member => (
              <Link key={member.id} href={`/family/${member.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-white cursor-pointer overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{member.name}</CardTitle>
                        <CardDescription>{member.age} years old</CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-100">
                        <Droplets className="w-3 h-3 mr-1" /> {member.bloodType}
                      </Badge>
                      {member.allergies && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          <AlertCircle className="w-3 h-3 mr-1" /> Allergy Alert
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      <p><strong>Medications:</strong> {member.medications.length} active</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}