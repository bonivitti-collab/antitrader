# AntiTrader — PWA para Análise Quantitativa

Base minimalista para uma aplicação de análise fundamentalista e quantitativa,
com foco em investimento de longo prazo, margem de segurança e relatórios diários
dos mercados B3 e americano (incluindo um futuro universo S&P 500).

**Estado atual:** estrutura inicial funcional. Não há integração com provedores,
coleta de cotações, cálculo de indicadores, autenticação ou recomendações reais.
A aplicação anterior foi substituída por esta base; suas funcionalidades não foram
migradas. Informações financeiras futuras serão educativas, não recomendações de
investimento.

## Stack e requisitos

- Node.js 24 ou superior e npm.
- Backend: Express, TypeScript, PostgreSQL e cliente Redis.
- Frontend: React, TypeScript e Vite; service worker gerado por vite-plugin-pwa.
- Docker com Compose v2 para PostgreSQL 17 e Redis 7.

## Estrutura

```text
backend/
  .env.example
  package.json
  package-lock.json
  tsconfig.json
  src/
    index.ts
    types/index.ts
    db/schema.sql
frontend/
  package.json
  package-lock.json
  tsconfig.json
  vite.config.ts
  index.html
  public/
    manifest.json
    pwa-192x192.png
    pwa-512x512.png
  src/
    main.tsx
    index.css
docker-compose.yml
.gitignore
README.md
```

## Instalação e desenvolvimento

Execute os comandos na raiz do repositório, salvo indicação contrária.

1. Configure o ambiente:

   ```sh
   cp backend/.env.example backend/.env
   ```

   Substitua os valores `replace-me` por senhas locais diferentes. As senhas são
   compartilhadas pelo Compose e pelo backend via `POSTGRES_PASSWORD` e
   `REDIS_PASSWORD`, sem incluí-las nas URLs. Se alterar o usuário, banco ou host,
   ajuste também `DATABASE_URL` e `REDIS_URL`.
   Não versione o arquivo `.env` nem utilize as credenciais de exemplo em produção.

2. Inicie a infraestrutura:

   ```sh
   docker compose --env-file backend/.env up -d --wait
   ```

   O schema é aplicado automaticamente **somente na primeira criação do volume
   PostgreSQL**. Não execute o SQL novamente sobre um banco já inicializado:
   o arquivo é um schema inicial transacional, não uma migração idempotente.

3. Instale as dependências:

   ```sh
   npm ci --prefix backend
   npm ci --prefix frontend
   ```

4. Em um terminal:

   ```sh
   cd backend
   npm run dev
   ```

5. Em outro terminal:

   ```sh
   cd frontend
   npm run dev
   ```

Abra http://localhost:5173. O Vite encaminha `/api` para
http://127.0.0.1:3000 sem necessidade de CORS.

### Variáveis do backend

| Variável | Uso |
| --- | --- |
| `NODE_ENV` | Ambiente de execução |
| `HOST` | Interface HTTP; padrão seguro `127.0.0.1` |
| `PORT` | Porta HTTP; padrão `3000` |
| `POSTGRES_USER`, `POSTGRES_DB` | Inicialização do container PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL, usada pelo container e pelo backend |
| `DATABASE_URL` | Conexão do backend com PostgreSQL |
| `REDIS_PASSWORD` | Senha do Redis, usada pelo container e pelo backend |
| `REDIS_URL` | Endereço de conexão do backend com Redis |

O backend carrega `.env` do diretório de execução; execute seus comandos dentro
de `backend`. As variáveis de conexão são obrigatórias. Nunca coloque segredos em
variáveis `VITE_*`, pois elas são expostas ao navegador.

### Verificação da API

```sh
curl --fail http://127.0.0.1:3000/api/health
```

Resposta saudável: `{"status":"ok","services":{"postgres":"up","redis":"up"}}`.
O endpoint consulta ambos os serviços; falhas retornam HTTP 503 e `degraded`,
sem expor erros internos ou credenciais. A inicialização exige ambos os serviços
disponíveis. Após perda da conexão Redis, reinicie o backend quando o Redis
voltar; reconexão automática não faz parte desta base.

