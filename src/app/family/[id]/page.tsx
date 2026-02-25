"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getStore, FamilyMember, addMedication, markAsTaken } from '@/app/lib/store';
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Calendar, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Camera, 
  UserCircle,
  Stethoscope,
  Activity,
  Bell,
  Trash2,
  Clock
} from 'lucide-react';
import { getDrugInteractionAlert } from '@/ai/flows/get-drug-interaction-alert-flow';
import { useToast } from '@/hooks/use-toast';

export default function MemberDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    pillCount: '30',
    pharmacyNumber: '',
    reminders: [] as string[],
  });

  useEffect(() => {
    const store = getStore();
    const found = store.familyMembers.find(m => m.id === id);
    if (found) setMember(found);

    // Check if there was a scanned medication in session storage
    const scanned = sessionStorage.getItem('scannedMed');
    if (scanned) {
      try {
        const parsed = JSON.parse(scanned);
        setNewMed(prev => ({
          ...prev,
          name: parsed.drugName || '',
          dosage: parsed.dosage || '',
          frequency: parsed.frequency || '',
        }));
        setIsAddingMed(true);
        sessionStorage.removeItem('scannedMed');
      } catch (e) {
        console.error("Failed to parse scanned med");
      }
    }
  }, [id]);

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please fill in all required fields." });
      return;
    }

    // Check interactions
    const interactionCheck = await getDrugInteractionAlert({
      newMedication: {
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency
      },
      existingMedications: member.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency
      }))
    });

    if (interactionCheck.hasInteraction) {
      if (!confirm(`${interactionCheck.warningMessage}\n\nDo you still want to add this medication?`)) {
        return;
      }
    }

    addMedication(member.id, {
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      pillCount: parseInt(newMed.pillCount),
      initialCount: parseInt(newMed.pillCount),
      pharmacyNumber: newMed.pharmacyNumber,
      startDate: new Date().toISOString(),
      reminders: newMed.reminders,
    });

    setIsAddingMed(false);
    setNewMed({ name: '', dosage: '', frequency: '', pillCount: '30', pharmacyNumber: '', reminders: [] });
    setMember({ ...member }); // Trigger re-render
    toast({ title: "Medication Added", description: `${newMed.name} and its reminders have been saved.` });
  };

  const handleMarkTaken = (medId: string) => {
    if (!member) return;
    const success = markAsTaken(member.id, medId);
    if (success) {
      setMember({ ...member });
      toast({ title: "Dose Logged", description: "Medication intake recorded successfully." });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Check pill count or medication status." });
    }
  };

  const addReminder = () => {
    if (!reminderTime) return;
    if (newMed.reminders.includes(reminderTime)) {
      toast({ title: "Duplicate Reminder", description: "This time is already set." });
      return;
    }
    setNewMed(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminderTime].sort()
    }));
    setReminderTime('');
  };

  const removeReminder = (time: string) => {
    setNewMed(prev => ({
      ...prev,
      reminders: prev.reminders.filter(t => t !== time)
    }));
  };

  if (!member) return null;

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Info */}
          <div className="w-full md:w-80 space-y-6">
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <div className="h-24 bg-primary/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-background flex items-center justify-center text-3xl font-bold text-primary translate-y-8">
                  {member.name.charAt(0)}
                </div>
              </div>
              <CardContent className="pt-12 text-center pb-6">
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <p className="text-muted-foreground">{member.age} Years • {member.bloodType}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">Active Patient</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Medical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Allergies</Label>
                  <p className="text-sm font-medium">{member.allergies || 'None listed'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Conditions</Label>
                  <p className="text-sm font-medium">{member.medicalConditions || 'None listed'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Primary Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold">{member.doctorName}</p>
                <p className="text-sm text-muted-foreground mb-3">{member.doctorContact}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`tel:${member.doctorContact}`}><Phone className="w-4 h-4 mr-2" /> Call Doctor</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1 rounded-xl shadow-sm">
                <TabsTrigger value="medications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Pill className="w-4 h-4 mr-2" /> Medications
                </TabsTrigger>
                <TabsTrigger value="adherence" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Activity className="w-4 h-4 mr-2" /> Health Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Active Prescriptions</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push('/medications/scan')} variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" /> Scan Label
                    </Button>
                    <Button onClick={() => setIsAddingMed(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Add Manually
                    </Button>
                  </div>
                </div>

                {isAddingMed && (
                  <Card className="border-2 border-primary/20 bg-primary/5 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">New Medication Entry</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Drug Name *</Label>
                          <Input value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="e.g. Lisinopril" />
                        </div>
                        <div className="space-y-2">
                          <Label>Dosage *</Label>
                          <Input value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} placeholder="e.g. 10mg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency *</Label>
                          <Input value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} placeholder="e.g. Once daily" />
                        </div>
                        <div className="space-y-2">
                          <Label>Pill Count</Label>
                          <Input type="number" value={newMed.pillCount} onChange={e => setNewMed({...newMed, pillCount: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Daily Reminders</Label>
                        <div className="flex gap-2">
                          <Input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-auto" />
                          <Button type="button" variant="secondary" onClick={addReminder}><Plus className="w-4 h-4 mr-2" /> Add Time</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newMed.reminders.map(time => (
                            <Badge key={time} variant="secondary" className="px-3 py-1 flex items-center gap-2 text-sm bg-white border shadow-sm">
                              <Clock className="w-3 h-3 text-primary" /> {time}
                              <button onClick={() => removeReminder(time)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                          {newMed.reminders.length === 0 && <p className="text-xs text-muted-foreground italic">No specific reminder times set yet.</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Pharmacy Number (for refills)</Label>
                        <Input value={newMed.pharmacyNumber} onChange={e => setNewMed({...newMed, pharmacyNumber: e.target.value})} placeholder="+1 555-555-0199" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button onClick={handleAddMed} className="flex-1">Save Prescription</Button>
                      <Button variant="ghost" onClick={() => setIsAddingMed(false)}>Cancel</Button>
                    </CardFooter>
                  </Card>
                )}

                <div className="grid gap-4">
                  {member.medications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-muted text-muted-foreground">
                      No medications tracked for this profile.
                    </div>
                  ) : (
                    member.medications.map(med => (
                      <Card key={med.id} className="border-none shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Pill className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{med.name}</h4>
                              <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                              
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${med.pillCount < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {med.pillCount} left
                                </span>
                                {med.lastTaken && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Taken {new Date(med.lastTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>

                              {med.reminders && med.reminders.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {med.reminders.map(time => (
                                    <span key={time} className="inline-flex items-center text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10">
                                      <Bell className="w-2.5 h-2.5 mr-1" /> {time}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 self-end md:self-center">
                            <Button size="sm" onClick={() => handleMarkTaken(med.id)} className="bg-accent hover:bg-accent/90">
                              Mark Taken
                            </Button>
                            {med.pillCount < 7 && med.pharmacyNumber && (
                              <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary/5" asChild>
                                <a href={`tel:${med.pharmacyNumber}`}><Phone className="w-4 h-4 mr-2" /> Refill</a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="adherence">
                <Card className="border-none shadow-md p-6 bg-white rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Adherence Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-primary/5 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">Doses Taken</p>
                      <p className="text-3xl font-bold text-primary">94%</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">On Time</p>
                      <p className="text-3xl font-bold text-accent">88%</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl text-center">
                      <p className="text-sm text-muted-foreground mb-1">Missed</p>
                      <p className="text-3xl font-bold text-orange-600">2</p>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l pt-8">
                    {[65, 80, 45, 90, 100, 85, 95].map((val, i) => (
                      <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group" style={{ height: `${val}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{val}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 px-4 text-xs text-muted-foreground">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
