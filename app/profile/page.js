"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LogOut } from 'lucide-react';


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [instagram, setInstagram] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/150/cccccc/666666?text=Upload+Photo');
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Don't set Google photo as default
      } else {
        router.push('/signup');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageChanged(true);
      setError(''); // Clear any previous error
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if image was uploaded
    if (!imageChanged) {
      setError('Please upload a profile photo');
      return;
    }

    setLoading(true);

    try {
      let photoURL = '';

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append('image', image);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      
      if (uploadData.url) {
        photoURL = uploadData.url;
      } else {
        setError('Failed to upload image');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          bio,
          gender,
          instagram,
          photoURL
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // router.push('/feed');
        router.push('/comingsoon')
      } else {
        setError(data.error || 'Failed to update profile');
      }

    } catch (error) {
      setError(error.message);
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="relative bg-card border border-border rounded-lg p-8 shadow-lg">
          {/* Logout Button - Top Right */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="absolute top-4 right-4 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>

          <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6")}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                <p className="text-muted-foreground text-sm">
                  Tell us more about yourself
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded text-sm text-center">
                  {error}
                </div>
              )}

              {/* Profile Picture */}
              <Field>
                <FieldLabel>Profile Photo *</FieldLabel>
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className={cn(
                      "w-32 h-32 rounded-full object-cover border-4",
                      imageChanged ? "border-border" : "border-destructive/50"
                    )}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    className={cn(
                      "bg-white hover:bg-gray-100",
                      imageChanged ? "text-black" : "text-destructive border-destructive"
                    )}
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    {imageChanged ? 'Change Photo' : 'Upload Photo (Required)'}
                  </Button>
                  <input 
                    id="file-input"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {!imageChanged && (
                  <FieldDescription className="text-destructive text-center">
                    Please upload your photo to continue
                  </FieldDescription>
                )}
              </Field>

              {/* Bio */}
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-input rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                  placeholder="Tell us about yourself..."
                  rows="3"
                  required
                  maxLength={200}
                />
                <FieldDescription>{bio.length}/200 characters</FieldDescription>
              </Field>

              {/* Gender */}
              <Field>
                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                <select 
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border border-input rounded-md bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              {/* Instagram */}
              <Field>
                <FieldLabel htmlFor="instagram">Instagram Username</FieldLabel>
                <Input 
                  id="instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@username"
                />
                <FieldDescription>Optional</FieldDescription>
              </Field>

              <Field>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-gray-100"
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
