import React, { useMemo, useState, useEffect, useRef } from 'react';
import { OPORTUNIDADES_SETUP, type Oportunidade } from './data/oportunidades';
export type { Oportunidade };
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  Activity,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  Bot,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Clock,
  Zap,
  Target,
  Trophy,
  Award,
  Search,
  PanelLeft,
  PanelRight,
  GripVertical,
  ChevronLeft,
  ArrowLeft,
  Snowflake,
  Building2,
} from 'lucide-react';
import { getCompanyProfile } from './data/companyProfiles';
import { TrackedOpportunity } from './types/tracker';
import {
  loadTrackedOpportunities,
  syncTrackedWithOpportunities,
  calculateTrackerStats,
} from './services/trackerService';
import { MetasTrackerModal } from './components/MetasTrackerModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { UserProfileMenu } from './components/UserProfileMenu';
import { useAuth } from './contexts/AuthContext';
import { searchUniverse, findInUniverse, getUniverseStats, type UniverseAsset } from './data/universe';



export interface StepTrace {
  label: string;
  type?: 'explore' | 'audit' | 'thought' | 'action';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  steps?: StepTrace[];
  source?: string;
  searchQueries?: string[];
  searchSources?: { title?: string; uri?: string }[];
}

// Renderizador Elegante de Markdown Financeiro Memoizado (Elimina recomputações pesadas)
const FormattedMessage = React.memo(function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const parseInline = (str: string): React.ReactNode => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter((r) => !r.every((c) => c.match(/^[:\-\s]+$/)));
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-2 rounded border border-slate-300">
          <table className="min-w-full text-[11px] divide-y divide-slate-300">
            <thead className="bg-slate-100">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-2 py-1 text-left font-bold text-slate-800">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2 py-1 text-slate-700">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      const cells = line.slice(1, -1).split('|').map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (!line) {
      elements.push(<div key={`empty-${i}`} className="h-1.5" />);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${i}`} className="font-bold text-xs text-slate-900 mt-2 mb-1 flex items-center gap-1">
          {parseInline(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${i}`} className="font-bold text-sm text-slate-900 mt-2 mb-1">
          {parseInline(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-1.5 pl-1 my-0.5">
          <span className="text-blue-600 font-bold leading-none mt-1">•</span>
          <div className="flex-1">{parseInline(line.slice(2))}</div>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+\.)\s(.*)/);
      if (match) {
        elements.push(
          <div key={`num-${i}`} className="flex items-start gap-1.5 pl-1 my-0.5">
            <span className="font-bold text-blue-700 text-[11px] leading-tight shrink-0">{match[1]}</span>
            <div className="flex-1">{parseInline(match[2])}</div>
          </div>
        );
      }
    } else {
      elements.push(
        <p key={`p-${i}`} className="my-0.5 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-0.5 text-xs text-slate-800">{elements}</div>;
});

