import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [instaladoSucesso, setInstaladoSucesso] = useState(false);

  // Se já estiver rodando instalado em modo standalone, esconde o botão
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstaladoSucesso(true);
        setTimeout(() => setInstaladoSucesso(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Botão no Header (aparece se for instalável ou se for iOS ou para dar opção PWA) */}
      {(isInstallable || isIOS) && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer animate-in fade-in"
          title="Instalar AntiTrader como aplicativo PWA direto no seu celular ou desktop"
        >
          {instaladoSucesso ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Instalado!</span>
            </>
          ) : (
            <>
              {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">App</span>
            </>
          )}
        </button>
      )}

      {/* Modal Guiado para iOS Safari */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="AntiTrader Logo" className="w-7 h-7 rounded-lg shadow-xs" />
                <h3 className="font-bold text-sm text-slate-900">Instalar AntiTrader no iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              No Safari do iPhone ou iPad, instale o <strong>AntiTrader</strong> diretamente na sua tela de início sem precisar da App Store:
            </p>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">1</span>
                <div>
                  Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima <span className="font-mono text-emerald-600 font-bold">↑</span> na barra do Safari).
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">2</span>
                <div>
                  Role para baixo e selecione <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">3</span>
                <div>
                  Toque em <strong>Adicionar</strong> no canto superior direito. Pronto! O ícone do AntiTrader ficará na sua tela.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
