// Dicionário inteligente e curado de perfis empresariais para a B3 e S&P 500
// Fornece ao investidor contexto direto sobre o que a empresa faz e como ganha dinheiro.

export interface CompanyProfile {
  setorPt: string;
  segmento: string;
  descricao: string;
}

export const SETORES_TRADUZIDOS: Record<string, string> = {
  'Financial Services': 'Serviços Financeiros & Bancos',
  'Utilities': 'Utilidade Pública (Energia & Saneamento)',
  'Energy': 'Petróleo, Gás & Biocombustíveis',
  'Basic Materials': 'Materiais Básicos (Mineração, Papel & Celulose)',
  'Industrials': 'Bens Industriais & Infraestrutura',
  'Real Estate': 'Imobiliário (FIIs & Propriedades Comerciais)',
  'Technology': 'Tecnologia & Semicondutores',
  'Healthcare': 'Saúde & Farmacêutico',
  'Communication Services': 'Comunicações & Telecomunicações',
  'Consumer Cyclical': 'Consumo Cíclico & Varejo',
  'Consumer Defensive': 'Consumo Não Cíclico & Alimentos',
};

export const PERFIS_EMPRESAS: Record<string, CompanyProfile> = {
  // === AÇÕES DA B3 (BRASIL) ===
  'BBAS3': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Intermediação Financeira / Agro',
    descricao: 'Maior instituição bancária do agronegócio na América Latina e banco mais antigo do Brasil (fundado em 1808). Líder em crédito rural com monopólio operacional no Plano Safra e gestão exclusiva de folhas de pagamento públicas.',
  },
  'PETR4': {
    setorPt: 'Petróleo, Gás & Biocombustíveis',
    segmento: 'Exploração, Refino e Distribuição',
    descricao: 'Gigante integrada de energia e maior produtora de petróleo do Brasil. Detém ativos de classe mundial no Pré-Sal com lifting cost ultra-competitivo (abaixo de US$ 6/barril), gerando volumosos fluxos de caixa e dividendos.',
  },
  'BBDC4': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos e Previdência / Seguros',
    descricao: 'Um dos maiores grupos bancários privados do país, com destaque na operação integrada do Grupo Bradesco Seguros (líder em saúde e previdência), capilaridade física nacional e foco em crédito a pessoas físicas e PMEs.',
  },
  'CMIG4': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Geração, Transmissão e Distribuição',
    descricao: 'Companhia Energética de Minas Gerais, uma das maiores concessionárias integradas do setor elétrico brasileiro. Opera vasta rede de distribuição regulada em MG e usinas hidrelétricas com fluxos de receita previsíveis.',
  },
  'CSAN3': {
    setorPt: 'Bens Industriais & Infraestrutura',
    segmento: 'Holding de Energia e Logística',
    descricao: 'Holding líder em transição energética e infraestrutura pesada. Controla a Raízen (açúcar, etanol e postos Shell), Rumo (maior operadora ferroviária da América Latina), Compass (distribuição de gás) e Moove (lubrificantes).',
  },
  'SAPR11': {
    setorPt: 'Utilidade Pública (Saneamento)',
    segmento: 'Água e Tratamento de Esgoto',
    descricao: 'Companhia de Saneamento do Paraná (Sanepar), com monopólio concedido de captação, tratamento e distribuição de água e esgotamento sanitário em centenas de municípios paranaenses, assegurando demanda inelástica e previsível.',
  },
  'CPLE3': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Geração e Distribuição de Energia',
    descricao: 'Copel (Companhia Paranaense de Energia), privatizada em 2023. Opera parque de geração hidrelétrica e eólica de baixo custo e ampla rede de distribuição regulada no estado do Paraná, com rigorosa eficiência de custos.',
  },
  'CPLE6': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Geração e Distribuição de Energia',
    descricao: 'Copel (ações preferenciais). Concessionária integrada de geração e distribuição de energia elétrica no Sul do Brasil, caracterizada por receitas indexadas à inflação e elevado histórico de proventos aos acionistas.',
  },
  'VALE3': {
    setorPt: 'Materiais Básicos (Mineração)',
    segmento: 'Minério de Ferro e Metais Básicos',
    descricao: 'Segunda maior produtora mundial de minério de ferro e níquel. Opera a ferrovia Carajás e minas de alto teor de ferro (65%+ Fe), garantindo margens brutas elevadas mesmo em ciclos baixos de commodities.',
  },
  'ITSA4': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Holding Multissetorial',
    descricao: 'Holding de investimentos que controla o Itaú Unibanco (maior banco privado da América Latina) e detém participações estratégicas na Dexco (materiais de construção), Alpargatas (Havaianas), CCR (rodovias) e NTS (gasodutos).',
  },
  'CXSE3': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancassurance / Seguros e Previdência',
    descricao: 'Braço segurador da Caixa Econômica Federal. Opera sem custos de agências próprias ao comercializar seguros residenciais, habitacionais, prestamistas e previdência privada exclusivamente na rede de 4.000+ agências e lotéricas da Caixa.',
  },
  'WEGE3': {
    setorPt: 'Bens Industriais & Infraestrutura',
    segmento: 'Motores Elétricos e Automação',
    descricao: 'Multinacional brasileira líder global em motores industriais elétricos, geradores, transformadores e sistemas de automação de energia. Reconhecida mundialmente por ROIC superior a 30% e contínua expansão internacional.',
  },
  'TAEE11': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Transmissão Elétrica Regulada',
    descricao: 'Transmissora Aliança de Energia Elétrica, focada 100% no segmento de transmissão (as linhas de alta tensão). Suas receitas são 100% baseadas em RAP (Receita Anual Permitida) reajustadas por IPCA ou IGP-M, com risco de demanda nulo.',
  },
  'EGIE3': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Geração Renovável e Transmissão',
    descricao: 'Maior geradora privada de energia 100% renovável do Brasil (hidrelétrica, eólica, solar e biomassa), controlada pelo grupo francês Engie. Destaca-se por governança corporativa de excelência e previsibilidade de caixa.',
  },
  'SANB11': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos Múltiplos Comerciais',
    descricao: 'Subsidiária brasileira do Banco Santander espanhol, com forte presença nos mercados de crédito consignado, financiamento de veículos e alta renda (Select), operando com robusta solvência patrimonial.',
  },
  'BBSE3': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancassurance / Seguros e Previdência',
    descricao: 'BB Seguridade Participações. Comercializa produtos de seguros (com destaque absoluto em seguro agrícola e penhor rural), previdência aberta (Brasilprev) e capitalização no balcão capilar do Banco do Brasil.',
  },
  'VIVT3': {
    setorPt: 'Comunicações & Telecomunicações',
    segmento: 'Telefonia Móvel e Fibra Óptica',
    descricao: 'Telefônica Brasil (Vivo), líder absoluta em telefonia móvel e banda larga de ultra velocidade em fibra óptica (FTTH) no Brasil, gerando fluxos de caixa recorrentes e alta distribuição de capital aos acionistas.',
  },
  'KLBN11': {
    setorPt: 'Materiais Básicos (Papel & Celulose)',
    segmento: 'Embalagens e Papel Kraftliner',
    descricao: 'Maior produtora e exportadora de papéis para embalagens e embalagens de papelão ondulado do Brasil, com fábrica integrada de celulose de fibra curta, longa e fluff (Projeto Puma).',
  },
  'VBBR3': {
    setorPt: 'Petróleo, Gás & Biocombustíveis',
    segmento: 'Distribuição de Combustíveis e Conveniência',
    descricao: 'Vibra Energia (antiga Petrobras Distribuidora). Maior distribuidora de combustíveis e lubrificantes do Brasil, operando a rede de postos Petrobras e lojas de conveniência BR Mania.',
  },

  // === FUNDOS IMOBILIÁRIOS (FIIs) ===
  'HGLG11': {
    setorPt: 'Imobiliário (FII)',
    segmento: 'Galpões Logísticos e Industriais',
    descricao: 'Um dos maiores e mais consolidados fundos de galpões logísticos classe A do Brasil, com imóveis modernos localizados nos principais eixos de consumo de São Paulo, Minas Gerais e Rio de Janeiro, atendendo comércio eletrônico.',
  },
  'MXRF11': {
    setorPt: 'Imobiliário (FII)',
    segmento: 'Títulos e Valores Mobiliários (Papel)',
    descricao: 'Maior fundo imobiliário em número de cotistas da B3. Investe predominantemente em Certificados de Recebíveis Imobiliários (CRIs) de alta liquidez e remuneração atrelada ao CDI e inflação.',
  },
  'KNIP11': {
    setorPt: 'Imobiliário (FII)',
    segmento: 'Recebíveis Imobiliários High Grade',
    descricao: 'Fundo imobiliário gerido pela Kinea (Itaú). Carteira focada em CRIs institucionais de baixíssimo risco de crédito (High Grade), 100% indexados à inflação (IPCA + spread), com excelente histórico de proteção patrimonial.',
  },
  'XPML11': {
    setorPt: 'Imobiliário (FII)',
    segmento: 'Shopping Centers',
    descricao: 'Fundo da XP focado em participação direta em shopping centers líderes em capitais e grandes centros metropolitanos do Brasil, com receitas baseadas em aluguel fixo, faturamento dos lojistas e estacionamento.',
  },

  // === AÇÕES DOS ESTADOS UNIDOS (S&P 500 & MERCADO GLOBAL) ===
  'GOOGL': {
    setorPt: 'Tecnologia & Comunicações',
    segmento: 'Mecanismo de Busca, Nuvem e IA',
    descricao: 'Alphabet Inc. Líder mundial em publicidade digital e buscas (Google Search), vídeos (YouTube), sistemas operacionais (Android) e infraestrutura em nuvem e inteligência artificial generativa (Google Cloud).',
  },
  'AAPL': {
    setorPt: 'Tecnologia',
    segmento: 'Dispositivos Eletrônicos e Serviços',
    descricao: 'Apple Inc. Criadora do iPhone, Mac, iPad e ecossistema fechado de serviços por assinatura (App Store, Apple Pay, iCloud), com incomparável fidelidade de consumidores e poder de precificação.',
  },
  'MSFT': {
    setorPt: 'Tecnologia',
    segmento: 'Software Corporativo e Computação em Nuvem',
    descricao: 'Microsoft Corporation. Gigante global dona do Azure Cloud, Microsoft 365 (Office), Windows, LinkedIn e líder em investimentos em inteligência artificial aplicada ao ambiente corporativo.',
  },
  'AMZN': {
    setorPt: 'Consumo Cíclico & Tecnologia',
    segmento: 'E-commerce Global e Cloud Computing (AWS)',
    descricao: 'Amazon.com. Maior ecossistema de varejo eletrônico e logística rápida do Ocidente, impulsionada pela Amazon Web Services (AWS), a maior plataforma de computação em nuvem do planeta.',
  },
  'JPM': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Banco Universal e de Investimentos',
    descricao: 'JPMorgan Chase & Co. Maior instituição financeira dos Estados Unidos por ativos totais, com liderança em banco comercial, banco de investimentos global, tesouraria e gestão de fortunas.',
  },
  'BAC': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos Comerciais e Financiamentos',
    descricao: 'Bank of America Corporation. Segundo maior banco dos EUA, atendendo mais de 68 milhões de consumidores e pequenas empresas através de depósitos a baixo custo e ampla rede digital.',
  },
  'WFC': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos e Empréstimos Hipotecários',
    descricao: 'Wells Fargo & Company. Banco comercial de relevância sistêmica focado no mercado interno norte-americano, em crédito corporativo, financiamento imobiliário e cartões.',
  },
  'C': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Banco Institucional e Comercial Global',
    descricao: 'Citigroup Inc. Instituição financeira global com presença singular em mais de 160 países, especializada em pagamentos corporativos internacionais, tesouraria e trade finance.',
  },
  'ALL': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Seguros Residenciais e Automotivos',
    descricao: 'The Allstate Corporation. Uma das maiores seguradoras de bens e responsabilidades civis dos EUA, gerando receitas recorrentes de prêmios de seguro de automóveis e residências.',
  },
  'FIS': {
    setorPt: 'Tecnologia & Financeiro',
    segmento: 'Processamento de Pagamentos e Banking Core',
    descricao: 'Fidelity National Information Services. Fornecedora de infraestrutura de tecnologia e software para bancos comerciais, processamento de cartões e sistemas financeiros mundiais.',
  },
  'EIX': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Distribuição e Transmissão de Energia',
    descricao: 'Edison International. Concessionária elétrica de utilidade pública controladora da Southern California Edison, abastecendo milhões de residências e indústrias na Califórnia.',
  },
  'ACGL': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Resseguros e Seguros Especializados',
    descricao: 'Arch Capital Group Ltd. Companhia global de seguros e resseguros sediada nas Bermudas, operando em linhas especializadas com disciplina rigorosa de subscrição de riscos.',
  },
  'UHS': {
    setorPt: 'Saúde & Farmacêutico',
    segmento: 'Hospitais e Saúde Comportamental',
    descricao: 'Universal Health Services. Uma das maiores redes de hospitais de cuidados intensivos e centros de saúde comportamental dos Estados Unidos e Reino Unido.',
  },
  'EG': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Resseguros Globais',
    descricao: 'Everest Group Ltd. Líder global em resseguros e seguros patrimoniais, protegendo grandes seguradoras primárias contra catástrofes e sinistros complexos.',
  },
  'VICI': {
    setorPt: 'Imobiliário (REIT)',
    segmento: 'Propriedades de Entretenimento e Cassinos',
    descricao: 'VICI Properties Inc. Um dos maiores REITs imobiliários do mundo, proprietário do Caesars Palace, MGM Grand e Bellagio em Las Vegas, com contratos de aluguel triple-net de 30+ anos 100% adimplentes.',
  },
  'CINF': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Seguros Empresariais e de Propriedade',
    descricao: 'Cincinnati Financial Corporation. Seguradora centenária com histórico exemplar de mais de 60 anos consecutivos de aumentos nos dividendos distribuídos (Dividend King).',
  },
  'HBAN': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Banco Regional Americano (Midwest)',
    descricao: 'Huntington Bancshares Inc. Banco regional centrado no Meio-Oeste dos EUA (Ohio, Michigan, Pensilvânia), especializado em crédito para pequenas empresas e financiamento automotivo.',
  },
  'CMCSA': {
    setorPt: 'Comunicações & Telecomunicações',
    segmento: 'Banda Larga, TV a Cabo e Entretenimento',
    descricao: 'Comcast Corporation. Conglomerado proprietário da rede de banda larga Xfinity, dos estúdios Universal Pictures e dos parques temáticos Universal Studios ao redor do mundo.',
  },
  'SYF': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Crédito ao Consumidor e Cartões Co-branded',
    descricao: 'Synchrony Financial. Maior emissora de cartões de crédito private label dos EUA, em parceria com gigantes do varejo físico e eletrônico (Amazon, Lowe\'s, TJX).',
  },
  'MTB': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Banco Comercial no Nordeste dos EUA',
    descricao: 'M&T Bank Corporation. Instituição financeira conservadora com foco em crédito comercial imobiliário e relacionamentos corporativos duradouros em NY, Maryland e NJ.',
  },
  'PNC': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Banco Múltiplo Regional e Nacional',
    descricao: 'PNC Financial Services Group. Um dos principais bancos comerciais dos EUA, com presença diversificada em varejo bancário, gestão de ativos e serviços para empresas.',
  },
  'USB': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos Comerciais e Custódia Corporativa',
    descricao: 'U.S. Bancorp. Quinto maior banco comercial dos EUA, destacado por sua divisão institucional de processamento de pagamentos globais (Elavon) e serviços de custódia corporativa.',
  },
  'HIG': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Seguros Comerciais e Benefícios a Empregados',
    descricao: 'The Hartford Insurance Group. Seguradora de mais de 200 anos de tradição, fornecedora de seguros corporativos, cobertura de acidentes de trabalho e planos de previdência.',
  },
  'AES': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Geração e Distribuição Global de Energia',
    descricao: 'The AES Corporation. Concessionária multinacional que opera usinas renováveis e redes de distribuição em múltiplos países, incluindo contratos de energia solar e armazenamento em baterias.',
  },
  'CFG': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Bancos Comerciais e Financiamento Estudantil',
    descricao: 'Citizens Financial Group. Grande banco com base na Nova Inglaterra e Meio-Oeste, com operações em crédito ao consumidor, hipotecas e linhas de capital de giro.',
  },
  'CHTR': {
    setorPt: 'Comunicações & Telecomunicações',
    segmento: 'Provedora de Internet e Cabo (Spectrum)',
    descricao: 'Charter Communications. Segunda maior operadora de cabo e banda larga dos EUA pela marca Spectrum, cobrindo dezenas de milhões de residências.',
  },
  'RJF': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Assessoria de Investimentos e Wealth Management',
    descricao: 'Raymond James Financial. Empresa de gestão patrimonial e assessoria financeira com milhares de consultores independentes e fundos geridos nos EUA e Europa.',
  },
  'CB': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Seguradora Multilinha Global',
    descricao: 'Chubb Limited. Maior seguradora de propriedades e responsabilidade civil de capital aberto do mundo, presente em 54 países e conhecida por sua subscrição de elite.',
  },
  'PYPL': {
    setorPt: 'Tecnologia & Financeiro',
    segmento: 'Carteiras Digitais e Pagamentos Online',
    descricao: 'PayPal Holdings. Plataforma de pagamentos digitais operadora do PayPal, Venmo e Braintree, conectando centenas de milhões de consumidores e comerciantes globalmente.',
  },
  'SMCI': {
    setorPt: 'Tecnologia',
    segmento: 'Servidores de Alta Densidade e Infraestrutura de IA',
    descricao: 'Super Micro Computer Inc. Fabricante líder de servidores modulares e clusters de computação de alta eficiência para data centers acelerados por GPUs de inteligência artificial.',
  },
  'CRH': {
    setorPt: 'Materiais Básicos (Construção)',
    segmento: 'Agregados, Asfalto e Concreto',
    descricao: 'CRH plc. Maior fabricante e distribuidora de materiais de construção pesada da América do Norte e Europa, fornecendo agregados e cimento para grandes obras de infraestrutura.',
  },
  'NEM': {
    setorPt: 'Materiais Básicos (Mineração)',
    segmento: 'Mineração de Ouro e Cobre',
    descricao: 'Newmont Corporation. Maior produtora mundial de ouro em reservas e volume de extração, com minas ativas na América do Norte, América do Sul, África e Austrália.',
  },
  'AMP': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Planejamento Financeiro e Gestão de Ativos',
    descricao: 'Ameriprise Financial. Companhia de planejamento patrimonial com mais de um século de história, gerindo trilhões de dólares para famílias de alta renda.',
  },
  'NEE': {
    setorPt: 'Utilidade Pública (Energia)',
    segmento: 'Energia Solar, Eólica e Concessionária Elétrica',
    descricao: 'NextEra Energy Inc. Maior produtora mundial de energia eólica e solar renovável e controladora da Florida Power & Light, a concessionária de maior crescimento nos EUA.',
  },
  'CF': {
    setorPt: 'Materiais Básicos (Química)',
    segmento: 'Fertilizantes Nitrogenados e Amônia',
    descricao: 'CF Industries Holdings. Líder mundial na fabricação de fertilizantes à base de nitrogênio, amônia verde e insumos agrícolas essenciais para a produção global de alimentos.',
  },
  'SCHW': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Corretora de Valores e Custódia de Ativos',
    descricao: 'The Charles Schwab Corporation. Maior corretora de investimentos individuais dos EUA e custodiante de assessores de investimentos, com trilhões em ativos de clientes.',
  },
  'FSLR': {
    setorPt: 'Tecnologia & Energia',
    segmento: 'Painéis Fotovoltaicos de Telureto de Cádmio',
    descricao: 'First Solar Inc. Maior fabricante americana de módulos solares avançados de película fina, pioneira em sustentabilidade e com ampla carteira de pedidos industriais.',
  },
  'ZTS': {
    setorPt: 'Saúde & Farmacêutico',
    segmento: 'Medicamentos e Vacinas para Saúde Animal',
    descricao: 'Zoetis Inc. Líder global indiscutível na descoberta, fabricação e venda de vacinas, antibióticos e diagnósticos veterinários para animais de companhia e pecuária.',
  },
  'MU': {
    setorPt: 'Tecnologia',
    segmento: 'Memórias DRAM e Armazenamento NAND Flash',
    descricao: 'Micron Technology Inc. Uma das raras fabricantes mundiais de chips de memória DRAM e memórias flash de alta velocidade (HBM) utilizadas em servidores de inteligência artificial.',
  },
  'AXP': {
    setorPt: 'Serviços Financeiros & Bancos',
    segmento: 'Cartões Premium e Rede de Pagamentos Fechada',
    descricao: 'American Express Company. Instituição financeira global com rede de pagamentos própria, focada em clientes de alta renda com consumo elevado e fidelidade a recompensas.',
  },
  'LDOS': {
    setorPt: 'Bens Industriais & Defesa',
    segmento: 'Tecnologia de Defesa, Inteligência e Aeroespacial',
    descricao: 'Leidos Holdings Inc. Fornecedora de soluções tecnológicas e de cibersegurança para o Departamento de Defesa dos EUA, agências de inteligência e segurança nacional.',
  },
};

