export interface UniverseAsset {
  ticker: string;
  nome: string;
  mercado: 'B3' | 'US';
  tipo: 'AÇÃO' | 'FII' | 'REIT';
  setor?: string;
}

// 1. TOP 54 ATIVOS DA B3
export const UNIVERSE_B3_TOP50: UniverseAsset[] = [
  {
    "ticker": "PETR4",
    "nome": "Petrobras PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Gás"
  },
  {
    "ticker": "PETR3",
    "nome": "Petrobras ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Gás"
  },
  {
    "ticker": "VALE3",
    "nome": "Vale ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Mineração e Siderurgia"
  },
  {
    "ticker": "ITUB4",
    "nome": "Itaú Unibanco PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Bancos"
  },
  {
    "ticker": "BBDC4",
    "nome": "Banco Bradesco PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Bancos"
  },
  {
    "ticker": "BBDC3",
    "nome": "Banco Bradesco ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Bancos"
  },
  {
    "ticker": "BBAS3",
    "nome": "Banco do Brasil ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Bancos"
  },
  {
    "ticker": "WEGE3",
    "nome": "WEG ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Bens Industriais / Motores"
  },
  {
    "ticker": "ABEV3",
    "nome": "Ambev ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Bebidas e Consumo"
  },
  {
    "ticker": "RENT3",
    "nome": "Localiza Rent a Car ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Locação de Veículos"
  },
  {
    "ticker": "BPAC11",
    "nome": "BTG Pactual Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Banco de Investimento"
  },
  {
    "ticker": "SUZB3",
    "nome": "Suzano ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Papel e Celulose"
  },
  {
    "ticker": "JBSS3",
    "nome": "JBS ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Alimentos / Proteína"
  },
  {
    "ticker": "ITSA4",
    "nome": "Itaúsa PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Holding Financeira"
  },
  {
    "ticker": "GGBR4",
    "nome": "Gerdau PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Siderurgia"
  },
  {
    "ticker": "ELET3",
    "nome": "Eletrobras ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "ELET6",
    "nome": "Eletrobras PNB",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "CSAN3",
    "nome": "Cosan ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Agronegócio e Energia"
  },
  {
    "ticker": "EQTL3",
    "nome": "Equatorial Energia ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "B3SA3",
    "nome": "B3 ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Serviços Financeiros / Bolsa"
  },
  {
    "ticker": "RADL3",
    "nome": "RaiaDrogasil ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Varejo Farmacêutico"
  },
  {
    "ticker": "PRIO3",
    "nome": "PRIO ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Gás Jr"
  },
  {
    "ticker": "VIVT3",
    "nome": "Telefônica Brasil (Vivo) ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Telecomunicações"
  },
  {
    "ticker": "CPLE3",
    "nome": "Copel ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "CPLE6",
    "nome": "Copel PNB",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "CMIG4",
    "nome": "Cemig PN",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "SBSP3",
    "nome": "Sabesp ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Saneamento Básico"
  },
  {
    "ticker": "CCRO3",
    "nome": "CCR ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Concessões Rodoviárias"
  },
  {
    "ticker": "EMBR3",
    "nome": "Embraer ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Aeroespacial e Defesa"
  },
  {
    "ticker": "BRFS3",
    "nome": "BRF ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Alimentos / Proteína"
  },
  {
    "ticker": "LREN3",
    "nome": "Lojas Renner ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Varejo de Moda"
  },
  {
    "ticker": "ENEV3",
    "nome": "Eneva ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Gás e Energia Térmica"
  },
  {
    "ticker": "EGIE3",
    "nome": "Engie Brasil ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Renovável"
  },
  {
    "ticker": "RDOR3",
    "nome": "Rede D'Or São Luiz ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Saúde / Hospitais"
  },
  {
    "ticker": "CSNA3",
    "nome": "CSN ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Siderurgia"
  },
  {
    "ticker": "MGLU3",
    "nome": "Magazine Luiza ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "E-commerce e Varejo"
  },
  {
    "ticker": "TOTS3",
    "nome": "Totvs ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Tecnologia / Software"
  },
  {
    "ticker": "ASAI3",
    "nome": "Assaí Atacadista ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Atacarejo de Alimentos"
  },
  {
    "ticker": "KLBN11",
    "nome": "Klabin Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Papel e Celulose"
  },
  {
    "ticker": "HAPV3",
    "nome": "Hapvida ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Saúde Suplementar"
  },
  {
    "ticker": "VBBR3",
    "nome": "Vibra Energia ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Distribuição de Combustíveis"
  },
  {
    "ticker": "ALOS3",
    "nome": "Allos ON (ex-Aliansce Sonae)",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "CPFE3",
    "nome": "CPFL Energia ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "CYRE3",
    "nome": "Cyrela ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Construção Civil"
  },
  {
    "ticker": "MULT3",
    "nome": "Multiplan ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "TIMS3",
    "nome": "TIM Brasil ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Telecomunicações"
  },
  {
    "ticker": "UGPA3",
    "nome": "Ultrapar ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Combustíveis e Gás"
  },
  {
    "ticker": "CRFB3",
    "nome": "Carrefour Brasil ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Varejo Alimentar"
  },
  {
    "ticker": "ENGI11",
    "nome": "Energisa Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica"
  },
  {
    "ticker": "TAEE11",
    "nome": "Taesa Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Transmissão Elétrica"
  },
  {
    "ticker": "SANB11",
    "nome": "Santander Brasil Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Financeiro / Bancos"
  },
  {
    "ticker": "SAPR11",
    "nome": "Sanepar Unit",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Saneamento Básico"
  },
  {
    "ticker": "CXSE3",
    "nome": "Caixa Seguridade ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Seguros e Previdência"
  },
  {
    "ticker": "BBSE3",
    "nome": "BB Seguridade ON",
    "mercado": "B3",
    "tipo": "AÇÃO",
    "setor": "Seguros e Previdência"
  }
];

// 2. FUNDOS IMOBILIÁRIOS BRASILEIROS (FIIs - B3)
export const UNIVERSE_FIIS_BR: UniverseAsset[] = [
  {
    "ticker": "HGLG11",
    "nome": "CSHG Logística FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística / Galpões Triple A"
  },
  {
    "ticker": "MXRF11",
    "nome": "Maxi Renda FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs Imobiliários"
  },
  {
    "ticker": "XPML11",
    "nome": "XP Malls FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "KNIP11",
    "nome": "Kinea Índice de Preços FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / IPCA+"
  },
  {
    "ticker": "BTLG11",
    "nome": "BTG Pactual Logística FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística e E-commerce"
  },
  {
    "ticker": "VISC11",
    "nome": "Vinci Shopping Centers FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "KNCR11",
    "nome": "Kinea Rendimentos Imobiliários FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CDI+"
  },
  {
    "ticker": "HGRU11",
    "nome": "CSHG Renda Urbana FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Renda Urbana / Varejo"
  },
  {
    "ticker": "XPLG11",
    "nome": "XP Log FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística / Galpões"
  },
  {
    "ticker": "CPTS11",
    "nome": "Capitânia Securities II FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs"
  },
  {
    "ticker": "TRXF11",
    "nome": "TRX Real Estate FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Renda Urbana / Big Retail"
  },
  {
    "ticker": "BRCO11",
    "nome": "Bresco Logística FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística Last-Mile"
  },
  {
    "ticker": "ALZR11",
    "nome": "Alianza Trust Renda Imobiliária FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Contratos Atípicos / Sale & Leaseback"
  },
  {
    "ticker": "RBRR11",
    "nome": "RBR Rendimento High Grade FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs High Grade"
  },
  {
    "ticker": "KNSC11",
    "nome": "Kinea Securities FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs Híbrido"
  },
  {
    "ticker": "VGHF11",
    "nome": "Valora Hedge Fund FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Hedge Fund Imobiliário"
  },
  {
    "ticker": "HGCR11",
    "nome": "CSHG Recebíveis Imobiliários FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs"
  },
  {
    "ticker": "HGBS11",
    "nome": "CSHG Brasil Shopping FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "RBRF11",
    "nome": "RBR Alpha Multiestratégia FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Fundos de Fundos (FOF)"
  },
  {
    "ticker": "TGAR11",
    "nome": "TG Ativo Real FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Desenvolvimento e Loteamentos"
  },
  {
    "ticker": "PVBI11",
    "nome": "VBI Prime Properties FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Lajes Corporativas Prime"
  },
  {
    "ticker": "VINO11",
    "nome": "Vinci Offices FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Lajes Corporativas"
  },
  {
    "ticker": "JSRE11",
    "nome": "JS Real Estate Multigestão FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Híbrido / Lajes e Logística"
  },
  {
    "ticker": "GGRC11",
    "nome": "GGR Covepi Renda FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística e Industrial Atípico"
  },
  {
    "ticker": "MALL11",
    "nome": "Malls Brasil Plural FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Shopping Centers"
  },
  {
    "ticker": "RECR11",
    "nome": "REC Recebíveis Imobiliários FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs"
  },
  {
    "ticker": "MCCI11",
    "nome": "Mauá Capital Recebíveis FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs"
  },
  {
    "ticker": "VRTA11",
    "nome": "Fator Verità FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CRIs"
  },
  {
    "ticker": "RZTR11",
    "nome": "Riza Terrax FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Agronegócio / Terras Agrícolas"
  },
  {
    "ticker": "VGIR11",
    "nome": "Valora RE III FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Papel / CDI+"
  },
  {
    "ticker": "HFOF11",
    "nome": "Hedge Top FOFII 3 FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Fundos de Fundos (FOF)"
  },
  {
    "ticker": "LVBI11",
    "nome": "VBI Logística FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Logística"
  },
  {
    "ticker": "RBRP11",
    "nome": "RBR Properties FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Lajes Corporativas e Renda"
  },
  {
    "ticker": "BCIA11",
    "nome": "Bradesco Carteira Imobiliária Ativa FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Fundos de Fundos (FOF)"
  },
  {
    "ticker": "HSML11",
    "nome": "HSI Malls FII",
    "mercado": "B3",
    "tipo": "FII",
    "setor": "Shopping Centers"
  }
];

