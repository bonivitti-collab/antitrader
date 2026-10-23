import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  ChevronLeft,
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
  Bot,
  Globe,
  Search,
  Check,
  Cpu,
  BrainCircuit,
  Lock,
  ArrowUpRight,
  FileSearch,
  Scale,
  Percent,
  User,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export function LandingPage({ onEnterApp, onOpenAuth }: LandingPageProps) {
  const { user } = useAuth();
  const [planoAnual, setPlanoAnual] = useState(true);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  const checkoutMensalUrl = import.meta.env.VITE_KIWIFY_CHECKOUT_MENSAL_URL || '';
  const checkoutAnualUrl = import.meta.env.VITE_KIWIFY_CHECKOUT_ANUAL_URL || '';

  const handleCheckoutOrAuth = (plano: 'mensal' | 'anual') => {
    const targetUrl = plano === 'anual' ? checkoutAnualUrl : checkoutMensalUrl;
    if (targetUrl) {
      try {
        const url = new URL(targetUrl);
        if (user?.email) url.searchParams.set('email', user.email);
        if (user?.name) url.searchParams.set('name', user.name);
        window.open(url.toString(), '_blank');
        return;
      } catch {
        window.open(targetUrl, '_blank');
        return;
      }
    }
    handleOpenAuth('signup');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    if (user) {
      onEnterApp();
    } else if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      onEnterApp();
    }
  };

  // Estado e Dados do Carrossel de Exemplos Reais
  const [slideAtual, setSlideAtual] = useState(0);
  const [carrosselPausado, setCarrosselPausado] = useState(false);

  const slidesExemplo = [
    {
      id: 'valuation',
      modulo: 'Módulo 1: Setup Graham-Buffett',
      titulo: 'Valuation Quantitativo & Preço Justo',
      tag: 'ZONA DE COMPRA CONFIRMADA',
      ticker: 'BBAS3',
      empresa: 'Banco do Brasil S.A.',
      mercado: 'B3',
      score: 'Score 88 (A)',
      statusPreco: 'Margem de Segurança de +108%',
      cotacao: 'R$ 24,64',
      badgeCor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      destaque: 'O AntiTrader cruzou o lucro auditado (LPA R$ 6,24) com patrimônio (VPA R$ 38,10) e identificou que o papel negocia pela metade do seu valor intrínseco.',
      metricas: [
        { label: 'Entrada Sugerida', val: 'R$ 23,90', sub: 'Stop: R$ 19,12 (-20%)', cor: 'text-white' },
        { label: 'Preço Justo (TP1)', val: 'R$ 51,21', sub: '+108% Upside', cor: 'text-teal-300' },
        { label: 'Alvo Estendido (TP2)', val: 'R$ 58,40', sub: '+137% Upside', cor: 'text-indigo-300' },
        { label: 'Diretriz Graham', val: 'COMPRA', sub: 'P/L 3.95x | ROE 21.3%', cor: 'text-emerald-400' },
      ],
    },
    {
      id: 'esteira',
      modulo: 'Módulo 2: Esteira de Metas',
      titulo: 'Execução Disciplinada de Lucro (TP1 / TP2)',
      tag: 'META BATIDA COM SUCESSO',
      ticker: 'SAPR4',
      empresa: 'Sanepar PN',
      mercado: 'B3',
      score: 'Finalizada',
      statusPreco: 'Lucro Realizado de +58.3%',
      cotacao: 'R$ 6,52',
      badgeCor: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
      destaque: 'A Esteira de Metas acompanhou o papel da entrada (R$ 4,12) até atingir o Preço Justo de R$ 6,48 com stop móvel protetor, gerando 58.3% de rentabilidade.',
      metricas: [
        { label: 'Preço de Entrada', val: 'R$ 4,12', sub: '14/01/2026', cor: 'text-white' },
        { label: 'Saída Finalizada', val: 'R$ 6,52', sub: '+58.3% Realizado', cor: 'text-emerald-300' },
        { label: 'Alvo TP1 (Batido)', val: 'R$ 6,48', sub: '100% Concluído', cor: 'text-teal-300' },
        { label: 'Dias Decorridos', val: '155 dias', sub: 'DY 8.2% acumulado', cor: 'text-sky-300' },
      ],
    },
    {
      id: 'ai-copilot',
      modulo: 'Módulo 3: Copilot com IA',
      titulo: 'Pesquisa em Tempo Real & Mercado Global',
      tag: 'WEB RESEARCH & S&P 500 ATIVO',
      ticker: 'S&P 500',
      empresa: 'Destaques do Pregão de Nova York',
      mercado: 'Wall Street',
      score: 'Grounded',
      statusPreco: 'Destaques: CCI (+9,08%), CRWD (+8,25%), SLB (+7,04%)',
      cotacao: 'Ao Vivo',
      badgeCor: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      destaque: 'Conectada via Google Search aos balanços da SEC/CVM, a IA sintetiza catalisadores fundamentais, riscos e números em segundos, sem linguagem prolixa.',
      metricas: [
        { label: 'Crown Castle (CCI)', val: '+9,08%', sub: 'Locação Torres SpaceX', cor: 'text-emerald-300' },
        { label: 'CrowdStrike (CRWD)', val: '+8,25%', sub: 'Avanço Cibersegurança', cor: 'text-emerald-300' },
        { label: 'Palo Alto (PANW)', val: '+7,22%', sub: 'Contratos em Nuvem', cor: 'text-emerald-300' },
        { label: 'SLB (Schlumberger)', val: '+7,04%', sub: 'Rali Petróleo Brent', cor: 'text-emerald-300' },
      ],
    },
    {
      id: 'scanner',
      modulo: 'Módulo 4: Scanner Quantitativo',
      titulo: 'Varredura Diária Automática às 19h',
      tag: '33 ATIVOS NA ZONA DE COMPRA',
      ticker: '168 ATIVOS',
      empresa: 'B3, FIIs e Dividend Kings dos EUA',
      mercado: 'Global',
      score: '168 Varreduras',
      statusPreco: 'Varredura automática com relógio regressivo',
      cotacao: 'Diária 19h',
      badgeCor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      destaque: 'O scanner monitora dezenas de empresas e alerta o investidor quando o mercado precifica ativos de alto dividendo com desconto acima de 20%.',
      metricas: [
        { label: 'Universo Monitorado', val: '168 Papéis', sub: 'B3, FIIs e S&P 500', cor: 'text-white' },
        { label: 'Na Zona de Compra', val: '33 Ativos', sub: 'Margem > 20%', cor: 'text-emerald-300' },
        { label: 'Filtro Defensivo', val: 'Graham & Barsi', sub: 'Empresas Lucrativas', cor: 'text-teal-300' },
        { label: 'Próxima Varredura', val: '19:00', sub: 'Atualização Automática', cor: 'text-sky-300' },
      ],
    },
  ];

  useEffect(() => {
    if (carrosselPausado) return;
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slidesExemplo.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carrosselPausado, slidesExemplo.length]);

  const faqs = [
    {
      q: 'Como saber se uma ação está barata ou cara na bolsa de valores?',
      a: 'O AntiTrader calcula o Preço Justo intrínseco utilizando a fórmula clássica de Benjamin Graham (raiz de 22,5 × LPA × VPA) cruzada com a fórmula de crescimento ajustada pelas taxas de juros (1974). Uma ação só é classificada na Zona de Compra quando negocia com desconto real de 20% a 50% em relação ao seu valor patrimonial e capacidade de gerar lucros consistentes.',
    },
    {
      q: 'Como o AntiTrader AI ajuda a evitar armadilhas de valor (value traps)?',
      a: 'O AntiTrader AI é o seu copiloto de inteligência financeira. Em vez de você perder horas lendo PDFs de 120 páginas da CVM ou SEC, você simplesmente pergunta: "A empresa X está barata mesmo ou tem pegadinha contábil?". A IA audita o balanço, separa lucros pontuais de operacionais recorrentes, analisa a dívida líquida/EBITDA e entrega um veredito tático com pontos de entrada, alvo e stop em segundos.',
    },
    {
      q: 'Como funcionam os 7 dias de teste grátis?',
      a: 'Você se cadastra e tem acesso imediato e irrestrito a todas as funcionalidades do AntiTrader e à IA. Nenhuma mensalidade é cobrada hoje. Se você decidir que a ferramenta não é para você, basta cancelar antes do 8º dia com um único clique no painel, sem pegadinhas nem burocracia.',
    },
    {
      q: 'Preciso ser um investidor experiente para usar?',
      a: 'Não. O AntiTrader foi desenhado exatamente para quem não quer perder tempo com planilhas complexas ou jargões de corretora. A ferramenta já entrega tudo mastigado: se o papel está na Zona de Compra, qual o Preço Justo matemático e quando realizar o lucro (TP1 e TP2).',
    },
    {
      q: 'Quais ações, FIIs e mercados estão cobertos na plataforma?',
      a: 'Monitoramos diariamente mais de 160 ativos com fundamentos sólidos: as principais ações da B3 (Brasil), Fundos Imobiliários (FIIs) e os constituintes de valor do S&P 500 (Estados Unidos), com varredura automática às 19h.',
    },
    {
      q: 'Qual a diferença do AntiTrader para sites como Status Invest, Fundamentus ou Oceans14?',
      a: 'Sites tradicionais são agregadores de dados brutos: mostram dezenas de tabelas e deixam toda a interpretação nas suas costas. O AntiTrader vai direto ao ponto: audita se os números são verdadeiros, calcula o Preço Justo matemático, coloca na esteira de metas (TP1 e TP2) e oferece uma Inteligência Artificial conversacional que responde qualquer dúvida sobre o negócio.',
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
          <a href="#ia-copilot" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>IA Especialista</span>
          </a>
          <a href="#dores-mercado" className="hover:text-white transition-colors">Dúvidas Frequentes</a>
          <a href="#metodo" className="hover:text-white transition-colors">O Método Graham</a>
          <a href="#precos" className="hover:text-white transition-colors">Planos &amp; Preços</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <button
              onClick={onEnterApp}
              className="px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-black text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>Meu Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                Entrar
              </button>

              <button
                onClick={() => handleOpenAuth('signup')}
                className="px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                Testar 7 Dias Grátis
              </button>
            </>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge de Destaque com Foco na IA */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-lg shadow-blue-900/20">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>VALUATION QUANTITATIVO + IA ANALISTA INSTITUCIONAL</span>
        </div>

        {/* Headline Principal Otimizada para Intenção de Busca */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
          Pare de caçar ações no escuro. <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Tenha um Analista de IA no seu bolso 24h por dia.
          </span>
        </h1>

        {/* Subheadline com Palavras-chave Naturais */}
        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          O <strong>AntiTrader</strong> une a matemática conservadora de Benjamin Graham com um <strong>Copilot de Inteligência Artificial Fundamentalista</strong>. Ele audita balanços da CVM e SEC, detecta pegadinhas contábeis, cruza o macro em tempo real e entrega a <strong>Zona de Compra exata</strong> com alvos <strong>TP1</strong>, <strong>TP2</strong> e <strong>Stop de Invalidação</strong>.
        </p>

        {/* CTA Único do Hero (Foco Total em Conversão) */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={() => handleOpenAuth('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <span>Começar Teste de 7 Dias Grátis</span>
            <ArrowRight className="w-5 h-5" />
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
            7 dias de acesso total à IA e ao terminal
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Cancele com 1 clique no painel
          </span>
        </div>

        {/* ======================================================== */}
        {/* CARROSSEL DE EXEMPLOS REAIS DO TERMINAL ANTITRADER       */}
        {/* ======================================================== */}
        <div 
          className="mt-12 sm:mt-16 bg-gradient-to-b from-slate-900 to-slate-950 p-3 sm:p-5 rounded-2xl border border-slate-700/80 shadow-2xl max-w-3xl mx-auto text-left relative overflow-hidden"
          onMouseEnter={() => setCarrosselPausado(true)}
          onMouseLeave={() => setCarrosselPausado(false)}
        >
          {/* Barra Superior Estilo Terminal com Controles de Navegação */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-slate-300 font-bold hidden sm:inline">
                {slidesExemplo[slideAtual].modulo}
              </span>
            </div>

            {/* Controles de Navegação Rápida (Anterior / Próximo) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSlideAtual((prev) => (prev - 1 + slidesExemplo.length) % slidesExemplo.length)}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Exemplo Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400 px-1">
                {slideAtual + 1} / {slidesExemplo.length}
              </span>
              <button
                onClick={() => setSlideAtual((prev) => (prev + 1) % slidesExemplo.length)}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Próximo Exemplo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Conteúdo Dinâmico do Slide Ativo */}
          <div className="pt-4 space-y-3 transition-all duration-300 ease-in-out">
            <div className="bg-slate-950/85 p-3.5 sm:p-5 rounded-xl border border-slate-800 flex flex-col gap-3.5 shadow-inner">
              
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xl font-black text-white">
                      {slidesExemplo[slideAtual].ticker}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {slidesExemplo[slideAtual].empresa}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
                      {slidesExemplo[slideAtual].mercado}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${slidesExemplo[slideAtual].badgeCor}`}>
                      {slidesExemplo[slideAtual].score}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="uppercase tracking-wide">{slidesExemplo[slideAtual].tag}</span>
                    <span className="text-slate-400 font-normal">({slidesExemplo[slideAtual].statusPreco})</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-mono">Referência</div>
                  <div className="text-base sm:text-lg font-mono font-black text-white">
                    {slidesExemplo[slideAtual].cotacao}
                  </div>
                </div>
              </div>

              {/* Explicação da Tese do Slide */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                {slidesExemplo[slideAtual].destaque}
              </p>

              {/* Grid das 4 métricas reais */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {slidesExemplo[slideAtual].metricas.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 block font-sans truncate">{m.label}</span>
                    <span className={`font-bold text-sm sm:text-base my-0.5 ${m.cor}`}>{m.val}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{m.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicadores de Slides Interativos (Pills Clicáveis) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              Passe o mouse para pausar • Clique para navegar
            </span>
            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              {slidesExemplo.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSlideAtual(idx)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    slideAtual === idx
                      ? 'bg-blue-600 text-white shadow-xs scale-105'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}. {s.id === 'valuation' ? 'Valuation' : s.id === 'esteira' ? 'Metas' : s.id === 'ai-copilot' ? 'IA Copilot' : 'Scanner'}
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ======================================================== */}
      {/* SEÇÃO ESTELAR DEDICADA À IA: "VOCÊ PRECISA DISSO"        */}
      {/* ======================================================== */}
      <section id="ia-copilot" className="py-16 sm:py-24 bg-gradient-to-b from-[#090f1d] via-[#0b1329] to-[#090f1d] border-y border-blue-900/40 px-4 sm:px-8 relative overflow-hidden">
        
        {/* Glows de IA */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Inteligência Artificial Feita para Investidores</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Enquanto outros perdem 4 horas decifrando um balanço, a nossa IA te entrega a tese em 5 segundos.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              O <strong>AntiTrader AI Copilot</strong> foi calibrado exclusivamente em literatura de <em>Value Investing</em> clássico (Benjamin Graham, Luiz Bazin, Warren Buffett) e dados regulatórios auditados da CVM e SEC. Pergunte qualquer coisa e receba respostas sem jargão nem viés de corretora.
            </p>
          </div>

          {/* Grid: Mockup da Conversa Real com a IA + 3 Pilares */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Lado Esquerdo: Mockup Interativo da IA (7 Colunas) */}
            <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 rounded-2xl border-2 border-blue-500/40 shadow-2xl space-y-4">
              
              {/* Header do Mockup do Chat */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block leading-none">AntiTrader AI Copilot</span>
                    <span className="text-[10px] text-emerald-400 font-mono">● Conectado com CVM, SEC &amp; Notícias</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40">
                  Web Research Ativa
                </span>
              </div>

              {/* Balão 1: Pergunta do Usuário */}
              <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-xl ml-6 text-xs text-slate-200">
                <div className="text-[10px] font-mono text-blue-300 font-bold mb-1">Você perguntou:</div>
                <p className="font-medium">
                  "O Banco do Brasil (BBAS3) está barato mesmo ou é uma armadilha de valor com risco político estatal?"
                </p>
              </div>

              {/* Balão 2: Resposta Auditada da IA */}
              <div className="bg-slate-900/90 border border-slate-700/70 p-3.5 sm:p-4 rounded-xl text-xs text-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-teal-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    Diagnóstico AntiTrader AI
                  </span>
                  <span>Agora mesmo</span>
                </div>

                <p className="leading-relaxed text-slate-300">
                  <strong>Não é armadilha de valor.</strong> Os fundamentos auditados confirmam que BBAS3 negocia com <strong>margem de segurança de 108%</strong> em relação ao Preço Justo de Graham:
                </p>

                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">• P/L Atual:</span>
                    <span className="text-white font-bold">4.0x (Média histórica: 6.2x)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• ROE Consolidado:</span>
                    <span className="text-emerald-400 font-bold">21.3% (Nível de banco privado)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Dividend Yield:</span>
                    <span className="text-teal-400 font-bold">9.8% a.a. (Colchão de proteção)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">• Preço Justo (TP1):</span>
                    <span className="text-emerald-300 font-bold">R$ 51,21 vs Cotação R$ 24,64</span>
                  </div>
                </div>

                <p className="leading-relaxed text-slate-300">
                  💡 <strong>Diretriz Tática:</strong> A ação está dentro da <strong>Zona de Compra recomendada</strong>. O alto retorno sobre patrimônio e o payout de 45% neutralizam grande parte do ruído político. <strong>Stop de invalidação definido em R$ 19,12 (-20%).</strong>
                </p>

                {/* Sugestões de Follow-up (Demonstrando o recurso no mockup) */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Sugestões para prosseguir na conversa:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-blue-300 border border-slate-700 flex items-center gap-1">
                      <span>Qual o histórico de inadimplência?</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-blue-300 border border-slate-700 flex items-center gap-1">
                      <span>Comparar com Itaú (ITUB4)</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Lado Direito: Os 3 Superpoderes da IA (5 Colunas) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Detecção de Pegadinhas Contábeis</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    A IA audita se o lucro da empresa veio de vendas reais ou de eventos pontuais não-recorrentes, separando o ouro da armadilha.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Pesquisa Web &amp; Fatos Relevantes ao Vivo</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    A IA cruza notícias de última hora, comunicados ao mercado e decisões de juros (Copom/Fed) para entender o que está acontecendo hoje.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Zero Conflito de Interesses</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Corretoras ganham quando você gira carteira. O AntiTrader ganha quando você acerta. A IA foi programada para priorizar a sua segurança.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#precos"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <span>Experimentar a IA por 7 Dias Grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: AS 3 GRANDES DORES QUE O INVESTIDOR BUSCA NO GOOGLE */}
      {/* ======================================================== */}
      <section id="dores-mercado" className="py-16 sm:py-20 bg-[#060a13] border-b border-slate-800/80 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Inteligência de Mercado &amp; Margem de Segurança
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
              As 3 dúvidas que todo investidor pesquisa no Google antes de comprar:
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              O AntiTrader foi construído exatamente para responder essas três perguntas com dados matemáticos e sem achismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Dor 1 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 relative hover:border-blue-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-white">
                "Como saber se a ação está barata mesmo ou se é uma pegadinha?"
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Muitas ações parecem baratas com P/L baixo, mas escondem dívidas impagáveis ou lucros não-recorrentes. A nossa IA audita o balanço da CVM e aplica o teste de 5 anos de lucros e solidez de caixa de Graham.
              </p>
            </div>

            {/* Dor 2 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 relative hover:border-teal-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center text-sm font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-white">
                "Qual é o preço máximo que devo pagar (Preço Teto / Preço Justo)?"
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você nunca mais compra na euforia no topo. O AntiTrader calcula a Zona de Entrada Ideal (com 20% a 33% de desconto sobre o Preço Justo conservador) para você entrar com margem de segurança garantida.
              </p>
            </div>

            {/* Dor 3 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 relative hover:border-emerald-500/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-white">
                "Quando devo vender ou colocar o lucro no bolso?"
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chega de dúvida se realiza ou se segura para sempre. A Esteira de Metas traça 2 alvos claros: o TP1 (quando atinge o Preço Justo) e o TP2 (alvo estendido de valorização), além de um stop protetor automático.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: O PROBLEMA VS A SOLUÇÃO (A DOR DO TRADER)         */}
      {/* ======================================================== */}
      <section id="metodo" className="py-16 sm:py-20 bg-[#070b14] px-4 sm:px-8">
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
      <section id="recursos" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-800">
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
                    <span><strong>AntiTrader AI Copilot</strong> ilimitado 24h</span>
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
                    <span>Web Research em tempo real integrado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Varreduras diárias automáticas às 19h</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckoutOrAuth('mensal')}
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
                    <span><strong>Consultas e auditorias ILIMITADAS</strong> na IA</span>
                  </li>
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
                </ul>
              </div>

              <button
                onClick={() => handleCheckoutOrAuth('anual')}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              >
                Garantir 7 Dias Grátis + Desconto Anual
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEÇÃO: FAQ (DÚVIDAS FREQUENTES OTIMIZADA PARA O GOOGLE)   */}
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
              Plataforma analítica e quantitativa de valuation com Inteligência Artificial baseada em Benjamin Graham.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button onClick={onEnterApp} className="hover:text-white transition-colors cursor-pointer">
              Terminal
            </button>
            <a href="#ia-copilot" className="hover:text-white transition-colors">IA Copilot</a>
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
