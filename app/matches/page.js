"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Mail, Instagram } from 'lucide-react';

export default function MatchesPage() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadMatches(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadMatches = async (uid) => {
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });

      const data = await response.json();
      setMatches(data.matches || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading matches:', error);
      setLoading(false);
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-4 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex justify-between items-center bg-card border border-border p-4 rounded-lg shadow">
          <Button 
            variant="ghost"
            onClick={() => router.push('/feed')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Matches</h1>
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Matches Content */}
      <div className="max-w-6xl mx-auto">
        {matches.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">Keep swiping to find your perfect match</p>
            <Button 
              onClick={() => router.push('/feed')}
              className="bg-white text-black hover:bg-gray-100"
            >
              Start Swiping
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-card border border-border p-6 rounded-lg shadow mb-6 text-center">
              <p className="text-xl">
                You have <span className="font-bold text-3xl">{matches.length}</span> match{matches.length !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div 
                  key={match.uid}
                  className="bg-card border border-border rounded-lg shadow-md overflow-hidden hover:shadow-2xl transform hover:scale-105 transition"
                >
                  <div className="relative h-72">
                    <img 
                      src={match.photoURL || 'https://via.placeholder.com/300x400?text=No+Photo'} 
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl font-bold mb-2">{match.name}</h3>
                    {match.bio && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {match.bio}
                      </p>
                    )}
                    <div className="space-y-2">
                      {match.instagram && (
                        <a 
                          href={`https://instagram.com/${match.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm hover:underline"
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          @{match.instagram}
                        </a>
                      )}
                      <a 
                        href={`mailto:${match.email}`}
                        className="flex items-center text-sm hover:underline"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