// 3. REAL ESTATE INVESTMENT TRUSTS (REITs - EUA)
export const UNIVERSE_REITS_US: UniverseAsset[] = [
  {
    "ticker": "O",
    "nome": "Realty Income Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Comercial Triple Net Lease"
  },
  {
    "ticker": "PLD",
    "nome": "Prologis Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Logística Global e Cadeia de Suprimentos"
  },
  {
    "ticker": "AMT",
    "nome": "American Tower Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Infraestrutura de Telecom / Torres"
  },
  {
    "ticker": "EQIX",
    "nome": "Equinix Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Data Centers e Interconexão"
  },
  {
    "ticker": "PSA",
    "nome": "Public Storage",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Self-Storage"
  },
  {
    "ticker": "SPG",
    "nome": "Simon Property Group",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Shopping Centers e Premium Outlets"
  },
  {
    "ticker": "DLR",
    "nome": "Digital Realty Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Data Centers"
  },
  {
    "ticker": "WELL",
    "nome": "Welltower Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Saúde / Moradia para Idosos"
  },
  {
    "ticker": "VICI",
    "nome": "VICI Properties Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Cassinos, Hotelaria e Entretenimento"
  },
  {
    "ticker": "AVB",
    "nome": "AvalonBay Communities",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial Multifamiliar"
  },
  {
    "ticker": "EQR",
    "nome": "Equity Residential",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial Multifamiliar"
  },
  {
    "ticker": "SBAC",
    "nome": "SBA Communications",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Torres de Telefonia e 5G"
  },
  {
    "ticker": "WY",
    "nome": "Weyerhaeuser Co",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Florestal e Madeira"
  },
  {
    "ticker": "EXR",
    "nome": "Extra Space Storage",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Self-Storage"
  },
  {
    "ticker": "MAA",
    "nome": "Mid-America Apartment",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial Sunbelt"
  },
  {
    "ticker": "ARE",
    "nome": "Alexandria Real Estate",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Laboratórios de Ciências da Vida"
  },
  {
    "ticker": "INVH",
    "nome": "Invitation Homes",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial Casas Unifamiliares"
  },
  {
    "ticker": "ESS",
    "nome": "Essex Property Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial Costa Oeste"
  },
  {
    "ticker": "CPT",
    "nome": "Camden Property Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Residencial"
  },
  {
    "ticker": "KIM",
    "nome": "Kimco Realty Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Centros Comerciais com Supermercados"
  },
  {
    "ticker": "HST",
    "nome": "Host Hotels & Resorts",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Hotéis e Resorts de Luxo"
  },
  {
    "ticker": "BXP",
    "nome": "Boston Properties",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Escritórios Corporativos Prime"
  },
  {
    "ticker": "CUBE",
    "nome": "CubeSmart",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Self-Storage"
  },
  {
    "ticker": "NNN",
    "nome": "NNN REIT Inc (National Retail)",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Varejo Triple Net Lease"
  },
  {
    "ticker": "STAG",
    "nome": "STAG Industrial",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Industrial e Galpões Logísticos"
  },
  {
    "ticker": "FRT",
    "nome": "Federal Realty Investment Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Shopping Centers / Dividend King"
  },
  {
    "ticker": "REG",
    "nome": "Regency Centers Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Centros Comerciais"
  },
  {
    "ticker": "WPC",
    "nome": "W. P. Carey Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Net Lease Diversificado"
  },
  {
    "ticker": "DOC",
    "nome": "Healthpeak Properties",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Instalações de Saúde e Clínicas"
  },
  {
    "ticker": "IRM",
    "nome": "Iron Mountain Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "Custódia de Documentos e Data Centers"
  }
];

