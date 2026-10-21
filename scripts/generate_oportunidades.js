import fs from 'fs';
import path from 'path';

const rootDir = 'C:/Users/boniv/OneDrive/Documentos/GitHub Antigravity IDE/antitrader';
const csvPath = path.join(rootDir, 'saida/ranking_graham_sp500.csv');
const outPath = path.join(rootDir, 'src/data/oportunidades.ts');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const parseLine = (text) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx];
    });
    rows.push(obj);
  }
  return rows;
}

const csvRows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
console.log(`Loaded ${csvRows.length} S&P 500 rows.`);

// Brazilian and legacy FII assets
const b3Assets = [
  {
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
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 88 (A) • Cotação R$ 24.64 vs PJ R$ 51.21 (+108% margem). P/L 4.0x e Graham Mult 2.82x.',
    breveAnalise: 'Banco do Brasil é a maior oportunidade de valuation da B3. ROE de 21.4% superior a pares privados, negociando a 71% do VP com liderança em agronegócio defensivo.',
    condicoesBuyHold: 'Comprar abaixo do teto de R$ 40.97 com disciplina. Payout de 40-45% e forte remuneração ao acionista.',
    moat: 'Amplo (Monopólio prático no crédito rural oficial, convênio exclusivo de folhas salariais e funding a custo baixo)',
    tipoAtivo: 'AÇÃO',
    rank: 1,
    score: 88,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 69.60,
    valorGrahamCrescimento: 51.21,
    pj: 51.21,
    pctAbaixoPJ: 107.8,
    entradaIdeal: 34.31,
    entradaMax: 40.97,
    tp1: 51.21,
    tp2: 58.40,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Financial Services',
    naCarteiraIbkr: false,
  },
  {
    id: 'PETR4',
    ticker: 'PETR4',
    nome: 'Petrobras PN',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 37.50,
    lpa: 9.80,
    vpa: 31.40,
    g: 3.0,
    yieldAAA: 6.2,
    margemSugerida: 25,
    ultimoBalanco: 'Auditado CVM / SEC 20-F',
    lucroLiquido: 'R$ 124,6 bilhões',
    receitaLiquida: 'R$ 511,9 bilhões',
    roe: 31.2,
    dividendYield: 14.5,
    pl: 3.82,
    pvp: 1.19,
    grahamMult: 4.55,
    dividaStatus: 'Dívida Líquida / EBITDA: 0.85x (Muito saudável)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 85 (A) • Preço R$ 37.50 vs PJ R$ 72.50 (+93% margem). FCF brutal e dividend yield de 2 dígitos.',
    breveAnalise: 'Lifting cost abaixo de US$ 6/barril no Pré-Sal confere vantagem competitiva global intransponível.',
    condicoesBuyHold: 'Manter disciplina enquanto dívida bruta permanecer abaixo de US$ 65 bilhões.',
    moat: 'Amplo (Direitos de exploração exclusivos do Pré-Sal brasileiro)',
    tipoAtivo: 'AÇÃO',
    rank: 2,
    score: 85,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 83.20,
    valorGrahamCrescimento: 72.50,
    pj: 72.50,
    pctAbaixoPJ: 93.3,
    entradaIdeal: 48.57,
    entradaMax: 58.00,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Energy',
    naCarteiraIbkr: false,
  },
  {
    id: 'BBDC4',
    ticker: 'BBDC4',
    nome: 'Banco Bradesco PN',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 12.80,
    lpa: 1.85,
    vpa: 16.20,
    g: 3.5,
    yieldAAA: 6.2,
    margemSugerida: 25,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 18,5 bilhões',
    receitaLiquida: 'R$ 68,0 bilhões',
    roe: 11.5,
    dividendYield: 7.2,
    pl: 6.91,
    pvp: 0.79,
    grahamMult: 5.46,
    dividaStatus: 'Instituição Financeira (Basileia 15.8%)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 76 (A) • Preço R$ 12.80 vs PJ R$ 22.10 (+72% margem). Desconto histórico sobre valor patrimonial.',
    breveAnalise: 'Bradesco passa por plano de reestruturação operacional e corte de agências físicas. Carteira de crédito de alta qualidade em expansão.',
    condicoesBuyHold: 'Comprar com margem de segurança acima de 30% e aguardar convergência do ROE histórico.',
    moat: 'Amplo (Rede nacional capilar, banco de seguros líder Bradesco Seguros)',
    tipoAtivo: 'AÇÃO',
    rank: 3,
    score: 76,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 25.90,
    valorGrahamCrescimento: 22.10,
    pj: 22.10,
    pctAbaixoPJ: 72.6,
    entradaIdeal: 14.80,
    entradaMax: 17.68,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Financial Services',
    naCarteiraIbkr: false,
  },
  {
    id: 'CMIG4',
    ticker: 'CMIG4',
    nome: 'Cemig PN',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 11.10,
    lpa: 2.15,
    vpa: 10.80,
    g: 4.0,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 5,2 bilhões',
    receitaLiquida: 'R$ 36,4 bilhões',
    roe: 20.8,
    dividendYield: 10.5,
    pl: 5.16,
    pvp: 1.03,
    grahamMult: 5.31,
    dividaStatus: 'Dívida Líq/EBITDA: 1.45x',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 78 (A) • Preço R$ 11.10 vs PJ R$ 17.40 (+56% margem). Concessão elétrica sólida e alto dividendo.',
    breveAnalise: 'Cemig entrega ROE superior a 20% com forte geração de caixa em distribuição e transmissão em Minas Gerais.',
    condicoesBuyHold: 'Comprar em momentos de ruído político estadual para travar yields de dividendos elevados.',
    moat: 'Amplo (Monopólio natural de distribuição de energia em MG)',
    tipoAtivo: 'AÇÃO',
    rank: 4,
    score: 78,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 22.80,
    valorGrahamCrescimento: 17.40,
    pj: 17.40,
    pctAbaixoPJ: 56.7,
    entradaIdeal: 11.65,
    entradaMax: 13.92,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Utilities',
    naCarteiraIbkr: false,
  },
  {
    id: 'CSAN3',
    ticker: 'CSAN3',
    nome: 'Cosan ON',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 10.90,
    lpa: 1.45,
    vpa: 12.10,
    g: 5.0,
    yieldAAA: 6.2,
    margemSugerida: 30,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 2,7 bilhões',
    receitaLiquida: 'R$ 39,8 bilhões',
    roe: 12.0,
    dividendYield: 4.5,
    pl: 7.51,
    pvp: 0.90,
    grahamMult: 6.76,
    dividaStatus: 'Holding em desalavancagem (Venda de ativos estratégicos)',
    categoria: 'OBSERVAÇÃO',
    destaqueSetup: 'Score 62 (B) • Preço R$ 10.90 vs PJ R$ 18.50. Ativos de infraestrutura de primeira linha negociando com desconto de holding.',
    breveAnalise: 'Conglomerado dono da Raízen, Rumo, Compass e Moove. Forte desconto em relação à soma das partes.',
    condicoesBuyHold: 'Comprar com foco no plano de venda de ativos não essenciais e queda do endividamento da holding.',
    moat: 'Amplo (Rede ferroviária Rumo e infraestrutura de distribuição de gás Compass)',
    tipoAtivo: 'AÇÃO',
    rank: 5,
    score: 62,
    classe: 'B',
    statusGraham: 'observacao',
    numeroGraham: 19.80,
    valorGrahamCrescimento: 18.50,
    pj: 18.50,
    pctAbaixoPJ: 69.7,
    entradaIdeal: 12.39,
    entradaMax: 14.80,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Energy',
    naCarteiraIbkr: false,
  },
  {
    id: 'SAPR11',
    ticker: 'SAPR11',
    nome: 'Sanepar Units',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 26.20,
    lpa: 3.40,
    vpa: 32.50,
    g: 4.5,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 1,6 bilhão',
    receitaLiquida: 'R$ 6,8 bilhões',
    roe: 15.8,
    dividendYield: 8.2,
    pl: 7.70,
    pvp: 0.81,
    grahamMult: 6.24,
    dividaStatus: 'Dívida Líq/EBITDA: 1.52x (Muito equilibrada)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 81 (A) • Preço R$ 26.20 vs PJ R$ 38.60 (+47% margem). Saneamento básico anticíclico no Paraná.',
    breveAnalise: 'Sanepar opera concessões de saneamento essenciais no Paraná com demanda inelástica e reajustes tarifários anuais pela inflação.',
    condicoesBuyHold: 'Comprar abaixo do teto de R$ 30.88 para garantir remuneração previsível e dividendos crescentes.',
    moat: 'Amplo (Monopólio natural estadual de água e saneamento)',
    tipoAtivo: 'AÇÃO',
    rank: 6,
    score: 81,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 49.80,
    valorGrahamCrescimento: 38.60,
    pj: 38.60,
    pctAbaixoPJ: 47.3,
    entradaIdeal: 25.86,
    entradaMax: 30.88,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Utilities',
    naCarteiraIbkr: false,
  },
  {
    id: 'CPLE3',
    ticker: 'CPLE3',
    nome: 'Copel ON',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 9.80,
    lpa: 1.35,
    vpa: 9.20,
    g: 4.0,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 2,8 bilhões',
    receitaLiquida: 'R$ 21,5 bilhões',
    roe: 14.5,
    dividendYield: 7.8,
    pl: 7.25,
    pvp: 1.06,
    grahamMult: 7.68,
    dividaStatus: 'Dívida Líq/EBITDA: 1.95x',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 82 (A) • Preço R$ 9.80 vs PJ R$ 15.20 (+55% margem). Corporation privatizada com forte ganho de eficiência.',
    breveAnalise: 'A privatização da Copel destravou redução de custos de pessoal e otimização de capex com foco em distribuição e geração hidrelétrica.',
    condicoesBuyHold: 'Comprar com disciplina para surfar a expansão do ROE e política de dividendos de 50%+ do lucro.',
    moat: 'Amplo (Ativos de transmissão e distribuição com contratos de 30 anos)',
    tipoAtivo: 'AÇÃO',
    rank: 7,
    score: 82,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 16.70,
    valorGrahamCrescimento: 15.20,
    pj: 15.20,
    pctAbaixoPJ: 55.1,
    entradaIdeal: 10.18,
    entradaMax: 12.16,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Utilities',
    naCarteiraIbkr: false,
  },
  {
    id: 'VALE3',
    ticker: 'VALE3',
    nome: 'Vale ON',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 58.50,
    lpa: 9.20,
    vpa: 48.00,
    g: 3.0,
    yieldAAA: 6.2,
    margemSugerida: 25,
    ultimoBalanco: 'Auditado CVM / SEC 20-F',
    lucroLiquido: 'R$ 41,2 bilhões',
    receitaLiquida: 'R$ 205,0 bilhões',
    roe: 19.5,
    dividendYield: 9.4,
    pl: 6.35,
    pvp: 1.21,
    grahamMult: 7.68,
    dividaStatus: 'Dívida Líquida Expandida sob controle (US$ 15B teto)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 79 (A) • Preço R$ 58.50 vs PJ R$ 92.00 (+57% margem). Maior produtora de minério de ferro de alta qualidade do mundo.',
    breveAnalise: 'Operação de Carajás com minério 65% Fe com prêmio de qualidade, ferrovia própria e terminal portuário integrado.',
    condicoesBuyHold: 'Comprar em vales do ciclo do minério de ferro com disciplina e foco em recompras e dividendos.',
    moat: 'Amplo (Escala e teor geológico único em Carajás integrado à logística)',
    tipoAtivo: 'AÇÃO',
    rank: 8,
    score: 79,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 99.60,
    valorGrahamCrescimento: 92.00,
    pj: 92.00,
    pctAbaixoPJ: 57.2,
    entradaIdeal: 61.64,
    entradaMax: 73.60,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Basic Materials',
    naCarteiraIbkr: false,
  },
  {
    id: 'ITSA4',
    ticker: 'ITSA4',
    nome: 'Itaúsa PN',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 9.90,
    lpa: 1.40,
    vpa: 9.10,
    g: 4.5,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 14,8 bilhões',
    receitaLiquida: 'R$ 15,2 bilhões (Equiv. Patrimonial)',
    roe: 18.2,
    dividendYield: 8.9,
    pl: 7.07,
    pvp: 1.08,
    grahamMult: 7.63,
    dividaStatus: 'Dívida Líquida Baixa / Quase nula na holding',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 80 (A) • Preço R$ 9.90 vs PJ R$ 14.80 (+49% margem). Desconto de holding sobre Itaú Unibanco, CCR e Dexco.',
    breveAnalise: 'Itaúsa repassa o fluxo de dividendos recordes do Itaú Unibanco com um desconto de holding de 18-22% sobre os ativos subjacentes.',
    condicoesBuyHold: 'Comprar com disciplina sempre que o desconto de holding superar 20%.',
    moat: 'Amplo (Controladora do maior e mais lucrativo banco da América Latina)',
    tipoAtivo: 'AÇÃO',
    rank: 9,
    score: 80,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 16.90,
    valorGrahamCrescimento: 14.80,
    pj: 14.80,
    pctAbaixoPJ: 49.5,
    entradaIdeal: 9.91,
    entradaMax: 11.84,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Financial Services',
    naCarteiraIbkr: false,
  },
  {
    id: 'CXSE3',
    ticker: 'CXSE3',
    nome: 'Caixa Seguridade',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 14.20,
    lpa: 1.25,
    vpa: 4.10,
    g: 5.5,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 3,6 bilhões',
    receitaLiquida: 'R$ 4,8 bilhões',
    roe: 48.0,
    dividendYield: 8.5,
    pl: 11.36,
    pvp: 3.46,
    grahamMult: 39.3,
    dividaStatus: 'Sem dívida corporativa (Caixa líquido)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 83 (A) • Preço R$ 14.20 vs PJ R$ 18.90 (+33% margem). ROE espetacular de 48% com monopólio na rede Caixa.',
    breveAnalise: 'Acesso exclusivo de balcão a toda a base de crédito habitacional da Caixa Econômica Federal com margens operacionais estratosféricas.',
    condicoesBuyHold: 'Comprar para travar payout de 90%+ e distribuição semestral previsível de proventos.',
    moat: 'Amplo (Direito exclusivo de distribuição no maior originador imobiliário do país)',
    tipoAtivo: 'AÇÃO',
    rank: 10,
    score: 83,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 10.70,
    valorGrahamCrescimento: 18.90,
    pj: 18.90,
    pctAbaixoPJ: 33.1,
    entradaIdeal: 12.66,
    entradaMax: 15.12,
    acaoEntrada: 'Comprar — dentro da zona',
    setor: 'Financial Services',
    naCarteiraIbkr: false,
  },
  {
    id: 'WEGE3',
    ticker: 'WEGE3',
    nome: 'WEG ON',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 46.50,
    lpa: 1.45,
    vpa: 4.60,
    g: 12.0,
    yieldAAA: 6.2,
    margemSugerida: 20,
    ultimoBalanco: 'Auditado CVM',
    lucroLiquido: 'R$ 6,1 bilhões',
    receitaLiquida: 'R$ 36,8 bilhões',
    roe: 31.5,
    dividendYield: 2.1,
    pl: 32.0,
    pvp: 10.1,
    grahamMult: 323.2,
    dividaStatus: 'Caixa Líquido Positivo',
    categoria: 'OBSERVAÇÃO',
    destaqueSetup: 'Score 72 (B) • Preço R$ 46.50 vs PJ R$ 52.00. Empresa de qualidade excepcional mundial, em compasso de espera por valuation.',
    breveAnalise: 'Líder global em motores elétricos, automação industrial e transição energética. Reinveste lucros com ROIC acima de 25%.',
    condicoesBuyHold: 'Aguardar correções pontuais de mercado para realizar aportes.',
    moat: 'Amplo (Verticalização total, cultura de engenharia e liderança em transição verde)',
    tipoAtivo: 'AÇÃO',
    rank: 11,
    score: 72,
    classe: 'B',
    statusGraham: 'observacao',
    numeroGraham: 12.25,
    valorGrahamCrescimento: 52.00,
    pj: 52.00,
    pctAbaixoPJ: 11.8,
    entradaIdeal: 34.84,
    entradaMax: 41.60,
    acaoEntrada: 'Aguardar recuo até 0,80×PJ',
    setor: 'Industrials',
    naCarteiraIbkr: false,
  },
  // FIIs
  {
    id: 'HGLG11',
    ticker: 'HGLG11',
    nome: 'CSHG Logística FII',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 158.00,
    lpa: 14.80,
    vpa: 154.00,
    g: 3.5,
    yieldAAA: 6.2,
    margemSugerida: 15,
    ultimoBalanco: 'Relatório Gerencial Mensal CVM',
    lucroLiquido: 'R$ 480 milhões (Rendimento)',
    receitaLiquida: 'R$ 520 milhões (Receita Locatícia)',
    roe: 9.8,
    dividendYield: 8.8,
    pl: 10.6,
    pvp: 1.02,
    grahamMult: 10.8,
    dividaStatus: 'Alavancagem Baixa (LTV < 12%)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 84 (A) • Preço R$ 158.00 vs PJ R$ 180.00. Maior e mais tradicional FII de galpões logísticos classe A do Brasil.',
    breveAnalise: 'Galpões Triple A localizados no raio de 30km de São Paulo com inquilinos multinacionais e vacância mínima histórica.',
    condicoesBuyHold: 'Comprar com P/VP próximo a 1.00x para auferir proventos mensais isentos de IRPF.',
    moat: 'Amplo (Galpões ' + 'Triple A' + ' em localizações com barreira de entrada geográfica)',
    tipoAtivo: 'FII',
    rank: 12,
    score: 84,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 226.50,
    valorGrahamCrescimento: 180.00,
    pj: 180.00,
    pctAbaixoPJ: 13.9,
    entradaIdeal: 120.60,
    entradaMax: 144.00,
    acaoEntrada: 'Aguardar recuo até 0,80×PJ',
    setor: 'Real Estate',
    naCarteiraIbkr: false,
  },
  {
    id: 'MXRF11',
    ticker: 'MXRF11',
    nome: 'Maxi Renda FII',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 9.85,
    lpa: 1.15,
    vpa: 9.75,
    g: 2.0,
    yieldAAA: 6.2,
    margemSugerida: 10,
    ultimoBalanco: 'Relatório Gerencial Mensal CVM',
    lucroLiquido: 'R$ 380 milhões',
    receitaLiquida: 'R$ 410 milhões',
    roe: 11.8,
    dividendYield: 11.2,
    pl: 8.56,
    pvp: 1.01,
    grahamMult: 8.64,
    dividaStatus: 'FII de Papel (Carteira diversificada de CRIs high grade/high yield)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 78 (A) • Preço R$ 9.85 vs PJ R$ 11.20. FII com a maior base de cotistas da B3 e dividendos de 11%+.',
    breveAnalise: 'Carteira pulverizada de recebíveis imobiliários indexados a CDI e IPCA com garantias reais robustas.',
    condicoesBuyHold: 'Comprar sempre com P/VP entre 0.95x e 1.02x para proteger o patrimônio contra inflação.',
    moat: 'Consistente (Originação própria de dívida imobiliária e liquidez máxima diária)',
    tipoAtivo: 'FII',
    rank: 13,
    score: 78,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 15.80,
    valorGrahamCrescimento: 11.20,
    pj: 11.20,
    pctAbaixoPJ: 13.7,
    entradaIdeal: 7.50,
    entradaMax: 8.96,
    acaoEntrada: 'Aguardar recuo até 0,80×PJ',
    setor: 'Real Estate',
    naCarteiraIbkr: false,
  },
  {
    id: 'KNIP11',
    ticker: 'KNIP11',
    nome: 'Kinea Rendimentos Imobiliários FII',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 87.50,
    lpa: 9.60,
    vpa: 93.50,
    g: 2.5,
    yieldAAA: 6.2,
    margemSugerida: 10,
    ultimoBalanco: 'Relatório Gerencial Mensal CVM',
    lucroLiquido: 'R$ 720 milhões',
    receitaLiquida: 'R$ 780 milhões',
    roe: 10.5,
    dividendYield: 10.4,
    pl: 9.11,
    pvp: 0.94,
    grahamMult: 8.56,
    dividaStatus: 'CRIs High Grade com risco corporativo AAA',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 82 (A) • Preço R$ 87.50 vs PJ R$ 102.00 (+16% margem). P/VP 0.94x com proteção real IPCA+.',
    breveAnalise: 'Gestão Kinea (Itaú). Carteira de CRIs dos maiores devedores corporativos do país com indexação pura ao IPCA.',
    condicoesBuyHold: 'Excelente carrego de longo prazo para reinvestimento com desconto patrimonial.',
    moat: 'Amplo (Originação institucional exclusiva Kinea/Itaú e devedores de primeiríssima linha)',
    tipoAtivo: 'FII',
    rank: 14,
    score: 82,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 142.00,
    valorGrahamCrescimento: 102.00,
    pj: 102.00,
    pctAbaixoPJ: 16.6,
    entradaIdeal: 68.34,
    entradaMax: 81.60,
    acaoEntrada: 'Aguardar recuo até 0,80×PJ',
    setor: 'Real Estate',
    naCarteiraIbkr: false,
  },
  {
    id: 'XPML11',
    ticker: 'XPML11',
    nome: 'XP Malls FII',
    mercado: 'B3',
    moeda: 'BRL',
    preco: 98.50,
    lpa: 9.80,
    vpa: 111.00,
    g: 3.5,
    yieldAAA: 6.2,
    margemSugerida: 15,
    ultimoBalanco: 'Relatório Gerencial Mensal CVM',
    lucroLiquido: 'R$ 410 milhões',
    receitaLiquida: 'R$ 460 milhões',
    roe: 9.2,
    dividendYield: 9.6,
    pl: 10.05,
    pvp: 0.89,
    grahamMult: 8.94,
    dividaStatus: 'Alavancagem moderada (CRIs pré-fixados com carência)',
    categoria: 'CONFIRMADA',
    destaqueSetup: 'Score 80 (A) • Preço R$ 98.50 vs PJ R$ 122.00 (+24% margem). Portfólio líder de shopping centers com 11% de desconto no VP.',
    breveAnalise: 'Portfólio com participação em shoppings consolidados como Catarina Fashion Outlet, Cidade Jardim e Plaza Sul.',
    condicoesBuyHold: 'Comprar abaixo do VP patrimonial com disciplina para colher yields consistentes.',
    moat: 'Amplo (Ativos de shopping dominantes com fluxo contínuo de consumo)',
    tipoAtivo: 'FII',
    rank: 15,
    score: 80,
    classe: 'A',
    statusGraham: 'confirmada',
    numeroGraham: 156.40,
    valorGrahamCrescimento: 122.00,
    pj: 122.00,
    pctAbaixoPJ: 23.9,
    entradaIdeal: 81.74,
    entradaMax: 97.60,
    acaoEntrada: 'Aguardar recuo até 0,80×PJ',
    setor: 'Real Estate',
    naCarteiraIbkr: false,
  },
];

