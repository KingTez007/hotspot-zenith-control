
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HotspotUser {
  id: string;
  name: string;
  device_type: string;
  ip_address: string;
  mac_address: string | null;
  session_start: string;
  data_used: number;
  status: string;
  voucher_code: string | null;
  location: string | null;
  created_at: string;
  updated_at: string | null;
}

export const useHotspotUsers = () => {
  const [users, setUsers] = useState<HotspotUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('hotspot_users')
        .select('*')
        .order('session_start', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('hotspot_users')
        .update({ status: 'disconnected' })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting user:', error);
      toast.error('Failed to disconnect user');
    }
  };

  const addUser = async (userData: Omit<HotspotUser, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hotspot_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      setUsers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('hotspot_users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hotspot_users' },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    users,
    isLoading,
    disconnectUser,
    addUser,
    refreshUsers: fetchUsers
  };
};
