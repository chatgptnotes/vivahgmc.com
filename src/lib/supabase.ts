import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Development logging
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : 'MISSING',
    key: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'MISSING',
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.';
  console.error('❌ Supabase Error:', errorMsg);
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'vivahgmc-web',
    },
  },
});

// Database Types
export interface Profile {
  id: string;
  user_id: string;
  user_type: 'parent' | 'child';
  status: 'pending' | 'approved' | 'rejected';

  // Child info
  child_name: string;
  child_age: number;
  child_height: string;
  child_profession: string;
  child_workplace: string;
  child_education: string;
  child_location: string;

  // Parent/Alumni info
  parent_name: string;
  batch_year: number;
  parent_city: string;

  // Preferences
  pref_age_min?: number;
  pref_age_max?: number;
  pref_profession?: string;

  // Meta
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
}

export interface ProfilePhoto {
  id: string;
  profile_id: string;
  photo_url: string;
  is_primary: boolean;
  uploaded_at: string;
}

export interface ConnectionRequest {
  id: string;
  from_profile_id: string;
  to_profile_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  connection_id: string;
  sender_profile_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface ContactExchange {
  id: string;
  connection_id: string;
  initiated_by: string;
  phone?: string;
  email?: string;
  created_at: string;
}
