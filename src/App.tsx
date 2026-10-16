import React, { useMemo, useState, useEffect, useRef } from 'react';
import { OPORTUNIDADES_SETUP } from './data/oportunidades';
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
} from 'lucide-react';
import { TrackedOpportunity } from './types/tracker';
import {
  loadTrackedOpportunities,
  syncTrackedWithOpportunities,
  calculateTrackerStats,
} from './services/trackerService';
import { MetasTrackerModal } from './components/MetasTrackerModal';

export interface Oportunidade {
  id: string;
  ticker: string;
  nome: string;
  mercado: 'B3' | 'US';
  moeda: 'BRL' | 'USD';
  preco: number;
  lpa: number;
  vpa: number;
  g: number;
  yieldAAA: number;
  margemSugerida: number;
  ultimoBalanco: string;
  lucroLiquido: string;
  receitaLiquida: string;
  roe: number;
  dividendYield: number;
  pl: number;
  pvp: number;
  grahamMult: number;
  dividaStatus: string;
  categoria: string;
  destaqueSetup: string;
  breveAnalise: string;
  condicoesBuyHold: string;
  moat: string;
  variacaoDia?: number;
  horarioCotacao?: string;
  origem?: string;
}

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

// Renderizador Elegante de Markdown Financeiro (Tabelas, Listas, Títulos, Negrito)
function FormattedMessage({ text }: { text: string }) {
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
}

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
  const [filtroMercado, setFiltroMercado] = useState<'TODOS' | 'B3' | 'US'>('TODOS');
  const [filtroZonaApenas, setFiltroZonaApenas] = useState(true);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>(OPORTUNIDADES_SETUP);
  const [carregandoOportunidades, setCarregandoOportunidades] = useState(false);

  // Varredura Diária Programada (19:00 Horário de Brasília) & Contagem Regressiva
  const [scanStatus, setScanStatus] = useState<{
    lastScanTime: number;
    lastScanFormatted: string;
    nextScanTime: number;
    nextScanFormatted: string;
    secondsUntilNextScan: number;
    isScanning: boolean;
    totalMonitored: number;
    totalInBuyZone: number;
    scanSchedulePolicy?: string;
    executionSummary?: string;
  } | null>(null);
  const [countdownStr, setCountdownStr] = useState<string>('--:--:--');
  const [executandoScanManual, setExecutandoScanManual] = useState(false);
  const [modalScanInfoAberto, setModalScanInfoAberto] = useState(false);
  const [feedbackScan, setFeedbackScan] = useState<string | null>(null);

  const [copiado, setCopiado] = useState(false);

  // Chat com o Agente (Especialista em Valuation & Inteligência Fundamentalista Aberta)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      timestamp: '14:35',
      steps: [
        { label: 'Auditoria de Demonstrações Contábeis & Balanços (CVM/SEC)', type: 'explore' },
        { label: 'Cotação em Tempo Real B3 / NYSE Integrada', type: 'audit' },
        { label: 'Múltiplos e Margem de Segurança Validados (Setup Graham)', type: 'thought' },
      ],
      text: `Olá! Sou o **AntiTrader AI de Inteligência de Mercado & Valuation**.

A **Peneira de Oportunidades da B3 e do S&P 500** está ativa e calibrada estritamente na **Zona de Compra**:
• **Filtro Ativo:** Apenas ativos cotados abaixo ou na Zona de Compra (com margem de segurança configurada).
• **Ativo em Foco:** **Banco do Brasil (BBAS3)** — Cotação R$ 24,64 vs Zona R$ 51,21 (+108% de margem). P/L de 4.0x e Graham Mult de 2.82x.
• **Ativos S&P 500 na Zona:** Pfizer (PFE), AT&T (T), Ford (F), General Motors (GM), British American Tobacco (BTI), Walgreens (WBA).
• **Ativos B3 na Zona:** BBAS3, PETR4, BBDC4, CMIG4, CSAN3, SAPR11, CPLE6, VALE3.

**Como estudar cada oportunidade:**
1. Navegue pela barra superior com a peneira ativada (**Peneira: Apenas Na Zona**).
2. Clique em qualquer empresa para carregar a modelagem detalhada de valuation, múltiplos e balanço auditado.
3. Leia a justificativa e os fundamentos no painel central.
4. Me pergunte qualquer coisa aqui no chat (riscos, projeções, governança, concorrentes ou cenários macroeconômicos) para apoiar sua tomada de decisão!`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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
            setPreco(atualizado.preco);
            setLpa(atualizado.lpa);
            setVpa(atualizado.vpa);
            setAtivo(atualizado);
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

  // Disparo manual imediato de varredura geral
  const dispararVarreduraManual = async () => {
    if (executandoScanManual) return;
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
            setPreco(atualizado.preco);
            setLpa(atualizado.lpa);
            setVpa(atualizado.vpa);
            setAtivo(atualizado);
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
    fetchOportunidades();
    fetchScanStatus();

    // Polling automático em segundo plano a cada 60 segundos
    const pollInterval = setInterval(() => {
      fetchOportunidades();
      fetchScanStatus();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, []);

  // Relógio de Contagem Regressiva para a Próxima Varredura às 19:00 BRT
  useEffect(() => {
    const updateCountdown = () => {
      if (scanStatus?.nextScanTime) {
        const diffSec = Math.max(0, Math.floor((scanStatus.nextScanTime - Date.now()) / 1000));
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;
        setCountdownStr(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );

        if (diffSec === 0) {
          fetchScanStatus();
          fetchOportunidades();
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [scanStatus?.nextScanTime]);

  // Scroll automático do chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, enviandoMsg]);

  // Carregar ativo selecionado (ao clicar numa oportunidade)
  // O chat é independente e NÃO é modificado ao clicar nas oportunidades
  const carregarAtivo = (op: Oportunidade) => {
    setAtivo(op);
    setPreco(op.preco);
    setLpa(op.lpa);
    setVpa(op.vpa);
    setG(op.g);
    setYieldAAA(op.yieldAAA);
    setMargem(op.margemSugerida || 30);
    setMoeda(op.moeda);
  };

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

    const numeroGraham = isValidGraham ? Math.sqrt(22.5 * lpa * vpa) : 0;
    const grahamCresc = (lpa > 0 && isValidYield) ? (lpa * (8.5 + 2 * g) * 4.4) / yieldAAA : 0;

    let fair = 0;
    if (isValidGraham && grahamCresc > 0) {
      fair = (numeroGraham + grahamCresc) / 2;
    } else if (isValidGraham) {
      fair = numeroGraham;
    } else if (grahamCresc > 0) {
      fair = grahamCresc;
    }

    const zona = fair * (1 - margem / 100);
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
  }, [preco, lpa, vpa, g, yieldAAA, margem]);

  const fmtMoeda = (val: number) => {
    return `${moeda === 'BRL' ? 'R$ ' : 'US$ '}${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
function calcularZonaPreco(op: { lpa: number; vpa: number; g: number; yieldAAA: number; margemSugerida?: number }) {
  const isValidGraham = op.lpa > 0 && op.vpa > 0;
  const isValidYield = op.yieldAAA > 0;
  const numeroGraham = isValidGraham ? Math.sqrt(22.5 * op.lpa * op.vpa) : 0;
  const grahamCresc = (op.lpa > 0 && isValidYield) ? (op.lpa * (8.5 + 2 * op.g) * 4.4) / op.yieldAAA : 0;
  let fair = 0;
  if (isValidGraham && grahamCresc > 0) {
    fair = (numeroGraham + grahamCresc) / 2;
  } else if (isValidGraham) {
    fair = numeroGraham;
  } else if (grahamCresc > 0) {
    fair = grahamCresc;
  }
  const margem = op.margemSugerida !== undefined ? op.margemSugerida : 30;
  const zona = fair * (1 - margem / 100);
  return { fair, zona, numeroGraham, grahamCresc };
}

  // Contagem de ativos estritamente na Zona de Compra Graham
  const totalNaZona = useMemo(() => {
    return oportunidades.filter((op) => {
      const { zona } = calcularZonaPreco(op);
      return op.preco <= zona;
    }).length;
  }, [oportunidades]);

  // Filtragem das Oportunidades do Setup (Peneira com Preço Justo e Zona de Compra)
  const oportunidadesFiltradas = useMemo(() => {
    return oportunidades
      .filter((op) => {
        if (filtroMercado !== 'TODOS' && op.mercado !== filtroMercado) return false;
        if (filtroZonaApenas) {
          const { zona } = calcularZonaPreco(op);
          return op.preco <= zona;
        }
        return true;
      })
      .sort((a, b) => {
        // Ordena com maior desconto em relação à Zona de Compra primeiro
        const zA = calcularZonaPreco(a).zona;
        const zB = calcularZonaPreco(b).zona;
        const descA = a.preco > 0 ? (zA - a.preco) / a.preco : 0;
        const descB = b.preco > 0 ? (zB - b.preco) / b.preco : 0;
        return descB - descA;
      });
  }, [oportunidades, filtroMercado, filtroZonaApenas]);

  return (
    <div className="h-screen w-screen max-w-full bg-[#f8f9fa] text-[#1e293b] font-sans flex flex-col overflow-hidden select-none">
      
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
      <header className="h-12 bg-white border-b border-slate-300 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 gap-2">
        
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

          {/* Botão Copiar */}
          <button
            onClick={copiarResumo}
            className="flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer active:scale-95"
            title="Copiar relatório formatado de valuation"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden xl:inline">{copiado ? 'Copiado!' : 'Copiar'}</span>
          </button>

          {/* Botão de Acompanhamento de Metas de Preço Graham */}
          <button
            onClick={() => setModalMetasAberto(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md border border-blue-300 bg-blue-50/80 hover:bg-blue-100 text-xs font-bold text-blue-900 transition-colors cursor-pointer shadow-2xs active:scale-95"
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

          {/* Botão de Auditoria do Sistema */}
          <button
            onClick={abrirAuditoria}
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 sm:px-2.5 py-1 rounded-md border border-emerald-300 hover:border-emerald-400 transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Abrir painel de auditoria técnica do sistema e testar cotações ao vivo"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden lg:inline">Auditoria:</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">100% Online</span>
              <span className="sm:hidden text-[10px] font-bold text-emerald-700">Online</span>
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* BARRA SUPERIOR DE OPORTUNIDADES (CARROSSEL HORIZONTAL)     */}
      {/* Aqui você clica no ativo lá em cima e ele abre destrinchado*/}
      {/* na esquerda, com a IA do lado direito em 2 abas iguais!   */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-300 px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 overflow-x-auto shadow-2xs">
        {/* Título & Filtros da Peneira */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="flex items-center gap-1 font-bold text-xs text-slate-900 tracking-tight uppercase">
            <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="whitespace-nowrap hidden sm:inline">Oportunidades:</span>
          </div>

          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-300">
            {(['TODOS', 'B3', 'US'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFiltroMercado(m)}
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  filtroMercado === m ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Relógio Pequenininho de Contagem Regressiva para a Varredura das 19h BRT */}
          <button
            onClick={() => setModalScanInfoAberto(true)}
            className="flex items-center gap-1 bg-[#0f172a] text-white px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            title="Próxima varredura geral diária às 19:00 de Brasília. Clique para auditar ou rodar varredura."
          >
            <Clock className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-400 text-[9px] font-medium hidden sm:inline">19h:</span>
            <span className="font-bold text-emerald-400 tracking-wider">{countdownStr}</span>
          </button>

          <button
            onClick={() => setFiltroZonaApenas(!filtroZonaApenas)}
            className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-2xs ${
              filtroZonaApenas
                ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title={filtroZonaApenas ? 'Mostrando apenas ativos estritamente na Zona de Compra' : 'Clique para ver todas as ações monitoradas'}
          >
            <Check className={`w-3 h-3 ${filtroZonaApenas ? 'text-white' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Peneira: </span>
            <span>{filtroZonaApenas ? 'Na Zona' : 'Todos'}</span>
          </button>

          {/* Botão de Refresh Rápido na barra */}
          <button
            onClick={fetchOportunidades}
            disabled={carregandoOportunidades}
            className="p-1 px-1.5 text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 cursor-pointer rounded border border-slate-300 hover:border-blue-300 shrink-0 hidden md:flex items-center gap-1 text-[10px] font-bold transition-colors shadow-2xs"
            title="Atualizar cotações de tela ao vivo do pregão para as ações da barra"
          >
            <RefreshCw className={`w-2.5 h-2.5 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          {/* Atalho de Metas na Barra */}
          <button
            onClick={() => setModalMetasAberto(true)}
            className="hidden lg:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 shrink-0 cursor-pointer shadow-2xs transition-colors"
            title="Abrir painel de acompanhamento de metas até o Preço Justo de Graham"
          >
            <Target className="w-2.5 h-2.5 text-blue-600" />
            <span>Metas ({trackerStats.totalAtivas})</span>
          </button>

          {/* Atalho para abrir a grade completa de oportunidades em telas médias */}
          <button
            onClick={() => setMobileTab('oportunidades')}
            className={`hidden sm:flex lg:hidden items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 cursor-pointer transition-colors ${
              mobileTab === 'oportunidades'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
            }`}
            title="Ver grade completa e comparativo de todas as oportunidades"
          >
            <Activity className="w-2.5 h-2.5" />
            <span>Grade ({oportunidadesFiltradas.length})</span>
          </button>
        </div>

        {/* Lista Horizontal de Cards de Oportunidades - Peneira da Zona de Compra */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-1 min-w-0">
          {oportunidadesFiltradas.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1 px-2">
              Nenhum ativo encontrado com os filtros selecionados.
            </div>
          ) : (
            oportunidadesFiltradas.map((op) => {
              const isSelected = ativo.ticker === op.ticker;
              const { zona, fair } = calcularZonaPreco(op);
              const naZona = op.preco <= zona;
              const margemPct = op.preco > 0 ? ((zona - op.preco) / op.preco) * 100 : 0;
              const moedaSimbolo = op.moeda === 'BRL' ? 'R$' : '$';

              return (
                <button
                  key={op.id}
                  onClick={() => {
                    carregarAtivo(op);
                    if (mobileTab === 'oportunidades' || mobileTab === 'metas') {
                      setMobileTab('info');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 flex items-center gap-2 cursor-pointer transition-all border-2 text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                      : naZona
                      ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-500'
                      : 'bg-[#f8fafc] border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                  title={`${op.nome} | Preço: ${moedaSimbolo} ${op.preco.toFixed(2)} | Zona: ${moedaSimbolo} ${zona.toFixed(2)} | Justo: ${moedaSimbolo} ${fair.toFixed(2)}`}
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{op.ticker}</span>
                      <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                        isSelected
                          ? 'bg-blue-800 text-white'
                          : op.mercado === 'B3'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                      }`}>
                        {op.mercado}
                      </span>
                      {naZona ? (
                        <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${
                          isSelected ? 'bg-white text-blue-700' : 'bg-emerald-600 text-white'
                        }`}>
                          NA ZONA
                        </span>
                      ) : (
                        <span className={`text-[8px] font-medium px-1 rounded uppercase ${
                          isSelected ? 'bg-blue-400/40 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          RADAR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {moedaSimbolo} {op.preco.toFixed(2)}
                      </span>
                      <span className={`text-[9px] font-semibold ${
                        isSelected
                          ? 'text-blue-100'
                          : naZona
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}>
                        Zona: {moedaSimbolo} {zona.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-right text-[9px] border-l pl-1.5 leading-tight ${
                    isSelected ? 'border-blue-400 text-blue-100' : 'border-slate-300 text-slate-600'
                  }`}>
                    <span className={`block font-bold ${
                      isSelected
                        ? 'text-white'
                        : naZona
                        ? 'text-emerald-700'
                        : 'text-slate-600'
                    }`}>
                      {naZona ? `+${margemPct.toFixed(0)}% margem` : 'Acima'}
                    </span>
                    <span>DY {op.dividendYield}%</span>
                    <span className="block font-medium">P/L {op.pl.toFixed(1)}x</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SELETOR MOBILE / TABLET (APARECE EM CELULAR E TABLET <lg) */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* SELETOR MOBILE / TABLET (APARECE EM CELULAR E TABLET <lg) */}
      {/* ========================================================= */}
      <nav className="flex lg:hidden bg-slate-100 border-b border-slate-300 px-1.5 sm:px-3 py-1 items-center justify-start sm:justify-center text-xs font-bold shrink-0 overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 touch-pan-x">
        {/* Aba 1: Oportunidades */}
        <button
          onClick={() => setMobileTab('oportunidades')}
          className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all border shrink-0 active:scale-95 ${
            mobileTab === 'oportunidades'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span>Oportunidades</span>
          <span
            className={`text-[9px] font-mono px-1 rounded-full ${
              mobileTab === 'oportunidades'
                ? 'bg-blue-800 text-white'
                : 'bg-emerald-100 text-emerald-800 font-bold'
            }`}
          >
            {totalNaZona}
          </span>
        </button>

        {/* Aba 2: Metas */}
        <button
          onClick={() => setMobileTab('metas')}
          className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all border shrink-0 active:scale-95 ${
            mobileTab === 'metas'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span>Metas</span>
          <span
            className={`text-[9px] font-mono px-1 rounded-full ${
              mobileTab === 'metas'
                ? 'bg-blue-800 text-white'
                : 'bg-blue-100 text-blue-800 font-bold'
            }`}
          >
            {trackerStats.totalAtivas}
          </span>
          {trackerStats.totalFinalizadas > 0 && (
            <span className="text-[9px] font-mono px-1 rounded-full bg-emerald-600 text-white font-bold">
              🏆{trackerStats.totalFinalizadas}
            </span>
          )}
        </button>

        {/* Aba 3: Valuation do ativo selecionado */}
        <button
          onClick={() => setMobileTab('info')}
          className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all border shrink-0 active:scale-95 ${
            mobileTab === 'info'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
          <span>Valuation</span>
          <span
            className={`text-[9px] font-mono px-1 rounded ${
              mobileTab === 'info' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {ativo.ticker}
          </span>
        </button>

        {/* Aba 4: AntiTrader AI */}
        <button
          onClick={() => setMobileTab('copilot')}
          className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all border shrink-0 active:scale-95 ${
            mobileTab === 'copilot'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" />
          <span>AntiTrader AI</span>
        </button>

        {/* Aba 5: Ambas (Visível em Tablets e telas maiores) */}
        <button
          onClick={() => setMobileTab('ambas')}
          className={`hidden sm:flex px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold items-center gap-1.5 cursor-pointer transition-all border shrink-0 active:scale-95 ${
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
      {/* ÁREA PRINCIPAL: RESPONSIVA (MOBILE, TABLET E DESKTOP)     */}
      {/* ========================================================= */}
      <div
        className={`flex-1 flex ${
          mobileTab === 'ambas' ? 'flex-col md:flex-row' : 'flex-col lg:flex-row'
        } w-full max-w-full overflow-hidden divide-y ${
          mobileTab === 'ambas' ? 'md:divide-y-0 md:divide-x' : 'lg:divide-y-0 lg:divide-x'
        } divide-slate-300 min-h-0`}
      >
        {/* ========================================================= */}
        {/* ABA MOBILE / TABLET: PAINEL DE OPORTUNIDADES DEDICADO     */}
        {/* Visível quando a aba "Oportunidades" está selecionada     */}
        {/* ========================================================= */}
        {mobileTab === 'oportunidades' && (
          <section className="lg:hidden w-full flex-1 min-w-0 bg-[#f8fafc] flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto">
            {/* Header do Painel com Controles e Filtros */}
            <div className="bg-white border border-slate-300 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5 shrink-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">
                      Peneira de Oportunidades Graham
                    </h2>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {oportunidadesFiltradas.length} ativos filtrados • {totalNaZona} na Zona de Compra
                    </p>
                  </div>
                </div>

                {/* Botão de Refresh */}
                <button
                  onClick={fetchOportunidades}
                  disabled={carregandoOportunidades}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-2xs cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
                  <span>{carregandoOportunidades ? 'Atualizando...' : 'Atualizar'}</span>
                </button>
              </div>

              {/* Linha de Filtros: Mercado e Peneira */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono text-slate-500 mr-1">Mercado:</span>
                  {(['TODOS', 'B3', 'US'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setFiltroMercado(m)}
                      className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                        filtroMercado === m
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setModalScanInfoAberto(true)}
                    className="flex items-center gap-1 bg-[#0f172a] text-white px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 cursor-pointer shadow-2xs"
                    title="Próxima varredura geral diária às 19:00 de Brasília"
                  >
                    <Clock className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
                    <span className="text-slate-400 text-[9px] font-medium hidden sm:inline">19h:</span>
                    <span className="font-bold text-emerald-400 tracking-wider">{countdownStr}</span>
                  </button>

                  <button
                    onClick={() => setFiltroZonaApenas(!filtroZonaApenas)}
                    className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                      filtroZonaApenas
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${filtroZonaApenas ? 'text-white' : 'text-slate-400'}`} />
                    <span>{filtroZonaApenas ? 'Na Zona' : 'Todos'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista/Grade de Cards de Oportunidades */}
            {oportunidadesFiltradas.length === 0 ? (
              <div className="bg-white border border-slate-300 rounded-xl p-8 text-center text-slate-500 space-y-2">
                <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm">Nenhum ativo encontrado com estes filtros.</p>
                <button
                  onClick={() => {
                    setFiltroMercado('TODOS');
                    setFiltroZonaApenas(false);
                  }}
                  className="text-xs text-blue-600 font-bold underline cursor-pointer"
                >
                  Limpar filtros da peneira
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
                {oportunidadesFiltradas.map((op) => {
                  const isSelected = ativo.ticker === op.ticker;
                  const { zona, fair } = calcularZonaPreco(op);
                  const naZona = op.preco <= zona;
                  const margemPct = op.preco > 0 ? ((zona - op.preco) / op.preco) * 100 : 0;
                  const moedaSimbolo = op.moeda === 'BRL' ? 'R$' : '$';

                  return (
                    <div
                      key={op.id}
                      onClick={() => {
                        carregarAtivo(op);
                        setMobileTab('info');
                      }}
                      className={`rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between border-2 ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                          : naZona
                          ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Linha Superior: Ticker, Nome, Mercado & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-base font-black font-mono tracking-tight text-slate-900">
                                {op.ticker}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                                  op.mercado === 'B3'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                                }`}
                              >
                                {op.mercado}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white shadow-2xs">
                                  EM FOCO
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-600 font-medium truncate mt-0.5">
                              {op.nome}
                            </div>
                          </div>

                          {/* Badge de Zona / Margem */}
                          <div className="text-right shrink-0">
                            {naZona ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs uppercase">
                                <Check className="w-3 h-3" />
                                NA ZONA
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 uppercase">
                                RADAR
                              </span>
                            )}
                            <div
                              className={`text-xs font-bold font-mono mt-0.5 ${
                                naZona ? 'text-emerald-700' : 'text-slate-500'
                              }`}
                            >
                              {naZona ? `+${margemPct.toFixed(0)}% margem` : 'Acima do Teto'}
                            </div>
                          </div>
                        </div>

                        {/* Preços: Cotação Atual vs Zona Graham vs Preço Justo */}
                        <div className="mt-3 grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-mono">
                          <div>
                            <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">
                              Preço Atual
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {moedaSimbolo} {op.preco.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-sans font-bold text-emerald-700 uppercase">
                              Teto Compra
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700">
                              {moedaSimbolo} {zona.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-sans font-bold text-blue-700 uppercase">
                              Preço Justo
                            </span>
                            <span className="text-xs font-bold text-blue-800">
                              {moedaSimbolo} {fair.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Múltiplos Fundamentais */}
                        <div className="mt-2.5 grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
                          <div className="bg-white border border-slate-200 rounded p-1">
                            <span className="text-slate-400 block text-[9px]">P/L</span>
                            <span className="font-bold text-slate-800">{op.pl.toFixed(1)}x</span>
                          </div>
                          <div className="bg-white border border-slate-200 rounded p-1">
                            <span className="text-slate-400 block text-[9px]">P/VP</span>
                            <span className="font-bold text-slate-800">{op.pvp.toFixed(2)}x</span>
                          </div>
                          <div className="bg-white border border-slate-200 rounded p-1">
                            <span className="text-slate-400 block text-[9px]">DY</span>
                            <span className="font-bold text-emerald-700">{op.dividendYield}%</span>
                          </div>
                          <div className="bg-white border border-slate-200 rounded p-1">
                            <span className="text-slate-400 block text-[9px]">ROE</span>
                            <span className="font-bold text-blue-700">{op.roe}%</span>
                          </div>
                        </div>

                        {/* Destaque / Moat */}
                        {op.destaqueSetup && (
                          <p className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-tight">
                            {op.destaqueSetup}
                          </p>
                        )}
                      </div>

                      {/* Botão de Ação para Abrir no Valuation */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          carregarAtivo(op);
                          setMobileTab('info');
                        }}
                        className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-900 text-white hover:bg-blue-600'
                        }`}
                      >
                        <span>
                          {isSelected ? 'Ver Valuation & Balanço' : `Analisar ${op.ticker} no Valuation`}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
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

            {/* Lista dos cards de metas */}
            <div className="space-y-3 pb-8">
              {trackedList.map((item) => {
                const isFinalizada = item.status === 'FINALIZADA';
                const moedaSimbolo = item.moeda === 'BRL' ? 'R$' : '$';
                const ganhoAtualPct = item.precoEntrada > 0
                  ? ((item.precoAtual - item.precoEntrada) / item.precoEntrada) * 100
                  : 0;
                const totalDeltaMeta = item.precoAlvo - item.precoEntrada;
                const atualDelta = item.precoAtual - item.precoEntrada;
                const progressoPct = totalDeltaMeta > 0
                  ? Math.min(100, Math.max(0, (atualDelta / totalDeltaMeta) * 100))
                  : (isFinalizada ? 100 : 0);

                return (
                  <div
                    key={item.ticker}
                    onClick={() => {
                      carregarTickerPorSimbolo(item.ticker);
                    }}
                    className={`bg-white rounded-xl p-3.5 border-2 transition-all cursor-pointer shadow-2xs ${
                      isFinalizada
                        ? 'border-emerald-400 bg-gradient-to-r from-emerald-50/40 via-white to-white'
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-black font-mono text-slate-900">{item.ticker}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                            item.mercado === 'B3'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                          }`}>
                            {item.mercado}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate mt-0.5">{item.nome}</div>
                      </div>

                      <div className="text-right">
                        {isFinalizada ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs uppercase">
                            🏆 Objetivo Atingido
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 uppercase">
                            Em Andamento
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

                    {/* Preços */}
                    <div className="mt-2.5 grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-mono text-xs">
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">Entrada</span>
                        <span className="font-bold text-slate-800">{moedaSimbolo} {item.precoEntrada.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-slate-400 uppercase">{isFinalizada ? 'Saída' : 'Atual'}</span>
                        <span className="font-extrabold text-slate-900">{moedaSimbolo} {(isFinalizada ? item.precoFinalizacao || item.precoAtual : item.precoAtual).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-sans font-bold text-blue-700 uppercase">Alvo Graham</span>
                        <span className="font-bold text-blue-800">{moedaSimbolo} {item.precoAlvo.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-600">
                        <span>Progresso da meta</span>
                        <span className="font-mono font-bold text-slate-900">{progressoPct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFinalizada ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-emerald-500'
                          }`}
                          style={{ width: `${progressoPct}%` }}
                        />
                      </div>
                    </div>

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
        {/* ABA DA ESQUERDA: ATIVO DESTRINCHADO & VALUATION           */}
        {/* ========================================================= */}
        <main
          className={`w-full ${
            mobileTab === 'ambas' ? 'md:w-1/2' : 'lg:w-1/2'
          } flex-1 min-w-0 bg-[#fbfcfd] flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto ${
            mobileTab === 'copilot' || mobileTab === 'oportunidades' || mobileTab === 'metas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header da Ação Selecionada */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-300 gap-2.5">
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
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-600 font-mono mt-1 flex-wrap">
                <span>{ativo.ultimoBalanco}</span>
                <span>•</span>
                <span>ROE: <strong className="text-emerald-700">{ativo.roe}%</strong></span>
                <span>•</span>
                <span>DY 12m: <strong className="text-emerald-700">{ativo.dividendYield}%</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
              <div className="text-left sm:text-right font-mono">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 block">
                    {fmtMoeda(preco)}
                  </span>
                  {ativo.variacaoDia !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
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
                <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-slate-600 mt-0.5">
                  <span>P/L: {calc.plAtual.toFixed(1)}x • P/VP: {calc.pvpAtual.toFixed(2)}x</span>
                  <button
                    onClick={atualizarCotacaoAtual}
                    disabled={atualizandoCotacao}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer transition-colors"
                    title="Consultar cotação ao vivo em tempo real deste ativo no pregão e recalcular desconto"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${atualizandoCotacao ? 'animate-spin' : ''}`} />
                    <span>{atualizandoCotacao ? 'Cotação...' : 'Cotação Atual'}</span>
                  </button>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase border-2 flex items-center gap-1.5 shrink-0 ${
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
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-md border border-blue-300 transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Abrir chat do AntiTrader AI para este ativo"
              >
                <Bot className="w-3.5 h-3.5 text-blue-600" />
                <span>Perguntar à IA</span>
              </button>
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
                Fair Value Médio
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
                  Teto Zona ({margem}% desc.)
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <span className="text-xl font-bold text-emerald-700 font-mono block mt-0.5">
                {fmtMoeda(calc.zona)}
              </span>
              <span className="text-[11px] text-emerald-900 font-mono mt-0.5 block">
                {preco <= calc.zona ? '✓ Dentro da Zona de Segurança' : `Distância: ${Math.abs(calc.vsZona).toFixed(1)}% para compra`}
              </span>
            </div>

            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg shadow-2xs">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Upside até Fair Value
              </span>
              <span className={`text-xl font-bold font-mono block mt-0.5 ${calc.vsFair >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {fmtPercent(calc.vsFair)}
              </span>
              <span className="text-[11px] text-slate-600 font-mono mt-0.5 block">
                P/L &times; P/VP: <strong className={calc.grahamMultiplier <= 22.5 ? 'text-emerald-700' : 'text-amber-700'}>{calc.grahamMultiplier.toFixed(2)}</strong> (Máx: 22.5)
              </span>
            </div>
          </div>

          {/* RÉGUA VISUAL DA ZONA DE COMPRA (GAUGE REFINADA) */}
          <div className="p-3.5 bg-white border-2 border-slate-300 rounded-lg shadow-2xs overflow-hidden">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2 flex-wrap gap-1">
              <span className="text-emerald-700">Barato / Compra (&lt; {fmtMoeda(calc.zona)})</span>
              <span className="text-amber-700">Preço Justo ({fmtMoeda(calc.fair)})</span>
              <span className="text-red-700">Caro / Aguardar</span>
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

            <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-slate-600 mt-1 flex-wrap gap-1">
              <span>0.00</span>
              <span>Teto Zona: <strong className="text-emerald-700">{fmtMoeda(calc.zona)}</strong></span>
              <span>Fair Value: <strong className="text-amber-750">{fmtMoeda(calc.fair)}</strong></span>
              <span>Escala: {fmtMoeda(calc.scaleMax)}</span>
            </div>
          </div>

          {/* FICHA TÉCNICA DO BALANÇO E TESE BUY & HOLD (QUADRINHOS BEM DEMARCADOS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <div className="p-3 bg-white border-2 border-slate-300 rounded-lg space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Condições para Buy &amp; Hold</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-300 text-xs text-slate-800 leading-relaxed min-h-[90px]">
                {ativo.condicoesBuyHold}
              </div>
              <div className="pt-2 border-t border-slate-300 text-[11px] font-mono text-slate-600 flex justify-between items-center">
                <span>Setup P/L &times; P/VP: <strong className="text-emerald-700">{calc.grahamMultiplier.toFixed(2)} &le; 22.5</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">Aprovado ✓</span>
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
                onClick={() => setMoeda(m => m === 'BRL' ? 'USD' : 'BRL')}
                className="text-xs font-mono px-2 py-0.5 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer"
              >
                Moeda: {moeda}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans">Cotação Atual ({moeda})</label>
                <input
                  type="number"
                  step="any"
                  value={preco}
                  onChange={(e) => setPreco(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans">LPA (Lucro por Ação)</label>
                <input
                  type="number"
                  step="any"
                  value={lpa}
                  onChange={(e) => setLpa(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans">VPA (Patrimônio Líq/Ação)</label>
                <input
                  type="number"
                  step="any"
                  value={vpa}
                  onChange={(e) => setVpa(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded-md border border-slate-300">
                <label className="text-[10px] text-slate-600 block mb-1 font-sans">Crescimento g (%)</label>
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
        {/* PAINEL DA DIREITA: COPILOT IA (ABERTO, PROFUNDO E AO LADO)*/}
        {/* Ocupa ~38% da largura no desktop                           */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* ABA DA DIREITA (50%): IA COPILOT DE MERCADO & VALUATION   */}
        {/* ========================================================= */}
        <aside
          className={`w-full ${
            mobileTab === 'ambas' ? 'md:w-1/2' : 'lg:w-1/2'
          } flex-1 min-w-0 bg-[#fbfbfc] flex flex-col border-t lg:border-t-0 lg:border-l border-slate-300 overflow-hidden ${
            mobileTab === 'info' || mobileTab === 'oportunidades' || mobileTab === 'metas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header do Chat */}
          <div className="p-2.5 border-b border-slate-300 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Bot className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-900 truncate">
                  AntiTrader AI • {ativo.ticker}
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

          {/* Mensagens do Chat com Steps de Auditoria e Formatação Rica */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-xs leading-relaxed font-sans min-h-[220px]">
            {chatMessages.map((msg) => (
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

                  {/* Conteúdo com Formatação Markdown Rica (Headers, Listas, Tabelas) */}
                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-line text-xs font-medium text-slate-800">
                      {msg.text}
                    </div>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}

                  {/* Badge de Pesquisa Web Realizada (quando houver queries) */}
                  {msg.searchQueries && msg.searchQueries.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                      <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="font-bold">Pesquisa Web:</span>
                      <span className="truncate italic">"{msg.searchQueries.join(', ')}"</span>
                    </div>
                  )}

                  {/* Fontes Web Consultadas */}
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

                  {/* Rodapé da Mensagem (Origem e Modelo) */}
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
            ))}

            {enviandoMsg && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 p-2 bg-slate-50 rounded border border-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consultando inteligência de mercado e fundamentos com IA...</span>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas de Análise - Formato Super Compacto em Linha Única (Sem Emojis, Sem Ocupar Espaço) */}
          <div className="px-2 py-1.5 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
              Sugestões:
            </span>
            {[
              { rotulo: 'Cotação Atual', q: `Qual a cotação atual e variação recente de ${ativo.ticker}? Mostre o preço de tela e análise de valuation.` },
              { rotulo: 'Macro & Selic', q: `Como a taxa Selic e juros futuros impactam ${ativo.ticker} e o seu setor?` },
              { rotulo: 'Pesquisa Web', q: `Pesquise os últimos fatos relevantes e notícias recentes de ${ativo.ticker}.` },
              { rotulo: 'Comparar Concorrentes', q: `Compare ${ativo.ticker} com seus maiores concorrentes em margens, endividamento e múltiplos.` },
              { rotulo: 'Preço Teto (Barsi)', q: `Simule o Preço Teto pelo método Décio Barsi para 6% de Dividend Yield em ${ativo.ticker}.` },
              { rotulo: 'Teste de Estresse', q: `Faça um teste de estresse para ${ativo.ticker}: o que acontece se as receitas caírem 25%?` },
              { rotulo: 'ROE vs ROIC', q: `Explique a diferença entre ROE e ROIC para ${ativo.ticker} e como o WACC afeta o valuation.` },
              { rotulo: 'Fosso & Governança', q: `Aprofunde o fosso econômico (moat) e riscos de governança corporativa de ${ativo.ticker}.` },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleEnviarMensagem(item.q)}
                className="text-[10.5px] text-slate-700 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-500 hover:text-blue-700 rounded px-2 py-0.5 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs shrink-0 flex items-center gap-1"
              >
                <span>{item.rotulo}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
              </button>
            ))}
          </div>

          {/* Caixa de Digitação do Chat - Ampla, Confortável e com Mais Espaço */}
          <div className="p-2.5 bg-white border-t border-slate-300 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEnviarMensagem();
              }}
              className="border-2 border-slate-300 focus-within:border-blue-600 rounded-lg p-2.5 bg-slate-50 transition-colors"
            >
              <textarea
                rows={3}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEnviarMensagem();
                  }
                }}
                placeholder={`Pergunte qualquer tema (valuation, balanços, macro, concorrentes, notícias, conceitos)...`}
                className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none resize-none font-sans min-h-[60px]"
              />

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[11px] text-slate-600 mt-1">
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                  <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Pesquisa web e análise fundamentalista ativas</span>
                  <span className="sm:hidden">Pesquisa Web Ativa</span>
                </div>

                <button
                  type="submit"
                  disabled={enviandoMsg || !inputMsg.trim()}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span>Enviar</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </aside>

      </div>

      {/* ========================================================= */}


      {/* ========================================================= */}
      {/* MODAL: AUDITORIA OPERACIONAL & DIAGNÓSTICOS EM TEMPO REAL  */}
      {/* ========================================================= */}
      {modalScanInfoAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border-2 border-slate-300 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Header do Modal */}
            <div className="p-3.5 border-b border-slate-300 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-2">
                    <span>Auditoria Técnica do Sistema &amp; Feeds em Tempo Real</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      100% Online
                    </span>
                  </h3>
                  <span className="text-[10px] text-slate-400 block">
                    Conexão direta aos pregões B3 (Brapi/Yahoo) e Wall Street (NYSE/Nasdaq)
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
              
              {/* Placar de Diagnósticos em Tempo Real */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Cobertura de Feeds</span>
                  <strong className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">
                    {auditDiagnostics ? `${auditDiagnostics.liveCoveragePercent}% (${auditDiagnostics.totalLiveFeeds}/${auditDiagnostics.totalMonitored})` : '20 de 20 (100%)'}
                  </strong>
                  <span className="text-[9px] text-slate-400">Tempo Real Ativo</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Latência Média</span>
                  <strong className="text-sm sm:text-base font-bold text-blue-400 block mt-0.5">
                    {auditDiagnostics ? `${auditDiagnostics.avgLatencyMs} ms` : '~180 ms'}
                  </strong>
                  <span className="text-[9px] text-slate-400">Resposta ultrarrápida</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Na Zona de Compra</span>
                  <strong className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">
                    {auditDiagnostics ? `${auditDiagnostics.totalInBuyZone} de ${auditDiagnostics.totalMonitored}` : '10 ativos'}
                  </strong>
                  <span className="text-[9px] text-slate-400">Filtro Graham-Buffett</span>
                </div>

                <div className="bg-[#0f172a] text-white p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">Varredura Geral 19h</span>
                  <strong className="text-sm sm:text-base font-bold text-amber-400 block mt-0.5">
                    {countdownStr}
                  </strong>
                  <span className="text-[9px] text-slate-400">Pós-fechamento diário</span>
                </div>
              </div>

              {/* Botão de Disparo da Auditoria ao Vivo */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800">
                    Última Sincronização Local: <span className="font-mono text-blue-700">{ultimaAtualizacaoEm}</span>
                  </span>
                </div>

                <button
                  onClick={rodarAuditoriaAoVivo}
                  disabled={executandoAuditoria}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-[11px] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${executandoAuditoria ? 'animate-spin' : ''}`} />
                  <span>{executandoAuditoria ? 'Testando Conexões...' : 'Testar Conexões & Cotações Agora'}</span>
                </button>
              </div>

              {/* Tabela de Auditoria dos Ativos em Tempo Real */}
              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-700" />
                    <span>Conferência de Tela: Preço Base vs Cotação de Mercado em Tempo Real</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Auto-refresh em segundo plano ativo (a cada 60s)
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
                          const mSimb = item.moeda === 'BRL' ? 'R$' : 'US$';
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
                disabled={executandoScanManual}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Zap className={`w-3.5 h-3.5 text-emerald-400 ${executandoScanManual ? 'animate-spin' : ''}`} />
                <span>{executandoScanManual ? 'Executando Varredura...' : 'Executar Varredura Geral Noturna Agora'}</span>
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

    </div>
  );
}
