"use client";

import { useEffect, useState } from 'react';
import { getStore, FamilyMember } from '@/app/lib/store';
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, TrendingUp, Calendar, AlertCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdherenceTracker() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setMembers(getStore().familyMembers);
  }, []);

  const handleGenerateReport = (name: string) => {
    toast({ title: "Report Generating", description: `Compiling 30-day health summary for ${name}...` });
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Family Health Insights
          </h1>
          <p className="text-muted-foreground">30-day adherence analytics and summary reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Avg Adherence</span>
              </div>
              <p className="text-3xl font-bold">92.4%</p>
              <p className="text-xs text-green-600 font-medium mt-1">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-accent mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Doses Tracked</span>
              </div>
              <p className="text-3xl font-bold">1,248</p>
              <p className="text-xs text-muted-foreground mt-1">Over past 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Missed Protocols</span>
              </div>
              <p className="text-3xl font-bold">4</p>
              <p className="text-xs text-orange-600 font-medium mt-1">Escalated to caregiver</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-6">Member Breakdown</h2>
        <div className="space-y-6">
          {members.length === 0 ? (
             <p className="text-center text-muted-foreground py-12 bg-white rounded-3xl border">Add family members to view adherence tracking.</p>
          ) : (
            members.map(member => (
              <Card key={member.id} className="border-none shadow-md overflow-hidden bg-white">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.medications.length} Active Medications</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleGenerateReport(member.name)}>
                      <FileText className="w-4 h-4 mr-2" /> Generate Doctor Report (PDF)
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">30-Day Medication Adherence</Label>
                        <span className="text-sm font-bold text-primary">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>

                    <div className="grid grid-cols-7 gap-1 h-12">
                      {[...Array(28)].map((_, i) => (
                        <div key={i} 
                          className={`rounded-sm ${Math.random() > 0.1 ? 'bg-primary/40' : 'bg-red-400/40'} border border-white/20`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}