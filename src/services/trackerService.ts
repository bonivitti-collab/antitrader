import { Oportunidade } from '../data/oportunidades';
import { TrackedOpportunity, TrackerStats } from '../types/tracker';

const STORAGE_KEY = 'antitrader_lifecycle_tracker_v1';

// Histórico de Oportunidades Concluídas e Ativas para Inicialização
export const SEED_TRACKED_OPPORTUNITIES: TrackedOpportunity[] = [
  // ========================================================
  // HISTÓRICO DE OPORTUNIDADES QUE BATERAM O OBJETIVO (FINALIZADAS)
  // ========================================================
  {
    id: 'SAPR4',
    ticker: 'SAPR4',
    nome: 'Sanepar PN',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '14/01/2026',
    timestampEntrada: new Date('2026-01-14T10:00:00').getTime(),
    precoEntrada: 4.12,
    precoTetoZona: 5.25,
    precoAlvo: 6.48,
    tp1: 6.48,
    tp2: 7.20,
    precoStop: 3.30,
    precoAtual: 6.52,
    status: 'FINALIZADA',
    etapaCiclo: 'TP2_BATIDO',
    dataTp1Atingido: '05/05/2026',
    dataFinalizacao: '18/06/2026',
    timestampFinalizacao: new Date('2026-06-18T16:30:00').getTime(),
    precoFinalizacao: 6.52,
    lucroRealizadoPercent: 58.3,
    diasDecorridos: 155,
    nota: 'Saneamento defensivo de alto dividendo. Atingiu o Preço Justo de Graham com valorização de 58.3%!',
    origem: 'AUTO_ZONA',
    score: 82,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'EGIE3',
    ticker: 'EGIE3',
    nome: 'Engie Brasil Energia',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '08/02/2026',
    timestampEntrada: new Date('2026-02-08T10:00:00').getTime(),
    precoEntrada: 38.10,
    precoTetoZona: 42.50,
    precoAlvo: 49.80,
    tp1: 49.80,
    tp2: 54.00,
    precoStop: 30.48,
    precoAtual: 50.15,
    status: 'FINALIZADA',
    etapaCiclo: 'TP1_BATIDO',
    dataTp1Atingido: '24/07/2026',
    dataFinalizacao: '24/07/2026',
    timestampFinalizacao: new Date('2026-07-24T17:00:00').getTime(),
    precoFinalizacao: 50.15,
    lucroRealizadoPercent: 31.6,
    diasDecorridos: 166,
    nota: 'Geração elétrica com contratos corrigidos por IPCA. Meta Graham TP1 batida em R$ 50,15.',
    origem: 'AUTO_ZONA',
    score: 80,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'AAPL',
    ticker: 'AAPL',
    nome: 'Apple Inc.',
    mercado: 'US',
    moeda: 'USD',
    dataEntrada: '15/03/2026',
    timestampEntrada: new Date('2026-03-15T11:00:00').getTime(),
    precoEntrada: 168.40,
    precoTetoZona: 185.00,
    precoAlvo: 232.00,
    tp1: 232.00,
    tp2: 245.00,
    precoStop: 134.72,
    precoAtual: 234.50,
    status: 'FINALIZADA',
    etapaCiclo: 'TP1_BATIDO',
    dataTp1Atingido: '04/09/2026',
    dataFinalizacao: '04/09/2026',
    timestampFinalizacao: new Date('2026-09-04T17:30:00').getTime(),
    precoFinalizacao: 234.50,
    lucroRealizadoPercent: 39.3,
    diasDecorridos: 173,
    nota: 'Correção de mercado aproveitada na Zona de Compra. Meta de Preço Justo alcançada com +39.3%.',
    origem: 'AUTO_ZONA',
    score: 85,
    classe: 'A',
    statusGraham: 'confirmada',
  },

  // ========================================================
  // OPORTUNIDADES ATIVAS EM ACOMPANHAMENTO (NA ZONA & RUMO AOS ALVOS)
  // ========================================================
  {
    id: 'BBAS3',
    ticker: 'BBAS3',
    nome: 'Banco do Brasil',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '10/08/2026',
    timestampEntrada: new Date('2026-08-10T10:00:00').getTime(),
    precoEntrada: 23.90,
    precoTetoZona: 40.97,
    precoAlvo: 51.21,
    tp1: 51.21,
    tp2: 58.40,
    precoStop: 19.12,
    precoAtual: 24.64,
    status: 'EM_ANDAMENTO',
    etapaCiclo: 'NA_ZONA',
    nota: 'Dentro da Zona de Compra com 108% de margem. Alvo TP1 em R$ 51,21 e TP2 em R$ 58,40. Stop: R$ 19,12.',
    origem: 'AUTO_ZONA',
    score: 88,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'PETR4',
    ticker: 'PETR4',
    nome: 'Petrobras PN',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '01/09/2026',
    timestampEntrada: new Date('2026-09-01T10:00:00').getTime(),
    precoEntrada: 36.80,
    precoTetoZona: 58.00,
    precoAlvo: 72.50,
    tp1: 72.50,
    tp2: 85.00,
    precoStop: 29.44,
    precoAtual: 37.50,
    status: 'EM_ANDAMENTO',
    etapaCiclo: 'NA_ZONA',
    nota: 'Geração massiva de FCF e dividendos. Rumo ao TP1 de R$ 72,50 e TP2 de R$ 85,00. Stop: R$ 29,44.',
    origem: 'AUTO_ZONA',
    score: 85,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'ALL',
    ticker: 'ALL',
    nome: 'The Allstate Corporation',
    mercado: 'US',
    moeda: 'USD',
    dataEntrada: '20/10/2026',
    timestampEntrada: new Date('2026-10-20T11:00:00').getTime(),
    precoEntrada: 249.91,
    precoTetoZona: 310.01,
    precoAlvo: 387.51,
    tp1: 387.51,
    tp2: 887.99,
    precoStop: 199.93,
    precoAtual: 249.91,
    status: 'EM_ANDAMENTO',
    etapaCiclo: 'NA_ZONA',
    nota: 'Top 1 Graham S&P 500 (Score 95 - Classe A). Dentro da faixa de entrada ($249 vs teto $310). Alvo TP1: $387.51 | TP2: $887.99.',
    origem: 'AUTO_ZONA',
    score: 95,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'FIS',
    ticker: 'FIS',
    nome: 'Fidelity National Information Services',
    mercado: 'US',
    moeda: 'USD',
    dataEntrada: '20/10/2026',
    timestampEntrada: new Date('2026-10-20T11:00:00').getTime(),
    precoEntrada: 36.43,
    precoTetoZona: 54.08,
    precoAlvo: 67.60,
    tp1: 67.60,
    tp2: 124.32,
    precoStop: 29.14,
    precoAtual: 36.43,
    status: 'EM_ANDAMENTO',
    etapaCiclo: 'NA_ZONA',
    nota: 'Score 93.6 (Classe A) no setor de Tecnologia. Preço de entrada $36.43 com 85% de margem vs TP1 $67.60.',
    origem: 'AUTO_ZONA',
    score: 93.6,
    classe: 'A',
    statusGraham: 'confirmada',
  },
  {
    id: 'VALE3',
    ticker: 'VALE3',
    nome: 'Vale ON',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '15/09/2026',
    timestampEntrada: new Date('2026-09-15T10:00:00').getTime(),
    precoEntrada: 56.80,
    precoTetoZona: 73.60,
    precoAlvo: 92.00,
    tp1: 92.00,
    tp2: 105.00,
    precoStop: 45.44,
    precoAtual: 58.50,
    status: 'EM_ANDAMENTO',
    etapaCiclo: 'NA_ZONA',
    nota: 'Minério de alta pureza 65% Fe. Alvo TP1 de R$ 92,00 (+57%) e TP2 de R$ 105,00. Stop: R$ 45,44.',
    origem: 'AUTO_ZONA',
    score: 79,
    classe: 'A',
    statusGraham: 'confirmada',
  },
];