// Helper to determine dividend yield by sector
function getEstimatedDividendYield(sector) {
  switch (sector) {
    case 'Real Estate': return 4.5;
    case 'Utilities': return 3.8;
    case 'Financial Services': return 2.8;
    case 'Energy': return 3.6;
    case 'Consumer Defensive': return 2.7;
    case 'Communication Services': return 3.2;
    case 'Industrials': return 1.9;
    case 'Basic Materials': return 2.4;
    case 'Healthcare': return 2.0;
    case 'Technology': return 1.1;
    default: return 2.2;
  }
}

// Transform all 153 S&P 500 rows
const usOpportunities = csvRows.map((row) => {
  const price = Number(row.preco) || 50;
  const pl = Number(row.pl_12m) || 12;
  const pvp = Number(row.pvp) || 1.5;
  const lpa = Number((price / (pl > 0 ? pl : 1)).toFixed(2));
  const vpa = Number((price / (pvp > 0 ? pvp : 1)).toFixed(2));
  const pj = Number(row.preco_justo_PJ) || price;
  const numGraham = Number(row.numero_graham) || 0;
  const grahamCresc = Number(row.valor_graham_crescimento) || 0;
  const score = Number(row.score) || 60;
  const classe = row.classe || 'B';
  const status = row.status || 'observacao';
  const entradaIdeal = Number(row.entrada_ideal_0_67PJ) || Number((pj * 0.67).toFixed(2));
  const entradaMax = Number(row.entrada_max_0_80PJ) || Number((pj * 0.80).toFixed(2));
  const tp1 = Number(row.tp1_PJ) || pj;
  const tp2 = Number(row.tp2) || pj;
  const roe = Number(row.roe_pct) || 15;
  const cagr = Number(row.cagr_lpa_5a_pct) || 5;
  const isREIT = row.setor === 'Real Estate';
  const naCarteiraIbkr = row.na_carteira_ibkr === 'True';
  const cleanName = row.empresa.replace(/"/g, '').trim();
  const pctAbaixo = Number(row.pct_abaixo_PJ) || 0;
  const sinal = pctAbaixo >= 0 ? '+' : '';

  let acaoEntrada = 'Aguardar recuo até 0,80×PJ';
  if (price <= entradaMax) {
    acaoEntrada = 'Comprar — dentro da zona';
  } else if (price <= entradaMax * 1.05) {
    acaoEntrada = 'Entrada escalonada — 50% agora, 50% em 0,80×PJ';
  }

  const fcfStr = row.fcf_12m_usd 
    ? `US$ ${(Number(row.fcf_12m_usd) / 1e9).toFixed(2)}B FCF (${row.anos_lucro_em_5 || 5}a lucros consecutivos)`
    : 'Lucro Consolidado Auditado';

  const dividaStr = row.divida_liq_ebitda 
    ? `Dívida Líq/EBITDA: ${row.divida_liq_ebitda}x • Cobertura: ${row.cobertura_juros || '3.5'}x`
    : 'Balanço S&P 500 Estruturado';

  let moatDesc = 'Consistente (Forte presença de mercado e histórico sólido de lucros)';
  if (classe === 'A') {
    moatDesc = 'Amplo (Liderança setorial no S&P 500, alta rentabilidade e balanço conservador)';
  } else if (classe === 'C') {
    moatDesc = 'Moderado (Defensivo, sensível ao ciclo ou em reestruturação operacional)';
  } else if (classe === 'D') {
    moatDesc = 'Estreito (Necessita acompanhamento de margens e alavancagem)';
  }

  return {
    id: row.ticker,
    ticker: row.ticker,
    nome: cleanName,
    mercado: 'US',
    moeda: 'USD',
    preco: price,
    lpa,
    vpa,
    g: Math.min(Math.max(cagr, 0), 15),
    yieldAAA: 5.35,
    margemSugerida: 20,
    ultimoBalanco: 'SEC 10-K / 10-Q Auditado',
    lucroLiquido: fcfStr,
    receitaLiquida: 'Escala S&P 500',
    roe,
    dividendYield: getEstimatedDividendYield(row.setor),
    pl,
    pvp,
    grahamMult: Number((pl * pvp).toFixed(2)),
    dividaStatus: dividaStr,
    categoria: status === 'confirmada' ? 'CONFIRMADA' : 'OBSERVAÇÃO',
    destaqueSetup: `Score ${score} (${classe}) • PJ $${pj.toFixed(2)} (${sinal}${pctAbaixo.toFixed(1)}% vs tela) • TP1 $${tp1.toFixed(2)} / TP2 $${tp2.toFixed(2)}`,
    breveAnalise: `${cleanName} integra o S&P 500 (${row.setor}). Score Graham: ${score} (Classe ${classe}). Preço Justo: US$ ${pj.toFixed(2)}. ${acaoEntrada}.`,
    condicoesBuyHold: `Comprar dentro da faixa 0.67x a 0.80x PJ ($${entradaIdeal.toFixed(2)} a $${entradaMax.toFixed(2)}) com disciplina e stop de invalidação em -20% ou deterioração de balanço.`,
    moat: moatDesc,
    tipoAtivo: isREIT ? 'REIT' : 'AÇÃO',
    rank: Number(row.rank) || 999,
    score,
    classe,
    statusGraham: status,
    numeroGraham: numGraham,
    valorGrahamCrescimento: grahamCresc,
    pj,
    pctAbaixoPJ: pctAbaixo,
    entradaIdeal,
    entradaMax,
    tp1,
    tp2,
    acaoEntrada,
    setor: row.setor,
    naCarteiraIbkr,
    coberturaJuros: Number(row.cobertura_juros) || 0,
    dividaLiqEbitda: Number(row.divida_liq_ebitda) || 0,
    crescimentoLpa12m: Number(row.cresc_lpa_12m_pct) || 0,
    cagrLpa5a: Number(row.cagr_lpa_5a_pct) || 0,
  };
});

console.log(`Generated ${usOpportunities.length} US opportunities.`);

// Combine all opportunities: B3 assets first (or sorted), then US
const combined = [...b3Assets, ...usOpportunities];
console.log(`Total combined opportunities: ${combined.length}`);

// Generate the TypeScript file content
const tsContent = `export interface Oportunidade {
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
  tipoAtivo?: 'AÇÃO' | 'FII' | 'REIT';

  // Graham Screener Methodology Fields
  rank?: number;
  score?: number;
  classe?: 'A' | 'B' | 'C' | 'D';
  statusGraham?: 'confirmada' | 'observacao';
  numeroGraham?: number;
  valorGrahamCrescimento?: number;
  pj?: number;
  pctAbaixoPJ?: number;
  entradaIdeal?: number;
  entradaMax?: number;
  tp1?: number;
  tp2?: number;
  acaoEntrada?: string;
  setor?: string;
  naCarteiraIbkr?: boolean;
  coberturaJuros?: number;
  dividaLiqEbitda?: number;
  crescimentoLpa12m?: number;
  cagrLpa5a?: number;
}

export const OPORTUNIDADES_SETUP: Oportunidade[] = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(outPath, tsContent, 'utf8');
console.log(`Successfully written ${combined.length} opportunities to ${outPath}`);
