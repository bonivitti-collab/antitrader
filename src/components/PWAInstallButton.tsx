import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  X,
  Check,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  ExternalLink,
  Zap
} from 'lucide-react';
import { usePWAInstall, PlatformType } from '../usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, detectedPlatform, install } = usePWAInstall();
  const [modalAberto, setModalAberto] = useState(false);
  const [activeTab, setActiveTab] = useState<PlatformType>(detectedPlatform);
  const [instalando, setInstalando] = useState(false);
  const [instaladoSucesso, setInstaladoSucesso] = useState(false);

  // Se já estiver rodando instalado em modo standalone (app instalado), exibe badge discreto
  if (isInstalled) {
    return (
      <div
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-2xs select-none"
        title="Você está utilizando o AntiTrader como aplicativo instalado!"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>App Instalado</span>
      </div>
    );
  }

  const handleButtonClick = async () => {
    // Sincroniza a aba com a plataforma atual ao abrir
    setActiveTab(detectedPlatform);
    setModalAberto(true);
  };

  const handleDirectInstall = async () => {
    if (!isInstallable) return;
    setInstalando(true);
    try {
      const ok = await install();
      if (ok) {
        setInstaladoSucesso(true);
        setTimeout(() => {
          setInstaladoSucesso(false);
          setModalAberto(false);
        }, 2000);
      }
    } finally {
      setInstalando(false);
    }
  };

  return (
    <>
      {/* Botão de Destaque no Header */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 border border-emerald-700"
        title="Instalar o AntiTrader na tela principal do celular ou notebook"
      >
        <Download className="w-3.5 h-3.5 shrink-0 animate-bounce duration-1000" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>

      {/* Modal Completo de Instalação e Instruções Passo a Passo */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top, 0.75rem))",
            paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 1.75rem))"
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAberto(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden flex flex-col max-h-[90dvh]">
            {/* Header do Modal */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-750">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shadow-xs">
                  <Download className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>Instalar AntiTrader como App</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      PWA
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Acesso instantâneo em 1 toque na tela principal do seu celular ou notebook
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
              {/* Botão de Instalação Direta (quando o navegador suportar 1 clique) */}
              {isInstallable && (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instalação Direta Pronta!</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                      Seu navegador suporta instalação com apenas 1 clique.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDirectInstall}
                    disabled={instalando || instaladoSucesso}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    {instaladoSucesso ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Instalado com Sucesso!</span>
                      </>
                    ) : instalando ? (
                      <span>Instalando...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Instalar Agora</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Seletor de Plataforma / Dispositivo */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Escolha o seu dispositivo para ver o passo a passo:
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ios')}
                    className={`py-2 px-1.5 sm:px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      activeTab === 'ios'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] sm:text-xs">iPhone / iPad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('android')}
                    className={`py-2 px-1.5 sm:px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      activeTab === 'android'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] sm:text-xs">Android</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('desktop')}
                    className={`py-2 px-1.5 sm:px-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      activeTab === 'desktop'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span className="text-[11px] sm:text-xs">Notebook / PC</span>
                  </button>
                </div>
              </div>

              {/* Instruções do iPhone / iOS Safari */}
              {activeTab === 'ios' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>No Safari do iPhone ou iPad</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        No navegador <strong>Safari</strong>, toque no ícone de <strong>Compartilhar</strong>{' '}
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-blue-700 text-[11px]">
                          <Share2 className="w-3 h-3 inline mr-1" /> Compartilhar (quadrado com seta ↑)
                        </span>{' '}
                        na barra inferior do celular.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Role a lista para baixo e toque em{' '}
                        <strong className="text-slate-900">&quot;Adicionar à Tela de Início&quot;</strong>{' '}
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-emerald-700 text-[11px]">
                          <PlusSquare className="w-3 h-3 inline mr-1" /> +
                        </span>.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Toque em <strong className="text-blue-700">&quot;Adicionar&quot;</strong> no canto superior direito.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Pronto!</strong> O ícone do AntiTrader ficará na tela principal e abrirá em tela cheia sem barras de navegador.
                    </span>
                  </div>
                </div>
              )}

              {/* Instruções do Celular Android */}
              {activeTab === 'android' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No Google Chrome ou Samsung Internet</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito do Chrome.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Selecione a opção{' '}
                        <strong className="text-slate-900">&quot;Instalar aplicativo&quot;</strong> (ou &quot;Adicionar à tela inicial&quot;).
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Confirme clicando em <strong className="text-emerald-700">&quot;Instalar&quot;</strong>.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Pronto!</strong> O AntiTrader será instalado como app nativo com abertura imediata em 1 toque.
                    </span>
                  </div>
                </div>
              )}

              {/* Instruções do Notebook / Computador */}
              {activeTab === 'desktop' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                    <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>No Google Chrome, Microsoft Edge ou Brave (Windows/Mac)</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Olhe no canto direito da sua <strong>barra de endereço</strong> (onde fica o link{' '}
                        <code className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-mono text-[11px]">
                          antitrader.vercel.app
                        </code>
                        ).
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Clique no ícone de <strong>Instalar</strong> (símbolo de monitor com seta para baixo{' '}
                        <Download className="w-3.5 h-3.5 inline text-indigo-600 mx-0.5" /> ou um círculo com sinal de{' '}
                        <strong className="text-indigo-700">+</strong>).
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="text-xs leading-relaxed text-slate-700">
                        Clique em <strong className="text-indigo-700">&quot;Instalar&quot;</strong> na janelinha de confirmação.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-950 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      <strong>Pronto!</strong> O AntiTrader ganhará uma janela própria de alto desempenho e um atalho na sua Área de Trabalho e Barra de Tarefas.
                    </span>
                  </div>
                </div>
              )}

              {/* Vantagens de Instalar */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Por que instalar como App?
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Abertura instantânea em 1 toque</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Tela cheia sem barras de URL</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Cotações e feeds em tempo real</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Download className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Leve e não ocupa espaço</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com Botão de Fechar */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