// Carregar oportunidades salvas no navegador
export function loadTrackedOpportunities(): TrackedOpportunity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTrackedOpportunities(SEED_TRACKED_OPPORTUNITIES);
      return SEED_TRACKED_OPPORTUNITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Migração suave para garantir campos da metodologia Graham 1974
      return parsed.map((item: any) => {
        const tp1 = item.tp1 || item.precoAlvo;
        const tp2 = item.tp2 || Number((tp1 * 1.35).toFixed(2));
        const precoStop = item.precoStop || Number((item.precoEntrada * 0.80).toFixed(2));
        let etapaCiclo = item.etapaCiclo;
        if (!etapaCiclo) {
          if (item.status === 'FINALIZADA') {
            etapaCiclo = 'TP2_BATIDO';
          } else if (item.precoAtual <= precoStop) {
            etapaCiclo = 'INVALIDADO';
          } else if (item.precoAtual >= tp2) {
            etapaCiclo = 'TP2_BATIDO';
          } else if (item.precoAtual >= tp1) {
            etapaCiclo = 'TP1_BATIDO';
          } else if (item.precoAtual > item.precoTetoZona) {
            etapaCiclo = 'RUMO_TP1';
          } else {
            etapaCiclo = 'NA_ZONA';
          }
        }
        return {
          ...item,
          tp1,
          tp2,
          precoStop,
          etapaCiclo,
        };
      });
    }
  } catch (err) {
    console.warn('[TrackerService] Erro ao carregar localStorage, usando seeds:', err);
  }
  return SEED_TRACKED_OPPORTUNITIES;
}

