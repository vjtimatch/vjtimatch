"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Users, Calendar, LogOut } from 'lucide-react';

export default function ComingSoonPage() {
  const [userCount, setUserCount] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/signup');
      } else {
        setUser(currentUser);
      }
    });

    fetchUserCount();

    return () => unsubscribe();
  }, [router]);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/user-count');
      const data = await response.json();
      setUserCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const progress = Math.min((userCount / 50) * 100, 100);

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="relative bg-card border border-border rounded-lg p-8 md:p-12 shadow-lg text-center">
          
          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome!</h1>
            <p className="text-muted-foreground text-lg">
              Thanks for signing up
            </p>
          </div>

          {/* Coming Soon Badge
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8">
            Launching Soon
          </div> */}

          {/* User Count */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <h2 className="text-4xl font-bold">{userCount}</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Students have already joined
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {50 - userCount > 0 ? `${50 - userCount} more until we reach 50 users` : 'Target reached! 🎉'}
            </p>
          </div>

          {/* Launch Info */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <h3 className="font-bold text-lg">Launch Date</h3>
            </div>
            <p className="text-2xl font-bold mb-2">November 1st, 2025</p>
            <p className="text-sm text-muted-foreground">
              We'll notify you when the site goes live. Check back soon!
            </p>
          </div>

          {/* User Info */}
          {user && (
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
