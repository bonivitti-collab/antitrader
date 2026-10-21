import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileMenuProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigateToPlans?: () => void;
}

export function UserProfileMenu({ onOpenAuth, onNavigateToPlans }: UserProfileMenuProps) {
  const { user, signOut, trialDaysRemaining, isConfigured } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onOpenAuth('login')}
          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        >
          Entrar
        </button>
        <button
          onClick={() => onOpenAuth('signup')}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>7 Dias Grátis</span>
        </button>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
        title="Configurações da Conta e Assinatura"
      >
        {/* Avatar com Inicial */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
          {initial}
        </div>

        {/* Nome / Badge de Dias Restantes (visível em telas médias e maiores) */}
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-[11px] font-bold text-slate-800 max-w-[110px] truncate">
            {user.name || user.email.split('@')[0]}
          </span>
          <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {trialDaysRemaining > 0 ? `${trialDaysRemaining}d teste grátis` : 'Assinante Pro'}
          </span>
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menu Suspenso */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in text-slate-800">
          
          {/* Cabeçalho do Menu */}
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user.name || 'Investidor AntiTrader'}
            </div>
            <div className="text-[11px] text-slate-500 truncate font-mono">
              {user.email}
            </div>

            {/* Status do Trial */}
            <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Degustação Grátis:</span>
              </div>
              <span className="font-mono font-black text-emerald-800 text-[11px] bg-white px-1.5 py-0.5 rounded shadow-2xs">
                {trialDaysRemaining} {trialDaysRemaining === 1 ? 'dia restante' : 'dias restantes'}
              </span>
            </div>
          </div>

          {/* Links e Ações */}
          <div className="p-1 space-y-0.5">
            {onNavigateToPlans && (
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onNavigateToPlans();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 rounded-lg transition-colors cursor-pointer text-left"
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Planos &amp; Assinatura</span>
              </button>
            )}

            <div className="border-t border-slate-100 my-1" />

            <button
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sair da Conta</span>
            </button>
          </div>

          {/* Footer do Menu */}
          <div className="px-3 py-2 bg-slate-50/70 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Sessão Criptografada
            </span>
            <span className="font-mono text-[9px] text-slate-400">
              {isConfigured ? 'Supabase Auth' : 'Sandbox Local'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
