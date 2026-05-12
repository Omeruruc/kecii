import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Goat {
  id: string;
  owner_name: string;
  price: number;
  payment_status: 'paid' | 'partial' | 'unpaid';
  paid_amount: number;
  remaining_amount: number;
  created_at: string;
  notes?: string;
}

// Goat operations
export async function fetchGoats() {
  const { data, error } = await supabase
    .from('goats')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching goats:', error);
    return [];
  }
  
  return data as Goat[];
}

export async function addGoat(goat: Omit<Goat, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('goats')
    .insert(goat)
    .select();
  
  if (error) {
    console.error('Error adding goat:', error);
    throw error;
  }
  
  return data[0] as Goat;
}

export async function updateGoat(id: string, updates: Partial<Goat>) {
  const { data, error } = await supabase
    .from('goats')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating goat:', error);
    throw error;
  }
  
  return data[0] as Goat;
}

export async function deleteGoat(id: string) {
  const { error } = await supabase
    .from('goats')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting goat:', error);
    throw error;
  }
  
  return true;
}

export async function getTotalStats() {
  const { data, error } = await supabase
    .from('goats')
    .select('price, paid_amount, payment_status');
  
  if (error) {
    console.error('Error fetching stats:', error);
    return { totalSales: 0, totalPaid: 0, totalRemaining: 0, totalGoats: 0 };
  }
  
  const stats = (data as Goat[]).reduce((acc, goat) => {
    return {
      totalSales: acc.totalSales + goat.price,
      totalPaid: acc.totalPaid + goat.paid_amount,
      totalRemaining: acc.totalRemaining + (goat.price - goat.paid_amount),
      totalGoats: acc.totalGoats + 1
    };
  }, { totalSales: 0, totalPaid: 0, totalRemaining: 0, totalGoats: 0 });
  
  return stats;
}