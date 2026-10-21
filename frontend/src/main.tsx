import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <h1>AntiTrader</h1>
      <p>Análise quantitativa para decisões de longo prazo.</p>
      <h2>Base do MVP</h2>
      <p>Em breve: indicadores fundamentalistas, avaliação de ativos e relatórios diários.</p>
      <p>Esta versão contém apenas a estrutura inicial, sem cotações ou recomendações.</p>
      <small>Conteúdo informativo. Não constitui recomendação de investimento.</small>
    </main>
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      console.warn('Não foi possível habilitar o modo offline.');
    });
  });
}
