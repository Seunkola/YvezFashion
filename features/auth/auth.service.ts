// Auth Service 

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { AuthError, Session, User } from '@supabase/supabase-js'

const supabase = getBrowserSupabaseClient()

// -------- AUTH FUNCTIONS --------

// Sign up with email + password
export async function signUp({email, password, ...profileData}: any) {
  //Sign up with Supabase Auth
  const {data: authData, error: signUpError } = await supabase.auth.signUp({email, password});

  if(signUpError) return { error: signUpError}

  //insert to customers table in database
  const {error: insertError} = await supabase.from('customers').insert({
    auth_user_id: authData?.user?.id,
    email,
    full_name: profileData.full_name,
    phone: profileData.phone,
    address: profileData.address,
    city: profileData.city,
    country: profileData.country,
    postal_code: profileData.postal_code
  });

  if(insertError) return {error: insertError};

  return { user: authData.user, session: authData.session};

}

// Login with email + password
export async function login(
  email: string,
  password: string
): Promise<{ data: any, error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// Logout current user
export async function logout(): Promise<{ error: AuthError | null }> {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  // Extra safety — manually clear cookies
  document.cookie = 'sb-access-token=; Max-Age=0; path=/'
  document.cookie = 'sb-refresh-token=; Max-Age=0; path=/'
  return { error }
}

// Login with an OAuth provider (e.g., Google, GitHub)
export async function loginWithProvider(
  provider: 'google' | 'github'
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  return { error }
}

// Request password reset email
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`, // Where user will reset password
  })
  return { error }
}

// Update password after reset
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error }
}

// Get current session
export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

// Admin Sign up with email + password
export async function adminSignup(email:string, password:string, full_name: string) {
 // Sign up in Supabase Auth
  const{data: authData, error:signUpError} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {full_name,  role: 'admin'},
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/welcome`
    }
  });

  return { authData, signUpError};
}

// Admin User Login with Email + password
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

//Admin logout
export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}