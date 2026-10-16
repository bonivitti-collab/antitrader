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
    precoAtual: 6.52,
    status: 'FINALIZADA',
    dataFinalizacao: '18/06/2026',
    timestampFinalizacao: new Date('2026-06-18T16:30:00').getTime(),
    precoFinalizacao: 6.52,
    lucroRealizadoPercent: 58.3,
    diasDecorridos: 155,
    nota: 'Saneamento defensivo de alto dividendo. Atingiu o Preço Justo de Graham com valorização de 58.3%!',
    origem: 'AUTO_ZONA',
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
    precoAtual: 50.15,
    status: 'FINALIZADA',
    dataFinalizacao: '24/07/2026',
    timestampFinalizacao: new Date('2026-07-24T17:00:00').getTime(),
    precoFinalizacao: 50.15,
    lucroRealizadoPercent: 31.6,
    diasDecorridos: 166,
    nota: 'Geração elétrica com contratos corrigidos por IPCA. Meta Graham batida em R$ 50,15.',
    origem: 'AUTO_ZONA',
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
    precoAtual: 234.50,
    status: 'FINALIZADA',
    dataFinalizacao: '04/09/2026',
    timestampFinalizacao: new Date('2026-09-04T17:30:00').getTime(),
    precoFinalizacao: 234.50,
    lucroRealizadoPercent: 39.3,
    diasDecorridos: 173,
    nota: 'Correção de mercado aproveitada na Zona de Compra. Meta de Preço Justo alcançada com +39.3%.',
    origem: 'AUTO_ZONA',
  },

  // ========================================================
  // OPORTUNIDADES ATIVAS EM ACOMPANHAMENTO (NA ZONA)
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
    precoTetoZona: 51.21,
    precoAlvo: 73.15,
    precoAtual: 24.64,
    status: 'EM_ANDAMENTO',
    nota: 'Entrada na Zona de Compra com 108% de margem e ROE superior a 21%. Caminhando para a meta.',
    origem: 'AUTO_ZONA',
  },
  {
    id: 'PETR4',
    ticker: 'PETR4',
    nome: 'Petrobras PN',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '01/09/2026',
    timestampEntrada: new Date('2026-09-01T10:00:00').getTime(),
    precoEntrada: 52.40,
    precoTetoZona: 66.86,
    precoAlvo: 95.52,
    precoAtual: 55.93,
    status: 'EM_ANDAMENTO',
    nota: 'Geração massiva de caixa livre e dividendos. Alvo Graham em R$ 95,52.',
    origem: 'AUTO_ZONA',
  },
  {
    id: 'PFE',
    ticker: 'PFE',
    nome: 'Pfizer Inc.',
    mercado: 'US',
    moeda: 'USD',
    dataEntrada: '20/08/2026',
    timestampEntrada: new Date('2026-08-20T11:00:00').getTime(),
    precoEntrada: 27.50,
    precoTetoZona: 38.68,
    precoAlvo: 51.58,
    precoAtual: 28.28,
    status: 'EM_ANDAMENTO',
    nota: 'Preço descontado em mínimas históricas com pipeline oncológico. Preço Justo em $51.58.',
    origem: 'AUTO_ZONA',
  },
  {
    id: 'T',
    ticker: 'T',
    nome: 'AT&T Inc.',
    mercado: 'US',
    moeda: 'USD',
    dataEntrada: '05/09/2026',
    timestampEntrada: new Date('2026-09-05T11:00:00').getTime(),
    precoEntrada: 20.80,
    precoTetoZona: 27.70,
    precoAlvo: 36.93,
    precoAtual: 22.18,
    status: 'EM_ANDAMENTO',
    nota: 'Telecom líder de cash flow e desalavancagem.',
    origem: 'AUTO_ZONA',
  },
  {
    id: 'VALE3',
    ticker: 'VALE3',
    nome: 'Vale S.A.',
    mercado: 'B3',
    moeda: 'BRL',
    dataEntrada: '15/09/2026',
    timestampEntrada: new Date('2026-09-15T10:00:00').getTime(),
    precoEntrada: 64.20,
    precoTetoZona: 70.36,
    precoAlvo: 100.51,
    precoAtual: 67.85,
    status: 'EM_ANDAMENTO',
    nota: 'Minério de ferro de alta pureza e forte remuneração ao acionista.',
    origem: 'AUTO_ZONA',
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
      return parsed;
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
export function calcularZonaGraham(op: { lpa: number; vpa: number; g: number; yieldAAA: number; margemSugerida?: number }) {
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
  return { fair, zona };
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

  // 1. Processar cada ativo recebido das cotações em tempo real
  liveOpportunities.forEach((op) => {
    const { fair, zona } = calcularZonaGraham(op);
    const inBuyZone = op.preco <= zona && zona > 0;
    const existing = updatedMap.get(op.ticker);

    if (existing) {
      // Atualiza cotação em tempo real e parâmetros de Graham
      existing.precoAtual = op.preco;
      existing.precoTetoZona = Number(zona.toFixed(2));
      existing.precoAlvo = Number(fair.toFixed(2));

      // Se ainda estiver em andamento, verifica se atingiu o Preço Justo de Graham!
      if (existing.status === 'EM_ANDAMENTO') {
        const dias = Math.max(
          1,
          Math.round((now - existing.timestampEntrada) / (1000 * 60 * 60 * 24))
        );
        existing.diasDecorridos = dias;

        // GATILHO DE META: Atingiu ou superou o Preço Justo Graham!
        if (op.preco >= existing.precoAlvo && existing.precoAlvo > 0) {
          existing.status = 'FINALIZADA';
          existing.dataFinalizacao = hojeStr;
          existing.timestampFinalizacao = now;
          existing.precoFinalizacao = op.preco;
          const lucroPct = ((op.preco - existing.precoEntrada) / existing.precoEntrada) * 100;
          existing.lucroRealizadoPercent = Number(lucroPct.toFixed(1));
          existing.nota = `Meta atingida! Preço alcançou ${existing.moeda === 'BRL' ? 'R$' : '$'} ${op.preco.toFixed(2)} superando o Preço Justo Graham de ${existing.moeda === 'BRL' ? 'R$' : '$'} ${existing.precoAlvo.toFixed(2)}.`;
          newlyCompleted.push(existing);
        }
      }
    } else if (inBuyZone) {
      // NOVO ATIVO ENTROU NA ZONA DE COMPRA: Cadastro automático na esteira!
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
        precoAtual: op.preco,
        status: 'EM_ANDAMENTO',
        diasDecorridos: 1,
        nota: `Entrada automática detectada na Zona de Compra (Cotação ${op.moeda === 'BRL' ? 'R$' : '$'} ${op.preco.toFixed(2)} <= Teto ${op.moeda === 'BRL' ? 'R$' : '$'} ${zona.toFixed(2)}).`,
        origem: 'AUTO_ZONA',
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
      return {
        ...item,
        precoEntrada: newPrice,
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
      const precoFinal = exitPrice !== undefined ? exitPrice : item.precoAtual;
      const lucroPct = ((precoFinal - item.precoEntrada) / item.precoEntrada) * 100;
      const dias = Math.max(1, Math.round((now - item.timestampEntrada) / (1000 * 60 * 60 * 24)));

      return {
        ...item,
        status: 'FINALIZADA' as const,
        dataFinalizacao: hojeStr,
        timestampFinalizacao: now,
        precoFinalizacao: precoFinal,
        lucroRealizadoPercent: Number(lucroPct.toFixed(1)),
        diasDecorridos: dias,
        nota: `Finalizado pelo investidor a ${item.moeda === 'BRL' ? 'R$' : '$'} ${precoFinal.toFixed(2)}.`,
      };
    }
    return item;
  });
  saveTrackedOpportunities(updated);
  return updated;
}

// Reabrir acompanhamento para monitorar novo ciclo
export function reopenTracking(
  list: TrackedOpportunity[],
  ticker: string,
  currentPrice: number
): TrackedOpportunity[] {
  const now = Date.now();
  const hojeStr = new Date().toLocaleDateString('pt-BR');

  const updated = list.map((item) => {
    if (item.ticker === ticker) {
      return {
        ...item,
        status: 'EM_ANDAMENTO' as const,
        dataEntrada: hojeStr,
        timestampEntrada: now,
        precoEntrada: currentPrice,
        precoAtual: currentPrice,
        dataFinalizacao: undefined,
        timestampFinalizacao: undefined,
        precoFinalizacao: undefined,
        lucroRealizadoPercent: undefined,
        diasDecorridos: 1,
        nota: 'Novo ciclo de acompanhamento iniciado.',
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

  const lucrosPotenciaisAtivas = ativas.map((i) => {
    if (i.precoEntrada > 0 && i.precoAlvo > 0) {
      return ((i.precoAlvo - i.precoEntrada) / i.precoEntrada) * 100;
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
    taxaAcertoPercent,
    lucroMedioRealizadoPercent,
    lucroPotencialMedioAtivas,
    tempoMedioDias,
    maiorGanhoPercent,
  };
}
