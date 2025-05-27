
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  voucher_code: string;
  package_type: string;
  amount: number;
  customer: string | null;
  payment_method: string;
  coordinator_id: string | null;
  created_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction recorded successfully');
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to record transaction');
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription
    const subscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    transactions,
    isLoading,
    addTransaction,
    refreshTransactions: fetchTransactions
  };
};