// Componente Isolado de Contagem Regressiva e Status Congelado
const CountdownDisplay = React.memo(function CountdownDisplay({
  nextScanTime,
  isFrozen = false,
  onExpired,
  className = 'font-bold text-sky-400',
  prefix,
}: {
  nextScanTime?: number | null;
  isFrozen?: boolean;
  onExpired?: () => void;
  className?: string;
  prefix?: React.ReactNode;
}) {
  const [str, setStr] = useState<string>(isFrozen ? 'CONGELADO' : '19:00 BRT');

  useEffect(() => {
    if (isFrozen) {
      setStr('CONGELADO');
      return;
    }
    if (!nextScanTime) {
      setStr('19:00 BRT');
      return;
    }

    const calc = () => {
      const diffSec = Math.max(0, Math.floor((nextScanTime - Date.now()) / 1000));
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;
      setStr(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );

      if (diffSec === 0 && onExpired) {
        onExpired();
      }
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [nextScanTime, isFrozen, onExpired]);

  return (
    <span className={className}>
      {prefix}
      {str}
    </span>
  );
});

export default function GrahamBuyZoneWorkspace() {
  // Controle de abas para telas pequenas (mobile/tablet)
  // No desktop, o Painel de Informações e o Copilot ficam lado a lado
  const [mobileTab, setMobileTab] = useState<'oportunidades' | 'metas' | 'info' | 'copilot' | 'ambas'>('oportunidades');

  // Sistema de Acompanhamento de Metas & Ciclo de Oportunidades (Graham Target Engine)
  const [trackedList, setTrackedList] = useState<TrackedOpportunity[]>(() => loadTrackedOpportunities());
  const [modalMetasAberto, setModalMetasAberto] = useState(false);
  const [metaNotification, setMetaNotification] = useState<string | null>(null);

  // Chave personalizada do usuário (mantida em background se configurada no storage)
  const [userApiKey] = useState<string>(() => {
    return localStorage.getItem('antitrader_gemini_key') || localStorage.getItem('antigravity_gemini_key') || '';
  });

  // Modal de Auditoria Operacional & Diagnósticos em Tempo Real
  const [auditDiagnostics, setAuditDiagnostics] = useState<any>(null);
  const [executandoAuditoria, setExecutandoAuditoria] = useState(false);
  const [ultimaAtualizacaoEm, setUltimaAtualizacaoEm] = useState<string>(new Date().toLocaleTimeString('pt-BR'));

  // Ativo Selecionado em Foco (iniciando com BBAS3 em cotação de mercado real)
  const [ativo, setAtivo] = useState<Oportunidade>({
    id: 'BBAS3',
    ticker: 'BBAS3',
    nome: 'Banco do Brasil',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 24.64,
    lpa: 6.18,
    vpa: 34.80,
    g: 4.5,
    yieldAAA: 6.2,
    margemSugerida: 30,
    ultimoBalanco: 'Auditado CVM (Consolidado Recente - Pós-Desdobramento)',
    lucroLiquido: 'R$ 36,4 bilhões',
    receitaLiquida: 'R$ 104,2 bilhões',
    roe: 21.4,
    dividendYield: 9.8,
    pl: 3.99,
    pvp: 0.71,
    grahamMult: 2.82,
    dividaStatus: 'Instituição Financeira (Índice de Basileia 16.2% - Saudável)',
    categoria: 'ZONA DE COMPRA',
    destaqueSetup: 'Cotação R$ 24.64 vs Zona R$ 51.21 (+108% de margem). P/L 4.0x e Graham Mult de 2.82x (limite Graham 22.50).',
    breveAnalise: 'O Banco do Brasil é a maior oportunidade de valuation da B3. ROE de 21.4% superior a pares privados, negociando a 71% do valor patrimonial com liderança em agronegócio defensivo.',
    condicoesBuyHold: 'Comprar abaixo do teto da Zona com disciplina. Payout de 40-45% e forte remuneração ao acionista.',
    moat: 'Amplo (Monopólio prático no crédito rural oficial, convênio exclusivo de folhas salariais e funding de depósitos a custo baixo)',
    variacaoDia: 0.85,
    horarioCotacao: '15:40',
    origem: 'B3 Pregão Oficial',
  });

  // Parâmetros do Valuation (sincronizados com o ativo)
  const [preco, setPreco] = useState<number>(24.64);
  const [lpa, setLpa] = useState<number>(6.18);
  const [vpa, setVpa] = useState<number>(34.80);
  const [g, setG] = useState<number>(4.5);
  const [yieldAAA, setYieldAAA] = useState<number>(6.2);
  const [margem, setMargem] = useState<number>(30);
  const [moeda, setMoeda] = useState<'USD' | 'BRL'>('BRL');

  // Estado da Cotação em Tempo Real
  const [atualizandoCotacao, setAtualizandoCotacao] = useState(false);
  const [feedbackCotacao, setFeedbackCotacao] = useState<string | null>(null);

  // Filtros da Barra de Oportunidades
  const [filtroMercado, setFiltroMercado] = useState<'TODOS' | 'B3' | 'US' | 'FII' | 'REIT'>('TODOS');
  const [filtroSub, setFiltroSub] = useState<'TODOS' | 'ZONA' | 'CLASSE_A' | 'CONFIRMADA' | 'IBKR'>('TODOS');
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>(OPORTUNIDADES_SETUP);
  const [carregandoOportunidades, setCarregandoOportunidades] = useState(false);
  const [buscaTicker, setBuscaTicker] = useState('');

  // Larguras Customizáveis dos Painéis (Three-Panel Layout para Notebooks e Desktops)
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('antitrader_panel_left_width');
      return saved ? Math.max(240, Math.min(480, parseInt(saved, 10))) : 320;
    } catch {
      return 320;
    }
  });

  const [rightWidth, setRightWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('antitrader_panel_right_width');
      return saved ? Math.max(280, Math.min(580, parseInt(saved, 10))) : 380;
    } catch {
      return 380;
    }
  });

  const [painelEsquerdoRecolhido, setPainelEsquerdoRecolhido] = useState(false);
  const [painelDireitoRecolhido, setPainelDireitoRecolhido] = useState(false);
  const [redimensionando, setRedimensionando] = useState<'left' | 'right' | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Persistência automática das preferências de largura no localStorage do notebook/desktop
  useEffect(() => {
    try {
      localStorage.setItem('antitrader_panel_left_width', leftWidth.toString());
    } catch {}
  }, [leftWidth]);

  useEffect(() => {
    try {
      localStorage.setItem('antitrader_panel_right_width', rightWidth.toString());
    } catch {}
  }, [rightWidth]);

  // Hook de arrasto suave dos divisores redimensionáveis (Mouse & Touchscreen para notebooks 2-em-1)
  useEffect(() => {
    if (!redimensionando) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (redimensionando === 'left') {
        const novo = Math.max(240, Math.min(Math.min(500, window.innerWidth - 650), clientX));
        setLeftWidth(novo);
      } else if (redimensionando === 'right') {
        const novo = Math.max(280, Math.min(Math.min(580, window.innerWidth - 650), window.innerWidth - clientX));
        setRightWidth(novo);
      }
    };

    const handlePointerUp = () => {
      setRedimensionando(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [redimensionando]);

  // Varredura Diária Programada & Contagem Regressiva (Suporte a Modo Congelado)
  const [scanStatus, setScanStatus] = useState<{
    isFrozen?: boolean;
    status?: string;
    lastScanTime: number;
    lastScanFormatted: string;
    nextScanTime: number | null;
    nextScanFormatted: string;
    secondsUntilNextScan: number;
    isScanning: boolean;
    totalMonitored: number;
    totalInBuyZone: number;
    scanSchedulePolicy?: string;
    executionSummary?: string;
  } | null>(null);
  // countdownStr isolado no CountdownDisplay para máxima performance de toque/clique
  const [executandoScanManual, setExecutandoScanManual] = useState(false);
  const [modalScanInfoAberto, setModalScanInfoAberto] = useState(false);
  const [feedbackScan, setFeedbackScan] = useState<string | null>(null);

  const [copiado, setCopiado] = useState(false);

  // Chat com o Agente (Especialista em Valuation & Inteligência Fundamentalista Aberta)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement>(null);
  // Sugestões inteligentes para prosseguir na conversa (estilo Google AI Studio / Meta AI)
  const followUpSuggestions = useMemo(() => {
    if (chatMessages.length === 0) return [];
    const ultimaMsg = chatMessages[chatMessages.length - 1];
    const texto = ultimaMsg.text.toLowerCase();

    if (texto.includes('dividendo') || texto.includes('yield') || texto.includes('provento') || texto.includes('payout')) {
      return [
        'Qual o histórico e sustentabilidade desse dividendo?',
        'Qual o Preço Teto para garantir 6% de Yield (Método Barsi)?',
        'Quais os 3 maiores riscos para esse pagamento?',
      ];
    }
    if (texto.includes('selic') || texto.includes('juro') || texto.includes('fed') || texto.includes('macro') || texto.includes('inflação')) {
      return [
        'Quais setores da B3 mais sofrem com esse cenário?',
        'Como os FIIs de tijolo e papel reagem a essa taxa?',
        'Qual a perspectiva para o dólar e commodities?',
      ];
    }
    if (texto.includes('banco') || texto.includes('crédito') || texto.includes('inadimplência') || texto.includes('bbas3') || texto.includes('itub4')) {
      return [
        'Como está o índice de inadimplência e cobertura?',
        'Comparar o ROE com os outros grandes bancos',
        'Quais os riscos de governança ou regulação?',
      ];
    }
    if (texto.includes('graham') || texto.includes('preço justo') || texto.includes('tp1') || texto.includes('tp2') || texto.includes('valuation')) {
      return [
        'O que acontece se a receita cair 20% (teste de estresse)?',
        'Quais catalisadores podem fazer o preço convergir pro TP1?',
        'Como definir o tamanho seguro da posição?',
      ];
    }
    return [
      'Quais são os 3 maiores riscos operacionais?',
      'Comparar com os principais concorrentes do setor',
      'Quais catalisadores podem destravar valor nos próximos 12 meses?',
    ];
  }, [chatMessages]);

  // Função para buscar cotação em tempo real para o ativo ativo
  const atualizarCotacaoAtual = async () => {
    if (atualizandoCotacao) return;
    setAtualizandoCotacao(true);
    try {
      const res = await fetch(`/api/live-quote?ticker=${ativo.ticker}&mercado=${ativo.mercado}`);
      if (res.ok) {
        const data = await res.json();
        if (data.price && data.price > 0) {
          const novoPreco = Number(data.price.toFixed(2));
          setPreco(novoPreco);
          setAtivo((prev) => {
            const pl = prev.lpa > 0 ? Number((novoPreco / prev.lpa).toFixed(2)) : prev.pl;
            const pvp = prev.vpa > 0 ? Number((novoPreco / prev.vpa).toFixed(2)) : prev.pvp;
            const grahamMult = Number((pl * pvp).toFixed(2));
            return {
              ...prev,
              preco: novoPreco,
              pl,
              pvp,
              grahamMult,
              variacaoDia: typeof data.changePercent === 'number' ? data.changePercent : prev.variacaoDia,
              horarioCotacao: data.updatedAt || prev.horarioCotacao,
              origem: data.source || prev.origem,
            };
          });

          // Atualiza também na lista de oportunidades
          setOportunidades((prev) =>
            prev.map((op) =>
              op.ticker === ativo.ticker
                ? {
                    ...op,
                    preco: novoPreco,
                    variacaoDia: typeof data.changePercent === 'number' ? data.changePercent : op.variacaoDia,
                  }
                : op
            )
          );

          const sinal = (data.changePercent || 0) >= 0 ? '+' : '';
          setFeedbackCotacao(
            `Cotação atualizada: ${ativo.moeda === 'BRL' ? 'R$ ' : 'US$ '}${novoPreco.toFixed(2)} (${sinal}${(data.changePercent || 0).toFixed(2)}%)`
          );
          setTimeout(() => setFeedbackCotacao(null), 3500);
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar cotação:', err);
    } finally {
      setAtualizandoCotacao(false);
    }
  };

  // Carrega oportunidades do backend com cotações atuais
  const fetchOportunidades = () => {
    setCarregandoOportunidades(true);
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOportunidades(data);
          setUltimaAtualizacaoEm(new Date().toLocaleTimeString('pt-BR'));
          const atualizado = data.find((o) => o.ticker === ativo.ticker);
          if (atualizado) {
            const m: 'BRL' | 'USD' = atualizado.mercado === 'B3' ? 'BRL' : (atualizado.moeda || 'USD');
            setPreco(atualizado.preco);
            setLpa(atualizado.lpa);
            setVpa(atualizado.vpa);
            setAtivo({ ...atualizado, moeda: m });
            setMoeda(m);
          }
        }
      })
      .catch((err) => console.error('Erro ao buscar oportunidades:', err))
      .finally(() => setCarregandoOportunidades(false));
  };

  // Executa a Auditoria Diagnóstica em Tempo Real
  const rodarAuditoriaAoVivo = async () => {
    setExecutandoAuditoria(true);
    try {
      const res = await fetch('/api/audit-diagnostics');
      if (res.ok) {
        const data = await res.json();
        setAuditDiagnostics(data);
      }
    } catch (err) {
      console.error('Erro ao executar auditoria diagnóstica:', err);
    } finally {
      setExecutandoAuditoria(false);
    }
  };

  const abrirAuditoria = () => {
    setModalScanInfoAberto(true);
    rodarAuditoriaAoVivo();
  };

  // Busca status do agendamento diário e contagem regressiva
  const fetchScanStatus = async () => {
    try {
      const res = await fetch('/api/scan-status');
      if (res.ok) {
        const data = await res.json();
        setScanStatus(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar status da varredura:', err);
    }
  };

  // Disparo manual de varredura geral (bloqueado apenas quando a aplicação estiver congelada)
  const dispararVarreduraManual = async () => {
    if (executandoScanManual || scanStatus?.isFrozen) {
      setFeedbackScan('Operações congeladas: varreduras automáticas e buscas diárias estão desativadas.');
      setTimeout(() => setFeedbackScan(null), 4000);
      return;
    }
    setExecutandoScanManual(true);
    setFeedbackScan('Executando varredura geral do universo...');
    try {
      const res = await fetch('/api/scan-now', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.opportunities && Array.isArray(data.opportunities)) {
          setOportunidades(data.opportunities);
          const atualizado = data.opportunities.find((o: any) => o.ticker === ativo.ticker);
          if (atualizado) {
            const m: 'BRL' | 'USD' = atualizado.mercado === 'B3' ? 'BRL' : (atualizado.moeda || 'USD');
            setPreco(atualizado.preco);
            setLpa(atualizado.lpa);
            setVpa(atualizado.vpa);
            setAtivo({ ...atualizado, moeda: m });
            setMoeda(m);
          }
        }
        await fetchScanStatus();
        setFeedbackScan('Varredura concluída com sucesso!');
        setTimeout(() => setFeedbackScan(null), 4000);
      }
    } catch (err) {
      console.error('Erro ao executar varredura manual:', err);
      setFeedbackScan('Erro ao executar varredura.');
      setTimeout(() => setFeedbackScan(null), 4000);
    } finally {
      setExecutandoScanManual(false);
    }
  };

  useEffect(() => {
    // Carrega oportunidades e status do servidor ao iniciar
    fetchOportunidades();
    fetchScanStatus();

    // As atualizações automáticas são executadas pelo backend; a interface não faz polling cíclico.
  }, []);

  // O relógio regressivo agora é processado exclusivamente pelo componente isolado <CountdownDisplay />

  // Scroll automático do chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, enviandoMsg]);

  // Carregar ativo selecionado (ao clicar numa oportunidade)
  // O chat é independente e NÃO é modificado ao clicar nas oportunidades
  const carregarAtivo = (op: Oportunidade) => {
    const m: 'BRL' | 'USD' = op.mercado === 'B3' ? 'BRL' : (op.moeda || 'USD');
    setAtivo({ ...op, moeda: m });
    setPreco(op.preco);
    setLpa(op.lpa);
    setVpa(op.vpa);
    setG(op.g);
    setYieldAAA(op.yieldAAA);
    setMargem(op.margemSugerida || 30);
    setMoeda(m);
  };

  const [buscandoAtivoUniverso, setBuscandoAtivoUniverso] = useState(false);

  // Consulta e carrega qualquer ativo do universo de 597 tickers (S&P 500, B3, FIIs, REITs) via Inteligência Fundamentalista
  const analisarAtivoDoUniverso = async (ticker: string) => {
    setBuscandoAtivoUniverso(true);
    setFeedbackCotacao(`Consultando balanço contábil e cotação de ${ticker}...`);
    try {
      const res = await fetch('/api/gemini/search-financials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userApiKey ? { 'x-gemini-key': userApiKey } : {}),
        },
        body: JSON.stringify({ query: ticker }),
      });

      if (res.ok) {
        const data: Oportunidade = await res.json();
        carregarAtivo(data);
        setOportunidades((prev) => {
          if (!prev.some((o) => o.ticker.toUpperCase() === data.ticker.toUpperCase())) {
            return [data, ...prev];
          }
          return prev.map((o) => (o.ticker.toUpperCase() === data.ticker.toUpperCase() ? data : o));
        });
        setFeedbackCotacao(`Ativo ${data.ticker} (${data.nome}) carregado e calibrado com sucesso!`);
        setTimeout(() => setFeedbackCotacao(null), 4000);
        if (!isDesktop) {
          setMobileTab('info');
        }
      } else {
        setFeedbackCotacao(`Não foi possível carregar balanço de ${ticker}.`);
        setTimeout(() => setFeedbackCotacao(null), 4000);
      }
    } catch (err) {
      console.error('Erro ao analisar ativo do universo:', err);
      setFeedbackCotacao(`Erro de conexão ao analisar ${ticker}.`);
      setTimeout(() => setFeedbackCotacao(null), 4000);
    } finally {
      setBuscandoAtivoUniverso(false);
    }
  };

  // Garante que a moeda esteja sempre estritamente alinhada ao mercado do ativo (B3 sempre BRL / R$)
  useEffect(() => {
    if (ativo.mercado === 'B3' && moeda !== 'BRL') {
      setMoeda('BRL');
    } else if (ativo.mercado === 'US' && moeda !== 'USD') {
      setMoeda('USD');
    }
  }, [ativo.ticker, ativo.mercado]);

  const carregarTickerPorSimbolo = (ticker: string) => {
    const op = oportunidades.find((o) => o.ticker === ticker);
    if (op) {
      carregarAtivo(op);
      setMobileTab('info');
    }
  };

  // Sincronização automática do Acompanhamento de Metas (Graham Target Engine)
  useEffect(() => {
    if (oportunidades.length > 0) {
      setTrackedList((prev) => {
        const { updatedList, newlyCompleted } = syncTrackedWithOpportunities(prev, oportunidades);
        if (newlyCompleted.length > 0) {
          const nomes = newlyCompleted.map((i) => i.ticker).join(', ');
          setMetaNotification(`🎯 Meta de Graham alcançada com sucesso: ${nomes}! Objetivo batido e salvo no histórico.`);
          setTimeout(() => setMetaNotification(null), 10000);
        }
        return updatedList;
      });
    }
  }, [oportunidades]);

  const trackerStats = useMemo(() => calculateTrackerStats(trackedList), [trackedList]);

  // Motor de Valuation Graham-Buffett
  const calc = useMemo(() => {
    const isValidGraham = lpa > 0 && vpa > 0;
    const isValidYield = yieldAAA > 0;
    const isOriginal = lpa === ativo.lpa && vpa === ativo.vpa;

    const numeroGraham = (isOriginal && ativo.numeroGraham)
      ? ativo.numeroGraham
      : (isValidGraham ? Math.sqrt(22.5 * lpa * vpa) : 0);

    const grahamCresc = (isOriginal && ativo.valorGrahamCrescimento)
      ? ativo.valorGrahamCrescimento
      : ((lpa > 0 && isValidYield) ? (lpa * (8.5 + 2 * g) * 4.4) / yieldAAA : 0);

    let fair = 0;
    if (isOriginal && ativo.tp1 && ativo.tp1 > 0) {
      fair = ativo.tp1;
    } else if (isOriginal && ativo.pj && ativo.pj > 0) {
      fair = ativo.pj;
    } else if (isValidGraham && grahamCresc > 0) {
      fair = (numeroGraham + grahamCresc) / 2;
    } else if (isValidGraham) {
      fair = numeroGraham;
    } else if (grahamCresc > 0) {
      fair = grahamCresc;
    }

    const zona = (isOriginal && ativo.entradaMax && ativo.entradaMax > 0)
      ? ativo.entradaMax
      : fair * (1 - margem / 100);

    const vsFair = preco > 0 ? ((fair - preco) / preco) * 100 : 0;
    const vsZona = preco > 0 ? ((zona - preco) / preco) * 100 : 0;

    let status: 'COMPRA' | 'JUSTO' | 'CARO' = 'CARO';
    if (preco <= zona && zona > 0) {
      status = 'COMPRA';
    } else if (preco <= fair && fair > 0) {
      status = 'JUSTO';
    } else {
      status = 'CARO';
    }

    const scaleMax = Math.max(preco * 1.15, fair * 1.25, zona * 1.4, 10);
    const pctZona = Math.min(Math.max((zona / scaleMax) * 100, 2), 85);
    const pctFair = Math.min(Math.max((fair / scaleMax) * 100, pctZona + 2), 95);
    const pctAgora = Math.min(Math.max((preco / scaleMax) * 100, 0), 100);

    const plAtual = lpa > 0 ? preco / lpa : 0;
    const pvpAtual = vpa > 0 ? preco / vpa : 0;
    const grahamMultiplier = plAtual * pvpAtual;

    return {
      numeroGraham,
      grahamCresc,
      fair,
      zona,
      vsFair,
      vsZona,
      status,
      pctZona,
      pctFair,
      pctAgora,
      scaleMax,
      plAtual,
      pvpAtual,
      grahamMultiplier,
    };
  }, [preco, lpa, vpa, g, yieldAAA, margem, ativo]);

  const perfilAtivo = useMemo(() => getCompanyProfile(ativo), [ativo]);

  const isAtivoB3 = (mercado?: string, m?: string, ticker?: string) => {
    if (mercado === 'B3') return true;
    if (m === 'BRL') return true;
    if (ticker && /^(BBAS3|PETR4|BBDC4|CMIG4|CSAN3|SAPR11|CPLE6|VALE3|ITSA4|CXSE3|WEGE3|[A-Z]{4}\d{1,2})$/i.test(ticker)) return true;
    return false;
  };

  const getMoedaSimbolo = (item: { mercado?: string; moeda?: string; ticker?: string }) => {
    return isAtivoB3(item.mercado, item.moeda, item.ticker) ? 'R$' : '$';
  };

  const fmtMoeda = (val: number, customMoeda?: 'BRL' | 'USD') => {
    const isReal = customMoeda === 'BRL' || isAtivoB3(ativo.mercado, ativo.moeda, ativo.ticker) || (ativo.mercado !== 'US' && moeda === 'BRL');
    return `${isReal ? 'R$ ' : 'US$ '}${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fmtPercent = (val: number) => {
    const s = val >= 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`;
    return s;
  };


  // Enviar Mensagem para o Chat (Profundo e Aberto)
  const handleEnviarMensagem = async (textoPersonalizado?: string) => {
    const texto = (textoPersonalizado || inputMsg).trim();
    if (!texto || enviandoMsg) return;

    const novaMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: texto,
    };

    setChatMessages((prev) => [...prev, novaMsg]);
    setInputMsg('');
    setEnviandoMsg(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userApiKey ? { 'x-gemini-key': userApiKey } : {}),
        },
        body: JSON.stringify({
          message: texto,
          ativoContexto: {
            ...ativo,
            preco,
            lpa,
            vpa,
            g,
            fair: calc.fair.toFixed(2),
            zona: calc.zona.toFixed(2),
            status: calc.status,
            grahamMult: calc.grahamMultiplier.toFixed(2),
          },
          historico: chatMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          customApiKey: userApiKey || undefined,
        }),
      });

      const data = await res.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          source: data.usedSource,
          searchQueries: data.searchQueries,
          searchSources: data.searchSources,
          text: data.reply,
        },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          text: `Erro ao consultar modelo: ${err.message}`,
        },
      ]);
    } finally {
      setEnviandoMsg(false);
    }
  };

  const copiarResumo = () => {
    const texto = `RELATÓRIO DE ANÁLISE FUNDAMENTALISTA • SETUP GRAHAM-BUFFETT
==================================================
Ativo: ${ativo.nome} (${ativo.ticker}) • ${ativo.moeda}
Último Balanço: ${ativo.ultimoBalanco}
Preço de Mercado Real: ${fmtMoeda(preco)}
Diagnóstico: [${calc.status}]

FUNDAMENTOS CONSOLIDADOS:
• LPA (Lucro/Ação): ${lpa.toFixed(2)} | VPA (Patrimônio/Ação): ${vpa.toFixed(2)}
• Múltiplo P/L: ${calc.plAtual.toFixed(2)}x | P/VP: ${calc.pvpAtual.toFixed(2)}x
• Produto Graham (P/L x P/VP): ${calc.grahamMultiplier.toFixed(2)} (Máx: 22.50)
• ROE: ${ativo.roe}% | Dividend Yield 12m: ${ativo.dividendYield}%

PREÇO JUSTO & ZONA DE COMPRA:
• Número Graham: ${fmtMoeda(calc.numeroGraham)}
• Graham Crescimento: ${fmtMoeda(calc.grahamCresc)}
• Fair Value Médio: ${fmtMoeda(calc.fair)}
• TETO DE COMPRA (${margem}% desc): ${fmtMoeda(calc.zona)}

VEREDITO:
${preco <= calc.zona ? '✓ Dentro da Zona de Compra com Margem de Segurança garantida.' : 'Aguardar recuo para respeitar a margem de segurança.'}`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

// Cálculo unificado de Preço Justo e Zona de Compra Graham-Buffett
function calcularZonaPreco(op: {
  lpa: number;
  vpa: number;
  g: number;
  yieldAAA: number;
  margemSugerida?: number;
  tp1?: number;
  entradaMax?: number;
  pj?: number;
}) {
  const isValidGraham = op.lpa > 0 && op.vpa > 0;
  const isValidYield = op.yieldAAA > 0;
  const numeroGraham = isValidGraham ? Math.sqrt(22.5 * op.lpa * op.vpa) : 0;
  const grahamCresc = (op.lpa > 0 && isValidYield) ? (op.lpa * (8.5 + 2 * op.g) * 4.4) / op.yieldAAA : 0;
  let fair = 0;
  if (op.tp1 && op.tp1 > 0) {
    fair = op.tp1;
  } else if (op.pj && op.pj > 0) {
    fair = op.pj;
  } else if (isValidGraham && grahamCresc > 0) {
    fair = (numeroGraham + grahamCresc) / 2;
  } else if (isValidGraham) {
    fair = numeroGraham;
  } else if (grahamCresc > 0) {
    fair = grahamCresc;
  }
  let zona = 0;
  if (op.entradaMax && op.entradaMax > 0) {
    zona = op.entradaMax;
  } else {
    const margem = op.margemSugerida !== undefined ? op.margemSugerida : 30;
    zona = fair * (1 - margem / 100);
  }
  return { fair, zona, numeroGraham, grahamCresc };
}

  // Contagens para os filtros do setup
  const totalNaZona = useMemo(() => {
    return oportunidades.filter((op) => {
      const { zona } = calcularZonaPreco(op);
      return op.preco <= zona;
    }).length;
  }, [oportunidades]);

  const totalClasseA = useMemo(() => {
    return oportunidades.filter((op) => op.classe === 'A').length;
  }, [oportunidades]);

  const totalConfirmadas = useMemo(() => {
    return oportunidades.filter((op) => op.statusGraham === 'confirmada' || op.categoria === 'CONFIRMADA').length;
  }, [oportunidades]);

  const totalIbkr = useMemo(() => {
    return oportunidades.filter((op) => op.naCarteiraIbkr).length;
  }, [oportunidades]);

  // Filtragem das Oportunidades do Setup (Peneira com Preço Justo e Zona de Compra)
  const oportunidadesFiltradas = useMemo(() => {
    return oportunidades
      .filter((op) => {
        if (filtroMercado === 'B3') {
          if (op.mercado !== 'B3' || op.tipoAtivo === 'FII') return false;
        } else if (filtroMercado === 'US') {
          if (op.mercado !== 'US' || op.tipoAtivo === 'REIT') return false;
        } else if (filtroMercado === 'FII') {
          if (op.tipoAtivo !== 'FII') return false;
        } else if (filtroMercado === 'REIT') {
          if (op.tipoAtivo !== 'REIT') return false;
        }

        if (filtroSub === 'ZONA') {
          const { zona } = calcularZonaPreco(op);
          if (op.preco > zona) return false;
        } else if (filtroSub === 'CLASSE_A') {
          if (op.classe !== 'A') return false;
        } else if (filtroSub === 'CONFIRMADA') {
          if (op.statusGraham !== 'confirmada' && op.categoria !== 'CONFIRMADA') return false;
        } else if (filtroSub === 'IBKR') {
          if (!op.naCarteiraIbkr) return false;
        }

        if (buscaTicker.trim()) {
          const q = buscaTicker.trim().toLowerCase();
          const matchTicker = op.ticker.toLowerCase().includes(q);
          const matchNome = op.nome.toLowerCase().includes(q);
          if (!matchTicker && !matchNome) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filtroSub === 'CLASSE_A' || filtroSub === 'TODOS' || filtroSub === 'CONFIRMADA') {
          const scoreA = a.score || 0;
          const scoreB = b.score || 0;
          if (scoreA !== scoreB) return scoreB - scoreA;
        }
        const zA = calcularZonaPreco(a).zona;
        const zB = calcularZonaPreco(b).zona;
        const descA = a.preco > 0 ? (zA - a.preco) / a.preco : 0;
        const descB = b.preco > 0 ? (zB - b.preco) / b.preco : 0;
        return descB - descA;
      });
  }, [oportunidades, filtroMercado, filtroSub, buscaTicker]);

  // Busca em tempo real no Universo Expandido (504 S&P 500, Top 50 B3, FIIs e REITs)
  const matchesUniverso = useMemo(() => {
    if (!buscaTicker.trim()) return [];
    return searchUniverse(buscaTicker.trim(), 4).filter(
      (u) => !oportunidades.some((o) => o.ticker.toUpperCase() === u.ticker.toUpperCase())
    );
  }, [buscaTicker, oportunidades]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  const [currentRoute, setCurrentRoute] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      if (path.startsWith('/app') || path.startsWith('/terminal') || isStandalone) {
        return 'app';
      }
    }
    return 'landing';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/app') || path.startsWith('/terminal')) {
        setCurrentRoute('app');
      } else {
        setCurrentRoute('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'landing' | 'app') => {
    setCurrentRoute(route);
    const targetPath = route === 'app' ? '/app' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  if (currentRoute === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => navigateTo('app')}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => {
            setAuthModalOpen(false);
            navigateTo('app');
          }}
        />
      </>
    );
  }

  return (
    <div className="h-full h-dvh w-full max-w-full bg-white text-[#1e293b] font-sans flex flex-col overflow-hidden select-none">
      
      {/* Barra Superior Sólida de Ancoragem Safe-Area para iOS Safari & PWA (Elimina o efeito esfumaçado/embaçado) */}
      <div className="w-full bg-white shrink-0 h-[env(safe-area-inset-top,0px)]" />

      {/* Banner de Notificação de Metas Alcançadas */}
      {metaNotification && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-md z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
            <span>{metaNotification}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModalMetasAberto(true)}
              className="px-2 py-0.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded text-[11px] font-extrabold cursor-pointer transition-colors shadow-xs"
            >
              Ver Histórico de Metas
            </button>
            <button
              onClick={() => setMetaNotification(null)}
              className="p-0.5 hover:bg-emerald-800 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HEADER PRINCIPAL RESPONSIVO COM IDENTIDADE ANTITRADER      */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-slate-300 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 gap-2 min-h-[48px]">
        
        {/* Logo / Marca AntiTrader */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-[#090d16] hover:bg-slate-900 transition-colors text-white px-2.5 py-1 rounded-lg border border-slate-800 shadow-xs cursor-default">
            {/* Ícone AntiTrader: Idêntico ao ícone PWA, nítido e chamativo */}
            <img
              src="/icon.svg"
              alt="AntiTrader Ícone & Logo"
              className="w-5 h-5 rounded-sm shrink-0 shadow-xs"
            />
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-black text-sm tracking-tight text-white">AntiTrader</span>
              <span className="hidden md:inline text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">
                Setup Graham &amp; Bazin
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer shadow-2xs"
            title="Ver Página Inicial & Planos de Assinatura"
          >
            <ArrowLeft className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Página Inicial</span>
          </button>
        </div>

        {/* Controles de Ação do Header - Responsivos e sem transbordo */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Botão de Instalação PWA */}
          <PWAInstallButton />

          {/* Botão de Refresh Global de Cotações */}
          <button
            onClick={fetchOportunidades}
            disabled={carregandoOportunidades}
            className="flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-400 transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Atualizar cotações ao vivo do pregão para as ações monitoradas"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline">{carregandoOportunidades ? 'Atualizando...' : 'Cotações'}</span>
          </button>

          {/* Botão de Acompanhamento de Metas de Preço Graham (Visível em Tablets e Desktops) */}
          <button
            onClick={() => setModalMetasAberto(true)}
            className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md border border-blue-300 bg-blue-50/80 hover:bg-blue-100 text-xs font-bold text-blue-900 transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Acompanhar variações de preço até o objetivo (Preço Justo Graham) e histórico de metas finalizadas"
          >
            <Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden md:inline">Metas:</span>
            <span className="font-mono text-[11px] sm:text-xs">{trackerStats.totalAtivas}</span>
            <span className="hidden sm:inline font-mono text-[11px]">Ativas</span>
            {trackerStats.totalFinalizadas > 0 && (
              <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                🏆 {trackerStats.totalFinalizadas}
              </span>
            )}
          </button>

          {/* Toggles de Painéis no Desktop / Notebook para Personalizar Espaço */}
          <div className="hidden lg:flex items-center gap-1 border-l border-slate-300 pl-1.5 ml-0.5">
            <button
              type="button"
              onClick={() => setPainelEsquerdoRecolhido(!painelEsquerdoRecolhido)}
              className={`p-1 px-1.5 rounded-md border text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                painelEsquerdoRecolhido
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title={painelEsquerdoRecolhido ? 'Expandir painel de oportunidades' : 'Recolher painel de oportunidades para dar mais espaço ao valuation'}
            >
              <PanelLeft className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] hidden xl:inline">Oportunidades</span>
            </button>

            <button
              type="button"
              onClick={() => setPainelDireitoRecolhido(!painelDireitoRecolhido)}
              className={`p-1 px-1.5 rounded-md border text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                painelDireitoRecolhido
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title={painelDireitoRecolhido ? 'Expandir painel AntiTrader AI' : 'Recolher painel AntiTrader AI para focar no valuation'}
            >
              <PanelRight className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] hidden xl:inline">IA</span>
            </button>
          </div>

          {/* Menu de Perfil / Acesso do Usuário */}
          <div className="border-l border-slate-300 pl-1.5 ml-0.5">
            <UserProfileMenu
              onOpenAuth={(mode) => {
                setAuthModalMode(mode);
                setAuthModalOpen(true);
              }}
              onNavigateToPlans={() => navigateTo('landing')}
            />
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SELETOR MOBILE / TABLET (MENU DE ABAS ENTRE O TOPO E AS OPORTUNIDADES) */}
      {/* ========================================================= */}
      <nav className="grid grid-cols-4 sm:grid-cols-5 lg:hidden w-full bg-slate-100 border-b border-slate-300 p-1 sm:p-1.5 gap-1 shrink-0 text-xs font-bold select-none overflow-hidden">
        {/* Aba 1: Oportunidades */}
        <button
          onClick={() => setMobileTab('oportunidades')}
          className={`py-1.5 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-xs font-bold tracking-tight flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer transition-all border active:scale-95 min-w-0 ${
            mobileTab === 'oportunidades'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Oportunidades</span>
        </button>

        {/* Aba 2: Metas */}
        <button
          onClick={() => setMobileTab('metas')}
          className={`py-1.5 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-xs font-bold tracking-tight flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer transition-all border active:scale-95 min-w-0 ${
            mobileTab === 'metas'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span>Metas</span>
          <span className={`text-[9px] font-mono px-1 rounded-full shrink-0 ${
            mobileTab === 'metas' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-900 font-bold'
          }`}>
            {trackerStats.totalAtivas}
          </span>
        </button>

        {/* Aba 3: Valuation */}
        <button
          onClick={() => setMobileTab('info')}
          className={`py-1.5 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-xs font-bold tracking-tight flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer transition-all border active:scale-95 min-w-0 ${
            mobileTab === 'info'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
          <span>Valuation</span>
        </button>

        {/* Aba 4: AntiTrader AI */}
        <button
          onClick={() => setMobileTab('copilot')}
          className={`py-1.5 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-xs font-bold tracking-tight flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer transition-all border active:scale-95 min-w-0 ${
            mobileTab === 'copilot'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">AntiTrader AI</span>
        </button>

        {/* Aba 5: Lado a Lado (Em tablets sm: até lg:) */}
        <button
          onClick={() => setMobileTab('ambas')}
          className={`hidden sm:flex py-1.5 px-1 rounded-md text-xs font-bold items-center justify-center gap-1 cursor-pointer transition-all border active:scale-95 min-w-0 ${
            mobileTab === 'ambas'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
          title="Modo Tablet: Visualizar Valuation e AntiTrader AI lado a lado"
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>Lado a Lado</span>
        </button>
      </nav>





      {/* ========================================================= */}
      {/* ÁREA PRINCIPAL: THREE-PANEL LAYOUT (CUSTOMIZÁVEL NO NOTEBOOK/DESKTOP) */}
      {/* ========================================================= */}
      <div
        className={`flex-1 flex flex-col lg:flex-row w-full max-w-full overflow-hidden min-h-0 bg-slate-100 relative ${
          redimensionando ? 'select-none' : ''
        }`}
      >
        {/* ========================================================= */}
        {/* PAINEL 1 (ESQUERDA): OPORTUNIDADES & PENEIRA GRAHAM       */}
        {/* Customizável no desktop/notebook e aba no mobile/tablet    */}
        {/* ========================================================= */}
        {painelEsquerdoRecolhido && isDesktop ? (
          <aside className="hidden lg:flex w-9 bg-slate-100 border-r border-slate-300 flex-col items-center py-3 justify-between shrink-0 select-none">
            <button
              onClick={() => setPainelEsquerdoRecolhido(false)}
              className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-300 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Expandir Painel de Oportunidades"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
              <span>Oportunidades</span>
              <span className="text-[9px] bg-emerald-600 text-white px-1 py-0.5 rounded-full font-mono">{totalNaZona}</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </aside>
        ) : (
          <section
            style={{ width: isDesktop && !painelEsquerdoRecolhido ? `${leftWidth}px` : undefined }}
            className={`w-full ${
              isDesktop ? 'shrink-0' : 'flex-1'
            } min-w-0 bg-[#f8fafc] flex flex-col border-r border-slate-300 h-full overflow-hidden ${
              mobileTab !== 'oportunidades' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Header Fixo do Painel de Oportunidades */}
            <div className="bg-white border-b border-slate-300 p-2.5 sm:p-3 shadow-2xs space-y-2 shrink-0">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-slate-900 leading-none truncate">
                      Peneira Graham
                    </h2>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {oportunidadesFiltradas.length} ativos • {totalNaZona} na Zona
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={fetchOportunidades}
                    disabled={carregandoOportunidades}
                    className="p-1 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded border border-slate-200 transition-colors cursor-pointer"
                    title="Atualizar cotações"
                  >
                    <RefreshCw className={`w-3 h-3 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setModalMetasAberto(true)}
                    className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 cursor-pointer transition-colors"
                    title="Acompanhamento de metas"
                  >
                    <Target className="w-3 h-3 text-blue-600" />
                    <span>{trackerStats.totalAtivas}</span>
                  </button>

                  {/* Botão de Recolher Painel no Desktop */}
                  <button
                    onClick={() => setPainelEsquerdoRecolhido(true)}
                    className="hidden lg:flex p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                    title="Recolher painel esquerdo para dar mais espaço ao valuation no notebook"
                  >
                    <PanelLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Barra de Busca Rápida por Ticker ou Empresa */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={buscaTicker}
                  onChange={(e) => setBuscaTicker(e.target.value)}
                  placeholder="Buscar ticker ou empresa (ex: BBAS3, PFE)..."
                  className="w-full pl-8 pr-7 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder:text-slate-400"
                />
                {buscaTicker && (
                  <button
                    onClick={() => setBuscaTicker('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                    title="Limpar busca"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Filtros Compactos: Mercado + Na Zona + Relógio 19h */}
              <div className="flex items-center justify-between gap-1 flex-wrap pt-1 text-[10px]">
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200">
                  {(['TODOS', 'B3', 'US', 'FII', 'REIT'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setFiltroMercado(m)}
                      className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                        filtroMercado === m
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 flex-wrap gap-0.5 text-[9.5px]">
                  <button
                    onClick={() => setFiltroSub('TODOS')}
                    className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                      filtroSub === 'TODOS'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos ({oportunidades.length})
                  </button>
                  <button
                    onClick={() => setFiltroSub('ZONA')}
                    className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors flex items-center gap-0.5 ${
                      filtroSub === 'ZONA'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Na Zona</span>
                    <span className={`text-[8px] px-1 rounded-full ${
                      filtroSub === 'ZONA' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {totalNaZona}
                    </span>
                  </button>
                  <button
                    onClick={() => setFiltroSub('CLASSE_A')}
                    className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors flex items-center gap-0.5 ${
                      filtroSub === 'CLASSE_A'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Classe A</span>
                    <span className={`text-[8px] px-1 rounded-full ${
                      filtroSub === 'CLASSE_A' ? 'bg-indigo-800 text-white' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {totalClasseA}
                    </span>
                  </button>
                  <button
                    onClick={() => setFiltroSub('CONFIRMADA')}
                    className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors flex items-center gap-0.5 ${
                      filtroSub === 'CONFIRMADA'
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Confirmadas</span>
                    <span className={`text-[8px] px-1 rounded-full ${
                      filtroSub === 'CONFIRMADA' ? 'bg-teal-900 text-white' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {totalConfirmadas}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setModalScanInfoAberto(true)}
                  className="flex items-center gap-1 bg-[#0f172a] text-white px-1.5 py-0.5 rounded font-mono border border-sky-800/60 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs ml-auto"
                  title={scanStatus?.isFrozen ? "PWA Congelado • Varreduras e buscas diárias desativadas" : "Varredura Diária às 19:00 BRT"}
                >
                  {scanStatus?.isFrozen ? (
                    <Snowflake className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                  ) : (
                    <Clock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  )}
                  <CountdownDisplay isFrozen={scanStatus?.isFrozen ?? false} nextScanTime={scanStatus?.nextScanTime} className="font-bold text-sky-300 text-[10px]" />
                </button>
              </div>
            </div>

            {/* Lista Vertical com Rolagem Suave dos Cards de Oportunidades */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
              {/* Sugestões de Ativos do Universo Geral (597 ativos: S&P 500, B3, FIIs, REITs) */}
              {matchesUniverso.length > 0 && (
                <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-2.5 rounded-xl border border-blue-500/40 text-white shadow-xs space-y-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                        Universo Expandido (S&P 500, B3, FIIs, REITs)
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">597 ativos</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchesUniverso.map((item) => (
                      <div
                        key={item.ticker}
                        className="flex items-center justify-between bg-slate-800/90 p-1.5 rounded-lg border border-slate-700 text-xs hover:border-slate-600 transition-colors"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white text-xs">{item.ticker}</span>
                            <span
                              className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                                item.tipo === 'FII'
                                  ? 'bg-teal-900 text-teal-200 border border-teal-700'
                                  : item.tipo === 'REIT'
                                  ? 'bg-purple-900 text-purple-200 border border-purple-700'
                                  : item.mercado === 'B3'
                                  ? 'bg-amber-900 text-amber-200 border border-amber-700'
                                  : 'bg-indigo-900 text-indigo-200 border border-indigo-700'
                              }`}
                            >
                              {item.tipo}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[130px] sm:max-w-[190px]">
                            {item.nome}
                          </span>
                        </div>
                        <button
                          onClick={() => analisarAtivoDoUniverso(item.ticker)}
                          disabled={buscandoAtivoUniverso}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>{buscandoAtivoUniverso ? 'Analisando...' : 'Analisar'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {oportunidadesFiltradas.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-600 font-medium">Nenhum ativo encontrado.</p>
                  <button
                    onClick={() => {
                      setBuscaTicker('');
                      setFiltroMercado('TODOS');
                      setFiltroSub('TODOS');
                    }}
                    className="mt-2 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Redefinir filtros
                  </button>
                </div>
              ) : (
                oportunidadesFiltradas.map((op) => {
                  const isSelected = ativo.ticker === op.ticker;
                  const { zona, fair } = calcularZonaPreco(op);
                  const naZona = op.preco <= zona;
                  const margemPct = op.preco > 0 ? ((zona - op.preco) / op.preco) * 100 : 0;
                  const moedaSimbolo = getMoedaSimbolo(op);

                  return (
                    <div
                      key={op.id}
                      onClick={() => {
                        carregarAtivo(op);
                        if (!isDesktop) {
                          setMobileTab('info');
                        }
                      }}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-600 shadow-xs'
                          : naZona
                          ? 'bg-white border-emerald-300 hover:border-emerald-500 shadow-2xs hover:bg-emerald-50/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:bg-slate-50'
                      }`}
                    >
                      {/* Topo do Card: Ticker, Mercado, Score, Status e IBKR */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-sm font-black font-mono text-slate-900 leading-none">
                            {op.ticker}
                          </span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase border ${
                            op.tipoAtivo === 'FII'
                              ? 'bg-teal-50 text-teal-900 border-teal-300'
                              : op.tipoAtivo === 'REIT'
                              ? 'bg-purple-50 text-purple-900 border-purple-300'
                              : op.mercado === 'B3'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                          }`}>
                            {op.tipoAtivo === 'FII' ? 'FII' : op.tipoAtivo === 'REIT' ? 'REIT' : op.mercado}
                          </span>
                          {op.score !== undefined && (
                            <span className={`text-[8px] font-black px-1.5 py-0.2 rounded font-mono border ${
                              op.classe === 'A'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : op.classe === 'B'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : op.classe === 'C'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}>
                              {op.score} ({op.classe})
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white shadow-2xs">
                              EM FOCO
                            </span>
                          )}
                        </div>

                        {op.statusGraham === 'confirmada' ? (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded uppercase bg-emerald-700 text-white shadow-2xs">
                            CONFIRMADA
                          </span>
                        ) : naZona ? (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded uppercase bg-emerald-600 text-white shadow-2xs flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            NA ZONA
                          </span>
                        ) : (
                          <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            RADAR
                          </span>
                        )}
                      </div>

                      {/* Nome da Empresa e Setor */}
                      <p className="text-[11px] font-medium text-slate-600 truncate mb-1">
                        {op.nome} {op.setor ? `• ${op.setor}` : ''}
                      </p>

                      {/* Preços e Margem de Segurança */}
                      <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 font-mono text-xs">
                        <div>
                          <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">Preço Atual</span>
                          <span className="font-extrabold text-slate-900">
                            {moedaSimbolo} {op.preco.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">
                            {op.entradaMax ? 'Teto Zona (0.80×PJ)' : 'Zona Compra (-25%)'}
                          </span>
                          <span className="font-bold text-emerald-700">
                            {moedaSimbolo} {zona.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Margem e Dual Targets TP1 / TP2 */}
                      <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-600 font-mono">
                        <span className={`font-bold ${naZona ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {naZona ? `+${margemPct.toFixed(0)}% margem` : (op.acaoEntrada || 'Acima do teto')}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500 font-semibold">
                          {op.tp1 && <span>PJ {moedaSimbolo}{op.tp1.toFixed(0)}</span>}
                          {op.tp2 && <span>• TP2 {moedaSimbolo}{op.tp2.toFixed(0)}</span>}
                          <span>• P/L {op.pl.toFixed(1)}x</span>
                        </div>
                      </div>

                      {/* Botão Mobile para Abrir Valuation */}
                      <div className="lg:hidden mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                        <span>Analisar Valuation</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* DIVISOR REDIMENSIONÁVEL 1 (ESQUERDA / MEIO) NO NOTEBOOK   */}
        {/* ========================================================= */}
        {!painelEsquerdoRecolhido && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setRedimensionando('left');
            }}
            onTouchStart={() => setRedimensionando('left')}
            onDoubleClick={() => setLeftWidth(320)}
            className="hidden lg:flex w-[5px] hover:w-[7px] bg-slate-200 hover:bg-blue-500 cursor-col-resize shrink-0 transition-all z-10 items-center justify-center group relative select-none"
            title="Arraste para redimensionar o painel de oportunidades no notebook. Clique duplo para redefinir para 320px."
          >
            <div className="w-1 h-8 rounded-full bg-slate-400 group-hover:bg-white transition-colors" />
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA MOBILE / TABLET: PAINEL DE METAS & CICLO DE VALOR     */}
        {/* ========================================================= */}
        {mobileTab === 'metas' && (
          <section className="lg:hidden w-full flex-1 min-w-0 bg-[#f8fafc] flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto">
            {/* Header com KPIs e Estatísticas Rápidas */}
            <div className="bg-white border border-slate-300 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5 shrink-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">
                      Acompanhamento de Metas de Valor
                    </h2>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {trackerStats.totalAtivas} ativas • {trackerStats.totalFinalizadas} batidas • Taxa de acerto {trackerStats.taxaAcertoPercent}%
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalMetasAberto(true)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Gerenciar Metas</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Mini KPIs */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono text-xs">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">Em Andamento</span>
                  <span className="font-bold text-blue-700">{trackerStats.totalAtivas}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="block text-[9px] font-sans font-bold text-emerald-700 uppercase">Metas Batidas</span>
                  <span className="font-extrabold text-emerald-800">🏆 {trackerStats.totalFinalizadas}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">Lucro Médio</span>
                  <span className="font-bold text-emerald-700">+{trackerStats.lucroMedioRealizadoPercent}%</span>
                </div>
              </div>
            </div>

            {/* Lista dos cards de metas com Ciclo Graham (Entrada ➔ TP1 ➔ TP2) */}
            <div className="space-y-3 pb-8">
              {trackedList.map((item) => {
                const isFinalizada = item.status === 'FINALIZADA';
                const moedaSimbolo = getMoedaSimbolo(item);
                const tp1 = item.tp1 || item.precoAlvo;
                const tp2 = item.tp2 || Number((tp1 * 1.35).toFixed(2));
                const precoStop = item.precoStop || Number((item.precoEntrada * 0.80).toFixed(2));

                const ganhoAtualPct = item.precoEntrada > 0
                  ? ((item.precoAtual - item.precoEntrada) / item.precoEntrada) * 100
                  : 0;

                // Estágio 1: Entrada -> TP1
                const deltaTp1 = tp1 - item.precoEntrada;
                const avancoTp1 = item.precoAtual - item.precoEntrada;
                const progressoTp1Pct = deltaTp1 > 0
                  ? Math.min(100, Math.max(0, (avancoTp1 / deltaTp1) * 100))
                  : (item.precoAtual >= tp1 ? 100 : 0);

                // Estágio 2: TP1 -> TP2
                const deltaTp2 = tp2 - tp1;
                const avancoTp2 = item.precoAtual - tp1;
                const progressoTp2Pct = deltaTp2 > 0
                  ? Math.min(100, Math.max(0, (avancoTp2 / deltaTp2) * 100))
                  : (item.precoAtual >= tp2 ? 100 : 0);

                const isInvalidado = item.etapaCiclo === 'INVALIDADO' || item.precoAtual <= precoStop;
                const isTp1Batido = item.etapaCiclo === 'TP1_BATIDO' || item.precoAtual >= tp1;
                const isTp2Batido = item.etapaCiclo === 'TP2_BATIDO' || item.precoAtual >= tp2;

                return (
                  <div
                    key={item.ticker}
                    onClick={() => {
                      carregarTickerPorSimbolo(item.ticker);
                    }}
                    className={`bg-white rounded-xl p-3.5 border-2 transition-all cursor-pointer shadow-2xs ${
                      isInvalidado
                        ? 'border-rose-400 bg-rose-50/20'
                        : isFinalizada || isTp2Batido
                        ? 'border-emerald-400 bg-gradient-to-r from-emerald-50/40 via-white to-white'
                        : isTp1Batido
                        ? 'border-teal-400 bg-teal-50/20'
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-base font-black font-mono text-slate-900">{item.ticker}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                            item.mercado === 'B3'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                          }`}>
                            {item.mercado}
                          </span>
                          {item.score !== undefined && (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded font-mono border bg-emerald-50 text-emerald-800 border-emerald-300">
                              Score {item.score}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate mt-0.5">{item.nome}</div>
                      </div>

                      <div className="text-right">
                        {isInvalidado ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs uppercase">
                            ⚠️ Stop Invalidação
                          </span>
                        ) : isFinalizada || isTp2Batido ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs uppercase">
                            🏆 TP2 Concluído
                          </span>
                        ) : isTp1Batido ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-700 text-white shadow-2xs uppercase">
                            🎯 TP1 Batido (Realizar 50%)
                          </span>
                        ) : item.precoAtual > item.precoTetoZona ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 uppercase">
                            A Caminho do TP1
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase">
                            ● Na Zona de Compra
                          </span>
                        )}
                        <div className={`text-xs font-bold font-mono mt-0.5 ${
                          (isFinalizada ? item.lucroRealizadoPercent || 0 : ganhoAtualPct) >= 0
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}>
                          {isFinalizada
                            ? `+${item.lucroRealizadoPercent}% Lucro`
                            : `${ganhoAtualPct >= 0 ? '+' : ''}${ganhoAtualPct.toFixed(1)}%`}
                        </div>
                      </div>
                    </div>

                    {/* Preços: Entrada/Stop, Atual, TP1, TP2 */}
                    <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-mono text-xs">
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">Entrada</span>
                        <span className="font-bold text-slate-800">{moedaSimbolo} {item.precoEntrada.toFixed(2)}</span>
                        <span className="block text-[8px] text-rose-600 font-bold">Stop: {moedaSimbolo} {precoStop.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">{isFinalizada ? 'Saída' : 'Atual'}</span>
                        <span className="font-extrabold text-slate-900">{moedaSimbolo} {(isFinalizada ? item.precoFinalizacao || item.precoAtual : item.precoAtual).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-teal-700 uppercase">Alvo TP1</span>
                        <span className="font-bold text-teal-800">{moedaSimbolo} {tp1.toFixed(2)}</span>
                        <span className="block text-[8px] text-teal-600">{progressoTp1Pct >= 100 ? '✓ Batido' : `${progressoTp1Pct.toFixed(0)}%`}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-indigo-700 uppercase">Alvo TP2</span>
                        <span className="font-bold text-indigo-800">{moedaSimbolo} {tp2.toFixed(2)}</span>
                        <span className="block text-[8px] text-indigo-600">{progressoTp2Pct >= 100 ? '✓ Batido' : `${progressoTp2Pct.toFixed(0)}%`}</span>
                      </div>
                    </div>

                    {/* Barras de progresso duplas */}
                    <div className="mt-2 space-y-1.5">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[10px] font-medium text-slate-600">
                          <span>Estágio 1: Entrada ➔ TP1 ({moedaSimbolo} {tp1.toFixed(2)})</span>
                          <span className="font-mono font-bold text-slate-900">{progressoTp1Pct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-teal-500"
                            style={{ width: `${progressoTp1Pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[10px] font-medium text-slate-600">
                          <span>Estágio 2: TP1 ➔ TP2 ({moedaSimbolo} {tp2.toFixed(2)})</span>
                          <span className="font-mono font-bold text-slate-900">{progressoTp2Pct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-teal-500 to-indigo-600"
                            style={{ width: `${progressoTp2Pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {item.nota && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                        💡 {item.nota}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        carregarTickerPorSimbolo(item.ticker);
                      }}
                      className="w-full mt-2.5 py-1 px-3 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver Valuation &amp; Balanço</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* PAINEL 2 (CENTRO): TERMINAL DE VALUATION & BALANÇO        */}
        {/* Ocupa flex-1 adaptando-se aos painéis redimensionáveis    */}
        {/* ========================================================= */}
        <main
          className={`flex-1 min-w-[320px] bg-[#fbfcfd] flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto h-full z-0 ${
            mobileTab === 'copilot' || mobileTab === 'oportunidades' || mobileTab === 'metas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Barra de Navegação Rápida no Mobile / Tablet */}
          <div className="lg:hidden flex items-center justify-between gap-2 p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-xs shrink-0">
            <button
              type="button"
              onClick={() => setMobileTab('oportunidades')}
              className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oportunidades</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('copilot')}
              className="flex items-center gap-1 font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md shadow-2xs cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AntiTrader AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Header da Ação Selecionada */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-300 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
                  TERMINAL DE VALUATION
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {ativo.nome}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  {ativo.ticker}
                </span>
                <span className="text-xs text-slate-500 font-mono">({ativo.mercado})</span>
                {ativo.score !== undefined && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono border ${
                    ativo.classe === 'A'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : ativo.classe === 'B'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : ativo.classe === 'C'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    SCORE {ativo.score} • CLASSE {ativo.classe}
                  </span>
                )}
                {ativo.statusGraham && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                    ativo.statusGraham === 'confirmada'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-amber-600 text-white border-amber-700'
                  }`}>
                    {ativo.statusGraham === 'confirmada' ? 'CONFIRMADA' : 'OBSERVAÇÃO'}
                  </span>
                )}
                {ativo.setor && (
                  <span className="text-[10px] text-slate-500 font-sans">
                    • {ativo.setor}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-600 font-mono mt-1 flex-wrap">
                <span>{ativo.ultimoBalanco}</span>
                <span>•</span>
                <span>ROE: <strong className="text-emerald-700">{ativo.roe}%</strong></span>
                <span>•</span>
                <span>DY 12m: <strong className="text-emerald-700">{ativo.dividendYield}%</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
              {/* Linha 1: Preço Atual e Status da Zona */}
              <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 block whitespace-nowrap">
                    {fmtMoeda(preco)}
                  </span>
                  {ativo.variacaoDia !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                        ativo.variacaoDia >= 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                      title="Variação da cotação no pregão recente"
                    >
                      {ativo.variacaoDia >= 0 ? '+' : ''}{ativo.variacaoDia.toFixed(2)}%
                    </span>
                  )}
                </div>

                <div
                  className={`px-2.5 py-1 rounded-md text-[10.5px] sm:text-[11px] font-extrabold tracking-wider uppercase border-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
                    calc.status === 'COMPRA'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                      : calc.status === 'JUSTO'
                      ? 'bg-amber-50 text-amber-900 border-amber-400'
                      : 'bg-red-50 text-red-900 border-red-400'
                  }`}
                >
                  <span className="text-[8px]">●</span>
                  <span>{calc.status === 'COMPRA' ? 'ZONA DE COMPRA' : calc.status === 'JUSTO' ? 'PREÇO JUSTO' : 'CARO (AGUARDAR)'}</span>
                </div>

                {/* Botão de Atalho Rápido para a IA no Mobile / Tablet */}
                <button
                  type="button"
                  onClick={() => setMobileTab('copilot')}
                  className="lg:hidden flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-md border border-blue-300 transition-colors cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
                  title="Abrir chat do AntiTrader AI para este ativo"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Perguntar à IA</span>
                </button>
              </div>

              {/* Linha 2: Múltiplos e Botão Atualizar Cotação em Linha Única Horizontal */}
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-slate-600 whitespace-nowrap">
                <span className="whitespace-nowrap">P/L: {calc.plAtual.toFixed(1)}x • P/VP: {calc.pvpAtual.toFixed(2)}x</span>
                <button
                  onClick={atualizarCotacaoAtual}
                  disabled={atualizandoCotacao}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer transition-colors shrink-0 whitespace-nowrap shadow-2xs"
                  title="Consultar cotação ao vivo em tempo real deste ativo no pregão e recalcular desconto"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${atualizandoCotacao ? 'animate-spin' : ''}`} />
                  <span className="whitespace-nowrap">{atualizandoCotacao ? 'Cotação...' : 'Cotação Atual'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner de Feedback de Atualização de Cotação */}
          {feedbackCotacao && (
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-mono flex items-center justify-between shadow-2xs">
              <span className="font-semibold">{feedbackCotacao}</span>
              <span className="text-[10px] text-emerald-700 font-bold">Valuation &amp; Graham Recalculados</span>
            </div>
          )}

          {/* Cards das Métricas Centrais (Quadrinhos com bordas nítidas) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg shadow-2xs">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Preço Justo (PJ / TP1)
              </span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-0.5">
                {fmtMoeda(calc.fair)}
              </span>
              <span className="text-[11px] text-slate-600 font-mono mt-0.5 block truncate">
                Graham: {fmtMoeda(calc.numeroGraham)} • Cresc: {fmtMoeda(calc.grahamCresc)}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 border-2 border-emerald-400 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                  Teto Zona ({ativo.entradaMax ? '0.80×PJ' : `${margem}% desc.`})
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span className="text-xl font-bold text-emerald-700 font-mono block mt-0.5">
                {fmtMoeda(calc.zona)}
              </span>
              <span className="text-[11px] text-emerald-900 font-mono mt-0.5 block truncate">
                {preco <= calc.zona 
                  ? '✓ Dentro da Zona de Segurança' 
                  : (ativo.acaoEntrada || `Distância: ${Math.abs(calc.vsZona).toFixed(1)}% para compra`)}
              </span>
            </div>

            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Upside TP1 &amp; Alvo TP2
                </span>
                <Target className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-xl font-bold font-mono ${calc.vsFair >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {fmtPercent(calc.vsFair)}
                </span>
                {ativo.tp2 && (
                  <span className="text-xs font-mono font-bold text-blue-700">
                    TP2: {fmtMoeda(ativo.tp2)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-600 font-mono mt-0.5 block whitespace-nowrap">
                P/L &times; P/VP: <strong className={calc.grahamMultiplier <= 22.5 ? 'text-emerald-700' : 'text-amber-700'}>{calc.grahamMultiplier.toFixed(2)}</strong> (Máx: 22.5)
              </span>
            </div>
          </div>

          {/* RÉGUA VISUAL DA ZONA DE COMPRA (GAUGE REFINADA) */}
          <div className="p-3.5 bg-white border-2 border-slate-300 rounded-lg shadow-2xs overflow-hidden">
            <div className="grid grid-cols-3 items-center text-[11px] font-bold text-slate-600 mb-2">
              <div className="text-left">
                <span className="text-emerald-700 whitespace-nowrap">Barato / Compra (&lt; {fmtMoeda(calc.zona)})</span>
              </div>
              <div className="text-center">
                <span className="text-amber-700 whitespace-nowrap">Preço Justo ({fmtMoeda(calc.fair)})</span>
              </div>
              <div className="text-right">
                <span className="text-red-700 whitespace-nowrap">Caro / Aguardar</span>
              </div>
            </div>

            {/* Barra fina, elegante e arredondada */}
            <div className="relative h-3.5 rounded-full bg-slate-200 overflow-hidden my-4 ring-1 ring-slate-300">
              <div className="flex w-full h-full rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${calc.pctZona}%` }}
                />
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.max(calc.pctFair - calc.pctZona, 0)}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(100 - calc.pctFair, 0)}%` }}
                />
              </div>

              {/* Pin indicador da Cotação Atual */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-slate-900 -translate-x-1/2 z-10 pointer-events-none transition-all duration-300 shadow-xs"
                style={{ left: `${Math.min(Math.max(calc.pctAgora, 2), 98)}%` }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold font-mono px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
                  AGORA {fmtMoeda(preco)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center text-[10px] sm:text-[11px] font-mono text-slate-600 mt-1">
              <div className="text-left whitespace-nowrap">0.00</div>
              <div className="text-center whitespace-nowrap">Teto Zona: <strong className="text-emerald-700">{fmtMoeda(calc.zona)}</strong></div>
              <div className="text-center whitespace-nowrap">Fair Value: <strong className="text-amber-750">{fmtMoeda(calc.fair)}</strong></div>
              <div className="text-right whitespace-nowrap">Escala: {fmtMoeda(calc.scaleMax)}</div>
            </div>
          </div>

          {/* FICHA TÉCNICA DO BALANÇO E TESE BUY & HOLD (QUADRINHOS BEM DEMARCADOS) */}
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>Dados Consolidados do Balanço</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-700">
                <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                  <span className="text-slate-500 text-[10px] block font-sans">Lucro Líquido:</span>
                  <strong className="text-slate-900 text-xs block mt-0.5">{ativo.lucroLiquido}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                  <span className="text-slate-500 text-[10px] block font-sans">Receita Líquida:</span>
                  <strong className="text-slate-900 text-xs block mt-0.5">{ativo.receitaLiquida}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                  <span className="text-slate-500 text-[10px] block font-sans">Endividamento:</span>
                  <strong className="text-slate-900 text-xs block mt-0.5">{ativo.dividaStatus}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                  <span className="text-slate-500 text-[10px] block font-sans">Fosso (Moat):</span>
                  <strong className="text-blue-700 text-xs block mt-0.5">{ativo.moat}</strong>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-300 text-xs text-slate-600 leading-relaxed">
                {ativo.breveAnalise}
              </div>
            </div>

            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg space-y-2.5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Condições para Buy &amp; Hold</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-300 text-xs text-slate-800 leading-relaxed min-h-[70px]">
                  {ativo.condicoesBuyHold}
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-slate-500 font-sans text-[11px]">Setup Graham:</span>
                    <span className="font-bold text-slate-900 whitespace-nowrap">
                      P/L &times; P/VP = {calc.grahamMultiplier.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans whitespace-nowrap">
                      (máx: 22.5)
                    </span>
                  </div>
                  <div className="shrink-0">
                    {calc.grahamMultiplier <= 22.5 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-md whitespace-nowrap shadow-2xs">
                        <span>Aprovado</span>
                        <span className="font-extrabold text-emerald-600">✓</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-md whitespace-nowrap shadow-2xs">
                        <span>Acima de 22.5</span>
                        <span className="font-extrabold text-amber-600">✕</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SOBRE A EMPRESA & PERFIL DO NEGÓCIO (PREENCHENDO O ESPAÇO EM BRANCO) */}
              <div className="pt-2.5 border-t border-slate-200 mt-2 space-y-1.5">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Sobre a Empresa ({ativo.ticker})</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate max-w-[220px]">
                    {perfilAtivo.setorPt}
                  </span>
                </div>
                <div className="p-2.5 bg-blue-50/50 rounded-md border border-blue-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>{ativo.nome}</span>
                    <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                      {perfilAtivo.segmento}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    {perfilAtivo.descricao}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MATRIZ DE SENSIBILIDADE POR MARGEM DE SEGURANÇA */}
          <div className="p-3 bg-white border-2 border-slate-300 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Matriz de Sensibilidade por Margem de Segurança
              </span>
              <span className="text-xs font-mono text-slate-600 font-bold">Fair: {fmtMoeda(calc.fair)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 text-center font-mono">
              {[10, 20, 30, 40, 50].map((m) => {
                const z = calc.fair * (1 - m / 100);
                const isSelected = margem === m;
                const isBuy = preco <= z;
                return (
                  <button
                    key={m}
                    onClick={() => setMargem(m)}
                    className={`p-2 rounded-lg border-2 text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : isBuy
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 hover:bg-emerald-100'
                        : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] opacity-80">{m}% Margem</div>
                    <strong className="block text-xs sm:text-sm mt-0.5">{fmtMoeda(z)}</strong>
                    <div className="text-[10px] mt-0.5 font-bold">
                      {isBuy ? '✓ Na Zona' : `${((z - preco) / preco * 100).toFixed(0)}%`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIMULADOR DE PARÂMETROS EDITÁVEIS */}
          <div className="p-3 bg-white border-2 border-slate-300 rounded-lg space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                Simulador de Parâmetros (Ajuste em Tempo Real)
              </span>
              <button
                onClick={() => {
                  if (ativo.mercado !== 'B3') {
                    setMoeda(m => m === 'BRL' ? 'USD' : 'BRL');
                  }
                }}
                className={`text-xs font-mono px-2 py-0.5 rounded border border-slate-300 ${
                  ativo.mercado === 'B3'
                    ? 'bg-slate-100 text-slate-700 cursor-default'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer'
                }`}
                title={ativo.mercado === 'B3' ? 'Ativo da B3 cotado obrigatoriamente em Reais (R$)' : 'Alternar moeda da simulação'}
              >
                Moeda: {ativo.mercado === 'B3' ? 'BRL (R$)' : moeda}
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans truncate" title="Cotação Atual">
                  Cotação ({ativo.mercado === 'B3' ? 'R$' : moeda})
                </label>
                <input
                  type="number"
                  step="any"
                  value={preco}
                  onChange={(e) => setPreco(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans truncate" title="LPA (Lucro por Ação)">
                  LPA (Lucro/Ação - {isAtivoB3(ativo.mercado, ativo.moeda, ativo.ticker) ? 'R$' : '$'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={lpa}
                  onChange={(e) => setLpa(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans truncate" title="VPA (Patrimônio Líquido por Ação)">
                  VPA (Patrimônio/Ação - {isAtivoB3(ativo.mercado, ativo.moeda, ativo.ticker) ? 'R$' : '$'})
                </label>
                <input
                  type="number"
                  step="any"
                  value={vpa}
                  onChange={(e) => setVpa(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans truncate" title="Crescimento g (%)">
                  Crescimento g (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={g}
                  onChange={(e) => setG(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600">Margem de Segurança Selecionada:</span>
                <strong className="text-blue-700 font-bold">{margem}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={margem}
                onChange={(e) => setMargem(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </main>

        {/* ========================================================= */}
        {/* DIVISOR REDIMENSIONÁVEL 2 (MEIO / DIREITA) NO NOTEBOOK    */}
        {/* ========================================================= */}
        {!painelDireitoRecolhido && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setRedimensionando('right');
            }}
            onTouchStart={() => setRedimensionando('right')}
            onDoubleClick={() => setRightWidth(380)}
            className="hidden lg:flex w-[5px] hover:w-[7px] bg-slate-200 hover:bg-blue-500 cursor-col-resize shrink-0 transition-all z-10 items-center justify-center group relative select-none"
            title="Arraste para redimensionar o painel AntiTrader AI no notebook. Clique duplo para redefinir para 380px."
          >
            <div className="w-1 h-8 rounded-full bg-slate-400 group-hover:bg-white transition-colors" />
          </div>
        )}

        {/* ========================================================= */}
        {/* PAINEL 3 (DIREITA): COPILOT ANTITRADER AI                 */}
        {/* Customizável no desktop/notebook e aba no mobile/tablet    */}
        {/* ========================================================= */}
        {painelDireitoRecolhido && isDesktop ? (
          <aside className="hidden lg:flex w-9 bg-slate-100 border-l border-slate-300 flex-col items-center py-3 justify-between shrink-0 select-none">
            <button
              onClick={() => setPainelDireitoRecolhido(false)}
              className="p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-300 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Expandir AntiTrader AI"
            >
              <PanelRight className="w-4 h-4" />
            </button>
            <span className="[writing-mode:vertical-rl] text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>AntiTrader AI</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </aside>
        ) : (
          <aside
            style={{ width: isDesktop && !painelDireitoRecolhido ? `${rightWidth}px` : undefined }}
            className={`w-full ${
              isDesktop ? 'shrink-0' : 'flex-1'
            } min-w-0 bg-[#fbfbfc] flex flex-col border-t lg:border-t-0 lg:border-l border-slate-300 overflow-hidden h-full ${
              mobileTab === 'info' || mobileTab === 'oportunidades' || mobileTab === 'metas' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Header do Chat */}
            <div className="p-2.5 border-b border-slate-300 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-bold text-xs text-slate-900 truncate">AntiTrader AI</span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                    Inteligência de Mercado &amp; Valuation
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                {/* Botão de Atalho Rápido para Voltar ao Valuation no Mobile / Tablet */}
                <button
                  type="button"
                  onClick={() => setMobileTab('info')}
                  className="lg:hidden flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-2 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                  title="Voltar ao Terminal de Valuation"
                >
                  <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                  <span>Valuation</span>
                </button>

                {/* Botão de Recolher Painel Direito no Desktop */}
                <button
                  type="button"
                  onClick={() => setPainelDireitoRecolhido(true)}
                  className="hidden lg:flex p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded border border-transparent hover:border-slate-300 transition-colors cursor-pointer"
                  title="Recolher painel AntiTrader AI para focar no valuation no notebook"
                >
                  <PanelRight className="w-3.5 h-3.5" />
                </button>

              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-1" title="Capacidade de realizar pesquisas em tempo real">
                <Globe className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span className="hidden md:inline">Web Research</span>
              </span>
              <button
                onClick={() => setChatMessages([])}
                className="p-1 hover:text-black cursor-pointer rounded ml-0.5"
                title="Limpar conversa"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

                    {/* Mensagens do Chat com Steps de Auditoria ou Welcome Screen no estilo AI Studio / Meta AI */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-xs leading-relaxed font-sans min-h-0">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-3 sm:p-5 max-w-sm sm:max-w-md mx-auto space-y-4 my-auto select-none">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Bot className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Como posso te ajudar hoje?
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                    Sou o <strong>AntiTrader AI</strong>, seu analista de inteligência de mercado. Pergunte sobre qualquer ação, FII, juros, valuation ou riscos.
                  </p>
                </div>

                {/* 3 Sugestões em Destaque (Estilo AI Studio / Meta AI com nosso layout) */}
                <div className="w-full space-y-2 pt-1 text-left">
                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Quais são as melhores ações na Zona de Compra com maior margem de segurança na B3 e no S&P 500 hoje?")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/80 hover:border-blue-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-blue-100 text-blue-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      🔍
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
                        <span>Varredura da Zona de Compra</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Ações com maior margem de segurança e desconto de Graham hoje.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Como o ciclo de juros (Selic e Fed Funds) e inflação estão impactando os setores e FIIs neste momento?")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50/80 hover:border-teal-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-teal-100 text-teal-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      ⚡
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 flex items-center justify-between">
                        <span>Cenário Macro, Selic &amp; Juros</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Impacto dos juros futuros nas ações de dividendos e FIIs.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Explique como funciona o cálculo do Preço Justo de Graham e a esteira de metas com TP1 e TP2.")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/80 hover:border-indigo-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-indigo-100 text-indigo-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      🎯
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                        <span>Fórmula Graham &amp; Metas TP1/TP2</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Alvos de realização conservador (TP1) e estendido (TP2) com stop.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  {/* Balão da Mensagem */}
                  <div
                    className={`p-3 rounded-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-50/90 text-slate-900 border-2 border-blue-300 ml-3 shadow-2xs'
                        : 'bg-white text-slate-900 border-2 border-slate-300 shadow-2xs mr-1'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1.5 font-mono text-slate-400">
                      <span className="font-bold text-slate-700">
                        {msg.sender === 'user' ? 'Você' : 'AntiTrader AI'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {msg.sender === 'user' ? (
                      <div className="whitespace-pre-line text-xs font-medium text-slate-800">
                        {msg.text}
                      </div>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}

                    {msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                        <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="font-bold">Pesquisa Web:</span>
                        <span className="truncate italic">"{msg.searchQueries.join(', ')}"</span>
                      </div>
                    )}

                    {msg.searchSources && msg.searchSources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
                        <span className="text-slate-500 font-mono text-[9px] font-bold">Fontes Web:</span>
                        {msg.searchSources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 text-[9px] hover:text-blue-700 transition-colors"
                            title={s.title}
                          >
                            <span className="truncate max-w-[120px]">{s.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.source && (
                      <div className="mt-2 pt-1 border-t border-slate-200 text-[9px] font-mono text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span>Origem:</span>
                          <strong className="text-slate-600">{msg.source}</strong>
                        </div>
                        <span className="text-slate-400">Setup Graham-Buffett</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {enviandoMsg && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 p-2 bg-slate-50 rounded border border-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consultando inteligência de mercado e fundamentos com IA...</span>
              </div>
            )}
          </div>

          {/* Sugestões Dinâmicas com Scroll Horizontal Fluido e Controles de Navegação */}
          <div className="relative border-t border-slate-200 bg-slate-50 shrink-0 group">
            {/* Botão de Scroll para Esquerda */}
            <button
              type="button"
              onClick={() => {
                if (suggestionsScrollRef.current) {
                  suggestionsScrollRef.current.scrollBy({ left: -160, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-0 bottom-0 z-10 px-1 bg-gradient-to-r from-slate-100 via-slate-100/90 to-transparent text-slate-500 hover:text-blue-700 flex items-center justify-center cursor-pointer transition-opacity"
              title="Rolar sugestões para a esquerda"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div
              ref={suggestionsScrollRef}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="px-6 py-1.5 flex items-center gap-1.5 overflow-x-auto scroll-smooth select-none cursor-grab active:cursor-grabbing"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 transparent',
              }}
            >
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-0.5">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>{chatMessages.length > 0 ? 'Prosseguir:' : 'Tópicos:'}</span>
              </span>
              {(chatMessages.length > 0 && followUpSuggestions.length > 0
                ? followUpSuggestions
                : [
                    `Análise de ${ativo.ticker}`,
                    'Varredura da Zona de Compra',
                    'Impacto da Selic e Juros',
                    'Preço Teto Método Barsi',
                    'Simulação de Estresse (-25%)',
                  ]
              ).map((sugestao, idx) => {
                const textoEnvio = typeof sugestao === 'string' && sugestao.startsWith('Análise de')
                  ? `Faça uma análise completa de valuation, múltiplos e margem de segurança de ${ativo.ticker}.`
                  : sugestao;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleEnviarMensagem(textoEnvio)}
                    disabled={enviandoMsg}
                    className="text-[10.5px] text-slate-700 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-500 hover:text-blue-700 rounded-full px-2.5 py-0.5 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs shrink-0 flex items-center gap-1 disabled:opacity-50 active:scale-95"
                  >
                    <span>{sugestao}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-50 text-blue-600" />
                  </button>
                );
              })}
            </div>

            {/* Botão de Scroll para Direita */}
            <button
              type="button"
              onClick={() => {
                if (suggestionsScrollRef.current) {
                  suggestionsScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-0 bottom-0 z-10 px-1 bg-gradient-to-l from-slate-100 via-slate-100/90 to-transparent text-slate-500 hover:text-blue-700 flex items-center justify-center cursor-pointer transition-opacity"
              title="Rolar sugestões para a direita"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Caixa de Digitação do Chat - Geometria Perfeita e Ajuste Fino para Mobile e Desktop */}
          <div className="p-3 sm:p-3.5 bg-white border-t border-slate-300 shrink-0 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEnviarMensagem();
              }}
              className="border-2 border-slate-300 focus-within:border-blue-600 rounded-xl p-2.5 sm:p-3 bg-slate-50/90 transition-colors shadow-2xs"
            >
              <textarea
                rows={2}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEnviarMensagem();
                  }
                }}
                placeholder="Pergunte qualquer tema (valuation, balanços, macro, concorrentes, notícias, conceitos)..."
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none resize-none font-sans min-h-[44px] max-h-[120px]"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-600 mt-1 gap-2">
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 truncate min-w-0">
                  <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline truncate">Pesquisa web e análise fundamentalista ativas</span>
                  <span className="sm:hidden truncate">Pesquisa Web Ativa</span>
                </div>

                <button
                  type="submit"
                  disabled={enviandoMsg || !inputMsg.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs active:scale-95 shrink-0"
                >
                  <span>Enviar</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </aside>
        )}

      </div>

      {/* ========================================================= */}


      {/* ========================================================= */}
      {/* MODAL: AUDITORIA OPERACIONAL & DIAGNÓSTICOS EM TEMPO REAL  */}
      {/* ========================================================= */}
      {modalScanInfoAberto && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-2 sm:p-4" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0.75rem))", paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 1.75rem))" }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border-2 border-slate-300 overflow-hidden max-h-[85dvh] sm:max-h-[90vh] flex flex-col">
            
            {/* Header do Modal */}
            <div className="p-3.5 border-b border-slate-300 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-2">
                    <span>Auditoria Técnica do Sistema &amp; Feeds</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                      scanStatus?.isFrozen
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {scanStatus?.isFrozen ? (
                        <>
                          <Snowflake className="w-3 h-3 text-sky-400" />
                          PWA Congelado
                        </>
                      ) : (
                        <>
                          <Activity className="w-3 h-3 text-emerald-400" />
                          PWA Ativo (Online)
                        </>
                      )}
                    </span>
                  </h3>
                  <span className="text-[10px] text-slate-400 block">
                    {scanStatus?.isFrozen
                      ? 'Modo estático seguro: varreduras diárias das 19h e buscas de mercado em segundo plano desativadas'
                      : 'Modo operacional ativo: cotações em tempo real com failover redundante (Brapi + Yahoo Finance)'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalScanInfoAberto(false)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4 space-y-4 overflow-y-auto text-xs text-slate-800 flex-1">
              
              {/* Banner Informativo de PWA Congelado (exibido apenas se congelado) */}
              {scanStatus?.isFrozen && (
                <div className="bg-sky-50 border border-sky-300 rounded-lg p-3 text-xs text-sky-950 flex items-start gap-2.5 shadow-2xs">
                  <Snowflake className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-sky-950 text-xs">PWA Congelado — Operações Automáticas Desativadas</strong>
                      <span className="text-[9px] bg-sky-200 text-sky-900 px-1.5 py-0.2 rounded font-bold uppercase">Standby Ativo</span>
                    </div>
                    <span className="text-[11px] text-sky-800 block mt-0.5 leading-snug">
                      A rotina diária de varredura geral (19:00 BRT) e o polling de mercado em segundo plano foram interrompidos com sucesso.
                      O terminal opera em modo de consulta estática segura, sem realizar chamadas externas contínuas ou consumir dados da sua rede.
                    </span>
                  </div>
                </div>
              )}

              {/* Resumo do Universo Completo Monitorado */}
              <div className="bg-[#0b1329] text-white p-3 rounded-lg border border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Universo Auditado: 597 Ativos Monitorados</span>
                    <span className="text-[10px] text-slate-400 block">
                      504 do S&P 500, 54 Blue Chips da B3, 35 Fundos Imobiliários (FIIs) e 30 REITs Americanos
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap font-mono text-[9px]">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">54 B3</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">504 S&P 500</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold">35 FIIs</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">30 REITs</span>
                </div>
              </div>

              {/* Placar de Diagnósticos em Tempo Real */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Estado dos Feeds</span>
                  <strong className={`text-sm sm:text-base font-bold block mt-0.5 ${scanStatus?.isFrozen ? 'text-sky-400' : 'text-emerald-400'}`}>
                    {scanStatus?.isFrozen ? 'ESTÁTICO' : 'AO VIVO / MULTI-API'}
                  </strong>
                  <span className="text-[9px] text-slate-400">{scanStatus?.isFrozen ? 'Snapshot preservado' : 'Brapi + Yahoo + Failover'}</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Latência de Rede</span>
                  <strong className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">
                    {scanStatus?.isFrozen ? '0 ms (Offline)' : 'Baixa (< 350ms)'}
                  </strong>
                  <span className="text-[9px] text-slate-400">{scanStatus?.isFrozen ? 'Sem chamadas externas' : 'Cotação em tempo real'}</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Na Zona de Compra</span>
                  <strong className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">
                    {auditDiagnostics ? `${auditDiagnostics.totalInBuyZone} de ${auditDiagnostics.totalMonitored}` : '10 ativos'}
                  </strong>
                  <span className="text-[9px] text-slate-400">Filtro Graham-Buffett</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Varredura Diária</span>
                  <CountdownDisplay isFrozen={scanStatus?.isFrozen ?? false} nextScanTime={scanStatus?.nextScanTime} className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5" />
                  <span className="text-[9px] text-slate-400">{scanStatus?.isFrozen ? 'Buscas diárias desativadas' : 'Agendada para 19:00 BRT'}</span>
                </div>
              </div>

              {/* Botão de Disparo da Auditoria ao Vivo */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-800">
                    Última Sincronização: <span className="font-mono text-blue-700">{ultimaAtualizacaoEm}</span>
                  </span>
                </div>

                <button
                  onClick={rodarAuditoriaAoVivo}
                  disabled={executandoAuditoria}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-[11px] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${executandoAuditoria ? 'animate-spin' : ''}`} />
                  <span>{executandoAuditoria ? 'Verificando...' : 'Atualizar Cotações ao Vivo'}</span>
                </button>
              </div>

              {/* Tabela de Auditoria dos Ativos em Tempo Real */}
              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-700" />
                    <span>Conferência de Tela: Snapshot Calibrado e Fundamentos Graham</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    {scanStatus?.isFrozen ? 'PWA Congelado' : 'Feeds Ativos com Failover'}
                  </span>
                </div>

                <div className="overflow-x-auto max-h-64">
                  <table className="min-w-full text-[11px] divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="px-2.5 py-1.5 text-left font-bold">Ticker</th>
                        <th className="px-2 py-1.5 text-left font-bold">Mercado</th>
                        <th className="px-2 py-1.5 text-right font-bold">Preço Base</th>
                        <th className="px-2.5 py-1.5 text-right font-bold text-slate-900">Preço de Tela (Ao Vivo)</th>
                        <th className="px-2 py-1.5 text-center font-bold">Provedor Feed</th>
                        <th className="px-2 py-1.5 text-right font-bold">Teto Zona</th>
                        <th className="px-2.5 py-1.5 text-center font-bold">Status Setup</th>
                        <th className="px-2 py-1.5 text-right font-bold">Margem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {auditDiagnostics?.items ? (
                        auditDiagnostics.items.map((item: any) => {
                          const isCompra = item.status === 'ZONA DE COMPRA';
                          const mSimb = isAtivoB3(item.mercado, item.moeda, item.ticker) ? 'R$' : 'US$';
                          const varSinal = item.variacaoVsBase >= 0 ? '+' : '';
                          return (
                            <tr key={item.ticker} className="hover:bg-slate-50 transition-colors">
                              <td className="px-2.5 py-1.5 font-bold text-slate-900 flex items-center gap-1">
                                <span>{item.ticker}</span>
                                <span className="text-[9px] text-slate-500 font-normal truncate max-w-[80px]">({item.nome})</span>
                              </td>
                              <td className="px-2 py-1.5 text-slate-600 font-mono text-[10px]">{item.mercado}</td>
                              <td className="px-2 py-1.5 text-right text-slate-500 font-mono">
                                {mSimb} {item.precoBase.toFixed(2)}
                              </td>
                              <td className="px-2.5 py-1.5 text-right font-mono font-bold text-slate-900">
                                <span>{mSimb} {item.precoAoVivo.toFixed(2)}</span>
                                <span className={`block text-[9px] ${item.variacaoVsBase >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {varSinal}{item.variacaoVsBase.toFixed(1)}% vs base
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                                  {item.provedor}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 text-right font-mono text-slate-700">
                                {mSimb} {item.tetoCompra.toFixed(2)}
                              </td>
                              <td className="px-2.5 py-1.5 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isCompra
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className={`px-2 py-1.5 text-right font-mono font-bold ${isCompra ? 'text-emerald-700' : 'text-slate-600'}`}>
                                {item.margemVsTeto > 0 ? `+${item.margemVsTeto}%` : `${item.margemVsTeto}%`}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-6 text-slate-500 italic">
                            {executandoAuditoria ? (
                              <span className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                <span>Realizando pings ao vivo e auditando os 20 ativos...</span>
                              </span>
                            ) : (
                              <span>Clique em &quot;Testar Conexões &amp; Cotações Agora&quot; para auditar a tabela.</span>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fundamentos & Dúvidas Respondidas */}
              <div className="space-y-2">
                <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    Por que as oportunidades não mudam a cada segundo no Value Investing?
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Em investimento fundamentalista (Benjamin Graham &amp; Warren Buffett), o <strong>Valor Intrínseco</strong> é calibrado por balanços contábeis auditados (LPA e VPA), que são reportados <strong>apenas 4 vezes ao ano (trimestrais)</strong>. A cotação varia a cada segundo no pregão, mas enquanto o preço de tela estiver com folga dentro do desconto (Preço &le; Teto de Compra), o ativo permanece em <strong>ZONA DE COMPRA</strong>. Ele só muda de status se a cotação romper o teto para cima ou para baixo.
                  </p>
                </div>
              </div>

              {feedbackScan && (
                <div className="p-2 rounded bg-blue-100 text-blue-900 font-bold text-center text-xs animate-pulse">
                  {feedbackScan}
                </div>
              )}
            </div>

            {/* Rodapé com Ações */}
            <div className="p-3 bg-slate-50 border-t border-slate-300 flex items-center justify-between shrink-0">
              <button
                onClick={dispararVarreduraManual}
                disabled={executandoScanManual || scanStatus?.isFrozen}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                title={scanStatus?.isFrozen ? "PWA Congelado: Varreduras desativadas" : "Executar varredura agora"}
              >
                <Zap className={`w-3.5 h-3.5 text-emerald-400 ${executandoScanManual ? 'animate-spin' : ''}`} />
                <span>{executandoScanManual ? 'Executando Varredura...' : 'Executar Varredura Geral Agora'}</span>
              </button>

              <button
                onClick={() => setModalScanInfoAberto(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Concluir Auditoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Acompanhamento de Metas & Ciclo de Oportunidades */}
      <MetasTrackerModal
        isOpen={modalMetasAberto}
        onClose={() => setModalMetasAberto(false)}
        trackedList={trackedList}
        setTrackedList={setTrackedList}
        onSelectTickerForValuation={(t) => {
          carregarTickerPorSimbolo(t);
        }}
      />

      {/* Modal de Autenticação / 7 Dias Grátis */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => setAuthModalOpen(false)}
      />

    </div>
  );
}
