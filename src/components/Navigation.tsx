import Link from 'next/link';
import { Heart, Users, Home, ShieldAlert, Activity } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:top-0 md:bottom-auto md:border-b md:bg-white/80 md:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="hidden md:flex items-center space-x-2 text-primary">
            <Heart className="w-8 h-8" />
            <span className="text-xl font-bold font-headline">CarePlan Nexus</span>
          </Link>
          
          <div className="flex flex-1 justify-around md:justify-end md:space-x-8">
            <Link href="/" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Home className="w-6 h-6" />
              <span className="text-xs md:text-sm font-medium">Home</span>
            </Link>
            <Link href="/family" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-xs md:text-sm font-medium">Family</span>
            </Link>
            <Link href="/adherence" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Activity className="w-6 h-6" />
              <span className="text-xs md:text-sm font-medium">Insights</span>
            </Link>
            <Link href="/emergency-access" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 text-destructive hover:text-destructive/80 transition-colors font-bold">
              <ShieldAlert className="w-6 h-6" />
              <span className="text-xs md:text-sm font-medium">SOS Card</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}