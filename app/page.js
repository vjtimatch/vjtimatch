"use client";
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, check profile status
        checkProfileAndRedirect(user.uid);
      } else {
        // User not logged in, show landing page
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkProfileAndRedirect = async (uid) => {
    try {
      const response = await fetch(`/api/users/${uid}`);
      const data = await response.json();
      
      if (data.user?.profileCompleted) {
        router.push('/feed');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-purple-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden">
      <div className="w-full max-w-xs px-4">
          <LoginForm />
      </div>
    </div>


    // <div className="min-h-screen bg-color black flex items-center justify-center p-4">
    //   <div className="max-w-4xl w-full">
    //     {/* Hero Section */}
    //     <div className="text-center mb-12">
    //       <h1 className="text-6xl font-bold text-white mb-4">
    //         title
    //       </h1>
    //       <p className="text-2xl text-white/90 mb-2">
    //         Find your perfect match on campus
    //       </p>
    //       <p className="text-lg text-white/80">
    //         Connect with students from your college
    //       </p>
    //     </div>

    //     {/* CTA Buttons */}
    //     <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
    //       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    //         Get Started
    //       </h2>
          
    //       <button 
    //         onClick={() => router.push('/signup')}
    //         className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg font-semibold text-lg mb-4 hover:shadow-lg transform hover:scale-105 transition"
    //       >
    //         Create Account
    //       </button>
          
    //       <button 
    //         onClick={() => router.push('/login')}
    //         className="w-full bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition"
    //       >
    //         I Already Have an Account
    //       </button>

    //       <p className="text-center text-gray-500 text-sm mt-6">
    //         By signing up, you agree to use your college email
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
}
