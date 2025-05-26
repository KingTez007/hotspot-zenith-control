
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'coordinator' | 'user';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
}

export async function signUp(email: string, password: string, full_name: string, role: UserRole = 'user') {
  // Validate password length to prevent 422 errors
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name,
          role: role // Send role to be used in the trigger
        }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(error.message || "Failed to sign up");
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function updateProfile(profile: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id!)
      .select();
    
    if (error) throw error;
    return data[0] as Profile;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
}
