
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Voucher {
  id: string;
  code: string;
  package_type: string;
  value: number;
  price: number;
  status: string;
  description: string | null;
  created_at: string;
  used_at: string | null;
  used_by: string | null;
  coordinator_id: string | null;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load vouchers');
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoucher = async (
    packageType: string,
    value: number,
    price: number,
    quantity: number,
    description?: string
  ) => {
    try {
      const newVouchers = [];
      
      for (let i = 0; i < quantity; i++) {
        const code = generateVoucherCode(packageType, value);
        
        const { data, error } = await supabase
          .from('vouchers')
          .insert({
            code,
            package_type: packageType,
            value,
            price,
            description: description || `${value} ${packageType === 'time' ? 'minutes' : 'MB'} access`,
            status: 'active'
          })
          .select()
          .single();

        if (error) throw error;
        newVouchers.push(data);
      }

      setVouchers(prev => [...newVouchers, ...prev]);
      toast.success(`Generated ${quantity} voucher(s) successfully!`);
      return newVouchers;
    } catch (error) {
      console.error('Error generating vouchers:', error);
      toast.error('Failed to generate vouchers');
      throw error;
    }
  };

  const generateVoucherCode = (type: string, value: number) => {
    const prefix = type === 'time' ? 'TIME' : 'DATA';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${value}-${random}`;
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return {
    vouchers,
    isLoading,
    generateVoucher,
    refreshVouchers: fetchVouchers
  };
};