/**
 * Retorna o perfil descritivo da empresa (O que ela faz, Setor e Segmento).
 * Se a empresa não estiver explicitamente mapeada, sintetiza uma descrição elegante
 * a partir dos dados do ativo (Setor, Nome, Tipo de Ativo e Moat).
 */
export function getCompanyProfile(ativo: {
  ticker: string;
  nome?: string;
  setor?: string;
  tipoAtivo?: string;
  moat?: string;
  breveAnalise?: string;
}): CompanyProfile {
  const tickerKey = (ativo.ticker || '').toUpperCase().trim();

  if (PERFIS_EMPRESAS[tickerKey]) {
    return PERFIS_EMPRESAS[tickerKey];
  }

  // Tradução do setor
  const setorIngles = ativo.setor || 'Financial Services';
  const setorPt = SETORES_TRADUZIDOS[setorIngles] || setorIngles;

  // Segmento padrão
  let segmento = 'Atuação Corporativa & Comercial';
  if (ativo.tipoAtivo === 'FII' || ativo.tipoAtivo === 'REIT') {
    segmento = 'Renda Imobiliária & Locação';
  } else if (setorIngles.includes('Financial')) {
    segmento = 'Serviços Financeiros & Capital';
  } else if (setorIngles.includes('Utilities')) {
    segmento = 'Concessões de Serviços Públicos';
  } else if (setorIngles.includes('Energy')) {
    segmento = 'Energia & Recursos';
  } else if (setorIngles.includes('Technology')) {
    segmento = 'Tecnologia & Softwares';
  } else if (setorIngles.includes('Materials')) {
    segmento = 'Extração & Manufatura de Base';
  }

  // Descrição sintetizada se não tiver entrada fixa
  let descricao = '';
  if (ativo.tipoAtivo === 'FII') {
    descricao = `Fundo de Investimento Imobiliário negociado na B3, com portfólio voltado à geração de renda passiva mensal aos cotistas através de contratos imobiliários estruturados.`;
  } else if (ativo.tipoAtivo === 'REIT') {
    descricao = `Real Estate Investment Trust (REIT) listado no mercado norte-americano, detentor de ativos imobiliários geradores de renda por meio de locação de longo prazo.`;
  } else if (ativo.moat && ativo.moat.length > 20) {
    descricao = `Empresa com atuação relevante no segmento de ${setorPt.toLowerCase()}. ${ativo.moat}`;
  } else {
    descricao = `Companhia listada no mercado de capitais atuante no setor de ${setorPt.toLowerCase()}, com modelo de negócios estruturado e monitoramento contínuo de fundamentos de valuation.`;
  }

  return {
    setorPt,
    segmento,
    descricao,
  };
}
