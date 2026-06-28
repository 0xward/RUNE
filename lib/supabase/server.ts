export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function assertSupabaseConfigured() {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
}
