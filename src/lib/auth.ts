import { supabase } from './supabaseClient'

export async function sendMagicLink(email: string) {
  if (!supabase) return { error: new Error('Supabase ainda não foi configurado.') }

  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  })
}

export async function signOut() {
  if (!supabase) return { error: null }
  return supabase.auth.signOut()
}
