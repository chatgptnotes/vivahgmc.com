// Environment variable checker
export const checkEnvironment = () => {
  const config = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    projectId: import.meta.env.VITE_PROJECT_ID,
    projectName: import.meta.env.VITE_PROJECT_NAME,
  };

  console.log('🔍 Environment Check:', {
    supabaseUrl: config.supabaseUrl ? '✅ Set' : '❌ Missing',
    supabaseAnonKey: config.supabaseAnonKey ? '✅ Set' : '❌ Missing',
    projectId: config.projectId ? '✅ Set' : '❌ Missing',
    projectName: config.projectName ? '✅ Set' : '❌ Missing',
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
  });

  const missing = [];
  if (!config.supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!config.supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('🔧 Please check your Vercel environment variable configuration');
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};
