const fs = require('fs');
const path = require('path');

const appPath = path.resolve('src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// The replacement for chat body and suggestions
const newChatBody = `          {/* Mensagens do Chat com Steps de Auditoria ou Welcome Screen no estilo AI Studio / Meta AI */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-xs leading-relaxed font-sans min-h-0">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-3 sm:p-5 max-w-sm sm:max-w-md mx-auto space-y-4 my-auto select-none">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Bot className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Como posso te ajudar hoje?
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                    Sou o <strong>AntiTrader AI</strong>, seu analista de inteligência de mercado. Pergunte sobre qualquer ação, FII, juros, valuation ou riscos.
                  </p>
                </div>

                {/* 3 Sugestões em Destaque (Estilo AI Studio / Meta AI com nosso layout) */}
                <div className="w-full space-y-2 pt-1 text-left">
                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Quais são as melhores ações na Zona de Compra com maior margem de segurança na B3 e no S&P 500 hoje?")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/80 hover:border-blue-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-blue-100 text-blue-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      🔍
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
                        <span>Varredura da Zona de Compra</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Ações com maior margem de segurança e desconto de Graham hoje.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Como o ciclo de juros (Selic e Fed Funds) e inflação estão impactando os setores e FIIs neste momento?")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50/80 hover:border-teal-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-teal-100 text-teal-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      ⚡
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 flex items-center justify-between">
                        <span>Cenário Macro, Selic &amp; Juros</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Impacto dos juros futuros nas ações de dividendos e FIIs.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnviarMensagem("Explique como funciona o cálculo do Preço Justo de Graham e a esteira de metas com TP1 e TP2.")}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/80 hover:border-indigo-400 text-slate-800 transition-all cursor-pointer shadow-2xs group flex items-start gap-2.5 active:scale-98"
                  >
                    <span className="p-1 rounded-md bg-indigo-100 text-indigo-700 text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      🎯
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                        <span>Fórmula Graham &amp; Metas TP1/TP2</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                        Alvos de realização conservador (TP1) e estendido (TP2) com stop.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1.5">
                  {/* Balão da Mensagem */}
                  <div
                    className={\`p-3 rounded-lg leading-relaxed \${
                      msg.sender === 'user'
                        ? 'bg-blue-50/90 text-slate-900 border-2 border-blue-300 ml-3 shadow-2xs'
                        : 'bg-white text-slate-900 border-2 border-slate-300 shadow-2xs mr-1'
                    }\`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1.5 font-mono text-slate-400">
                      <span className="font-bold text-slate-700">
                        {msg.sender === 'user' ? 'Você' : 'AntiTrader AI'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {msg.sender === 'user' ? (
                      <div className="whitespace-pre-line text-xs font-medium text-slate-800">
                        {msg.text}
                      </div>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}

                    {msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                        <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="font-bold">Pesquisa Web:</span>
                        <span className="truncate italic">"{msg.searchQueries.join(', ')}"</span>
                      </div>
                    )}

                    {msg.searchSources && msg.searchSources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
                        <span className="text-slate-500 font-mono text-[9px] font-bold">Fontes Web:</span>
                        {msg.searchSources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 text-[9px] hover:text-blue-700 transition-colors"
                            title={s.title}
                          >
                            <span className="truncate max-w-[120px]">{s.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.source && (
                      <div className="mt-2 pt-1 border-t border-slate-200 text-[9px] font-mono text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span>Origem:</span>
                          <strong className="text-slate-600">{msg.source}</strong>
                        </div>
                        <span className="text-slate-400">Setup Graham-Buffett</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {enviandoMsg && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 p-2 bg-slate-50 rounded border border-slate-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consultando inteligência de mercado e fundamentos com IA...</span>
              </div>
            )}
          </div>

          {/* Sugestões Dinâmicas para Prosseguir na Conversa (Estilo Google AI Studio / Meta AI com nosso layout) */}
          <div className="px-2.5 py-1.5 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>{chatMessages.length > 0 ? 'Prosseguir:' : 'Tópicos:'}</span>
            </span>
            {(chatMessages.length > 0 && followUpSuggestions.length > 0
              ? followUpSuggestions
              : [
                  \`Análise de \${ativo.ticker}\`,
                  'Varredura da Zona de Compra',
                  'Impacto da Selic e Juros',
                  'Preço Teto Método Barsi',
                  'Simulação de Estresse (-25%)',
                ]
            ).map((sugestao, idx) => {
              const textoEnvio = typeof sugestao === 'string' && sugestao.startsWith('Análise de')
                ? \`Faça uma análise completa de valuation, múltiplos e margem de segurança de \${ativo.ticker}.\`
                : sugestao;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleEnviarMensagem(textoEnvio)}
                  disabled={enviandoMsg}
                  className="text-[10.5px] text-slate-700 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-500 hover:text-blue-700 rounded-full px-2.5 py-0.5 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs shrink-0 flex items-center gap-1 disabled:opacity-50 active:scale-95"
                >
                  <span>{sugestao}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50 text-blue-600" />
                </button>
              );
            })}
          </div>`;

// Find and replace the chat body section
const targetStart = '{/* Mensagens do Chat com Steps de Auditoria e Formatação Rica */}';
const targetEnd = '{/* Caixa de Digitação do Chat - Geometria Perfeita e Ajuste Fino para Mobile e Desktop */}';

const startIndex = code.indexOf(targetStart);
const endIndex = code.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.slice(0, startIndex) + newChatBody + '\r\n\r\n          ' + code.slice(endIndex);
  fs.writeFileSync(appPath, code, 'utf8');
  console.log('App.tsx chat body successfully replaced with AI Studio / Meta AI suggestions!');
} else {
  console.error('Target anchors not found for chat body replacement!');
  process.exit(1);
}
