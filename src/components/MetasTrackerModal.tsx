import React, { useState, useMemo } from 'react';
import {
  Target,
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  X,
  Pencil,
  Trash2,
  Check,
  Search,
  ExternalLink,
  Copy,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Activity,
  Percent,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { TrackedOpportunity, TrackerStats } from '../types/tracker';
import {
  calculateTrackerStats,
  updateEntryPrice,
  finalizeManually,
  reopenTracking,
  removeTrackedOpportunity,
  resetTrackedOpportunities,
} from '../services/trackerService';

interface MetasTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackedList: TrackedOpportunity[];
  setTrackedList: React.Dispatch<React.SetStateAction<TrackedOpportunity[]>>;
  onSelectTickerForValuation: (ticker: string) => void;
}

export function MetasTrackerModal({
  isOpen,
  onClose,
  trackedList,
  setTrackedList,
  onSelectTickerForValuation,
}: MetasTrackerModalProps) {
  const [activeTab, setActiveTab] = useState<'ATIVAS' | 'FINALIZADAS' | 'TODAS'>('ATIVAS');
  const [filtroMercado, setFiltroMercado] = useState<'TODOS' | 'B3' | 'US'>('TODOS');
  const [busca, setBusca] = useState('');
  
  // Estado para edição do preço de entrada
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');
  
  // Feedback de cópia do relatório
  const [copiado, setCopiado] = useState(false);

  // Estatísticas consolidadas
  const stats: TrackerStats = useMemo(() => {
    return calculateTrackerStats(trackedList);
  }, [trackedList]);

  // Lista filtrada
  const filteredList = useMemo(() => {
    return trackedList.filter((item) => {
      if (activeTab === 'ATIVAS' && item.status !== 'EM_ANDAMENTO') return false;
      if (activeTab === 'FINALIZADAS' && item.status !== 'FINALIZADA') return false;
      if (filtroMercado !== 'TODOS' && item.mercado !== filtroMercado) return false;
      if (busca.trim()) {
        const q = busca.toLowerCase().trim();
        return (
          item.ticker.toLowerCase().includes(q) ||
          item.nome.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [trackedList, activeTab, filtroMercado, busca]);

  // Salvar novo preço de entrada editado pelo usuário
  const handleSaveEntryPrice = (ticker: string) => {
    const val = parseFloat(editPriceVal.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      const updated = updateEntryPrice(trackedList, ticker, val);
      setTrackedList(updated);
    }
    setEditingTicker(null);
  };

  // Finalizar manualmente
  const handleFinalize = (ticker: string) => {
    const updated = finalizeManually(trackedList, ticker);
    setTrackedList(updated);
  };

  // Reabrir
  const handleReopen = (ticker: string) => {
    const updated = reopenTracking(trackedList, ticker);
    setTrackedList(updated);
  };

  // Remover
  const handleRemove = (ticker: string) => {
    if (confirm(`Remover ${ticker} da esteira de acompanhamento?`)) {
      const updated = removeTrackedOpportunity(trackedList, ticker);
      setTrackedList(updated);
    }
  };

  // Copiar relatório
  const copiarRelatorioMetas = () => {
    const lines = [
      '====================================================',
      'ANTITRADER — RELATÓRIO DO CICLO DE METAS GRAHAM (TP1 & TP2)',
      `Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
      `Total Ativas: ${stats.totalAtivas} | Metas Batidas: ${stats.totalFinalizadas} | Taxa de Acerto: ${stats.taxaAcertoPercent}%`,
      `Lucro Médio Realizado: +${stats.lucroMedioRealizadoPercent}% | Maior Ganho: +${stats.maiorGanhoPercent}%`,
      '====================================================',
      '',
    ];

    trackedList.forEach((i) => {
      const isFin = i.status === 'FINALIZADA';
      const m = i.moeda === 'BRL' ? 'R$' : '$';
      const tp1 = i.tp1 || i.precoAlvo;
      const tp2 = i.tp2 || Number((tp1 * 1.35).toFixed(2));
      const stop = i.precoStop || Number((i.precoEntrada * 0.80).toFixed(2));
      lines.push(
        `• ${i.ticker} (${i.mercado}) - ${i.nome} [${i.etapaCiclo || i.status}]`,
        `  Entrada: ${m} ${i.precoEntrada.toFixed(2)} | Stop (-20%): ${m} ${stop.toFixed(2)}`,
        `  Cotação Atual: ${m} ${i.precoAtual.toFixed(2)} | TP1: ${m} ${tp1.toFixed(2)} | TP2: ${m} ${tp2.toFixed(2)}`,
        `  Resultado: ${isFin ? `+${i.lucroRealizadoPercent}% Realizado` : `${(((i.precoAtual - i.precoEntrada) / i.precoEntrada) * 100).toFixed(1)}% flutuante`}`,
        `  Diretriz: ${i.nota || 'Acompanhamento do ciclo de valorização em andamento.'}`,
        ''
      );
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
        paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom, 1.75rem))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0.5rem))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0.5rem))',
      }}
    >
      <div className="bg-white w-full max-w-5xl rounded-xl sm:rounded-2xl shadow-2xl border border-slate-300 flex flex-col max-h-[84dvh] sm:max-h-[90vh] overflow-hidden">
        
        {/* ======================================================== */}
        {/* MODAL HEADER                                             */}
        {/* ======================================================== */}
        <div className="py-2 px-2.5 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-600/30 rounded-lg sm:rounded-xl border border-blue-400/40 text-blue-300 shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                <h2 className="text-xs sm:text-lg font-black tracking-tight text-white truncate">
                  <span className="sm:hidden">Ciclo de Metas Graham</span>
                  <span className="hidden sm:inline">Acompanhamento do Ciclo de Metas Graham</span>
                </h2>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-bold uppercase whitespace-nowrap shrink-0">
                  Zona ➔ TP1 ➔ TP2
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 hidden sm:block">
                Monitoramento contínuo desde a entrada na zona (0.67–0.80× PJ) até o Preço Justo (TP1) e Alvo Estendido (TP2).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={copiarRelatorioMetas}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white text-[10px] sm:text-xs font-bold border border-slate-600 transition-colors cursor-pointer shadow-2xs"
              title="Copiar relatório completo de acompanhamento"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span className="hidden sm:inline">{copiado ? 'Copiado!' : 'Copiar Relatório'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* KPI CARDS (RESUMO QUANTITATIVO)                          */}
        {/* ======================================================== */}
        <div className="p-1.5 sm:p-3 bg-[#f8fafc] border-b border-slate-200 shrink-0">
          
          {/* Desktop Grid (sm and up) */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
            
            {/* Em Andamento */}
            <div className="bg-white p-2 rounded-xl border border-blue-200 shadow-2xs">
              <div className="flex items-center justify-between text-blue-600 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Em Andamento</span>
                <Clock className="w-3.5 h-3.5 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.totalAtivas}
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Na esteira Graham</span>
            </div>

            {/* TP1 Batidos */}
            <div className="bg-white p-2 rounded-xl border border-teal-200 shadow-2xs">
              <div className="flex items-center justify-between text-teal-700 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">TP1 Batidos</span>
                <Target className="w-3.5 h-3.5 shrink-0 text-teal-600" />
              </div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-teal-900 leading-tight">
                {stats.totalTp1Batidos}
              </div>
              <span className="text-[10px] text-teal-700 font-medium">Preço Justo atingido</span>
            </div>

            {/* Metas Concluídas (TP2) */}
            <div className="bg-white p-2 rounded-xl border border-emerald-300 shadow-2xs bg-gradient-to-br from-emerald-50/40 to-white">
              <div className="flex items-center justify-between text-emerald-700 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Ciclos Concluídos</span>
                <Trophy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-900 leading-tight">
                {stats.totalFinalizadas}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">100% finalizadas</span>
            </div>

            {/* Taxa de Acerto */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Taxa de Acerto</span>
                <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.taxaAcertoPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Nas concluídas</span>
            </div>

            {/* Lucro Médio Realizado */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Lucro Médio</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-700 leading-tight">
                +{stats.lucroMedioRealizadoPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Por posição</span>
            </div>

            {/* Tempo Médio */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Tempo Médio</span>
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.tempoMedioDias} d
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Prazo 2–3 anos</span>
            </div>

          </div>

          {/* Mobile Horizontal Carousel (ultra-compacto, ocupa apenas ~44px de altura) */}
          <div className="sm:hidden flex items-stretch gap-1.5 overflow-x-auto pb-0.5 no-scrollbar snap-x">
            {/* Em Andamento */}
            <div className="snap-start shrink-0 min-w-[92px] bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-blue-600">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">Em Andamento</span>
                <Clock className="w-2.5 h-2.5 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-slate-900 leading-none">{stats.totalAtivas}</span>
                <span className="text-[8px] text-blue-700 font-medium">ativas</span>
              </div>
            </div>

            {/* TP1 Batidos */}
            <div className="snap-start shrink-0 min-w-[92px] bg-white px-2 py-1 rounded-lg border border-teal-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-teal-700">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">TP1 Batidos</span>
                <Target className="w-2.5 h-2.5 shrink-0 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-teal-900 leading-none">{stats.totalTp1Batidos}</span>
                <span className="text-[8px] text-teal-700 font-medium">atingidos</span>
              </div>
            </div>

            {/* Ciclos Concluídos */}
            <div className="snap-start shrink-0 min-w-[96px] bg-white px-2 py-1 rounded-lg border border-emerald-300 shadow-2xs bg-gradient-to-br from-emerald-50/40 to-white flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">Concluídos</span>
                <Trophy className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-emerald-900 leading-none">{stats.totalFinalizadas}</span>
                <span className="text-[8px] text-emerald-700 font-bold">100%</span>
              </div>
            </div>

            {/* Taxa de Acerto */}
            <div className="snap-start shrink-0 min-w-[88px] bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">Acerto</span>
                <Award className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-slate-900 leading-none">{stats.taxaAcertoPercent}%</span>
                <span className="text-[8px] text-slate-500 font-medium">taxa</span>
              </div>
            </div>

            {/* Lucro Médio */}
            <div className="snap-start shrink-0 min-w-[88px] bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">Lucro Médio</span>
                <TrendingUp className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-emerald-700 leading-none">+{stats.lucroMedioRealizadoPercent}%</span>
                <span className="text-[8px] text-slate-500 font-medium">médio</span>
              </div>
            </div>

            {/* Tempo Médio */}
            <div className="snap-start shrink-0 min-w-[88px] bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans">Tempo Médio</span>
                <Activity className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold font-mono text-slate-900 leading-none">{stats.tempoMedioDias} d</span>
                <span className="text-[8px] text-slate-500 font-medium">ciclo</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BARRA DE FILTROS & NAVEGAÇÃO ENTRE ABAS                  */}
        {/* ======================================================== */}
        <div className="p-1.5 sm:p-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-2 shrink-0">
          
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-300">
            <button
              onClick={() => setActiveTab('ATIVAS')}
              className={`flex-1 sm:flex-none px-1.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'ATIVAS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Em Andamento</span>
              <span className={`text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 rounded-full ${
                activeTab === 'ATIVAS' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.totalAtivas}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('FINALIZADAS')}
              className={`flex-1 sm:flex-none px-1.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'FINALIZADAS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Concluídas</span>
              <span className={`text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 rounded-full ${
                activeTab === 'FINALIZADAS' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {stats.totalFinalizadas}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('TODAS')}
              className={`flex-1 sm:flex-none px-1.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 'TODAS'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Todas ({stats.totalGeral})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-300 text-xs shrink-0">
              {(['TODOS', 'B3', 'US'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFiltroMercado(m)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-colors ${
                    filtroMercado === m ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:w-44">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Filtrar ticker..."
                className="w-full bg-[#f8fafc] border border-slate-300 text-[11px] sm:text-xs rounded-lg pl-6 sm:pl-7 pr-2 py-0.5 sm:py-1 outline-none font-medium focus:border-blue-600 focus:bg-white transition-all"
              />
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-1.5 sm:left-2 top-1.5 sm:top-2" />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LISTAGEM DOS ATIVOS EM ACOMPANHAMENTO                    */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2.5 sm:space-y-3 bg-[#f1f5f9]/60">
          {filteredList.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-sm">Nenhuma oportunidade encontrada nesta categoria.</p>
              <p className="text-xs text-slate-400">
                Conforme os ativos entrarem na Zona de Compra (0.67x a 0.80x PJ), eles são enfileirados automaticamente aqui!
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isFinalizada = item.status === 'FINALIZADA';
              const moedaSimbolo = item.moeda === 'BRL' ? 'R$' : '$';
              const tp1 = item.tp1 || item.precoAlvo;
              const tp2 = item.tp2 || Number((tp1 * 1.35).toFixed(2));
              const precoStop = item.precoStop || Number((item.precoEntrada * 0.80).toFixed(2));

              // Cálculos de variação e progressos em 2 estágios
              const ganhoAtualPct = item.precoEntrada > 0
                ? ((item.precoAtual - item.precoEntrada) / item.precoEntrada) * 100
                : 0;

              // Estágio 1: Entrada ➔ TP1
              const deltaTp1 = tp1 - item.precoEntrada;
              const avancoTp1 = item.precoAtual - item.precoEntrada;
              const progressoTp1Pct = deltaTp1 > 0
                ? Math.min(100, Math.max(0, (avancoTp1 / deltaTp1) * 100))
                : (item.precoAtual >= tp1 ? 100 : 0);

              // Estágio 2: TP1 ➔ TP2
              const deltaTp2 = tp2 - tp1;
              const avancoTp2 = item.precoAtual - tp1;
              const progressoTp2Pct = deltaTp2 > 0
                ? Math.min(100, Math.max(0, (avancoTp2 / deltaTp2) * 100))
                : (item.precoAtual >= tp2 ? 100 : 0);

              const upsideRestanteTp1 = Math.max(0, tp1 - item.precoAtual);
              const upsideTp1Pct = item.precoAtual > 0 ? (upsideRestanteTp1 / item.precoAtual) * 100 : 0;

              const upsideRestanteTp2 = Math.max(0, tp2 - item.precoAtual);
              const upsideTp2Pct = item.precoAtual > 0 ? (upsideRestanteTp2 / item.precoAtual) * 100 : 0;

              const isInvalidado = item.etapaCiclo === 'INVALIDADO' || item.precoAtual <= precoStop;
              const isTp1Batido = item.etapaCiclo === 'TP1_BATIDO' || item.precoAtual >= tp1;
              const isTp2Batido = item.etapaCiclo === 'TP2_BATIDO' || item.precoAtual >= tp2;

              return (
                <div
                  key={item.ticker}
                  className={`bg-white rounded-xl p-3.5 sm:p-4 transition-all border-2 flex flex-col justify-between shadow-2xs ${
                    isInvalidado
                      ? 'border-rose-400 bg-rose-50/20'
                      : isFinalizada || isTp2Batido
                      ? 'border-emerald-400 bg-gradient-to-r from-emerald-50/30 via-white to-white'
                      : isTp1Batido
                      ? 'border-teal-400 bg-teal-50/20'
                      : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header do Card com Ticker, Score e Badge da Etapa */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-base sm:text-lg font-black font-mono tracking-tight text-slate-900">
                          {item.ticker}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">
                          {item.nome}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                          item.mercado === 'B3'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                        }`}>
                          {item.mercado}
                        </span>
                        {item.score !== undefined && (
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded font-mono border ${
                            item.classe === 'A'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-blue-50 text-blue-800 border-blue-300'
                          }`}>
                            Score {item.score} ({item.classe})
                          </span>
                        )}
                        {item.statusGraham === 'confirmada' && (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded uppercase bg-emerald-700 text-white shadow-2xs">
                            CONFIRMADA
                          </span>
                        )}
                      </div>

                      {/* Badge da Etapa do Ciclo de Vida Graham */}
                      <div className="text-right shrink-0">
                        {isInvalidado ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-xs uppercase">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Stop Invalidação (-20%)</span>
                          </div>
                        ) : isFinalizada || isTp2Batido ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-xs uppercase">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>TP2 Concluído (+{item.lucroRealizadoPercent || ganhoAtualPct.toFixed(1)}%)</span>
                          </div>
                        ) : isTp1Batido ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-700 text-white text-xs font-bold uppercase shadow-2xs">
                            <Target className="w-3 h-3 text-teal-300" />
                            <span>TP1 Batido (Realizar 50% / Stop 0x0)</span>
                          </div>
                        ) : item.precoAtual > item.precoTetoZona ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 text-xs font-bold uppercase">
                            <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
                            <span>A Caminho do TP1</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold uppercase">
                            <span>● Na Zona de Compra</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bloco de Preços em 4 Colunas: Entrada/Stop ➔ Atual ➔ TP1 ➔ TP2 */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-center">
                      
                      {/* 1. Preço de Entrada & Stop */}
                      <div className="relative group bg-white p-1.5 rounded-lg border border-slate-200">
                        <span className="block text-[8.5px] font-sans font-bold text-slate-500 uppercase">
                          Entrada ({item.dataEntrada})
                        </span>
                        
                        {editingTicker === item.ticker ? (
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <input
                              type="text"
                              value={editPriceVal}
                              onChange={(e) => setEditPriceVal(e.target.value)}
                              className="w-16 text-xs text-center border border-blue-600 bg-white rounded px-1 py-0.5 font-bold outline-none"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEntryPrice(item.ticker)}
                            />
                            <button
                              onClick={() => handleSaveEntryPrice(item.ticker)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingTicker(null)}
                              className="p-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-800">
                              {moedaSimbolo} {item.precoEntrada.toFixed(2)}
                            </span>
                            {!isFinalizada && (
                              <button
                                onClick={() => {
                                  setEditingTicker(item.ticker);
                                  setEditPriceVal(item.precoEntrada.toFixed(2));
                                }}
                                className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer"
                                title="Editar preço de entrada real"
                              >
                                <Pencil className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        )}
                        <span className="text-[9px] text-rose-700 font-bold block mt-0.5">
                          Stop: {moedaSimbolo} {precoStop.toFixed(2)} (-20%)
                        </span>
                      </div>

                      {/* 2. Cotação Atual / Saída */}
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                        <span className="block text-[8.5px] font-sans font-bold text-slate-500 uppercase">
                          {isFinalizada ? `Saída (${item.dataFinalizacao})` : 'Cotação Atual'}
                        </span>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                          {moedaSimbolo} {(isFinalizada ? item.precoFinalizacao || item.precoAtual : item.precoAtual).toFixed(2)}
                        </div>
                        <div className={`text-[10px] font-bold mt-0.5 ${
                          (isFinalizada ? item.lucroRealizadoPercent || 0 : ganhoAtualPct) >= 0
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}>
                          {isFinalizada
                            ? `+${item.lucroRealizadoPercent}% Realizado`
                            : `${ganhoAtualPct >= 0 ? '+' : ''}${ganhoAtualPct.toFixed(1)}% flutuante`}
                        </div>
                      </div>

                      {/* 3. Alvo TP1 (Preço Justo Conservador) */}
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                        <span className="block text-[8.5px] font-sans font-bold text-teal-700 uppercase">
                          Alvo TP1 (Preço Justo)
                        </span>
                        <div className="text-xs sm:text-sm font-black text-teal-950 mt-0.5">
                          {moedaSimbolo} {tp1.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-semibold text-teal-700 mt-0.5">
                          {item.precoAtual >= tp1 ? '✓ 100% Alcançado!' : `Falta ${moedaSimbolo} ${upsideRestanteTp1.toFixed(2)} (+${upsideTp1Pct.toFixed(0)}%)`}
                        </div>
                      </div>

                      {/* 4. Alvo TP2 (Estendido / Média Fórmulas) */}
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                        <span className="block text-[8.5px] font-sans font-bold text-indigo-700 uppercase">
                          Alvo TP2 (Estendido)
                        </span>
                        <div className="text-xs sm:text-sm font-black text-indigo-950 mt-0.5">
                          {moedaSimbolo} {tp2.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-semibold text-indigo-700 mt-0.5">
                          {item.precoAtual >= tp2 ? '✓ 100% Alcançado!' : `Falta ${moedaSimbolo} ${upsideRestanteTp2.toFixed(2)} (+${upsideTp2Pct.toFixed(0)}%)`}
                        </div>
                      </div>

                    </div>

                    {/* Progressos em 2 Réguas Visuais (TP1 e TP2) */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      
                      {/* Régua Estágio 1: Entrada ➔ TP1 */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-700 flex items-center gap-1 text-[11px]">
                            <Target className="w-3 h-3 text-teal-600" />
                            <span>Estágio 1 (Entrada ➔ TP1):</span>
                          </span>
                          <span className={`font-mono font-bold ${progressoTp1Pct >= 100 ? 'text-teal-700' : 'text-slate-800'}`}>
                            {progressoTp1Pct >= 100 ? '✓ Concluído' : `${progressoTp1Pct.toFixed(0)}%`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-teal-500"
                            style={{ width: `${progressoTp1Pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Régua Estágio 2: TP1 ➔ TP2 */}
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-700 flex items-center gap-1 text-[11px]">
                            <Flame className="w-3 h-3 text-indigo-600" />
                            <span>Estágio 2 (TP1 ➔ TP2):</span>
                          </span>
                          <span className={`font-mono font-bold ${progressoTp2Pct >= 100 ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {progressoTp2Pct >= 100 ? '✓ Concluído' : `${progressoTp2Pct.toFixed(0)}%`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-teal-500 to-indigo-600"
                            style={{ width: `${progressoTp2Pct}%` }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Nota de Acompanhamento / Diretriz Tática */}
                    {item.nota && (
                      <p className="mt-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-300 leading-relaxed font-sans shadow-2xs">
                        💡 <strong>Diretriz Tática:</strong> {item.nota}
                      </p>
                    )}
                  </div>

                  {/* Ações Inferiores do Card */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                      <span>{item.diasDecorridos ? `${item.diasDecorridos} dias em carteira` : 'Recente'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectTickerForValuation(item.ticker);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Ver no Terminal de Valuation"
                      >
                        <span>Abrir Valuation</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {isFinalizada ? (
                        <button
                          onClick={() => handleReopen(item.ticker)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                          title="Reabrir ciclo de metas"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Reabrir</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFinalize(item.ticker)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Finalizar posição com cotação atual"
                        >
                          <Check className="w-3 h-3" />
                          <span>Finalizar Posição</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.ticker)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remover da esteira"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER                                             */}
        {/* ======================================================== */}
        <div className="py-2.5 px-3.5 sm:p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-slate-900">{trackedList.length}</span>
            <span className="text-[11px] sm:text-xs">ativos no ciclo de vida</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs text-xs flex items-center gap-1.5"
            title="Voltar / Fechar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Voltar / Fechar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
