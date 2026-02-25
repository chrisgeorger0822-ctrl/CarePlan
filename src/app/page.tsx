"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Plus, UserPlus } from 'lucide-react';
import { addFamilyMember, BloodType } from '@/app/lib/store';
import Navigation from '@/components/Navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodType: '' as BloodType,
    allergies: '',
    medicalConditions: '',
    doctorName: '',
    doctorContact: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(val => val === '')) {
      alert('Please enter the required contents');
      return;
    }

    addFamilyMember({
      name: formData.name,
      age: parseInt(formData.age),
      bloodType: formData.bloodType,
      allergies: formData.allergies,
      medicalConditions: formData.medicalConditions,
      doctorName: formData.doctorName,
      doctorContact: formData.doctorContact,
    });

    router.push('/family');
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to CarePlan Nexus</h1>
          <p className="text-muted-foreground">To get started, create your first family member profile.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" />
              Family Member Details
            </CardTitle>
            <CardDescription>Enter essential medical information for personalized care.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="member-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="e.g., 45" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select onValueChange={(val: BloodType) => setFormData({...formData, bloodType: val})}>
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input 
                  id="allergies" 
                  placeholder="e.g., Penicillin, Peanuts" 
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Input 
                  id="medicalConditions" 
                  placeholder="e.g., Hypertension, Diabetes" 
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Primary Doctor Name</Label>
                  <Input 
                    id="doctorName" 
                    placeholder="Dr. Smith" 
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorContact">Doctor Contact (Phone/Email)</Label>
                  <Input 
                    id="doctorContact" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.doctorContact}
                    onChange={(e) => setFormData({...formData, doctorContact: e.target.value})}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button form="member-form" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="w-5 h-5 mr-2" />
              Save Family Member
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}