export interface TrackedOpportunity {
  id: string; // Ticker da oportunidade (ex: 'BBAS3')
  ticker: string;
  nome: string;
  mercado: 'B3' | 'US';
  moeda: 'BRL' | 'USD';
  dataEntrada: string; // Data em que entrou na Zona de Compra (ex: '15/08/2026')
  timestampEntrada: number;
  precoEntrada: number; // Preço de entrada na Zona de Compra
  precoTetoZona: number; // Preço teto da Zona de Compra com margem de segurança
  precoAlvo: number; // Preço Justo de Graham (Preço Alvo de Saída)
  precoAtual: number; // Cotação de mercado em tempo real
  status: 'EM_ANDAMENTO' | 'FINALIZADA';
  dataFinalizacao?: string; // Data em que atingiu o Preço Justo Graham
  timestampFinalizacao?: number;
  precoFinalizacao?: number;
  lucroRealizadoPercent?: number; // Lucro percentual final ao atingir o objetivo
  diasDecorridos?: number; // Dias corridos entre entrada e saída
  nota?: string;
  origem: 'AUTO_ZONA' | 'MANUAL';
}

export interface TrackerStats {
  totalAtivas: number;
  totalFinalizadas: number;
  totalGeral: number;
  taxaAcertoPercent: number; // % das finalizadas que atingiram com lucro
  lucroMedioRealizadoPercent: number;
  lucroPotencialMedioAtivas: number;
  tempoMedioDias: number;
  maiorGanhoPercent: number;
}
