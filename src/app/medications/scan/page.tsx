"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, RefreshCw, Check, X, Pill } from 'lucide-react';
import { scanPrescriptionForMedicationDetails } from '@/ai/flows/scan-prescription-for-medication-details';
import { useToast } from '@/hooks/use-toast';

export default function MedicationScan() {
  const router = useRouter();
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      toast({ variant: "destructive", title: "Camera Error", description: "Could not access camera." });
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUri = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(dataUri);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const processPhoto = async () => {
    if (!photo) return;
    setIsScanning(true);
    try {
      const result = await scanPrescriptionForMedicationDetails({ photoDataUri: photo });
      // In a real app we'd pass this to the form. Here we mock navigation with query params or session storage
      sessionStorage.setItem('scannedMed', JSON.stringify(result));
      toast({ title: "Analysis Complete", description: `Found ${result.drugName}` });
      router.back();
    } catch (err) {
      toast({ variant: "destructive", title: "OCR Error", description: "Failed to analyze label." });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle>Prescription Scanner</CardTitle>
            <CardDescription>Position the label clearly within the frame for best results.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {!stream && !photo && (
                <Button onClick={startCamera} size="lg" className="rounded-full h-20 w-20 flex flex-col items-center justify-center p-0">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">Start</span>
                </Button>
              )}
              
              {stream && (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <Button onClick={takePhoto} size="lg" className="absolute bottom-6 rounded-full w-16 h-16 shadow-xl border-4 border-white">
                    <div className="w-10 h-10 rounded-full bg-white" />
                  </Button>
                </>
              )}

              {photo && (
                <div className="relative w-full h-full">
                  <img src={photo} className="w-full h-full object-cover" alt="Captured" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                      <p className="font-bold text-lg animate-pulse">AI is analyzing label...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 flex gap-4">
            {photo && !isScanning && (
              <>
                <Button onClick={processPhoto} className="flex-1 bg-accent">
                  <Check className="w-4 h-4 mr-2" /> Use Photo
                </Button>
                <Button onClick={() => { setPhoto(null); startCamera(); }} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retake
                </Button>
              </>
            )}
            {!photo && !stream && (
               <Button onClick={() => router.back()} variant="ghost" className="w-full">
                  <X className="w-4 h-4 mr-2" /> Cancel
               </Button>
            )}
          </div>
        </Card>

        <div className="mt-8 flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="p-2 bg-primary/10 rounded-lg">
             <Pill className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary">Pro Tip</h4>
            <p className="text-sm text-muted-foreground">Make sure the text isn't blurry. The AI extracts Drug Name, Dosage, and Frequency automatically.</p>
          </div>
        </div>
      </main>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}