import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  BarChart3,
  Flame,
  Award,
  ChevronDown,
  Layers,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [planoAnual, setPlanoAnual] = useState(true);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Como funcionam os 7 dias de teste grátis?',
      a: 'Você se cadastra e tem acesso imediato e irrestrito a todas as funcionalidades do AntiTrader. Nenhuma mensalidade é cobrada hoje. Se você decidir que a ferramenta não é para você, basta cancelar antes do 8º dia com um único clique no painel, sem burocracia.',
    },
    {
      q: 'Preciso ser um investidor experiente para usar?',
      a: 'Não. O AntiTrader foi desenhado exatamente para eliminar o "financês" e planilhas complexas. A ferramenta calcula o Preço Justo de cada ação, diz se ela está ou não na Zona de Compra recomendada e define os alvos de saída (TP1 e TP2).',
    },
    {
      q: 'Quais mercados e ativos estão cobertos?',
      a: 'Monitoramos diariamente mais de 160 ativos com fundamentos sólidos: as principais ações da B3 (Brasil), Fundos Imobiliários (FIIs) e os constituintes de valor do S&P 500 (Estados Unidos).',
    },
    {
      q: 'Como é calculada a margem de segurança e o Preço Justo?',
      a: 'Utilizamos a fórmula clássica de Benjamin Graham (raiz de 22,5 × LPA × VPA) cruzada com a fórmula de crescimento ajustada pelas taxas de juros (1974), aplicando o menor entre os dois como teto conservador.',
    },
    {
      q: 'Funciona no celular como aplicativo?',
      a: 'Sim! O AntiTrader é um PWA (Progressive Web App). Você pode adicioná-lo à tela de início do seu iPhone ou Android e utilizá-lo como um app nativo, rápido e sem ocupar memória.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ======================================================== */}
      {/* NAVBAR SUPERIOR                                          */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#070b14]/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 p-1.5 px-2.5 rounded-xl shadow-inner">
            <img src="/icon.svg" alt="AntiTrader Logo" className="w-6 h-6 rounded" />
            <span className="font-black text-base tracking-tight text-white">AntiTrader</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40">
            by Sentinel Systems
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#metodo" className="hover:text-white transition-colors">O Método</a>
          <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
          <a href="#precos" className="hover:text-white transition-colors">Planos &amp; Preços</a>
          <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onEnterApp}
            className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Ver Demonstração</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <a
            href="#precos"
            className="px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
          >
            Testar 7 Dias Grátis
          </a>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge de Destaque */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Fórmula de Benjamin Graham &amp; Warren Buffett Automatizada</span>
        </div>

        {/* Headline Principal */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
          Pare de caçar ações no escuro. <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Invista com Margem de Segurança Real.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Chega de girar carteira pagando taxas ou seguindo dicas de fóruns. 
          O <strong>AntiTrader</strong> rastreia diariamente 168 ativos na <strong>B3</strong> e no <strong>S&amp;P 500</strong>, calcula o Preço Justo conservador e entrega a <strong>Zona de Compra</strong>, <strong>Alvo TP1</strong>, <strong>Alvo TP2</strong> e <strong>Stop de Invalidação</strong>.
        </p>

        {/* CTAs do Hero */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href="#precos"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Começar Teste de 7 Dias Grátis</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Acessar Terminal ao Vivo</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Micro-Garantias */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            R$ 0 cobrado hoje
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            7 dias de acesso total
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Cancele com 1 clique
          </span>
        </div>

        {/* ======================================================== */}
        {/* CARD MOCKUP: PREVIEW INTERATIVO DA ESTEIRA              */}
        {/* ======================================================== */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-b from-slate-900 to-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-700/80 shadow-2xl max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-slate-300 font-bold">Terminal AntiTrader — Esteira de Metas</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              ● Varredura Atualizada
            </span>
          </div>

          <div className="pt-4 space-y-3">
            <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-lg font-black text-white">BBAS3</span>
                    <span className="text-xs font-semibold text-slate-400">Banco do Brasil S.A.</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">B3</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">Score 88 (A)</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase bg-emerald-600 text-white">Confirmada</span>
                  </div>
                  <div className="mt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>NA ZONA DE COMPRA (Margem de Segurança 108%)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Cotação Atual</div>
                  <div className="text-base sm:text-lg font-mono font-black text-white">R$ 24,64</div>
                </div>
              </div>

              {/* Grid das 4 métricas de preço */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Entrada Sugerida</span>
                  <span className="font-bold text-white text-sm">R$ 23,90</span>
                  <span className="text-[10px] text-rose-400 block">Stop: R$ 19,12 (-20%)</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Preço Justo (TP1)</span>
                  <span className="font-bold text-teal-300 text-sm">R$ 51,21</span>
                  <span className="text-[10px] text-teal-400 block">+108% Upside</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Alvo Estendido (TP2)</span>
                  <span className="font-bold text-indigo-300 text-sm">R$ 58,40</span>
                  <span className="text-[10px] text-indigo-400 block">+137% Alvo</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Diretriz Graham</span>
                  <span className="font-bold text-emerald-400 text-sm">Comprar</span>
                  <span className="text-[10px] text-slate-400 block">Dentro da Zona</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: O PROBLEMA VS A SOLUÇÃO (A DOR DO TRADER)         */}
      {/* ======================================================== */}
      <section id="metodo" className="py-16 sm:py-20 bg-[#090f1d] border-y border-slate-800 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Por que 90% das pessoas perdem dinheiro na bolsa?
            </h2>
            <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              Girar carteira enriquece a corretora. Comprar valor enriquece você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O Trader Normal */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-rose-900/30 space-y-4">
              <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                O "Trader" Comum
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Compra ações na euforia porque ouviu notícia ou dica no YouTube.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Não tem a mínima ideia de quanto a empresa realmente vale (preço justo).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Vende no fundo em pânico e perde para o CDI no final do ano.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Vive estressado olhando gráfico de minuto em minuto.</span>
                </li>
              </ul>
            </div>

            {/* O AntiTrader */}
            <div className="bg-gradient-to-br from-blue-950/50 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-blue-500/30 space-y-4 shadow-xl">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                O Investidor AntiTrader
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Só entra quando o ativo está com <strong>desconto de 20% a 50%</strong> sobre o valor intrínseco.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sabe exatamente onde é o <strong>TP1 (Preço Justo)</strong> e o <strong>TP2 (Alvo Estendido)</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Protegido por um <strong>stop matemático de 20%</strong> caso a tese seja invalidada.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Recebe dividendos com tranquilidade enquanto o mercado converge para o valor justo.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: OS 4 PILARES DA PLATAFORMA                        */}
      {/* ======================================================== */}
      <section id="recursos" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
            Tecnologia Institucional ao seu Alcance
          </h2>
          <p className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Tudo o que você precisa para investir com precisão matemática.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pilar 1 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">168 Ativos Monitorados</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Varredura diária automatizada de ações da B3, Fundos Imobiliários e constituintes do S&amp;P 500 pontualmente às 19h.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Ciclo de Metas (TP1 &amp; TP2)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Esteira de ciclo de vida que acompanha cada papel da entrada na zona (0.67–0.80× PJ) até o Preço Justo e alvo estendido.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">AntiTrader AI Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inteligência Artificial que analisa os catalisadores macro, riscos operacionais e gera resumos executivos da tese de cada empresa.
            </p>
          </div>

          {/* Pilar 4 */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">App PWA Mobile First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instale na tela inicial do celular com 1 toque. Notificações, interface leve, sem anúncios e com velocidade ultra-rápida.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: TABELA DE PREÇOS (PRICING)                        */}
      {/* ======================================================== */}
      <section id="precos" className="py-16 sm:py-24 bg-gradient-to-b from-[#090f1d] via-[#070b14] to-[#070b14] border-t border-slate-800 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Planos Claros &amp; Sem Surpresas
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
              Comece com 7 dias grátis.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Cancele quando quiser no seu painel. R$ 0 cobrado no período de teste.
            </p>

            {/* Toggle Mensal / Anual */}
            <div className="mt-6 inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-bold">
              <button
                onClick={() => setPlanoAnual(false)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !planoAnual ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setPlanoAnual(true)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  planoAnual ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">
                  Economize 25%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Card Mensal */}
            <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">Plano Mensal</h3>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Sem Fidelidade
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">R$ 39,90</span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  7 dias gratuitos • Cancele a qualquer momento
                </p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso total ao Terminal AntiTrader</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>168 ações da B3 e S&amp;P 500 com Preço Justo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Esteira de Metas com Alvos TP1 e TP2</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AntiTrader AI Copilot integrado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Varreduras diárias automáticas às 19h</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Experimentar 7 Dias Grátis
              </button>
            </div>

            {/* Card Anual (Destaque) */}
            <div className="bg-gradient-to-b from-blue-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-blue-500/60 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-blue-900/30">
              
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                ★ Mais Popular • 2 Meses Grátis
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">Plano Anual</h3>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    Melhor Custo-Benefício
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">R$ 299,00</span>
                  <span className="text-xs text-slate-400">/ ano</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Equivale a apenas R$ 24,90/mês (Economize R$ 179)
                </p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Todos os recursos</strong> do plano mensal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>2 meses de acesso 100% gratuitos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Preço travado por 1 ano sem reajustes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suporte prioritário via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso antecipado a novos radares e ativos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              >
                Garantir 7 Dias Grátis + Desconto Anual
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: FAQ (DÚVIDAS FREQUENTES)                          */}
      {/* ======================================================== */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            Perguntas Frequentes
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
            Tire suas dúvidas antes de começar.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = faqAberto === i;
            return (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setFaqAberto(isOpen ? null : i)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-100 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* FOOTER INSTITUCIONAL                                     */}
      {/* ======================================================== */}
      <footer className="border-t border-slate-800 bg-[#050811] py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <img src="/icon.svg" alt="AntiTrader" className="w-5 h-5 rounded" />
              <span className="font-black text-slate-200 text-sm">AntiTrader</span>
              <span className="text-[10px] text-slate-500">• Sentinel Systems</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Plataforma analítica e quantitativa de valuation baseada na metodologia de Benjamin Graham.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button onClick={onEnterApp} className="hover:text-white transition-colors cursor-pointer">
              Terminal
            </button>
            <a href="#precos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-mono">sentinelsystems.com.br</span>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800/60 text-[10px] text-slate-600 text-center leading-relaxed">
          <strong>Aviso Legal Importante:</strong> O AntiTrader é uma ferramenta de apoio à decisão analítica desenvolvida pela Sentinel Systems com base em dados fundamentalistas públicos e modelos matemáticos de Graham e Bazin. Não constitui recomendação, conselho ou consultoria de investimentos conforme a Instrução CVM. O investidor é o único responsável por suas decisões de alocação de capital.
        </div>
      </footer>

    </div>
  );
}
