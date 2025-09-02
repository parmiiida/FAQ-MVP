import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vciobtmysjxmljupfytw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaW9idG15c2p4bWxqdXBmeXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDM5NzMsImV4cCI6MjA3MTc3OTk3M30.hpGr3S8docfaBzvOgrjlOXJ-KbHmpC0czQWlJRhauVE'
);

interface FAQ {
  id: string;
  question: string;
  answer: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface FAQInsert {
  question: string;
  answer: string;
  user_id: string;
}

export class FAQService {
  static async testConnection(): Promise<void> {
    console.log('Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase.from('faqs').select('count').limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    console.log('Connection test successful');
  }

  static async getFAQs(userId: string): Promise<FAQ[]> {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFAQs:', error);
      throw error;
    }
  }

  static async addFAQ(faq: FAQInsert): Promise<FAQ> {


    try {
      console.log('Attempting to add FAQ:', faq);

      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('FAQ added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in addFAQ:', error);
      throw error;
    }
  }

  static async updateFAQ(id: string, updates: Partial<FAQInsert>): Promise<FAQ> {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating FAQ:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateFAQ:', error);
      throw error;
    }
  }

  static async deleteFAQ(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteFAQ:', error);
      throw error;
    }
  }
}
