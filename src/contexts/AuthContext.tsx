import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  trialDaysRemaining: number;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'antitrader_demo_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicialização do estado de autenticação
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Modo Demonstração / Sandbox local (sem travar caso as chaves ainda não tenham sido configuradas)
      try {
        const cached = localStorage.getItem(DEMO_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser(parsed);
        }
      } catch (e) {
        console.warn('Erro ao carregar usuário demo local:', e);
      }
      setLoading(false);
      return;
    }

    // Modo Supabase Real
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (mounted) {
          setSession(session);
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
              avatarUrl: session.user.user_metadata?.avatar_url,
              createdAt: session.user.created_at,
              isDemo: false,
            });
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão Supabase:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        setUser({
          id: newSession.user.id,
          email: newSession.user.email || '',
          name: newSession.user.user_metadata?.full_name || newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0],
          avatarUrl: newSession.user.user_metadata?.avatar_url,
          createdAt: newSession.user.created_at,
          isDemo: false,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Cálculo dos dias restantes de degustação (7 dias a partir da criação)
  const trialDaysRemaining = useMemo(() => {
    if (!user) return 7;
    try {
      const createdDate = new Date(user.createdAt).getTime();
      const now = Date.now();
      const elapsedDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
      return Math.max(0, 7 - elapsedDays);
    } catch {
      return 7;
    }
  }, [user]);

  // Login com E-mail e Senha
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Mock Sandbox Login
      const demoUser: AuthUser = {
        id: 'demo-user-' + Date.now(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        isDemo: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: traduzirErroSupabase(error.message) };
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Erro inesperado ao realizar login.' };
    }
  };

  // Cadastro com 7 Dias Grátis
  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Mock Sandbox Cadastro
      const demoUser: AuthUser = {
        id: 'demo-user-' + Date.now(),
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
        isDemo: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null, needsEmailConfirmation: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        return { error: traduzirErroSupabase(error.message) };
      }

      // Se o Supabase exigir confirmação por e-mail e não tiver sessão ativa
      const needsConfirmation = !data.session;
      return { error: null, needsEmailConfirmation: needsConfirmation };
    } catch (e: any) {
      return { error: e.message || 'Erro inesperado ao criar conta.' };
    }
  };

  // Login com Google OAuth
  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Mock Sandbox Login Google
      const demoUser: AuthUser = {
        id: 'google-user-' + Date.now(),
        email: 'investidor.google@gmail.com',
        name: 'Investidor Google',
        createdAt: new Date().toISOString(),
        isDemo: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app',
        },
      });
      if (error) {
        return { error: traduzirErroSupabase(error.message) };
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Erro ao conectar com Google.' };
    }
  };

  // Recuperação de Senha
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null }; // Simula envio com sucesso no modo demo
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) {
        return { error: traduzirErroSupabase(error.message) };
      }
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Erro ao solicitar recuperação de senha.' };
    }
  };

  // Logout
  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Erro ao deslogar:', e);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        trialDaysRemaining,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

// Utilitário para traduzir mensagens de erro do Supabase para o português do investidor
function traduzirErroSupabase(msg: string): string {
  if (!msg) return 'Ocorreu um erro. Tente novamente.';
  const lower = msg.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
    return 'E-mail ou senha incorretos. Verifique suas credenciais.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Este e-mail já possui cadastro. Clique na aba "Entrar".';
  }
  if (lower.includes('password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres para sua segurança.';
  }
  if (lower.includes('rate limit')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes.';
  }
  if (lower.includes('email not confirmed')) {
    return 'E-mail ainda não confirmado. Verifique sua caixa de entrada ou spam.';
  }
  return msg;
}
