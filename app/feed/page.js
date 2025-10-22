"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, X, User, Users, LogOut } from 'lucide-react';

export default function FeedPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadFeed(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadFeed = async (uid) => {
    try {
      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });

      const data = await response.json();
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading feed:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (!user || users.length === 0 || swiping) return;

    setSwiping(true);
    const targetUser = users[currentIndex];

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          targetUid: targetUser.uid,
          direction
        })
      });

      const data = await response.json();

      if (data.isMatch) {
        setMatchedUser(targetUser);
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 3000);
      }

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setSwiping(false);
      }, 300);

    } catch (error) {
      console.error('Error swiping:', error);
      setSwiping(false);
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

  const currentUser = users[currentIndex];

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading profiles...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative bg-card border border-border rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">No more profiles, refresh page</h2>
            <p className="text-muted-foreground mb-6">Check back later for new people</p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => router.push('/matches')}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                <Users className="w-4 h-4 mr-2" />
                View Matches
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col p-4 overflow-hidden">
      {/* Match Popup */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card border border-border p-8 rounded-lg text-center shadow-2xl max-w-sm mx-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">It's a Match!</h2>
            <p className="text-muted-foreground">
              You and <span className="font-bold text-foreground">{matchedUser?.name}</span> liked each other
            </p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="w-full max-w-md mx-auto mb-4 flex justify-between items-center bg-card border border-border p-4 rounded-lg shadow">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/profile')}
          className="hover:bg-muted"
        >
          <User className="w-4 h-4 mr-1" />
          Profile
        </Button>
        <h1 className="text-xl font-bold"></h1>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/matches')}
          className="hover:bg-muted"
        >
          <Users className="w-4 h-4 mr-1" />
          Matches
        </Button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className={cn(
          "bg-card border border-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300",
          swiping ? "scale-95 opacity-50" : "scale-100 opacity-100"
        )}>
          <div className="relative h-[500px]">
            <img 
              src={currentUser.photoURL || 'https://via.placeholder.com/400x600?text=No+Photo'} 
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{currentUser.name}</h2>
              {currentUser.bio && (
                <p className="text-sm mb-2 line-clamp-3 text-gray-200">{currentUser.bio}</p>
              )}
              {currentUser.instagram && (
                <p className="text-sm text-gray-300">@{currentUser.instagram}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-8 p-6 bg-card">
            <Button 
              onClick={() => handleSwipe('left')}
              disabled={swiping}
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              <X className="w-8 h-8" />
            </Button>
            <Button 
              onClick={() => handleSwipe('right')}
              disabled={swiping}
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Counter & Logout */}
      <div className="w-full max-w-md mx-auto mt-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {users.length - currentIndex - 1} profile{users.length - currentIndex - 1 !== 1 ? 's' : ''} remaining
        </p>
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
}
