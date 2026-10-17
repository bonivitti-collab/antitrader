# Diretrizes de Layout, Geometria e Mobile - AntiTrader

Ao desenvolver, ajustar ou auditar interfaces neste repositório, siga obrigatoriamente estes padrões:

## 1. Ancoragem de Safe-Area e Topo Mobile
- **Nunca use `backdrop-blur` ou translucidez esfumaçada** na barra superior ou na safe-area do celular. O topo deve ter ancoragem sólida e opaca (`bg-white shrink-0 h-[env(safe-area-inset-top,0px)]`).
- **Rodapés e modais:** Sempre respeite `env(safe-area-inset-bottom, 0px)` para evitar sobreposição com a barra de navegação/home bar do iOS/Android.
- Garanta que as bordas de inputs e caixas de chat fiquem perfeitamente alinhadas, sem cortar extremidades da viewport mobile.

## 2. Alinhamento Horizontal e Bloqueio de Quebra de Linha
- Pares interdependentes de métricas e ações (ex: múltiplos P/L, botões de ação com preço, multiplicador Graham) devem permanecer travados em **linha única horizontal**, sem quebras deselegantes de texto (`whitespace-nowrap`, `shrink-0`).

## 3. Modais e Densidade de Informação em Telas Menores
- Em modais com listas/tabelas no mobile, **a área de scroll deve ser maximizada**.
- Compacte grids de estatísticas no celular: reduza paddings, oculte descrições secundárias redundantes com `hidden sm:inline`, e garanta que o container de rolagem receba `flex-1 min-h-0 overflow-y-auto`.

## 4. Auditoria Multi-Dispositivo
- Sempre valide e mantenha consistência estética nos 3 formatos essenciais:
  - **Notebooks / Laptops** (1024px a 1280px)
  - **Tablets** (768px a 1023px)
  - **Smartphones / Mobile** (360px a 430px)
- Nos desktops/notebooks, priorize layouts com painéis ajustáveis e persistência no `localStorage`.

## 5. Performance de Interação e Latência de Cliques
- Isole relógios e timers periódicos (ex: contagem regressiva de segundos) em subcomponentes memoizados dedicados para não acionar re-render de árvores inteiras de componentes ou de renderizadores markdown.
- Assegure transições focadas (ex: `transition-colors`, `transition-transform`) em vez de `transition-all` indiscriminado que possa degradar o framerate ao tocar/clicar em botões.
