import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yyfzasangyvqglqiaiod.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Znphc2FuZ3l2cWdscWlhaW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzUzNTQsImV4cCI6MjA5NzY1MTM1NH0.QKd7zZ8bqE1Spm32YXhUHpewlKq3MMpdRJxfRbE7s7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count');
    if (error) {
      console.error('Connection failed:', error);
      return false;
    }
    console.log('Connection successful!');
    return true;
  } catch (err) {
    console.error('Connection error:', err);
    return false;
  }
};