// Salvar no localStorage
export function saveTrackedOpportunities(list: TrackedOpportunity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('[TrackerService] Erro ao salvar no localStorage:', err);
  }
}

// Cálculo do Preço Justo Graham e Teto da Zona de Compra
export function calcularZonaGraham(op: {
  lpa: number;
  vpa: number;
  g: number;
  yieldAAA: number;
  margemSugerida?: number;
  tp1?: number;
  tp2?: number;
  pj?: number;
  entradaMax?: number;
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

// Sincronizar dados em tempo real com as cotações do pregão e esteira de oportunidades
export function syncTrackedWithOpportunities(
  currentTracked: TrackedOpportunity[],
  liveOpportunities: Oportunidade[]
): {
  updatedList: TrackedOpportunity[];
  newlyCompleted: TrackedOpportunity[];
  newlyEnrolledCount: number;
} {
  const updatedMap = new Map<string, TrackedOpportunity>(
    currentTracked.map((item) => [item.ticker, { ...item }])
  );

  const newlyCompleted: TrackedOpportunity[] = [];
  let newlyEnrolledCount = 0;
  const now = Date.now();
  const hojeStr = new Date().toLocaleDateString('pt-BR');

  // Processar cada ativo recebido das cotações em tempo real
  liveOpportunities.forEach((op) => {
    const { fair, zona } = calcularZonaGraham(op);
    const inBuyZone = op.preco <= zona && zona > 0;
    const existing = updatedMap.get(op.ticker);
    const tp1 = op.tp1 || fair;
    const tp2 = op.tp2 || Number((tp1 * 1.35).toFixed(2));

    if (existing) {
      // Atualiza cotação em tempo real e parâmetros
      existing.precoAtual = op.preco;
      existing.precoTetoZona = Number(zona.toFixed(2));
      existing.precoAlvo = Number(fair.toFixed(2));
      existing.tp1 = Number(tp1.toFixed(2));
      existing.tp2 = Number(tp2.toFixed(2));
      existing.precoStop = Number((existing.precoEntrada * 0.80).toFixed(2));
      if (op.score) existing.score = op.score;
      if (op.classe) existing.classe = op.classe;
      if (op.statusGraham) existing.statusGraham = op.statusGraham;

      const dias = Math.max(
        1,
        Math.round((now - existing.timestampEntrada) / (1000 * 60 * 60 * 24))
      );
      existing.diasDecorridos = dias;

      // Avaliação de Estágio do Ciclo de Vida:
      if (existing.status === 'EM_ANDAMENTO') {
        if (op.preco <= existing.precoStop) {
          existing.etapaCiclo = 'INVALIDADO';
          existing.nota = `⚠️ Invalidação de risco: Fechamento abaixo de ${existing.moeda === 'BRL' ? 'R$' : '$'} ${existing.precoStop.toFixed(2)} (-20% da entrada). Reavaliar saída defensiva de capital.`;
        } else if (op.preco >= existing.tp2) {
          // GATILHO TP2: Alvo Estendido Concluído!
          existing.etapaCiclo = 'TP2_BATIDO';
          existing.status = 'FINALIZADA';
          existing.dataFinalizacao = hojeStr;
          existing.timestampFinalizacao = now;
          existing.precoFinalizacao = op.preco;
          const lucroPct = ((op.preco - existing.precoEntrada) / existing.precoEntrada) * 100;
          existing.lucroRealizadoPercent = Number(lucroPct.toFixed(1));
          existing.nota = `🏆 Alvo estendido TP2 atingido em ${existing.moeda === 'BRL' ? 'R$' : '$'} ${op.preco.toFixed(2)}! Ciclo Graham 100% finalizado com +${existing.lucroRealizadoPercent}% de valorização.`;
          newlyCompleted.push(existing);
        } else if (op.preco >= existing.tp1) {
          // GATILHO TP1: Meta de Preço Justo Batida!
          existing.etapaCiclo = 'TP1_BATIDO';
          if (!existing.dataTp1Atingido) {
            existing.dataTp1Atingido = hojeStr;
          }
          existing.nota = `🎯 TP1 Preço Justo atingido em ${existing.moeda === 'BRL' ? 'R$' : '$'} ${op.preco.toFixed(2)}! Realizar lucro de 50% da posição e ajustar stop loss da metade restante para ${existing.moeda === 'BRL' ? 'R$' : '$'} ${existing.precoEntrada.toFixed(2)} (breakeven).`;
        } else if (op.preco > existing.precoTetoZona) {
          existing.etapaCiclo = 'RUMO_TP1';
          existing.nota = `Posição em valorização a caminho do Preço Justo TP1 (${existing.moeda === 'BRL' ? 'R$' : '$'} ${existing.tp1.toFixed(2)}). Carregar com paciência (horizonte 2 a 3 anos).`;
        } else {
          existing.etapaCiclo = 'NA_ZONA';
        }
      }
    } else if (inBuyZone) {
      // NOVO ATIVO ENTROU NA ZONA DE COMPRA: Cadastro automático na esteira!
      const precoStop = Number((op.preco * 0.80).toFixed(2));
      const newItem: TrackedOpportunity = {
        id: op.ticker,
        ticker: op.ticker,
        nome: op.nome,
        mercado: op.mercado,
        moeda: op.moeda,
        dataEntrada: hojeStr,
        timestampEntrada: now,
        precoEntrada: op.preco,
        precoTetoZona: Number(zona.toFixed(2)),
        precoAlvo: Number(fair.toFixed(2)),
        tp1: Number(tp1.toFixed(2)),
        tp2: Number(tp2.toFixed(2)),
        precoStop,
        precoAtual: op.preco,
        status: 'EM_ANDAMENTO',
        etapaCiclo: 'NA_ZONA',
        diasDecorridos: 1,
        nota: `Entrada detectada na Zona de Compra (${op.moeda === 'BRL' ? 'R$' : '$'} ${op.preco.toFixed(2)} <= ${op.moeda === 'BRL' ? 'R$' : '$'} ${zona.toFixed(2)}). Alvo TP1: ${op.moeda === 'BRL' ? 'R$' : '$'} ${tp1.toFixed(2)} | TP2: ${op.moeda === 'BRL' ? 'R$' : '$'} ${tp2.toFixed(2)}. Stop: ${op.moeda === 'BRL' ? 'R$' : '$'} ${precoStop.toFixed(2)}.`,
        origem: 'AUTO_ZONA',
        score: op.score,
        classe: op.classe,
        statusGraham: op.statusGraham,
      };
      updatedMap.set(op.ticker, newItem);
      newlyEnrolledCount++;
    }
  });

  const updatedList = Array.from(updatedMap.values());
  saveTrackedOpportunities(updatedList);

  return {
    updatedList,
    newlyCompleted,
    newlyEnrolledCount,
  };
}

// Atualizar preço de entrada manualmente (caso o investidor tenha comprado por outro valor)
export function updateEntryPrice(
  list: TrackedOpportunity[],
  ticker: string,
  newPrice: number
): TrackedOpportunity[] {
  const updated = list.map((item) => {
    if (item.ticker === ticker) {
      const precoStop = Number((newPrice * 0.80).toFixed(2));
      return {
        ...item,
        precoEntrada: newPrice,
        precoStop,
      };
    }
    return item;
  });
  saveTrackedOpportunities(updated);
  return updated;
}

// Finalizar manualmente (ex: se o investidor vendeu antes da meta ou atingiu seu teto pessoal)
export function finalizeManually(
  list: TrackedOpportunity[],
  ticker: string,
  exitPrice?: number
): TrackedOpportunity[] {
  const now = Date.now();
  const hojeStr = new Date().toLocaleDateString('pt-BR');

  const updated = list.map((item) => {
    if (item.ticker === ticker) {
      const finalPrice = exitPrice || item.precoAtual;
      const lucroPct = ((finalPrice - item.precoEntrada) / item.precoEntrada) * 100;
      return {
        ...item,
        status: 'FINALIZADA' as const,
        etapaCiclo: 'TP2_BATIDO' as const,
        dataFinalizacao: hojeStr,
        timestampFinalizacao: now,
        precoFinalizacao: finalPrice,
        lucroRealizadoPercent: Number(lucroPct.toFixed(1)),
        nota: `Posição finalizada manualmente com lucro realizado de +${lucroPct.toFixed(1)}%.`,
      };
    }
    return item;
  });
  saveTrackedOpportunities(updated);
  return updated;
}

// Reabrir acompanhamento de uma oportunidade
export function reopenTracking(
  list: TrackedOpportunity[],
  ticker: string
): TrackedOpportunity[] {
  const now = Date.now();
  const hojeStr = new Date().toLocaleDateString('pt-BR');

  const updated = list.map((item) => {
    if (item.ticker === ticker) {
      return {
        ...item,
        status: 'EM_ANDAMENTO' as const,
        etapaCiclo: 'NA_ZONA' as const,
        dataEntrada: hojeStr,
        timestampEntrada: now,
        dataFinalizacao: undefined,
        timestampFinalizacao: undefined,
        precoFinalizacao: undefined,
        lucroRealizadoPercent: undefined,
        diasDecorridos: 1,
        nota: 'Novo ciclo de acompanhamento reaberto pelo investidor.',
      };
    }
    return item;
  });
  saveTrackedOpportunities(updated);
  return updated;
}

// Remover oportunidade da esteira
export function removeTrackedOpportunity(
  list: TrackedOpportunity[],
  ticker: string
): TrackedOpportunity[] {
  const updated = list.filter((item) => item.ticker !== ticker);
  saveTrackedOpportunities(updated);
  return updated;
}

// Restaurar seeds padrão
export function resetTrackedOpportunities(): TrackedOpportunity[] {
  saveTrackedOpportunities(SEED_TRACKED_OPPORTUNITIES);
  return SEED_TRACKED_OPPORTUNITIES;
}

// Calcular Estatísticas Gerais (KPIs)
export function calculateTrackerStats(list: TrackedOpportunity[]): TrackerStats {
  const ativas = list.filter((i) => i.status === 'EM_ANDAMENTO');
  const finalizadas = list.filter((i) => i.status === 'FINALIZADA');

  const lucrosFinalizadas = finalizadas
    .map((i) => i.lucroRealizadoPercent ?? 0)
    .filter((v) => typeof v === 'number');

  const totalComLucro = lucrosFinalizadas.filter((v) => v > 0).length;
  const taxaAcertoPercent = finalizadas.length > 0
    ? Number(((totalComLucro / finalizadas.length) * 100).toFixed(1))
    : 100;

  const lucroMedioRealizadoPercent = lucrosFinalizadas.length > 0
    ? Number((lucrosFinalizadas.reduce((acc, v) => acc + v, 0) / lucrosFinalizadas.length).toFixed(1))
    : 0;

  const diasFinalizadas = finalizadas
    .map((i) => i.diasDecorridos ?? 0)
    .filter((d) => d > 0);
  const tempoMedioDias = diasFinalizadas.length > 0
    ? Math.round(diasFinalizadas.reduce((acc, v) => acc + v, 0) / diasFinalizadas.length)
    : 0;

  const maiorGanhoPercent = lucrosFinalizadas.length > 0
    ? Math.max(...lucrosFinalizadas)
    : 0;

  const totalTp1Batidos = list.filter((i) => i.etapaCiclo === 'TP1_BATIDO' || i.etapaCiclo === 'RUMO_TP2' || i.etapaCiclo === 'TP2_BATIDO').length;

  const lucrosPotenciaisAtivas = ativas.map((i) => {
    const target = i.tp1 || i.precoAlvo;
    if (i.precoEntrada > 0 && target > 0) {
      return ((target - i.precoEntrada) / i.precoEntrada) * 100;
    }
    return 0;
  });

  const lucroPotencialMedioAtivas = lucrosPotenciaisAtivas.length > 0
    ? Number((lucrosPotenciaisAtivas.reduce((acc, v) => acc + v, 0) / lucrosPotenciaisAtivas.length).toFixed(1))
    : 0;

  return {
    totalAtivas: ativas.length,
    totalFinalizadas: finalizadas.length,
    totalGeral: list.length,
    totalTp1Batidos,
    taxaAcertoPercent,
    lucroMedioRealizadoPercent,
    lucroPotencialMedioAtivas,
    tempoMedioDias,
    maiorGanhoPercent,
  };
}
