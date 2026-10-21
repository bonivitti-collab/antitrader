export interface TrackedOpportunity {
  id: string; // Ticker da oportunidade (ex: 'BBAS3')
  ticker: string;
  nome: string;
  mercado: 'B3' | 'US';
  moeda: 'BRL' | 'USD';
  dataEntrada: string; // Data em que entrou na Zona de Compra (ex: '15/08/2026')
  timestampEntrada: number;
  precoEntrada: number; // Preço de entrada na Zona de Compra
  precoTetoZona: number; // Preço teto da Zona de Compra com margem de segurança (0.80x PJ)
  precoAlvo: number; // TP1: Preço Justo de Graham (Preço Alvo de Saída Conservador)
  tp1: number; // Preço Justo PJ = min(Graham, Crescimento)
  tp2?: number; // Alvo Estendido = Média das Fórmulas
  precoStop?: number; // Invalidação por stop de -20% sobre a entrada
  precoAtual: number; // Cotação de mercado em tempo real
  status: 'EM_ANDAMENTO' | 'FINALIZADA';
  etapaCiclo: 'NA_ZONA' | 'RUMO_TP1' | 'TP1_BATIDO' | 'RUMO_TP2' | 'TP2_BATIDO' | 'INVALIDADO';
  dataTp1Atingido?: string;
  dataFinalizacao?: string; // Data em que atingiu a meta final
  timestampFinalizacao?: number;
  precoFinalizacao?: number;
  lucroRealizadoPercent?: number; // Lucro percentual final ao atingir o objetivo
  diasDecorridos?: number; // Dias corridos entre entrada e saída
  nota?: string;
  origem: 'AUTO_ZONA' | 'MANUAL';
  score?: number;
  classe?: 'A' | 'B' | 'C' | 'D';
  statusGraham?: 'confirmada' | 'observacao';
}

export interface TrackerStats {
  totalAtivas: number;
  totalFinalizadas: number;
  totalGeral: number;
  totalTp1Batidos: number;
  taxaAcertoPercent: number; // % das finalizadas que atingiram com lucro
  lucroMedioRealizadoPercent: number;
  lucroPotencialMedioAtivas: number;
  tempoMedioDias: number;
  maiorGanhoPercent: number;
}
