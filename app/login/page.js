"use client";

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkUserProfile(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkUserProfile = async (uid) => {
    try {
      const response = await fetch(`/api/users/${uid}`);
      const data = await response.json();
      
      if (data.user?.profileCompleted) {
        // router.push('/feed');
        router.push('/comingsoon')
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;

      if (
        !email.endsWith('.vjti.ac.in') &&
        email !== 'vjtimatch@gmail.com' &&
        email !== 'y.ultra.pro.super.max2@gmail.com' &&
        email !== 'y.ultra.pro.super.max@gmail.com' &&
        email !== 'brucewayne305305@gmail.com'
      ) {
          setError('Only college emails (.vjti.ac.in) or authorized emails are allowed!');
          await auth.signOut();
          setLoading(false);
          return;
      }


      // Check if user exists in database
      const response = await fetch(`/api/users/${user.uid}`);
      const data = await response.json();

      if (!data.user) {
        // User doesn't exist - show error
        setError('No account found. Please sign up first!');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // User exists, proceed to check profile
      await checkUserProfile(user.uid);

    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative bg-card border border-border rounded-lg p-8 shadow-lg">
          <form className={cn("flex flex-col gap-6")}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Login with your college Google account
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded text-sm text-center">
                  {error}
                </div>
              )}

              <Field>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full bg-white text-white hover:bg-gray-100 flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    'Logging in...'
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Login with Google
                    </>
                  )}
                </Button>
              </Field>

              <p className="text-xs text-center text-muted-foreground mt-2">
              By logging in, you agree to our{' '}
              <a 
                href="https://termsncondition.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-primary"
              >
                Terms and Conditions
              </a>.
              </p>
              
              <FieldDescription className="text-center text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