// 4. UNIVERSO S&P 500 (504 ATIVOS)
export const UNIVERSE_SP500: UniverseAsset[] = [
  {
    "ticker": "A",
    "nome": "Agilent Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Diagnósticos & Ciências da Vida"
  },
  {
    "ticker": "AAL",
    "nome": "American Airlines Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Companhias Aéreas"
  },
  {
    "ticker": "AAPL",
    "nome": "Apple Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tecnologia / Hardware & Ecossistema"
  },
  {
    "ticker": "ABBV",
    "nome": "AbbVie Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Farmacêutica & Imunologia"
  },
  {
    "ticker": "ABNB",
    "nome": "Airbnb Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hospedagem & Viagens"
  },
  {
    "ticker": "ABT",
    "nome": "Abbott Laboratories",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Dispositivos Médicos & Nutrição"
  },
  {
    "ticker": "ACGL",
    "nome": "Arch Capital Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros e Resseguros"
  },
  {
    "ticker": "ACN",
    "nome": "Accenture plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Consultoria e Tecnologia"
  },
  {
    "ticker": "ADBE",
    "nome": "Adobe Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software Criativo & Nuvem"
  },
  {
    "ticker": "ADI",
    "nome": "Analog Devices",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Semicondutores Analógicos"
  },
  {
    "ticker": "ADM",
    "nome": "Archer-Daniels-Midland",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processamento Agrícola"
  },
  {
    "ticker": "ADP",
    "nome": "Automatic Data Processing",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software de Folha e RH"
  },
  {
    "ticker": "ADSK",
    "nome": "Autodesk Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software CAD e Engenharia"
  },
  {
    "ticker": "AEE",
    "nome": "Ameren Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Utilidade Elétrica e Gás"
  },
  {
    "ticker": "AEP",
    "nome": "American Electric Power",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Utilidade Elétrica"
  },
  {
    "ticker": "AES",
    "nome": "The AES Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Geração e Transmissão de Energia"
  },
  {
    "ticker": "AFL",
    "nome": "Aflac Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Suplementares"
  },
  {
    "ticker": "AIG",
    "nome": "American International Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Globais"
  },
  {
    "ticker": "AIZ",
    "nome": "Assurant Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Especializados"
  },
  {
    "ticker": "AJG",
    "nome": "Arthur J. Gallagher",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corretagem de Seguros"
  },
  {
    "ticker": "AKAM",
    "nome": "Akamai Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "CDN e Cibersegurança"
  },
  {
    "ticker": "ALB",
    "nome": "Albemarle Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lítio e Química Fina"
  },
  {
    "ticker": "ALGN",
    "nome": "Align Technology",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Invisalign & Odontologia"
  },
  {
    "ticker": "ALL",
    "nome": "Allstate Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Patrimoniais"
  },
  {
    "ticker": "ALLE",
    "nome": "Allegion plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fechaduras & Segurança Predial"
  },
  {
    "ticker": "AMAT",
    "nome": "Applied Materials",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Equipamentos para Chips"
  },
  {
    "ticker": "AMCR",
    "nome": "Amcor plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Embalagens Globais"
  },
  {
    "ticker": "AMD",
    "nome": "Advanced Micro Devices",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Semicondutores e GPUs"
  },
  {
    "ticker": "AME",
    "nome": "AMETEK Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Instrumentos Eletrônicos de Precisão"
  },
  {
    "ticker": "AMGN",
    "nome": "Amgen Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Biotecnologia"
  },
  {
    "ticker": "AMP",
    "nome": "Ameriprise Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Patrimônio"
  },
  {
    "ticker": "AMT",
    "nome": "American Tower Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Torres de Telecom"
  },
  {
    "ticker": "AMZN",
    "nome": "Amazon.com Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "E-commerce & AWS"
  },
  {
    "ticker": "ANET",
    "nome": "Arista Networks",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Switches e Redes Nuvem"
  },
  {
    "ticker": "ANSS",
    "nome": "ANSYS Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software de Simulação de Engenharia"
  },
  {
    "ticker": "AON",
    "nome": "Aon plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Consultoria de Risco e Previdência"
  },
  {
    "ticker": "AOS",
    "nome": "A. O. Smith Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Aquecedores de Água"
  },
  {
    "ticker": "APA",
    "nome": "APA Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exploração de Petróleo e Gás"
  },
  {
    "ticker": "APD",
    "nome": "Air Products and Chemicals",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gases Industriais & Hidrogênio"
  },
  {
    "ticker": "APH",
    "nome": "Amphenol Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Conectores e Cabos Ópticos"
  },
  {
    "ticker": "APTV",
    "nome": "Aptiv plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Arquitetura Elétrica Automotiva"
  },
  {
    "ticker": "ARE",
    "nome": "Alexandria Real Estate",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Laboratórios de Biotec"
  },
  {
    "ticker": "ATO",
    "nome": "Atmos Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gás Natural"
  },
  {
    "ticker": "AVB",
    "nome": "AvalonBay Communities",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Apartamentos Residenciais"
  },
  {
    "ticker": "AVGO",
    "nome": "Broadcom Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Semicondutores e Conectividade"
  },
  {
    "ticker": "AWK",
    "nome": "American Water Works",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Água e Saneamento"
  },
  {
    "ticker": "AXON",
    "nome": "Axon Enterprise",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Câmeras Corporais e Tasers"
  },
  {
    "ticker": "AXP",
    "nome": "American Express Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cartões Premium e Viagens"
  },
  {
    "ticker": "AZO",
    "nome": "AutoZone Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Varejo de Autopeças"
  },
  {
    "ticker": "BA",
    "nome": "Boeing Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Aviação Comercial e Militar"
  },
  {
    "ticker": "BAC",
    "nome": "Bank of America",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco Comercial e Investimento"
  },
  {
    "ticker": "BALL",
    "nome": "Ball Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Latas de Alumínio Recicláveis"
  },
  {
    "ticker": "BAX",
    "nome": "Baxter International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Produtos Médicos e Hospitalares"
  },
  {
    "ticker": "BBWI",
    "nome": "Bath & Body Works",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Varejo de Cosméticos e Fragrâncias"
  },
  {
    "ticker": "BBY",
    "nome": "Best Buy Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletrônicos e Informática"
  },
  {
    "ticker": "BDX",
    "nome": "Becton Dickinson",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas Médicos e Injetáveis"
  },
  {
    "ticker": "BEN",
    "nome": "Franklin Resources",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Fundos e Ações"
  },
  {
    "ticker": "BF.B",
    "nome": "Brown-Forman Cl B",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bebidas Destiladas (Jack Daniel's)"
  },
  {
    "ticker": "BG",
    "nome": "Bunge Global SA",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Agronegócio e Exportação"
  },
  {
    "ticker": "BIIB",
    "nome": "Biogen Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Medicamentos Neurológicos"
  },
  {
    "ticker": "BIO",
    "nome": "Bio-Rad Laboratories",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pesquisa e Diagnósticos Clínicos"
  },
  {
    "ticker": "BK",
    "nome": "The Bank of New York Mellon",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Custódia de Títulos Globais"
  },
  {
    "ticker": "BKNG",
    "nome": "Booking Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Turismo Online (Booking.com)"
  },
  {
    "ticker": "BKR",
    "nome": "Baker Hughes Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Serviços de Petróleo e Gás"
  },
  {
    "ticker": "BLDR",
    "nome": "Builders FirstSource",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Materiais de Construção Residencial"
  },
  {
    "ticker": "BLK",
    "nome": "BlackRock Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Gestora de Recursos do Mundo (iShares)"
  },
  {
    "ticker": "BMY",
    "nome": "Bristol Myers Squibb",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Biofarmacêutica"
  },
  {
    "ticker": "BR",
    "nome": "Broadridge Financial Solutions",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tecnologia de Comunicação Financeira"
  },
  {
    "ticker": "BRK.B",
    "nome": "Berkshire Hathaway Cl B",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Conglomerado Warren Buffett"
  },
  {
    "ticker": "BRO",
    "nome": "Brown & Brown",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corretagem de Seguros"
  },
  {
    "ticker": "BSX",
    "nome": "Boston Scientific",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Stents e Cardiologia Intervencionista"
  },
  {
    "ticker": "BWA",
    "nome": "BorgWarner Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas de Transmissão Automotiva"
  },
  {
    "ticker": "BX",
    "nome": "Blackstone Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Private Equity e Ativos Alternativos"
  },
  {
    "ticker": "BXP",
    "nome": "Boston Properties",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Escritórios Corporativos"
  },
  {
    "ticker": "C",
    "nome": "Citigroup Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco Global"
  },
  {
    "ticker": "CAG",
    "nome": "Conagra Brands",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Alimentos Congelados e Mercearia"
  },
  {
    "ticker": "CAH",
    "nome": "Cardinal Health",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Logística de Medicamentos"
  },
  {
    "ticker": "CARR",
    "nome": "Carrier Global Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ar Condicionado e Climatização"
  },
  {
    "ticker": "CAT",
    "nome": "Caterpillar Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratores e Escavadeiras Pesadas"
  },
  {
    "ticker": "CB",
    "nome": "Chubb Limited",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Comerciais e Pessoais"
  },
  {
    "ticker": "CBOE",
    "nome": "Cboe Global Markets",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bolsa de Opções (VIX)"
  },
  {
    "ticker": "CBRE",
    "nome": "CBRE Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Imóveis Corporativos"
  },
  {
    "ticker": "CCI",
    "nome": "Crown Castle Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Infraestrutura de Celular"
  },
  {
    "ticker": "CCL",
    "nome": "Carnival Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cruzeiros Turísticos"
  },
  {
    "ticker": "CDNS",
    "nome": "Cadence Design Systems",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Automação de Design Eletrônico (EDA)"
  },
  {
    "ticker": "CDW",
    "nome": "CDW Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Soluções Corporativas de TI"
  },
  {
    "ticker": "CE",
    "nome": "Celanese Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Polímeros de Alta Performance"
  },
  {
    "ticker": "CEG",
    "nome": "Constellation Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Geração Nuclear e Descarbonização"
  },
  {
    "ticker": "CF",
    "nome": "CF Industries",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Amônia e Fertilizantes"
  },
  {
    "ticker": "CFG",
    "nome": "Citizens Financial Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco Regional"
  },
  {
    "ticker": "CHD",
    "nome": "Church & Dwight",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Produtos de Limpeza (Arm & Hammer)"
  },
  {
    "ticker": "CHRW",
    "nome": "C.H. Robinson",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Logística de Cargas Terrestres"
  },
  {
    "ticker": "CHTR",
    "nome": "Charter Communications",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Internet Banda Larga Spectrum"
  },
  {
    "ticker": "CI",
    "nome": "The Cigna Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Planos Médicos e Farmácia PBM"
  },
  {
    "ticker": "CINF",
    "nome": "Cincinnati Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Comerciais"
  },
  {
    "ticker": "CL",
    "nome": "Colgate-Palmolive",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Higiene Bucal e Sabonetes"
  },
  {
    "ticker": "CLX",
    "nome": "The Clorox Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Desinfetantes e Limpeza Doméstica"
  },
  {
    "ticker": "CMA",
    "nome": "Comerica Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco Comercial"
  },
  {
    "ticker": "CMCSA",
    "nome": "Comcast Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mídia e Entretenimento (NBCUniversal)"
  },
  {
    "ticker": "CME",
    "nome": "CME Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Derivativos e Futuros de Commodities"
  },
  {
    "ticker": "CMG",
    "nome": "Chipotle Mexican Grill",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Restaurantes Fast-Casual"
  },
  {
    "ticker": "CMI",
    "nome": "Cummins Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Motores Diesel e Geradores"
  },
  {
    "ticker": "CMS",
    "nome": "CMS Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade e Gás em Michigan"
  },
  {
    "ticker": "CNC",
    "nome": "Centene Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Saúde Governamental Medicaid"
  },
  {
    "ticker": "CNP",
    "nome": "CenterPoint Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Distribuição Elétrica no Texas"
  },
  {
    "ticker": "COF",
    "nome": "Capital One Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Financiamentos e Cartões"
  },
  {
    "ticker": "COO",
    "nome": "The Cooper Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lentes de Contato CooperVision"
  },
  {
    "ticker": "COP",
    "nome": "ConocoPhillips",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exploração Independente de Petróleo"
  },
  {
    "ticker": "COR",
    "nome": "Cencora Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Distribuição Farmacêutica Global"
  },
  {
    "ticker": "COST",
    "nome": "Costco Wholesale",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Clubes de Compras por Assinatura"
  },
  {
    "ticker": "CPAY",
    "nome": "Corpay Inc (Fleetcor)",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pagamentos Corporativos de Combustível"
  },
  {
    "ticker": "CPB",
    "nome": "Campbell Soup Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sopas e Petiscos (Goldfish)"
  },
  {
    "ticker": "CPRT",
    "nome": "Copart Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Leilões Online de Carros Sinistrados"
  },
  {
    "ticker": "CPT",
    "nome": "Camden Property Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Apartamentos Residenciais"
  },
  {
    "ticker": "CRL",
    "nome": "Charles River Laboratories",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Testes Pré-clínicos de Medicamentos"
  },
  {
    "ticker": "CRM",
    "nome": "Salesforce Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software de CRM Líder Mundial"
  },
  {
    "ticker": "CRWD",
    "nome": "CrowdStrike Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Segurança de Endpoint Falcon"
  },
  {
    "ticker": "CSCO",
    "nome": "Cisco Systems",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Roteadores e Infraestrutura de Rede"
  },
  {
    "ticker": "CSGP",
    "nome": "CoStar Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Informações de Imóveis Comerciais"
  },
  {
    "ticker": "CSX",
    "nome": "CSX Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Transporte Ferroviário no Leste dos EUA"
  },
  {
    "ticker": "CTAS",
    "nome": "Cintas Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Aluguel de Uniformes e Higiene Predial"
  },
  {
    "ticker": "CTRA",
    "nome": "Coterra Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gás de Xisto na Bacia Marcellus"
  },
  {
    "ticker": "CTSH",
    "nome": "Cognizant Technology",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Outsourcing de TI"
  },
  {
    "ticker": "CTVA",
    "nome": "Corteva Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pioneer Sementes e Proteção de Cultivos"
  },
  {
    "ticker": "CVS",
    "nome": "CVS Health Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Farmácias e Cuidados de Saúde Aetna"
  },
  {
    "ticker": "CVX",
    "nome": "Chevron Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Gás Integrado"
  },
  {
    "ticker": "CZR",
    "nome": "Caesars Entertainment",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Resorts de Cassino"
  },
  {
    "ticker": "D",
    "nome": "Dominion Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade na Virgínia e Carolina"
  },
  {
    "ticker": "DAL",
    "nome": "Delta Air Lines",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Transporte Aéreo Global"
  },
  {
    "ticker": "DAY",
    "nome": "Dayforce Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Capital Humano HCM"
  },
  {
    "ticker": "DD",
    "nome": "DuPont de Nemours",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Kevlar, Tyvek e Polímeros"
  },
  {
    "ticker": "DE",
    "nome": "Deere & Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratores Verdes John Deere"
  },
  {
    "ticker": "DECK",
    "nome": "Deckers Outdoor Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Calçados Esportivos HOKA"
  },
  {
    "ticker": "DELL",
    "nome": "Dell Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Servidores de IA e Computadores"
  },
  {
    "ticker": "DFS",
    "nome": "Discover Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede de Cartões de Crédito"
  },
  {
    "ticker": "DG",
    "nome": "Dollar General",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Varejo Popular com Preço Baixo"
  },
  {
    "ticker": "DGX",
    "nome": "Quest Diagnostics",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exames de Sangue e Análises Clínicas"
  },
  {
    "ticker": "DHI",
    "nome": "D.R. Horton",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Construtora de Casas dos EUA"
  },
  {
    "ticker": "DHR",
    "nome": "Danaher Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Biotecnologia e Ciências da Vida"
  },
  {
    "ticker": "DIS",
    "nome": "Walt Disney Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Parques, Filmes e Streaming Disney+"
  },
  {
    "ticker": "DLR",
    "nome": "Digital Realty Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Mega Data Centers"
  },
  {
    "ticker": "DLTR",
    "nome": "Dollar Tree",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas Tudo por US$ 1.25"
  },
  {
    "ticker": "DOC",
    "nome": "Healthpeak Properties",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Clínicas e Consultórios"
  },
  {
    "ticker": "DOV",
    "nome": "Dover Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Componentes e Bombas Industriais"
  },
  {
    "ticker": "DOW",
    "nome": "Dow Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Química Básica e Plásticos de Engenharia"
  },
  {
    "ticker": "DPZ",
    "nome": "Domino's Pizza",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Entrega Rápida de Pizzas"
  },
  {
    "ticker": "DRI",
    "nome": "Darden Restaurants",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cadeia de Restaurantes Olive Garden"
  },
  {
    "ticker": "DTE",
    "nome": "DTE Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade em Detroit"
  },
  {
    "ticker": "DUK",
    "nome": "Duke Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Serviços Públicos de Energia"
  },
  {
    "ticker": "DVA",
    "nome": "DaVita Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Clínicas de Hemodiálise"
  },
  {
    "ticker": "DVN",
    "nome": "Devon Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Gás Natural"
  },
  {
    "ticker": "DXCM",
    "nome": "DexCom Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sensores de Glicose para Diabetes"
  },
  {
    "ticker": "EA",
    "nome": "Electronic Arts",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Jogos Digitais e EA FC"
  },
  {
    "ticker": "EBAY",
    "nome": "eBay Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Plataforma de Comércio Eletrônico"
  },
  {
    "ticker": "ECL",
    "nome": "Ecolab Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Higiene e Tratamento de Água Industrial"
  },
  {
    "ticker": "ED",
    "nome": "Consolidated Edison",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Energia Elétrica em Nova York"
  },
  {
    "ticker": "EFX",
    "nome": "Equifax Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Análise de Histórico de Crédito"
  },
  {
    "ticker": "EG",
    "nome": "Everest Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Contra Catástrofes"
  },
  {
    "ticker": "EIX",
    "nome": "Edison International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade no Sul da Califórnia"
  },
  {
    "ticker": "EL",
    "nome": "The Estée Lauder Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Perfumes e Cuidados com a Pele"
  },
  {
    "ticker": "ELV",
    "nome": "Elevance Health",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Planos de Saúde Anthem"
  },
  {
    "ticker": "EMN",
    "nome": "Eastman Chemical",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Materiais Especiais"
  },
  {
    "ticker": "EMR",
    "nome": "Emerson Electric",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Válvulas de Automação de Processos"
  },
  {
    "ticker": "ENPH",
    "nome": "Enphase Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas Solares Residenciais"
  },
  {
    "ticker": "EOG",
    "nome": "EOG Resources",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Poços de Petróleo de Alta Rentabilidade"
  },
  {
    "ticker": "EPAM",
    "nome": "EPAM Systems",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Engenharia Digital e Software"
  },
  {
    "ticker": "EQIX",
    "nome": "Equinix Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Conectividade de Data Centers"
  },
  {
    "ticker": "EQR",
    "nome": "Equity Residential",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Apartamentos Costeiros"
  },
  {
    "ticker": "EQT",
    "nome": "EQT Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Produtora de Gás Natural dos EUA"
  },
  {
    "ticker": "ERIE",
    "nome": "Erie Indemnity Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Companhias de Seguros"
  },
  {
    "ticker": "ES",
    "nome": "Eversource Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Utilidades na Nova Inglaterra"
  },
  {
    "ticker": "ESS",
    "nome": "Essex Property Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Imóveis Residenciais Califórnia"
  },
  {
    "ticker": "ETN",
    "nome": "Eaton Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Transformadores e Gestão Elétrica"
  },
  {
    "ticker": "ETR",
    "nome": "Entergy Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Usinas Elétricas no Sul dos EUA"
  },
  {
    "ticker": "EVRG",
    "nome": "Evergy Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade no Kansas e Missouri"
  },
  {
    "ticker": "EW",
    "nome": "Edwards Lifesciences",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Válvulas Cardíacas Transcateter"
  },
  {
    "ticker": "EXC",
    "nome": "Exelon Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Distribuição Elétrica Urbana"
  },
  {
    "ticker": "EXPD",
    "nome": "Expeditors International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Despacho Aduaneiro e Cargas"
  },
  {
    "ticker": "EXPE",
    "nome": "Expedia Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Agências de Viagens Online (Vrbo/Hotels)"
  },
  {
    "ticker": "EXR",
    "nome": "Extra Space Storage",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Galpões de Auto-Armazenamento"
  },
  {
    "ticker": "F",
    "nome": "Ford Motor Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Picape F-150 e Automóveis"
  },
  {
    "ticker": "FANG",
    "nome": "Diamondback Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Perfuração de Petróleo Permiano"
  },
  {
    "ticker": "FAST",
    "nome": "Fastenal Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Parafusos e Vending Machines Industriais"
  },
  {
    "ticker": "FCX",
    "nome": "Freeport-McMoRan",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mineração de Cobre Grasberg"
  },
  {
    "ticker": "FDS",
    "nome": "FactSet Research Systems",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Terminais de Dados para Gestores"
  },
  {
    "ticker": "FDX",
    "nome": "FedEx Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Entregas Expressas Globais"
  },
  {
    "ticker": "FE",
    "nome": "FirstEnergy Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Transmissão Elétrica em Ohio e Pensilvânia"
  },
  {
    "ticker": "FFIV",
    "nome": "F5 Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Balanceadores de Carga e Segurança Web"
  },
  {
    "ticker": "FI",
    "nome": "Fiserv Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processamento de Débito e Cartões"
  },
  {
    "ticker": "FICO",
    "nome": "Fair Isaac Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Algoritmo Oficial de Score FICO"
  },
  {
    "ticker": "FIS",
    "nome": "Fidelity National Information",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software Bancário Central"
  },
  {
    "ticker": "FITB",
    "nome": "Fifth Third Bancorp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco no Meio-Oeste"
  },
  {
    "ticker": "FMC",
    "nome": "FMC Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Inseticidas e Herbicidas"
  },
  {
    "ticker": "FOX",
    "nome": "Fox Corp Cl B",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede de Televisão e Notícias"
  },
  {
    "ticker": "FOXA",
    "nome": "Fox Corp Cl A",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede de Televisão e Notícias"
  },
  {
    "ticker": "FRT",
    "nome": "Federal Realty Investment Trust",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Shoppings ao Ar Livre"
  },
  {
    "ticker": "FSLR",
    "nome": "First Solar",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Módulos Solares Fotovoltaicos"
  },
  {
    "ticker": "FTNT",
    "nome": "Fortinet Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Firewalls e Redes Corporativas Seguras"
  },
  {
    "ticker": "FTV",
    "nome": "Fortive Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sensores e Softwares de Campo"
  },
  {
    "ticker": "GD",
    "nome": "General Dynamics",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Jatos Executivos Gulfstream e Tanques"
  },
  {
    "ticker": "GDDY",
    "nome": "GoDaddy Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Registros de Sites na Web"
  },
  {
    "ticker": "GE",
    "nome": "GE Aerospace",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Turbinas de Aviões Comerciais"
  },
  {
    "ticker": "GEHC",
    "nome": "GE HealthCare Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ressonância Magnética e Ultrassom"
  },
  {
    "ticker": "GEN",
    "nome": "Gen Digital",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Antivírus Norton e Proteção LifeLock"
  },
  {
    "ticker": "GEV",
    "nome": "GE Vernova",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Turbinas a Gás e Eólicas"
  },
  {
    "ticker": "GILD",
    "nome": "Gilead Sciences",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratamentos de HIV e Hepatite"
  },
  {
    "ticker": "GIS",
    "nome": "General Mills",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cereal Cheerios e Sorvetes Häagen-Dazs"
  },
  {
    "ticker": "GL",
    "nome": "Globe Life Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Apólices de Vida Diretas"
  },
  {
    "ticker": "GLW",
    "nome": "Corning Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Vidro Gorilla Glass para Smartphones"
  },
  {
    "ticker": "GM",
    "nome": "General Motors",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Carros Chevrolet e Caminhonetes GMC"
  },
  {
    "ticker": "GNRC",
    "nome": "Generac Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Geradores de Energia de Emergência"
  },
  {
    "ticker": "GOOG",
    "nome": "Alphabet Inc Cl C",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Google Search e Android"
  },
  {
    "ticker": "GOOGL",
    "nome": "Alphabet Inc Cl A",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Google Search, YouTube e GCP"
  },
  {
    "ticker": "GPC",
    "nome": "Genuine Parts Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas de Autopeças NAPA"
  },
  {
    "ticker": "GPN",
    "nome": "Global Payments",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maquininhas de Cartão e Gateway"
  },
  {
    "ticker": "GRMN",
    "nome": "Garmin Ltd",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Relógios para Corrida e Navegação Marítima"
  },
  {
    "ticker": "GS",
    "nome": "Goldman Sachs Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "M&A e Negociação de Ações"
  },
  {
    "ticker": "GWW",
    "nome": "W. W. Grainger",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Catálogo de Ferramentas Industriais"
  },
  {
    "ticker": "HAL",
    "nome": "Halliburton Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fraturamento Hidráulico de Poços"
  },
  {
    "ticker": "HAS",
    "nome": "Hasbro Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Brinquedos Nerf, Transformers e D&D"
  },
  {
    "ticker": "HBAN",
    "nome": "Huntington Bancshares",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Financiamento a Concessionárias"
  },
  {
    "ticker": "HCA",
    "nome": "HCA Healthcare",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Rede Privada de Hospitais dos EUA"
  },
  {
    "ticker": "HD",
    "nome": "Home Depot Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas de Materiais de Construção DIY"
  },
  {
    "ticker": "HES",
    "nome": "Hess Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Petróleo offshore na Guiana"
  },
  {
    "ticker": "HIG",
    "nome": "The Hartford Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguro de Pequenas Empresas"
  },
  {
    "ticker": "HII",
    "nome": "Huntington Ingalls",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Porta-Aviões Nucleares"
  },
  {
    "ticker": "HLT",
    "nome": "Hilton Worldwide",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hotéis e Fidelidade Hilton Honors"
  },
  {
    "ticker": "HOLX",
    "nome": "Hologic Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Biópsias e Saúde da Mulher"
  },
  {
    "ticker": "HON",
    "nome": "Honeywell International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sensores de Edifícios Inteligentes"
  },
  {
    "ticker": "HPE",
    "nome": "Hewlett Packard Enterprise",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Servidores Corporativos ProLiant"
  },
  {
    "ticker": "HPQ",
    "nome": "HP Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Notebooks e Cartuchos de Tinta"
  },
  {
    "ticker": "HRL",
    "nome": "Hormel Foods",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Carnes SPAM e Manteiga Skippy"
  },
  {
    "ticker": "HSIC",
    "nome": "Henry Schein",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cadeiras e Equipamentos Odontológicos"
  },
  {
    "ticker": "HST",
    "nome": "Host Hotels & Resorts",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Hotéis de Convenção"
  },
  {
    "ticker": "HSY",
    "nome": "The Hershey Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Chocolates Hershey e Reese's"
  },
  {
    "ticker": "HUBB",
    "nome": "Hubbell Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Isoladores e Equipamentos de Rede Elétrica"
  },
  {
    "ticker": "HUM",
    "nome": "Humana Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Planos de Saúde para Aposentados"
  },
  {
    "ticker": "HWM",
    "nome": "Howmet Aerospace",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Peças Forjadas de Titânio para Jatos"
  },
  {
    "ticker": "IBM",
    "nome": "International Business Machines",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mainframes e IA Red Hat"
  },
  {
    "ticker": "ICE",
    "nome": "Intercontinental Exchange",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mercados de Energia e NYSE"
  },
  {
    "ticker": "IDXX",
    "nome": "IDEXX Laboratories",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exames para Clínicas Veterinárias"
  },
  {
    "ticker": "IEX",
    "nome": "IDEX Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bombas de Dosagem de Fluidos Químicos"
  },
  {
    "ticker": "IFF",
    "nome": "International Flavors & Fragrances",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ingredientes para Alimentos"
  },
  {
    "ticker": "INCY",
    "nome": "Incyte Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratamentos para Doenças Mieloproliferativas"
  },
  {
    "ticker": "INTC",
    "nome": "Intel Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processadores Core e Fundição"
  },
  {
    "ticker": "INTU",
    "nome": "Intuit Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Declaração TurboTax e Gestão QuickBooks"
  },
  {
    "ticker": "INVH",
    "nome": "Invitation Homes",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Locação de Casas em Bairros Nobres"
  },
  {
    "ticker": "IP",
    "nome": "International Paper",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Caixas de Papelão e Celulose"
  },
  {
    "ticker": "IPG",
    "nome": "Interpublic Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Agências McCann e Propaganda"
  },
  {
    "ticker": "IQV",
    "nome": "IQVIA Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Estudos Clínicos Fase 3"
  },
  {
    "ticker": "IR",
    "nome": "Ingersoll Rand",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Compressores de Ar de Fábricas"
  },
  {
    "ticker": "IRM",
    "nome": "Iron Mountain Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Guarda de Arquivos Físicos e Digitais"
  },
  {
    "ticker": "ISRG",
    "nome": "Intuitive Surgical",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Robôs para Cirurgia Laparoscópica"
  },
  {
    "ticker": "IT",
    "nome": "Gartner Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pesquisa e Análise de Tecnologias"
  },
  {
    "ticker": "ITW",
    "nome": "Illinois Tool Works",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas de Fixação e Soldagem"
  },
  {
    "ticker": "IVZ",
    "nome": "Invesco Ltd",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gestão de Fundos e ETF QQQ"
  },
  {
    "ticker": "J",
    "nome": "Jacobs Solutions",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Engenharia de Infraestrutura e Cidades"
  },
  {
    "ticker": "JBHT",
    "nome": "J.B. Hunt Transport",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Contêineres de Carga em Trem e Estrada"
  },
  {
    "ticker": "JBL",
    "nome": "Jabil Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Montagem de Circuitos para Terceiros"
  },
  {
    "ticker": "JCI",
    "nome": "Johnson Controls",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Termostatos York e Alarmes Prediais"
  },
  {
    "ticker": "JKHY",
    "nome": "Jack Henry & Associates",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processamento de Contas para Bancos Cooperativos"
  },
  {
    "ticker": "JNJ",
    "nome": "Johnson & Johnson",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cirurgia e Remédios Oncológicos"
  },
  {
    "ticker": "JNPR",
    "nome": "Juniper Networks",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Roteadores e IA Mist para Redes"
  },
  {
    "ticker": "JPM",
    "nome": "JPMorgan Chase & Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Banco dos Estados Unidos"
  },
  {
    "ticker": "K",
    "nome": "Kellanova",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Batatas Pringles e Barras de Cereal"
  },
  {
    "ticker": "KDP",
    "nome": "Keurig Dr Pepper",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cápsulas de Café K-Cup e Refrigerantes"
  },
  {
    "ticker": "KEY",
    "nome": "KeyCorp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Agências Bancárias em 15 Estados"
  },
  {
    "ticker": "KEYS",
    "nome": "Keysight Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Osciloscópios e Testes 5G/6G"
  },
  {
    "ticker": "KHC",
    "nome": "The Kraft Heinz Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ketchup Heinz e Queijo Kraft"
  },
  {
    "ticker": "KIM",
    "nome": "Kimco Realty Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Galerias Comerciais com Supermercados"
  },
  {
    "ticker": "KKR",
    "nome": "KKR & Co Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Grandes Compras Corporativas (LBO)"
  },
  {
    "ticker": "KLAC",
    "nome": "KLA Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Detecção de Defeitos em Wafers de Silício"
  },
  {
    "ticker": "KMB",
    "nome": "Kimberly-Clark",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fraldas Huggies e Lenços Kleenex"
  },
  {
    "ticker": "KMI",
    "nome": "Kinder Morgan",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Transporte de Gás Natural por Dutos"
  },
  {
    "ticker": "KMX",
    "nome": "CarMax Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Rede de Seminovos dos EUA"
  },
  {
    "ticker": "KO",
    "nome": "The Coca-Cola Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bebidas e Refrigerantes Globais"
  },
  {
    "ticker": "KR",
    "nome": "The Kroger Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Rede de Supermercados Tradicionais"
  },
  {
    "ticker": "KVUE",
    "nome": "Kenvue Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Colutório Listerine e Sabonete Neutrogena"
  },
  {
    "ticker": "L",
    "nome": "Loews Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hotéis e Transporte por Oleodutos"
  },
  {
    "ticker": "LDOS",
    "nome": "Leidos Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas de Defesa e Segurança Nacional"
  },
  {
    "ticker": "LEN",
    "nome": "Lennar Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bairros Residenciais Planejados"
  },
  {
    "ticker": "LH",
    "nome": "Labcorp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exames Genéticos e Diagnósticos"
  },
  {
    "ticker": "LHX",
    "nome": "L3Harris Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Equipamentos de Guerra Eletrônica"
  },
  {
    "ticker": "LIN",
    "nome": "Linde plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Oxigênio Hospitalar e Hidrogênio"
  },
  {
    "ticker": "LKQ",
    "nome": "LKQ Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Peças Automotivas de Colisão"
  },
  {
    "ticker": "LLY",
    "nome": "Eli Lilly and Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mounjaro, Zepbound e Tratamento de Diabetes"
  },
  {
    "ticker": "LMT",
    "nome": "Lockheed Martin",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Mísseis Patriot e Caça F-35"
  },
  {
    "ticker": "LNT",
    "nome": "Alliant Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Energia Eólica e Solar em Iowa"
  },
  {
    "ticker": "LOW",
    "nome": "Lowe's Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ferramentas e Jardinagem"
  },
  {
    "ticker": "LRCX",
    "nome": "Lam Research",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corrosão e Deposição de Silício"
  },
  {
    "ticker": "LULU",
    "nome": "Lululemon Athletica",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Calças de Yoga e Vestuário Esportivo"
  },
  {
    "ticker": "LUV",
    "nome": "Southwest Airlines",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Linhas Aéreas Ponto a Ponto"
  },
  {
    "ticker": "LVS",
    "nome": "Las Vegas Sands",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hotelaria de Luxo Marina Bay Sands"
  },
  {
    "ticker": "LW",
    "nome": "Lamb Weston Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fritas para Grandes Redes de Fast Food"
  },
  {
    "ticker": "LYB",
    "nome": "LyondellBasell",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Polipropileno e Resinas Plásticas"
  },
  {
    "ticker": "LYV",
    "nome": "Live Nation Entertainment",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Venda de Ingressos de Festivais"
  },
  {
    "ticker": "MA",
    "nome": "Mastercard Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede Global de Pagamentos Digitais"
  },
  {
    "ticker": "MAA",
    "nome": "Mid-America Apartment",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Condomínios Residenciais"
  },
  {
    "ticker": "MAR",
    "nome": "Marriott International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hotéis Ritz-Carlton e Sheraton"
  },
  {
    "ticker": "MAS",
    "nome": "Masco Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Acabamentos de Banheiro e Cozinha"
  },
  {
    "ticker": "MCD",
    "nome": "McDonald's Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Franquias Globais de Lanches"
  },
  {
    "ticker": "MCHP",
    "nome": "Microchip Technology",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Controladores Integrados de Baixo Custo"
  },
  {
    "ticker": "MCK",
    "nome": "McKesson Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fornecimento para Farmácias e Clínicas"
  },
  {
    "ticker": "MCO",
    "nome": "Moody's Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Avaliação de Rating de Crédito Soberano"
  },
  {
    "ticker": "MDLZ",
    "nome": "Mondelēz International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Guloseimas e Bombons"
  },
  {
    "ticker": "MDT",
    "nome": "Medtronic plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Marca-passos e Bombas de Insulina"
  },
  {
    "ticker": "MET",
    "nome": "MetLife Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Benefícios Corporativos de Seguro"
  },
  {
    "ticker": "META",
    "nome": "Meta Platforms Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Instagram, WhatsApp e Realidade Virtual"
  },
  {
    "ticker": "MGM",
    "nome": "MGM Resorts International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Complexos Hoteleiros Bellagio"
  },
  {
    "ticker": "MHK",
    "nome": "Mohawk Industries",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Carpetes e Pisos Vinílicos"
  },
  {
    "ticker": "MKC",
    "nome": "McCormick & Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Especiarias e Molhos de Pimenta"
  },
  {
    "ticker": "MKTX",
    "nome": "MarketAxess Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Negociação Eletrônica de Debêntures"
  },
  {
    "ticker": "MLM",
    "nome": "Martin Marietta Materials",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Areia, Cimento e Brita Pesada"
  },
  {
    "ticker": "MMC",
    "nome": "Marsh & McLennan",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Consultoria de Riscos Mercer"
  },
  {
    "ticker": "MMM",
    "nome": "3M Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fitas Scotch, Post-it e Abrasivos"
  },
  {
    "ticker": "MNST",
    "nome": "Monster Beverage",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bebidas Energéticas com Taurina"
  },
  {
    "ticker": "MO",
    "nome": "Altria Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cigarros Marlboro nos EUA"
  },
  {
    "ticker": "MOH",
    "nome": "Molina Healthcare",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Saúde para Famílias de Baixa Renda"
  },
  {
    "ticker": "MOS",
    "nome": "The Mosaic Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Nutrientes de Solo para Plantações"
  },
  {
    "ticker": "MPC",
    "nome": "Marathon Petroleum",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Postos de Gasolina Speedway"
  },
  {
    "ticker": "MPWR",
    "nome": "Monolithic Power Systems",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Conversão Eficiente de Voltagem"
  },
  {
    "ticker": "MRK",
    "nome": "Merck & Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Imunoterapia Keytruda para Câncer"
  },
  {
    "ticker": "MRNA",
    "nome": "Moderna Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Terapias Gênicas Baseadas em RNAm"
  },
  {
    "ticker": "MS",
    "nome": "Morgan Stanley",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Assessoria de Investimentos para Fortunas"
  },
  {
    "ticker": "MSCI",
    "nome": "MSCI Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Índices Emergentes e Métricas de Portfólio"
  },
  {
    "ticker": "MSFT",
    "nome": "Microsoft Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Windows, Office 365, Copilot e Azure"
  },
  {
    "ticker": "MSI",
    "nome": "Motorola Solutions",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Comunicação Crítica para Bombeiros"
  },
  {
    "ticker": "MTB",
    "nome": "M&T Bank Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Empréstimos Empresariais em Nova York"
  },
  {
    "ticker": "MTCH",
    "nome": "Match Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Aplicativos Hinge e Match"
  },
  {
    "ticker": "MTD",
    "nome": "Mettler-Toledo International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pipetas e Instrumentos de Laboratório"
  },
  {
    "ticker": "MU",
    "nome": "Micron Technology",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Memórias HBM3e para Chips de IA"
  },
  {
    "ticker": "NCLH",
    "nome": "Norwegian Cruise Line",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Turismo de Cruzeiros Oceânicos"
  },
  {
    "ticker": "NDAQ",
    "nome": "Nasdaq Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Índice Nasdaq 100 e Tecnologia de Troca"
  },
  {
    "ticker": "NDSN",
    "nome": "Nordson Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Dispensadores de Cola de Alta Velocidade"
  },
  {
    "ticker": "NEE",
    "nome": "NextEra Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Produtora de Energia Renovável"
  },
  {
    "ticker": "NEM",
    "nome": "Newmont Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Produtora de Ouro do Mundo"
  },
  {
    "ticker": "NFLX",
    "nome": "Netflix Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Produção de Séries Originais e Streaming"
  },
  {
    "ticker": "NI",
    "nome": "NiSource Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gás Natural e Energia no Meio-Norte"
  },
  {
    "ticker": "NKE",
    "nome": "NIKE Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tênis Air Jordan e Artigos de Corrida"
  },
  {
    "ticker": "NOC",
    "nome": "Northrop Grumman",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas Aeroespaciais Militares"
  },
  {
    "ticker": "NOW",
    "nome": "ServiceNow Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Automação de Fluxos de Trabalho de TI"
  },
  {
    "ticker": "NRG",
    "nome": "NRG Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Eletricidade no Varejo"
  },
  {
    "ticker": "NSC",
    "nome": "Norfolk Southern",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Linhas Férreas Industriais"
  },
  {
    "ticker": "NTAP",
    "nome": "NetApp Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gerenciamento de Arquivos em Multi-nuvem"
  },
  {
    "ticker": "NTRS",
    "nome": "Northern Trust Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Family Offices e Serviços Fiduciários"
  },
  {
    "ticker": "NUE",
    "nome": "Nucor Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Fabricante de Aço dos EUA"
  },
  {
    "ticker": "NVDA",
    "nome": "NVIDIA Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Chips H100 e Blackwell para IA"
  },
  {
    "ticker": "NVR",
    "nome": "NVR Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Casas Ryan Homes sob Encomenda"
  },
  {
    "ticker": "NWS",
    "nome": "News Corp Cl B",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Livros HarperCollins e Mídia"
  },
  {
    "ticker": "NWSA",
    "nome": "News Corp Cl A",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Livros e Notícias Econômicas"
  },
  {
    "ticker": "NXPI",
    "nome": "NXP Semiconductors",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Segurança Automotiva e Conexão NFC"
  },
  {
    "ticker": "O",
    "nome": "Realty Income Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - The Monthly Dividend Company"
  },
  {
    "ticker": "ODFL",
    "nome": "Old Dominion Freight Line",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cargas Fracionadas de Precisão"
  },
  {
    "ticker": "OKE",
    "nome": "ONEOK Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Plantas de Fracionamento de Gás"
  },
  {
    "ticker": "OMC",
    "nome": "Omnicom Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Planejamento de Mídia e Agências"
  },
  {
    "ticker": "ON",
    "nome": "ON Semiconductor",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Chips para Inversores de Veículos Elétricos"
  },
  {
    "ticker": "ORCL",
    "nome": "Oracle Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bancos de Dados Autônomos e Nuvem OCI"
  },
  {
    "ticker": "ORLY",
    "nome": "O'Reilly Automotive",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas de Varejo de Peças para Mecânicos"
  },
  {
    "ticker": "OTIS",
    "nome": "Otis Worldwide",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Manutenção de Elevadores em Prédios"
  },
  {
    "ticker": "OXY",
    "nome": "Occidental Petroleum",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Petróleo e Remoção Direta de Ar"
  },
  {
    "ticker": "PANW",
    "nome": "Palo Alto Networks",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Segurança Prisma Cloud e Corta-Fogo"
  },
  {
    "ticker": "PARA",
    "nome": "Paramount Global",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Estúdios Paramount e Canal CBS"
  },
  {
    "ticker": "PAYC",
    "nome": "Paycom Software",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Folha de Pagamento em Sistema Único"
  },
  {
    "ticker": "PAYX",
    "nome": "Paychex Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Benefícios e Pagamentos a Pequenas Firmas"
  },
  {
    "ticker": "PCAR",
    "nome": "PACCAR Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Caminhões DAF, Kenworth e Peterbilt"
  },
  {
    "ticker": "PCG",
    "nome": "PG&E Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Energia na Califórnia Central"
  },
  {
    "ticker": "PEG",
    "nome": "Public Service Enterprise Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Distribuição Elétrica em Nova Jersey"
  },
  {
    "ticker": "PEP",
    "nome": "PepsiCo Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Salgadinhos Lay's, Doritos e Refrigerantes"
  },
  {
    "ticker": "PFE",
    "nome": "Pfizer Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Medicamentos Oncológicos e Vacinas"
  },
  {
    "ticker": "PFG",
    "nome": "Principal Financial Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Planos de Previdência 401(k)"
  },
  {
    "ticker": "PG",
    "nome": "Procter & Gamble",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lâminas Gillette, Fraldas Pampers e Ariel"
  },
  {
    "ticker": "PGR",
    "nome": "Progressive Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Diretos de Carro e Moto"
  },
  {
    "ticker": "PH",
    "nome": "Parker-Hannifin",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tubos, Vedações e Filtros Aeroespaciais"
  },
  {
    "ticker": "PHM",
    "nome": "PulteGroup Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Casas Prontas para Morar"
  },
  {
    "ticker": "PKG",
    "nome": "Packaging Corp of America",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Embalagens de Transporte Corrugadas"
  },
  {
    "ticker": "PLD",
    "nome": "Prologis Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Armazéns Logísticos Mundiais"
  },
  {
    "ticker": "PLTR",
    "nome": "Palantir Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software Gotham e Plataforma AIP"
  },
  {
    "ticker": "PM",
    "nome": "Philip Morris International",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Dispositivos de Tabaco Aquecido IQOS"
  },
  {
    "ticker": "PNC",
    "nome": "PNC Financial Services",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banca Corporativa e de Varejo"
  },
  {
    "ticker": "PNR",
    "nome": "Pentair plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bombas e Filtros de Água Domésticos"
  },
  {
    "ticker": "PNW",
    "nome": "Pinnacle West Capital",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Serviços Públicos de Energia no Deserto"
  },
  {
    "ticker": "PODD",
    "nome": "Insulet Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Dispositivos sem Tubo para Insulina"
  },
  {
    "ticker": "POOL",
    "nome": "Pool Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cloro, Bombas e Acessórios para Piscina"
  },
  {
    "ticker": "PPG",
    "nome": "PPG Industries",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Revestimentos para Aviões e Construção"
  },
  {
    "ticker": "PPL",
    "nome": "PPL Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Redes de Transmissão Elétrica"
  },
  {
    "ticker": "PRU",
    "nome": "Prudential Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros e Gestão PGIM"
  },
  {
    "ticker": "PSA",
    "nome": "Public Storage",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Maior Operador de Self-Storage"
  },
  {
    "ticker": "PSX",
    "nome": "Phillips 66",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Refinamento e Querosene de Aviação"
  },
  {
    "ticker": "PTC",
    "nome": "PTC Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Software de CAD Creo e IoT Industrial"
  },
  {
    "ticker": "PWR",
    "nome": "Quanta Services",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Instalação de Torres de Alta Voltagem"
  },
  {
    "ticker": "PYPL",
    "nome": "PayPal Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processamento Venmo e Pagamentos Web"
  },
  {
    "ticker": "QCOM",
    "nome": "Qualcomm Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Modems Snapdragon e Licenciamento 5G"
  },
  {
    "ticker": "QRVO",
    "nome": "Qorvo Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Filtros Acústicos de Radiofrequência"
  },
  {
    "ticker": "RCL",
    "nome": "Royal Caribbean Cruises",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cruzeiros Icon of the Seas"
  },
  {
    "ticker": "REG",
    "nome": "Regency Centers Corp",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Supermercados Suburbano"
  },
  {
    "ticker": "REGN",
    "nome": "Regeneron Pharmaceuticals",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratamentos Dupixent e Eylea"
  },
  {
    "ticker": "RF",
    "nome": "Regions Financial Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco Regional no Sudeste dos EUA"
  },
  {
    "ticker": "RHI",
    "nome": "Robert Half",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Headhunter para Finanças e Contabilidade"
  },
  {
    "ticker": "RJF",
    "nome": "Raymond James Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corretores de Valores Autônomos"
  },
  {
    "ticker": "RL",
    "nome": "Ralph Lauren Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Camisas Polo e Grife de Alta Renda"
  },
  {
    "ticker": "RMD",
    "nome": "ResMed Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Máscaras e Aparelhos para Sono"
  },
  {
    "ticker": "ROK",
    "nome": "Rockwell Automation",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Automação Allen-Bradley"
  },
  {
    "ticker": "ROL",
    "nome": "Rollins Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Exterminação e Manejo de Pragas"
  },
  {
    "ticker": "ROP",
    "nome": "Roper Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Softwares Verticais para Saúde e Legal"
  },
  {
    "ticker": "ROST",
    "nome": "Ross Stores",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pontas de Estoque de Marcas Famosas"
  },
  {
    "ticker": "RSG",
    "nome": "Republic Services",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Aterros Sanitários e Caminhões de Lixo"
  },
  {
    "ticker": "RTX",
    "nome": "RTX Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Motores Pratt & Whitney e Radares"
  },
  {
    "ticker": "RVTY",
    "nome": "Revvity Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Análise de Moléculas e Genômica"
  },
  {
    "ticker": "SBAC",
    "nome": "SBA Communications",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Estruturas de Torres Sem Fio"
  },
  {
    "ticker": "SBUX",
    "nome": "Starbucks Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cafeterias no Mundo Inteiro"
  },
  {
    "ticker": "SCHW",
    "nome": "Charles Schwab Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corretora de Ações Sem Taxa"
  },
  {
    "ticker": "SHW",
    "nome": "Sherwin-Williams",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tintas Decorativas e Automotivas"
  },
  {
    "ticker": "SJM",
    "nome": "The J.M. Smucker Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Geléias e Rações para Pets"
  },
  {
    "ticker": "SLB",
    "nome": "Schlumberger Ltd",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Medição de Poços Petrolíferos"
  },
  {
    "ticker": "SMCI",
    "nome": "Super Micro Computer",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Servidores Resfriados a Líquido"
  },
  {
    "ticker": "SNA",
    "nome": "Snap-on Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Chaves e Equipamentos para Concessionárias"
  },
  {
    "ticker": "SNPS",
    "nome": "Synopsys Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Propriedade Intelectual e Design de Circuitos"
  },
  {
    "ticker": "SO",
    "nome": "Southern Company",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Usinas Nucleares Vogtle e Energia"
  },
  {
    "ticker": "SOLV",
    "nome": "Solventum Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Curativos Cirúrgicos e Fitas Hospitalares"
  },
  {
    "ticker": "SPG",
    "nome": "Simon Property Group",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Malls e Premium Outlets"
  },
  {
    "ticker": "SPGI",
    "nome": "S&P Global Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ratings S&P e Provedor de Índices"
  },
  {
    "ticker": "SRE",
    "nome": "Sempra",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Infraestrutura de GNL e Distribuição"
  },
  {
    "ticker": "STE",
    "nome": "STERIS plc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Esterilização de Instrumentos de Cirurgia"
  },
  {
    "ticker": "STLD",
    "nome": "Steel Dynamics",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Barras e Perfis de Aço"
  },
  {
    "ticker": "STT",
    "nome": "State Street Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Serviços de Fundo e Custódia"
  },
  {
    "ticker": "STX",
    "nome": "Seagate Technology",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Discos Rígidos para Nuvem"
  },
  {
    "ticker": "SW",
    "nome": "Smurfit Westrock",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Soluções Integradas de Papelão"
  },
  {
    "ticker": "SWK",
    "nome": "Stanley Black & Decker",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Furadeiras e Ferramentas Manuais"
  },
  {
    "ticker": "SWKS",
    "nome": "Skyworks Solutions",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Amplificadores de Sinal Sem Fio"
  },
  {
    "ticker": "SYF",
    "nome": "Synchrony Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Emissão de Cartões com Varejistas"
  },
  {
    "ticker": "SYK",
    "nome": "Stryker Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Macas Hospitalares e Próteses"
  },
  {
    "ticker": "SYY",
    "nome": "Sysco Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Caminhões de Entrega para Restaurantes"
  },
  {
    "ticker": "T",
    "nome": "AT&T Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Operadora de Telefonia Celular e Fibra"
  },
  {
    "ticker": "TAP",
    "nome": "Molson Coors Beverage",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cervejas Coors Light e Miller"
  },
  {
    "ticker": "TDG",
    "nome": "TransDigm Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Peças de Reposição para Aviação"
  },
  {
    "ticker": "TDY",
    "nome": "Teledyne Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sensores de Infravermelho Espaciais"
  },
  {
    "ticker": "TECH",
    "nome": "Bio-Techne Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Anticorpos e Kits ELISA"
  },
  {
    "ticker": "TEL",
    "nome": "TE Connectivity",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sensores de Alta Tensão para Autos"
  },
  {
    "ticker": "TER",
    "nome": "Teradyne Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Robôs Industriais Universal Robots"
  },
  {
    "ticker": "TFC",
    "nome": "Truist Financial",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco da Fusão BB&T e SunTrust"
  },
  {
    "ticker": "TFX",
    "nome": "Teleflex Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Cateteres Vasculares e Urológicos"
  },
  {
    "ticker": "TGT",
    "nome": "Target Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Grandes Lojas de Departamentos"
  },
  {
    "ticker": "TJX",
    "nome": "TJX Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas T.J. Maxx e Marshalls"
  },
  {
    "ticker": "TMO",
    "nome": "Thermo Fisher Scientific",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Equipamentos e Insumos Científicos"
  },
  {
    "ticker": "TMUS",
    "nome": "T-Mobile US",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Operadora de Telefonia 5G"
  },
  {
    "ticker": "TPR",
    "nome": "Tapestry Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bolsas Coach e Moda"
  },
  {
    "ticker": "TRGP",
    "nome": "Targa Resources",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Dutos de Gás no Permiano"
  },
  {
    "ticker": "TRMB",
    "nome": "Trimble Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Topografia e Guiamento Agrícola"
  },
  {
    "ticker": "TROW",
    "nome": "T. Rowe Price Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Fundos de Ações e Pensão"
  },
  {
    "ticker": "TRV",
    "nome": "The Travelers Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros Corporativos"
  },
  {
    "ticker": "TSCO",
    "nome": "Tractor Supply Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Artigos para Fazendas e Animais"
  },
  {
    "ticker": "TSLA",
    "nome": "Tesla Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Carros Elétricos e Baterias Megapack"
  },
  {
    "ticker": "TSN",
    "nome": "Tyson Foods",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Frigoríficos e Proteína Bovina/Aves"
  },
  {
    "ticker": "TT",
    "nome": "Trane Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Ar Condicionado Central Trane"
  },
  {
    "ticker": "TTWO",
    "nome": "Take-Two Interactive",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rockstar Games e Franquia GTA"
  },
  {
    "ticker": "TXN",
    "nome": "Texas Instruments",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Chips Analógicos e Calculadoras"
  },
  {
    "ticker": "TXT",
    "nome": "Textron Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Jatos Cessna e Helicópteros Bell"
  },
  {
    "ticker": "TYL",
    "nome": "Tyler Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Sistemas para Tribunais e Câmaras"
  },
  {
    "ticker": "UAL",
    "nome": "United Airlines Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Linhas Aéreas Nacionais e Internacionais"
  },
  {
    "ticker": "UBER",
    "nome": "Uber Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Corridas de Carro e Entregas Uber Eats"
  },
  {
    "ticker": "UDR",
    "nome": "UDR Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Comunidades de Apartamentos"
  },
  {
    "ticker": "UHS",
    "nome": "Universal Health Services",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Hospitais Gerais e de Saúde Mental"
  },
  {
    "ticker": "ULTA",
    "nome": "Ulta Beauty",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Lojas de Maquiagem e Salões"
  },
  {
    "ticker": "UNH",
    "nome": "UnitedHealth Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Empresa de Saúde dos EUA"
  },
  {
    "ticker": "UNP",
    "nome": "Union Pacific Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede Ferroviária no Oeste dos EUA"
  },
  {
    "ticker": "UPS",
    "nome": "United Parcel Service",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Entregas em Furgões Marrons"
  },
  {
    "ticker": "URI",
    "nome": "United Rentals",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Locação de Máquinas Pesadas de Construção"
  },
  {
    "ticker": "USB",
    "nome": "U.S. Bancorp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Banco com 2.000 Agências"
  },
  {
    "ticker": "V",
    "nome": "Visa Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Processamento de Pagamentos VisaNet"
  },
  {
    "ticker": "VICI",
    "nome": "VICI Properties Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Imóveis de Cassino Caesars"
  },
  {
    "ticker": "VLO",
    "nome": "Valero Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Refinarias de Petróleo no Golfo"
  },
  {
    "ticker": "VLTO",
    "nome": "Veralto Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Tratamento de Água e Purificação"
  },
  {
    "ticker": "VMC",
    "nome": "Vulcan Materials",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Pedreiras e Asfalto para Rodovias"
  },
  {
    "ticker": "VRSK",
    "nome": "Verisk Analytics",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bancos de Dados para Subscrição de Riscos"
  },
  {
    "ticker": "VRSN",
    "nome": "VeriSign Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Operação da Raiz de Nomes DNS da Internet"
  },
  {
    "ticker": "VRTX",
    "nome": "Vertex Pharmaceuticals",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Medicamentos para Fibrose Cística"
  },
  {
    "ticker": "VST",
    "nome": "Vistra Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Usinas de Eletricidade e Armazenamento em Baterias"
  },
  {
    "ticker": "VTR",
    "nome": "Ventas Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Residências para Terceira Idade"
  },
  {
    "ticker": "VTRS",
    "nome": "Viatris Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Genéricos e Medicamentos Estabelecidos"
  },
  {
    "ticker": "VZ",
    "nome": "Verizon Communications",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede Celular 5G e Fios"
  },
  {
    "ticker": "WAB",
    "nome": "Wabtec Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Equipamentos Eletrônicos para Trens"
  },
  {
    "ticker": "WAT",
    "nome": "Waters Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Espectrômetros de Massa"
  },
  {
    "ticker": "WBA",
    "nome": "Walgreens Boots Alliance",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Rede Farmacêutica em Cada Esquina"
  },
  {
    "ticker": "WBD",
    "nome": "Warner Bros. Discovery",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Estúdios Warner Bros, HBO e Max"
  },
  {
    "ticker": "WDC",
    "nome": "Western Digital",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "HDs e Memórias SanDisk"
  },
  {
    "ticker": "WEC",
    "nome": "WEC Energy Group",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Energia em Wisconsin e Illinois"
  },
  {
    "ticker": "WELL",
    "nome": "Welltower Inc",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Moradias Assistidas para Idosos"
  },
  {
    "ticker": "WFC",
    "nome": "Wells Fargo & Co",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Crédito Imobiliário e Varejo Bancário"
  },
  {
    "ticker": "WM",
    "nome": "Waste Management",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Coleta e Destinação de Resíduos Sólidos"
  },
  {
    "ticker": "WMB",
    "nome": "The Williams Companies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Gasoduto Transco"
  },
  {
    "ticker": "WMT",
    "nome": "Walmart Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Varejista Físico do Planeta"
  },
  {
    "ticker": "WRB",
    "nome": "W. R. Berkley Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Seguros para Frotas e Riscos Comerciais"
  },
  {
    "ticker": "WRK",
    "nome": "WestRock (Smurfit Westrock)",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Embalagens e Papel Kraft"
  },
  {
    "ticker": "WST",
    "nome": "West Pharmaceutical Services",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Componentes para Injeções Médicas"
  },
  {
    "ticker": "WTW",
    "nome": "Willis Towers Watson",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Consultoria de Riscos e Benefícios"
  },
  {
    "ticker": "WY",
    "nome": "Weyerhaeuser Co",
    "mercado": "US",
    "tipo": "REIT",
    "setor": "REIT - Florestas de Pinus para Madeira"
  },
  {
    "ticker": "WYNN",
    "nome": "Wynn Resorts",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Resorts de Luxo em Vegas e Boston"
  },
  {
    "ticker": "XEL",
    "nome": "Xcel Energy",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Geração Eólica em 8 Estados"
  },
  {
    "ticker": "XOM",
    "nome": "Exxon Mobil Corp",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Maior Empresa de Petróleo dos EUA"
  },
  {
    "ticker": "XYL",
    "nome": "Xylem Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Bombas e Tecnologias de Água Flygt"
  },
  {
    "ticker": "YUM",
    "nome": "Yum! Brands",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Franquias KFC, Pizza Hut e Taco Bell"
  },
  {
    "ticker": "ZBH",
    "nome": "Zimmer Biomet Holdings",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Próteses Ortopédicas"
  },
  {
    "ticker": "ZBRA",
    "nome": "Zebra Technologies",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Leitores de Código de Barras e RFID"
  },
  {
    "ticker": "ZTS",
    "nome": "Zoetis Inc",
    "mercado": "US",
    "tipo": "AÇÃO",
    "setor": "Remédios e Vacinas Veterinárias"
  }
];

// 5. MAPA GERAL UNIFICADO
export const GLOBAL_UNIVERSE: UniverseAsset[] = [
  ...UNIVERSE_B3_TOP50,
  ...UNIVERSE_FIIS_BR,
  ...UNIVERSE_REITS_US,
  ...UNIVERSE_SP500,
];

const universeMap = new Map<string, UniverseAsset>();
GLOBAL_UNIVERSE.forEach((a) => {
  const key = a.ticker.toUpperCase();
  if (!universeMap.has(key)) {
    universeMap.set(key, a);
  }
});

export const ALL_UNIVERSE_MAP = universeMap;

export function findInUniverse(query: string): UniverseAsset | undefined {
  if (!query) return undefined;
  const clean = query.trim().toUpperCase();
  return universeMap.get(clean) || universeMap.get(clean.replace('.SA', ''));
}

export function searchUniverse(query: string, limit = 15): UniverseAsset[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toUpperCase();
  const results: UniverseAsset[] = [];

  for (const asset of universeMap.values()) {
    if (
      asset.ticker.toUpperCase().includes(q) ||
      asset.nome.toUpperCase().includes(q) ||
      (asset.setor && asset.setor.toUpperCase().includes(q))
    ) {
      results.push(asset);
      if (results.length >= limit) break;
    }
  }

  return results;
}

export function getUniverseStats() {
  const b3Count = UNIVERSE_B3_TOP50.length;
  const fiisCount = UNIVERSE_FIIS_BR.length;
  const reitsCount = UNIVERSE_REITS_US.length;
  const sp500Count = UNIVERSE_SP500.length;
  const total = universeMap.size;

  return {
    total,
    b3Count,
    fiisCount,
    reitsCount,
    sp500Count,
    description: `${total} ativos monitorados: ${sp500Count} constituintes do S&P 500, ${b3Count} ações líderes da B3, ${fiisCount} Fundos Imobiliários brasileiros (FIIs) e ${reitsCount} Real Estate Investment Trusts americanos (REITs).`,
  };
}