## Banco de dados

O schema contém:

- `assets`: cadastro de ativos, mercado, moeda e setor.
- `daily_prices`: OHLC diário, fechamento ajustado, volume e origem.
- `fundamentals`: fundamentos por ativo, período e provedor.
- `analyses`: avaliação versionada ligada à cotação e aos fundamentos do mesmo ativo.
- `daily_reports` e `daily_report_items`: relatórios por mercado/data e ranking.

Há chaves estrangeiras, restrições de domínio, unicidade e índices para séries
históricas e rankings. Dados ausentes usam `NULL`, nunca valores simulados.
Valores monetários e indicadores usam `NUMERIC`; `Decimal` nos tipos compartilhados
é uma string para evitar perda de precisão. `BIGINT` de volume também é string.
Os tipos representam contratos serializados: datas `YYYY-MM-DD`, timestamps ISO
8601; futuros endpoints devem converter os objetos `Date` retornados pelo driver.
Percentuais são frações (`0.15` significa 15%); score varia entre 0 e 100.
Não há dados iniciais nem motor de cálculo. O schema evoluirá por migrações quando
o MVP ganhar funcionalidades; o bootstrap não substitui uma estratégia de migração.

### Operação local

```sh
docker compose --env-file backend/.env ps
docker compose --env-file backend/.env logs postgres redis
docker compose --env-file backend/.env down
```

Os volumes preservam os dados. Para **apagar todos os dados locais** e reaplicar o
schema do zero, use `docker compose --env-file backend/.env down -v` e inicie
novamente. Alterar variáveis PostgreSQL não troca as credenciais de um volume
existente: altere-as no banco ou recrie o volume conscientemente.

## Validação e build

```sh
npm run lint --prefix backend
npm run build --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

`lint` faz checagem estática TypeScript; não há suíte de testes automatizada ainda.
Os lockfiles permitem instalações reproduzíveis com `npm ci`.

Para executar o backend compilado, dentro de `backend`: `npm start`.
Para inspecionar o frontend compilado, dentro de `frontend`: `npm run preview`,
acessando http://localhost:4173.

## PWA e publicação

O build gera `frontend/dist`, incluindo o service worker e o manifesto estático.
Após uma primeira visita online, a interface estática fica disponível offline.
Não há cache de respostas `/api`; os dados financeiros futuros deverão ter uma
política explícita de validade. O service worker é registrado apenas em produção.
Novas versões ficam aguardando o fechamento das abas antigas para ativação.

Para testar instalação/offline, faça o build e use `npm run preview` no frontend;
verifique Manifest e Service Workers no painel Application do navegador. A
disponibilidade da instalação depende do navegador e do sistema operacional.
O preview não encaminha `/api`: serve apenas para conferir a interface e a PWA.

Em produção, sirva `frontend/dist` por HTTPS (localhost é permitido no
desenvolvimento), com fallback de navegação para `index.html`, e encaminhe `/api`
ao backend por um proxy reverso. Não aplique esse fallback às rotas `/api`.
Sirva `/sw.js` com revalidação, evitando cache HTTP permanente do service worker.
O backend não serve arquivos estáticos. Ajuste `HOST` apenas se precisar expô-lo
em outra interface, protegendo-o com proxy e firewall.

O Compose fornecido é **somente para desenvolvimento local**, com portas de
banco/cache restritas a loopback. Produção exige gestão de segredos, TLS,
backups, monitoramento e revisão de permissões. A API inicial não possui login,
rate limiting nem endpoints de negócio e não deve ser exposta como serviço público.

## Próximos passos do MVP

1. Integrar provedores licenciados de preços e fundamentos com rastreabilidade.
2. Implementar indicadores, modelos de valuation e critérios de margem de segurança.
3. Criar rotas de consulta, filtros, ranking e relatórios diários.
4. Adicionar testes automatizados, migrações e observabilidade.
5. Implementar autenticação e listas de acompanhamento, se necessárias.

Nenhum desses itens está implementado nesta entrega inicial.
