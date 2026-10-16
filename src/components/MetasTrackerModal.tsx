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
  DollarSign,
  Activity,
  Percent,
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

  if (!isOpen) return null;

  // Salvar novo preço de entrada
  const handleSaveEntryPrice = (ticker: string) => {
    const val = parseFloat(editPriceVal.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      const updated = updateEntryPrice(trackedList, ticker, val);
      setTrackedList(updated);
    }
    setEditingTicker(null);
    setEditPriceVal('');
  };

  // Finalizar manualmente
  const handleFinalize = (ticker: string) => {
    if (confirm(`Deseja finalizar o acompanhamento de ${ticker} com o preço atual de mercado?`)) {
      const updated = finalizeManually(trackedList, ticker);
      setTrackedList(updated);
    }
  };

  // Reabrir acompanhamento
  const handleReopen = (item: TrackedOpportunity) => {
    const updated = reopenTracking(trackedList, item.ticker, item.precoAtual);
    setTrackedList(updated);
  };

  // Remover da esteira
  const handleRemove = (ticker: string) => {
    if (confirm(`Remover ${ticker} da esteira de acompanhamento?`)) {
      const updated = removeTrackedOpportunity(trackedList, ticker);
      setTrackedList(updated);
    }
  };

  // Resetar para seeds padrão
  const handleReset = () => {
    if (confirm('Restaurar lista de acompanhamento e histórico para os valores padrão de auditoria?')) {
      const reset = resetTrackedOpportunities();
      setTrackedList(reset);
    }
  };

  // Copiar relatório em texto
  const handleCopyReport = () => {
    const ativas = trackedList.filter((i) => i.status === 'EM_ANDAMENTO');
    const finalizadas = trackedList.filter((i) => i.status === 'FINALIZADA');

    let text = `🎯 *ANTITRADER - RELATÓRIO DE METAS & CICLO DE OPORTUNIDADES*\n`;
    text += `Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    text += `📊 *ESTATÍSTICAS CONSOLIDADAS:*\n`;
    text += `• Metas Batidas (Finalizadas): ${stats.totalFinalizadas}\n`;
    text += `• Em Acompanhamento: ${stats.totalAtivas}\n`;
    text += `• Taxa de Acerto: ${stats.taxaAcertoPercent}%\n`;
    text += `• Lucro Médio Realizado: +${stats.lucroMedioRealizadoPercent}%\n`;
    text += `• Tempo Médio até o Alvo: ${stats.tempoMedioDias} dias\n\n`;

    text += `🏆 *METAS BATIDAS (HISTÓRICO CONCLUÍDO):*\n`;
    finalizadas.forEach((f) => {
      text += `• ${f.ticker} (${f.nome}) | Entrada: ${f.moeda === 'BRL' ? 'R$' : '$'} ${f.precoEntrada.toFixed(2)} ➔ Saída: ${f.moeda === 'BRL' ? 'R$' : '$'} ${f.precoFinalizacao?.toFixed(2) || f.precoAtual.toFixed(2)} | Lucro: +${f.lucroRealizadoPercent}% em ${f.diasDecorridos} dias\n`;
    });

    text += `\n🟢 *EM ACOMPANHAMENTO (PROGRESSO ATUAL):*\n`;
    ativas.forEach((a) => {
      const ganhoAtual = ((a.precoAtual - a.precoEntrada) / a.precoEntrada) * 100;
      text += `• ${a.ticker} (${a.nome}) | Entrada: ${a.moeda === 'BRL' ? 'R$' : '$'} ${a.precoEntrada.toFixed(2)} | Atual: ${a.moeda === 'BRL' ? 'R$' : '$'} ${a.precoAtual.toFixed(2)} (${ganhoAtual >= 0 ? '+' : ''}${ganhoAtual.toFixed(1)}%) | Alvo Graham: ${a.moeda === 'BRL' ? 'R$' : '$'} ${a.precoAlvo.toFixed(2)}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* ======================================================== */}
        {/* HEADER DO MODAL                                          */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Acompanhamento de Metas &amp; Ciclo de Valor
                </h2>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full uppercase">
                  Graham Target Engine
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                Monitoramento contínuo de variação da entrada na Zona até o Preço Justo de Graham.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Copiar relatório formatado de metas"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{copiado ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* KPI CARDS (RESUMO QUANTITATIVO)                          */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-[#f8fafc] border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            
            {/* Em Andamento */}
            <div className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs">
              <div className="flex items-center justify-between text-blue-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Em Andamento</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.totalAtivas}
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Ativos na esteira</span>
            </div>

            {/* Metas Batidas */}
            <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-2xs bg-gradient-to-br from-emerald-50/40 to-white">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Metas Batidas</span>
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-extrabold font-mono text-emerald-900 leading-tight">
                {stats.totalFinalizadas}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Objetivo concluído</span>
            </div>

            {/* Taxa de Acerto */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Taxa de Acerto</span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.taxaAcertoPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Nas finalizadas</span>
            </div>

            {/* Lucro Médio Realizado */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Lucro Médio</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-bold font-mono text-emerald-700 leading-tight">
                +{stats.lucroMedioRealizadoPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Por oportunidade</span>
            </div>

            {/* Maior Ganho */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Maior Ganho</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-bold font-mono text-emerald-800 leading-tight">
                +{stats.maiorGanhoPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Recorde Graham</span>
            </div>

            {/* Tempo Médio */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Tempo Médio</span>
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 leading-tight">
                {stats.tempoMedioDias} d
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Até a meta final</span>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* BARRA DE FILTROS & NAVEGAÇÃO ENTRE ABAS                  */}
        {/* ======================================================== */}
        <div className="p-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          
          {/* Sub-abas de Visualização */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-300">
            <button
              onClick={() => setActiveTab('ATIVAS')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ATIVAS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Em Andamento</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === 'ATIVAS' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {stats.totalAtivas}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('FINALIZADAS')}
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'FINALIZADAS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Metas Batidas</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === 'FINALIZADAS' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {stats.totalFinalizadas}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('TODAS')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'TODAS'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Todas ({stats.totalGeral})</span>
            </button>
          </div>

          {/* Filtros de Mercado e Busca */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-300 text-xs">
              {(['TODOS', 'B3', 'US'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFiltroMercado(m)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
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
                className="w-full bg-[#f8fafc] border border-slate-300 text-xs rounded-lg pl-7 pr-2 py-1 outline-none font-medium focus:border-blue-600 focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Restaurar padrão inicial do setup"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* CORPO: LISTA DE CARDS DE ACOMPANHAMENTO                  */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 bg-[#f8fafc]">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
              <Target className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm">Nenhuma oportunidade encontrada nesta categoria.</p>
              <p className="text-xs text-slate-400">
                Conforme os ativos entrarem na Zona de Compra, eles são enfileirados automaticamente aqui!
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isFinalizada = item.status === 'FINALIZADA';
              const moedaSimbolo = item.moeda === 'BRL' ? 'R$' : '$';
              
              // Cálculos de variação e progresso
              const ganhoAtualPct = item.precoEntrada > 0
                ? ((item.precoAtual - item.precoEntrada) / item.precoEntrada) * 100
                : 0;

              const totalDeltaMeta = item.precoAlvo - item.precoEntrada;
              const atualDelta = item.precoAtual - item.precoEntrada;
              const progressoPct = totalDeltaMeta > 0
                ? Math.min(100, Math.max(0, (atualDelta / totalDeltaMeta) * 100))
                : (isFinalizada ? 100 : 0);

              const distanciaRestante = Math.max(0, item.precoAlvo - item.precoAtual);
              const upsideRestantePct = item.precoAtual > 0 ? (distanciaRestante / item.precoAtual) * 100 : 0;

              return (
                <div
                  key={item.ticker}
                  className={`bg-white rounded-xl p-3.5 sm:p-4 transition-all border-2 flex flex-col justify-between shadow-2xs ${
                    isFinalizada
                      ? 'border-emerald-400 bg-gradient-to-r from-emerald-50/30 via-white to-white'
                      : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Header do Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-black font-mono tracking-tight text-slate-900">
                          {item.ticker}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">
                          {item.nome}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                          item.mercado === 'B3'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-indigo-50 text-indigo-900 border-indigo-300'
                        }`}>
                          {item.mercado}
                        </span>
                        {item.origem === 'AUTO_ZONA' && (
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                            Auto
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="text-right shrink-0">
                        {isFinalizada ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-xs uppercase">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Objetivo Atingido</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 text-xs font-bold uppercase">
                            <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
                            <span>Em Acompanhamento</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bloco de Preços: Entrada ➔ Atual ➔ Preço Justo Graham */}
                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-center">
                      
                      {/* Preço de Entrada */}
                      <div className="relative group">
                        <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">
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
                        <span className="text-[9px] text-slate-400 block mt-0.5">Teto: {moedaSimbolo} {item.precoTetoZona.toFixed(2)}</span>
                      </div>

                      {/* Cotação Atual / Saída */}
                      <div>
                        <span className="block text-[9px] font-sans font-bold text-slate-500 uppercase">
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
                            : `${ganhoAtualPct >= 0 ? '+' : ''}${ganhoAtualPct.toFixed(1)}% atual`}
                        </div>
                      </div>

                      {/* Preço Justo Graham (Meta Alvo) */}
                      <div>
                        <span className="block text-[9px] font-sans font-bold text-blue-700 uppercase">
                          Preço Justo Graham
                        </span>
                        <div className="text-xs sm:text-sm font-black text-blue-900 mt-0.5">
                          {moedaSimbolo} {item.precoAlvo.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-semibold text-blue-700 mt-0.5">
                          {isFinalizada ? '100% Alcançado' : `Falta ${moedaSimbolo} ${distanciaRestante.toFixed(2)} (+${upsideRestantePct.toFixed(0)}%)`}
                        </div>
                      </div>

                    </div>

                    {/* Barra de Progresso Dinâmica até o Preço Justo de Graham */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-blue-600" />
                          <span>Progresso até a Meta de Valor:</span>
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {progressoPct.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFinalizada
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : 'bg-gradient-to-r from-blue-600 to-emerald-500'
                          }`}
                          style={{ width: `${progressoPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Nota de Acompanhamento */}
                    {item.nota && (
                      <p className="mt-2 text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200 leading-relaxed font-sans">
                        💡 {item.nota}
                      </p>
                    )}
                  </div>

                  {/* Ações Inferiores do Card */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                      <span>{item.diasDecorridos ? `${item.diasDecorridos} dias em carteira` : 'Recente'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectTickerForValuation(item.ticker);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Abrir no terminal de valuation e balanço auditado"
                      >
                        <span>Valuation</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {isFinalizada ? (
                        <button
                          onClick={() => handleReopen(item)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reiniciar novo ciclo de monitoramento para este ativo"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-600" />
                          <span>Reabrir Ciclo</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFinalize(item.ticker)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Marcar como finalizada com o preço atual de mercado"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Finalizar Meta</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.ticker)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
        {/* FOOTER DO MODAL                                          */}
        {/* ======================================================== */}
        <div className="p-3 bg-white border-t border-slate-300 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Rastreamento ativo com cotações em tempo real e varredura diária das 19h</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
