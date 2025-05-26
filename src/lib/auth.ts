
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
    console.log('Attempting to sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    });
    
    if (error) {
      console.error('Supabase sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful:', data);
    return data;
  } catch (error: any) {
    console.error("Sign in error:", error);
    
    // Handle specific Supabase errors
    if (error.message?.includes('Email logins are disabled')) {
      throw new Error("Email authentication is not enabled. Please contact the administrator.");
    } else if (error.message?.includes('Invalid login credentials')) {
      throw new Error("Invalid email or password. Please check your credentials.");
    } else {
      throw new Error(error.message || "Failed to sign in");
    }
  }
}

export async function signUp(email: string, password: string, full_name: string, role: UserRole = 'user') {
  // Validate password length to prevent 422 errors
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  
  try {
    console.log('Attempting to sign up with email:', email, 'role:', role);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name,
          role: role
        }
      }
    });
    
    if (error) {
      console.error('Supabase sign up error:', error);
      throw error;
    }
    
    console.log('Sign up successful:', data);
    return data;
  } catch (error: any) {
    console.error("Sign up error:", error);
    
    // Handle specific Supabase errors
    if (error.message?.includes('Email signups are disabled')) {
      throw new Error("Email registration is not enabled. Please contact the administrator.");
    } else if (error.message?.includes('User already registered')) {
      throw new Error("An account with this email already exists. Please try signing in instead.");
    } else {
      throw new Error(error.message || "Failed to sign up");
    }
  }
}

export async function signOut() {
  try {
    console.log('Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('Sign out successful');
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('No session found for profile fetch');
      return null;
    }
    
    console.log('Fetching profile for user:', session.user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    console.log('Profile fetched successfully:', data);
    return data as Profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function updateProfile(profile: Partial<Profile>) {
  try {
    console.log('Updating profile:', profile);
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id!)
      .select();
    
    if (error) throw error;
    console.log('Profile updated successfully:', data[0]);
    return data[0] as Profile;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw new Error(error.message || "Failed to update profile");
  }
}
