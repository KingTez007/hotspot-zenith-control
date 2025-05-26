
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Profile, getProfile } from '@/lib/auth';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  isCoordinator: false,
  isUser: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Fetch profile when user logs in - use setTimeout to avoid auth callback issues
          setTimeout(async () => {
            try {
              const userProfile = await getProfile();
              console.log('Fetched profile after auth change:', userProfile);
              setProfile(userProfile);
            } catch (error) {
              console.error('Error fetching profile after auth change:', error);
            } finally {
              setIsLoading(false);
            }
          }, 100);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        getProfile().then(userProfile => {
          console.log('Initial profile fetch:', userProfile);
          setProfile(userProfile);
          setIsLoading(false);
        }).catch(error => {
          console.error('Error fetching initial profile:', error);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isCoordinator = profile?.role === 'coordinator';
  const isUser = profile?.role === 'user';

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      isAdmin, 
      isCoordinator,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
