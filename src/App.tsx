import React, { useMemo, useState, useEffect, useRef } from 'react';
import { OPORTUNIDADES_SETUP } from './data/oportunidades';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  Search,
  Sparkles,
  Send,
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
  Key,
  X,
  Lock,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Clock,
  Zap,
} from 'lucide-react';

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
  const [mobileTab, setMobileTab] = useState<'info' | 'copilot' | 'ambas'>('ambas');

  // Chave personalizada do usuário (salva no localStorage para backup)
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('antitrader_gemini_key') || localStorage.getItem('antigravity_gemini_key') || '';
  });
  const [inputApiKey, setInputApiKey] = useState('');
  const [chaveSalvaFeedback, setChaveSalvaFeedback] = useState(false);
  const [apiStatusInfo, setApiStatusInfo] = useState<any>(null);
  const [testandoApi, setTestandoApi] = useState(false);

  // Modal com explicação de Chaves de API e Fontes
  const [modalApiAberto, setModalApiAberto] = useState(false);

  // Ativo Selecionado em Foco (iniciando com PETR4 em cotação de mercado real)
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

  // Pesquisa com IA
  const [buscaTicker, setBuscaTicker] = useState('');
  const [buscandoIA, setBuscandoIA] = useState(false);
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
      text: `Olá! Sou o **Copilot AntiTrader de Inteligência de Mercado & Valuation**.

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

    // Busca status da API
    fetch('/api/api-status')
      .then((res) => res.json())
      .then((info) => setApiStatusInfo(info))
      .catch(() => {});
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

  // Salvar chave de backup
  const salvarChaveCustomizada = () => {
    if (inputApiKey.trim()) {
      localStorage.setItem('antitrader_gemini_key', inputApiKey.trim());
      localStorage.setItem('antigravity_gemini_key', inputApiKey.trim());
      setUserApiKey(inputApiKey.trim());
    } else {
      localStorage.removeItem('antitrader_gemini_key');
      localStorage.removeItem('antigravity_gemini_key');
      setUserApiKey('');
    }
    setChaveSalvaFeedback(true);
    setTimeout(() => setChaveSalvaFeedback(false), 2500);
  };

  // Testar conexão de API
  const testarConexaoApi = async () => {
    setTestandoApi(true);
    try {
      const res = await fetch('/api/api-status');
      const data = await res.json();
      setApiStatusInfo(data);
    } catch {
      // ignore
    } finally {
      setTestandoApi(false);
    }
  };

  // Busca Inteligente com IA
  const handleBuscarTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaTicker.trim() || buscandoIA) return;

    setBuscandoIA(true);
    try {
      const res = await fetch('/api/gemini/search-financials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userApiKey ? { 'x-gemini-key': userApiKey } : {}),
        },
        body: JSON.stringify({ query: buscaTicker.trim() }),
      });
      if (!res.ok) throw new Error('Não foi possível carregar os dados.');
      const data: Oportunidade = await res.json();
      carregarAtivo(data);
      setBuscaTicker('');
    } catch (err: any) {
      console.error(err);
    } finally {
      setBuscandoIA(false);
    }
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

          {/* Botão de Informações de Chave de API & Backup */}
          <button
            onClick={() => {
              setInputApiKey(userApiKey);
              setModalApiAberto(true);
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Ver informações sobre chave gratuita, backup e failover"
          >
            <Key className="w-3 h-3 text-blue-600" />
            <span className="hidden lg:inline">Chaves &amp; Backup</span>
            {userApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Chave pessoal ativa"></span>}
          </button>
        </div>

        {/* Barra Central de Busca com IA */}
        <form onSubmit={handleBuscarTicker} className="flex-1 max-w-xs sm:max-w-sm mx-1 sm:mx-2 min-w-0">
          <div className="relative">
            <input
              type="text"
              value={buscaTicker}
              onChange={(e) => setBuscaTicker(e.target.value)}
              placeholder="Buscar ação com IA (ex: PETR4, BBAS3, NVDA)..."
              className="w-full bg-[#f8fafc] border border-slate-300 focus:border-blue-600 focus:bg-white text-xs text-[#0f172a] rounded-md pl-7 pr-12 py-1 outline-none font-medium transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            <button
              type="submit"
              disabled={buscandoIA || !buscaTicker.trim()}
              className="absolute right-1 top-0.5 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {buscandoIA ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
              <span>IA</span>
            </button>
          </div>
        </form>

        {/* Controles de Ação do Header */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Botão de Instalação PWA (Disponível quando instalável ou no iOS Safari) */}
          <PWAInstallButton />

          {/* Botão de Refresh Global de Cotações */}
          <button
            onClick={fetchOportunidades}
            disabled={carregandoOportunidades}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-400 transition-colors cursor-pointer shadow-2xs"
            title="Atualizar cotações ao vivo do pregão para as ações monitoradas"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{carregandoOportunidades ? 'Atualizando...' : 'Atualizar Cotações'}</span>
          </button>

          <button
            onClick={copiarResumo}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            title="Copiar relatório formatado"
          >
            {copiado ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span className="hidden sm:inline">{copiado ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-bold">B3/US</span>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* BARRA SUPERIOR DE OPORTUNIDADES (CARROSSEL HORIZONTAL)     */}
      {/* Aqui você clica no ativo lá em cima e ele abre destrinchado*/}
      {/* na esquerda, com a IA do lado direito em 2 abas iguais!   */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-300 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 overflow-x-auto shadow-2xs">
        {/* Título & Filtros da Peneira */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 font-bold text-xs text-slate-900 tracking-tight uppercase">
            <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="whitespace-nowrap">Oportunidades:</span>
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
            className="flex items-center gap-1 bg-[#0f172a] text-white px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            title="Próxima varredura geral diária às 19:00 de Brasília. Clique para auditar ou rodar varredura."
          >
            <Clock className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-400 text-[9px] font-medium hidden sm:inline">19h:</span>
            <span className="font-bold text-emerald-400 tracking-wider">{countdownStr}</span>
          </button>

          <button
            onClick={() => setFiltroZonaApenas(!filtroZonaApenas)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-2xs ${
              filtroZonaApenas
                ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title={filtroZonaApenas ? 'Mostrando apenas ativos estritamente na Zona de Compra' : 'Clique para ver todas as ações monitoradas'}
          >
            <Check className={`w-3 h-3 ${filtroZonaApenas ? 'text-white' : 'text-slate-400'}`} />
            <span>Peneira: {filtroZonaApenas ? 'Apenas Na Zona' : 'Todos'}</span>
          </button>

          {/* Botão de Refresh Rápido junto aos controles da barra */}
          <button
            onClick={fetchOportunidades}
            disabled={carregandoOportunidades}
            className="p-1 px-1.5 text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 cursor-pointer rounded border border-slate-300 hover:border-blue-300 shrink-0 flex items-center gap-1 text-[10px] font-bold transition-colors shadow-2xs"
            title="Atualizar cotações de tela ao vivo do pregão para as ações da barra"
          >
            <RefreshCw className={`w-2.5 h-2.5 text-blue-600 ${carregandoOportunidades ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
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
                  onClick={() => carregarAtivo(op)}
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
      {/* SELETOR MOBILE / TABLET (APARECE APENAS EM TELAS MENORES) */}
      {/* ========================================================= */}
      <div className="flex md:hidden bg-slate-100 border-b border-slate-300 px-3 py-1 items-center justify-between text-xs font-bold shrink-0">
        <span className="text-slate-600 text-[11px] font-mono">Visualizar:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setMobileTab('info')}
            className={`px-2.5 py-0.5 rounded border ${mobileTab === 'info' ? 'bg-white text-blue-700 border-slate-300 shadow-2xs font-bold' : 'text-slate-600 border-transparent'}`}
          >
            Valuation &amp; Balanço
          </button>
          <button
            onClick={() => setMobileTab('copilot')}
            className={`px-2.5 py-0.5 rounded border ${mobileTab === 'copilot' ? 'bg-white text-blue-700 border-slate-300 shadow-2xs font-bold' : 'text-slate-600 border-transparent'}`}
          >
            Copilot IA
          </button>
          <button
            onClick={() => setMobileTab('ambas')}
            className={`px-2.5 py-0.5 rounded border ${mobileTab === 'ambas' ? 'bg-white text-blue-700 border-slate-300 shadow-2xs font-bold' : 'text-slate-600 border-transparent'}`}
          >
            Ambas
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ÁREA PRINCIPAL: 2 PAINÉIS (VALUATION & COPILOT AO LADO)   */}
      {/* O painel vertical foi removido. Fica o meio e o copilot!  */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-full overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-300 min-h-0">
        {/* ========================================================= */}
        {/* PAINEL VERTICAL DA ESQUERDA: PENEIRA DE OPORTUNIDADES     */}
        {/* Lista Vertical com Preço de Tela vs Preço Zona de Compra  */}
        {/* PAINEL DO MEIO: VALUATION, GAUGE & DADOS DO BALANÇO       */}
        {/* Ocupa ~62% da largura no desktop (espaçoso e nítido)       */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* ABA DA ESQUERDA (50%): ATIVO DESTRINCHADO & VALUATION     */}
        {/* ========================================================= */}
        <main
          className={`w-full md:w-1/2 flex-1 min-w-0 bg-[#fbfcfd] flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto ${
            mobileTab === 'copilot' ? 'hidden md:flex' : 'flex'
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
          className={`w-full md:w-1/2 flex-1 min-w-0 bg-[#fbfbfc] flex flex-col border-l md:border-l-0 border-slate-300 overflow-hidden ${
            mobileTab === 'info' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header do Chat */}
          <div className="p-2.5 border-b border-slate-300 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Bot className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-900 truncate">
                  Copilot IA • {ativo.ticker}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-600 shrink-0">
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
                      {msg.sender === 'user' ? 'Você' : 'Gemini Copilot'}
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
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Pesquisa web e análise fundamentalista ativas</span>
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
      {/* MODAL: CHAVES DE API GRATUITA + BACKUP (FAILOVER AUTOMÁTICO)*/}
      {/* ========================================================= */}
      {modalApiAberto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border-2 border-slate-300 overflow-hidden">
            <div className="p-3.5 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Chave Gratuita + Chave de Backup (Failover)
                </h3>
              </div>
              <button
                onClick={() => setModalApiAberto(false)}
                className="p-1 text-slate-500 hover:text-black cursor-pointer rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs text-slate-700 leading-relaxed max-h-[80vh] overflow-y-auto">
              
              {/* Explicação da Arquitetura */}
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                  <Lock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Como funciona a Chave Gratuita e o Backup</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  O sistema possui uma <strong>chave gratuita do Google AI Studio</strong> ativa no servidor. Caso a cota gratuita atinja o limite por minuto, o servidor faz <strong>failover automático para chaves reservas e modelos alternativos (Gemini 3.8 Flash, Gemini 3.1 Flash Lite e Gemini 2.5 Flash)</strong> sem travar o seu uso!
                </p>
              </div>

              {/* Status das Chaves Ativas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Status do Servidor:</h4>
                  <button
                    onClick={testarConexaoApi}
                    disabled={testandoApi}
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${testandoApi ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>
                </div>

                <div className="p-2.5 rounded border border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                    <div>
                      <strong className="block text-slate-900">1. Chave Gratuita Primária (Google AI Studio):</strong>
                      <span className="text-slate-600 text-[11px]">
                        {apiStatusInfo?.primaryKeyStatus || 'Ativa no backend seguro (sem expor chave ao navegador).'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                    <div>
                      <strong className="block text-slate-900">2. Chave de Backup / Failover:</strong>
                      <span className="text-slate-600 text-[11px]">
                        Ativa para alternância automática em caso de saturação ou código 429 de cota.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campo para o Usuário Adicionar sua Própria Chave Gratuita de Backup */}
              <div className="p-3 rounded-lg border-2 border-slate-300 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sua Chave Gratuita Pessoal (Backup Opcional)</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Criar Chave Gratuita</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <p className="text-[11px] text-slate-600">
                  Deseja usar sua própria chave pessoal do Google AI Studio como prioridade ou backup garantido? Cole abaixo (fica salva apenas no seu navegador):
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 bg-white border border-slate-400 focus:border-blue-600 rounded px-2.5 py-1 text-xs font-mono outline-none"
                  />
                  <button
                    onClick={salvarChaveCustomizada}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded cursor-pointer transition-colors"
                  >
                    Salvar
                  </button>
                </div>

                {chaveSalvaFeedback && (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> Chave pessoal salva e prioritária para suas chamadas!
                  </span>
                )}
                {userApiKey && !chaveSalvaFeedback && (
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Chave pessoal ativa: <code className="font-mono bg-slate-200 px-1 rounded">{userApiKey.slice(0, 6)}...{userApiKey.slice(-4)}</code></span>
                    <button
                      onClick={() => {
                        setInputApiKey('');
                        localStorage.removeItem('antitrader_gemini_key');
                        localStorage.removeItem('antigravity_gemini_key');
                        setUserApiKey('');
                      }}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>

            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-300 text-right">
              <button
                onClick={() => setModalApiAberto(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AUDITORIA DA VARREDURA DIÁRIA (19:00 BRT) & MERCADOS*/}
      {/* ========================================================= */}
      {modalScanInfoAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border-2 border-slate-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header do Modal */}
            <div className="p-3.5 border-b border-slate-300 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-100">
                  Auditoria da Varredura Diária de Oportunidades (19h BRT)
                </h3>
              </div>
              <button
                onClick={() => setModalScanInfoAberto(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo do Modal com Auditoria Técnica e Estatísticas */}
            <div className="p-4 space-y-3.5 overflow-y-auto text-xs text-slate-800">
              
              {/* Placar do Agendamento */}
              <div className="bg-[#0f172a] text-white p-3 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Próxima Varredura 19h BRT</span>
                  <strong className="text-base font-bold text-emerald-400 block mt-0.5">{countdownStr}</strong>
                  <span className="text-[9px] text-slate-400">{scanStatus?.nextScanFormatted || 'Hoje às 19:00 BRT'}</span>
                </div>
                <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Última Varredura Consolidada</span>
                  <strong className="text-base font-bold text-blue-400 block mt-0.5">{scanStatus?.totalInBuyZone || 0} na Zona</strong>
                  <span className="text-[9px] text-slate-400">{scanStatus?.lastScanFormatted || 'Consolidada pós-pregão'}</span>
                </div>
              </div>

              {/* Perguntas & Auditoria Técnica Respondidas com Transparência */}
              <div className="space-y-2.5">
                <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    1. Quando o sistema varre a busca?
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    A varredura geral ocorre de forma <strong>programada e automática todos os dias às 19:00 (Horário de Brasília)</strong>.
                    Você também pode disparar a varredura manual a qualquer instante clicando no botão <strong>Varredura Geral</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                    2. Por que o horário fixo das 19:00 BRT?
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    • O pregão da <strong>B3</strong> encerra às 17h00 (ou 18h00 com after-market).<br />
                    • As bolsas de Wall Street (<strong>NYSE e Nasdaq / S&amp;P 500</strong>) encerram às 16h00 NY (17h00 de Brasília).<br />
                    • Às 19:00 BRT, todos os livros de ofertas do dia estão finalizados, as cotações de fechamento oficiais estão consolidadas e as companhias publicam seus balanços e fatos relevantes após o expediente de negociação.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-slate-700" />
                    3. Ele está buscando em todos os ativos do S&amp;P 500 e da B3?
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>Auditoria Transparente:</strong> O S&amp;P 500 possui 503 componentes e a B3 possui mais de 400 empresas listadas. Fazer ~900 requisições simultâneas em tempo real a cada segundo estouraria as cotas das APIs de mercado. Por isso, seguimos a arquitetura dos terminais institucionais (Bloomberg / Koyfin):
                  </p>
                  <ul className="text-[11px] text-slate-600 list-disc list-inside mt-1 space-y-0.5">
                    <li><strong>Varredura de Universo (19h BRT):</strong> Avalia e recalcula preços teto, margem de segurança e Graham Multiplier do universo de liquidez.</li>
                    <li><strong>Busca Aberta Global com IA:</strong> Qualquer um dos 503 ativos do S&amp;P 500 ou 400 da B3 que você digitar no campo de busca ou no chat é analisado instantaneamente em tempo real.</li>
                    <li><strong>Botões de Refresh:</strong> Atualizam exclusivamente as cotações instantâneas de tela durante o pregão.</li>
                  </ul>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                    4. O que fazem os botões de Refresh (Cotação Atual)?
                  </h4>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Os botões de refresh são dedicados à <strong>cotação ao vivo de tela</strong> durante o pregão. Ao clicar, o sistema consulta a cotação no livro oficial e recalcula na hora o desconto contra o Preço Teto fixado da Zona de Compra.
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
            <div className="p-3 bg-slate-50 border-t border-slate-300 flex items-center justify-between">
              <button
                onClick={dispararVarreduraManual}
                disabled={executandoScanManual}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Zap className={`w-3.5 h-3.5 text-emerald-400 ${executandoScanManual ? 'animate-spin' : ''}`} />
                <span>{executandoScanManual ? 'Executando Varredura...' : 'Executar Varredura Geral Agora'}</span>
              </button>

              <button
                onClick={() => setModalScanInfoAberto(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Fechar Auditoria
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
