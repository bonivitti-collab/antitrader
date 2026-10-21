const fs = require('fs');
const path = require('path');

const appPath = path.resolve('src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Clear initial chatMessages wall of text (start with empty [])
const oldChatMessagesInit = `  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      timestamp: '14:35',
      steps: [
        { label: 'Auditoria de Demonstrações Contábeis & Balanços (CVM/SEC)', type: 'explore' },
        { label: 'Cotação em Tempo Real B3 / NYSE Integrada', type: 'audit' },
        { label: 'Múltiplos e Margem de Segurança Validados (Setup Graham)', type: 'thought' },
      ],
      text: \`Olá! Sou o **AntiTrader AI de Inteligência de Mercado & Valuation**.

A **Peneira de Oportunidades da B3 e do S&P 500** está ativa e calibrada estritamente na **Zona de Compra**:
• **Filtro Ativo:** Apenas ativos cotados abaixo ou na Zona de Compra (com margem de segurança configurada).
• **Ativo em Foco:** **Banco do Brasil (BBAS3)** — Cotação R$ 24,64 vs Zona R$ 51,21 (+108% de margem). P/L de 4.0x e Graham Mult de 2.82x.
• **Ativos S&P 500 na Zona:** Pfizer (PFE), AT&T (T), Ford (F), General Motors (GM), British American Tobacco (BTI), Walgreens (WBA).
• **Ativos B3 na Zona:** BBAS3, PETR4, BBDC4, CMIG4, CSAN3, SAPR11, CPLE6, VALE3.

**Como estudar cada oportunidade:**
1. Navegue pela barra superior com a peneira ativada (**Peneira: Apenas Na Zona**).
2. Clique em qualquer empresa para carregar a modelagem detalhada de valuation, múltiplos e balanço auditado.
3. Leia a justificativa e os fundamentos no painel central.
4. Me pergunte qualquer coisa aqui no chat (riscos, projeções, governança, concorrentes ou cenários macroeconômicos) para apoiar sua tomada de decisão!\`,
    },
  ]);`;

// Check CRLF / LF
const oldChatMessagesInitLF = oldChatMessagesInit.replace(/\r\n/g, '\n');
const oldChatMessagesInitCRLF = oldChatMessagesInit.replace(/\r?\n/g, '\r\n');

if (code.includes(oldChatMessagesInitCRLF)) {
  code = code.replace(oldChatMessagesInitCRLF, '  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);');
} else if (code.includes(oldChatMessagesInitLF)) {
  code = code.replace(oldChatMessagesInitLF, '  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);');
} else {
  // Regex fallback
  code = code.replace(/const \[chatMessages, setChatMessages\] = useState<ChatMessage\[\]>\(\[[\s\S]*?\]\);/, 'const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);');
}

// 2. Add followUpSuggestions hook in App.tsx right after chatScrollRef
const followUpLogic = `  // Sugestões inteligentes para prosseguir na conversa (estilo Google AI Studio / Meta AI)
  const followUpSuggestions = useMemo(() => {
    if (chatMessages.length === 0) return [];
    const ultimaMsg = chatMessages[chatMessages.length - 1];
    const texto = ultimaMsg.text.toLowerCase();

    if (texto.includes('dividendo') || texto.includes('yield') || texto.includes('provento') || texto.includes('payout')) {
      return [
        'Qual o histórico e sustentabilidade desse dividendo?',
        'Qual o Preço Teto para garantir 6% de Yield (Método Barsi)?',
        'Quais os 3 maiores riscos para esse pagamento?',
      ];
    }
    if (texto.includes('selic') || texto.includes('juro') || texto.includes('fed') || texto.includes('macro') || texto.includes('inflação')) {
      return [
        'Quais setores da B3 mais sofrem com esse cenário?',
        'Como os FIIs de tijolo e papel reagem a essa taxa?',
        'Qual a perspectiva para o dólar e commodities?',
      ];
    }
    if (texto.includes('banco') || texto.includes('crédito') || texto.includes('inadimplência') || texto.includes('bbas3') || texto.includes('itub4')) {
      return [
        'Como está o índice de inadimplência e cobertura?',
        'Comparar o ROE com os outros grandes bancos',
        'Quais os riscos de governança ou regulação?',
      ];
    }
    if (texto.includes('graham') || texto.includes('preço justo') || texto.includes('tp1') || texto.includes('tp2') || texto.includes('valuation')) {
      return [
        'O que acontece se a receita cair 20% (teste de estresse)?',
        'Quais catalisadores podem fazer o preço convergir pro TP1?',
        'Como definir o tamanho seguro da posição?',
      ];
    }
    return [
      'Quais são os 3 maiores riscos operacionais?',
      'Comparar com os principais concorrentes do setor',
      'Quais catalisadores podem destravar valor nos próximos 12 meses?',
    ];
  }, [chatMessages]);`;

if (!code.includes('const followUpSuggestions = useMemo')) {
  code = code.replace(
    '  const chatScrollRef = useRef<HTMLDivElement>(null);',
    '  const chatScrollRef = useRef<HTMLDivElement>(null);\r\n' + followUpLogic
  );
}

// 3. Decouple AI Header from specific ticker
const oldAiHeader = `<div className="flex items-center gap-1.5 min-w-0">
                <Bot className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    AntiTrader AI • {ativo.ticker}
                  </span>
                </div>
              </div>`;

const newAiHeader = `<div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-bold text-xs text-slate-900 truncate">AntiTrader AI</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                      Copilot
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                    Inteligência de Mercado &amp; Valuation
                  </span>
                </div>
              </div>`;

code = code.replace(/<div className="flex items-center gap-1\.5 min-w-0">\s*<Bot className="w-4 h-4 text-blue-600 shrink-0" \/>\s*<div className="min-w-0">\s*<span className="font-bold text-xs text-slate-900 truncate">\s*AntiTrader AI • \{ativo\.ticker\}\s*<\/span>\s*<\/div>\s*<\/div>/, newAiHeader);

fs.writeFileSync(appPath, code, 'utf8');
console.log('App.tsx step 1 patched successfully!');
