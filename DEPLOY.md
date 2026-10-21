# Deploy do AntiTrader

## O que está pronto

O projeto atual é um **PWA React/Vite com backend Express**, em um único pacote
gerenciado por Bun. Não é um monorepo Next.js/Prisma.

O fluxo de produção é:

1. Um push em `main` inicia `Production CI/CD`.
2. Os workflows reutilizáveis executam Jest, Vitest, build, TypeScript, Prettier,
   auditoria de dependências e CodeQL.
3. Somente se todos os jobs obrigatórios terminarem com sucesso, o backend é
   enviado ao Railway.
4. Após o health check da API, o frontend é publicado no Vercel.
5. O workflow verifica o endereço estável do frontend e seu proxy `/api`.

PRs e pushes em outras branches executam apenas as verificações, sem secrets de
produção. O disparo manual de `Production CI/CD` também valida o código, mas só
publica se a branch selecionada for `main`. Deploys de produção são serializados.

**Os arquivos não criam contas, projetos, secrets ou domínios e não significam que
o site já esteja online.** O primeiro deploy depende do setup abaixo. Nenhum token
deve ser enviado por chat ou commitado no repositório.

## Custos e permanência

- Vercel, Supabase e GitHub Actions oferecem planos gratuitos sujeitos a limites,
  elegibilidade e termos de uso.
- **Não conte com Railway gratuito permanentemente.** Trials/créditos podem
  expirar e o backend pode exigir um plano pago. Confira os preços atuais antes
  de ativar os serviços: <https://railway.com/pricing>,
  <https://vercel.com/pricing>, <https://supabase.com/pricing> e
  <https://docs.github.com/en/billing/concepts/product-billing/github-actions>.
- Projetos gratuitos do Supabase podem ser pausados por inatividade. Não há
  garantia de disponibilidade eterna ou de APIs externas gratuitas para sempre.
- Um domínio de produção é estável enquanto o projeto e a conta forem mantidos.
  URLs de preview por deployment não substituem o domínio de produção.

## 1. Preparar o GitHub

Em **Settings → Actions → General**, permita GitHub Actions e as actions usadas
nos arquivos de workflow. Habilite Code scanning/CodeQL em **Settings → Code
security**, quando disponível. Em repositórios privados, esse recurso pode exigir
licença/plano adicional; sem a funcionalidade, o job CodeQL pode falhar e bloquear
o deploy. Não remova verificações silenciosamente para contornar erros.

Crie o environment **production** em **Settings → Environments**. Restrinja-o à
branch `main`. Aprovações obrigatórias são opcionais; se habilitadas, haverá uma
pausa para aprovação antes de publicar.

Cadastre os secrets em **Settings → Secrets and variables → Actions → Secrets**,
ou no environment `production`:

| Secret              | Origem                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Token da conta Vercel, com acesso ao projeto                                 |
| `VERCEL_ORG_ID`     | Team/Organization ID do Vercel (também disponível em `.vercel/project.json`) |
| `VERCEL_PROJECT_ID` | Project ID do Vercel                                                         |
| `RAILWAY_TOKEN`     | **Project token** do Railway, associado ao environment de produção           |

Cadastre as seguintes **Variables** (não secrets), no repositório ou no environment
`production`:

| Variable                 | Valor                                                    |
| ------------------------ | -------------------------------------------------------- |
| `RAILWAY_PROJECT_ID`     | ID do projeto Railway                                    |
| `RAILWAY_SERVICE_ID`     | ID do serviço Express                                    |
| `RAILWAY_ENVIRONMENT_ID` | ID do environment Railway, não seu nome de exibição      |
| `RAILWAY_PUBLIC_URL`     | Origem HTTPS real da API, sem path, query ou credenciais |
| `VERCEL_PUBLIC_URL`      | Origem HTTPS estável do frontend                         |

Exemplos de origens: `https://antitrader.vercel.app` e
`https://antitrader-api.up.railway.app`, **somente se esses nomes forem atribuídos
às suas contas**. O domínio Railway usual contém `.up.railway.app`; o endereço
`https://antitrader-api.railway.app` não é garantido nem criado por este workflow.
Use os endereços reais exibidos nos painéis. Não use uma URL de preview como
`VERCEL_PUBLIC_URL`.

## 2. Preparar o Railway (Express)

1. Crie um projeto e um serviço vazio para a API. Use a raiz do repositório como
   diretório de build.
2. Em **Variables**, configure:
   - `NODE_ENV=production`
   - `RAILPACK_NODE_VERSION=24`
   - `RAILPACK_BUN_VERSION=1.4.3`
   - `GEMINI_API_KEY` e `GEMINI_API_KEY_BACKUP` apenas se for utilizar os recursos
     de IA que precisam dessas chaves.
3. Não defina `VERCEL` no Railway. Deixe o Railway fornecer `PORT`; o Express
   escuta nessa porta em `0.0.0.0`.
4. Em **Networking**, gere um domínio público e copie a origem HTTPS para
   `RAILWAY_PUBLIC_URL`. Se o nome desejado não estiver disponível, use o domínio
   atribuído ou configure um domínio próprio.
5. Confirme que o serviço usa `railway.toml` da raiz, sem overrides conflitantes:
   - Builder Railpack.
   - Build: `bun install --frozen-lockfile && bun run build && bun run build:server`.
   - Start: `bun run start` (Node executa `server.mjs`, não TypeScript diretamente).
   - Health check: `/api/health`, timeout de 120 segundos.
6. Gere um project token para o environment correto e salve-o como
   `RAILWAY_TOKEN` no GitHub. Copie os IDs de projeto, serviço e environment.
7. **Desconecte/desative deploys automáticos pela integração GitHub do Railway.**
   A publicação deve ocorrer somente pelo CLI do workflow, depois do CI. Um
   deploy independente disparado pelo provedor contornaria os testes.

O modo congelado existente (`IS_FROZEN`) é preservado. O boot e os endpoints
estáticos testados não exigem chave Gemini; a inicialização de cliente não usado
foi removida. Esta configuração não ativa varreduras nem adiciona provedores de
dados.

## 3. Preparar o Vercel (PWA)

1. Crie/importe o projeto, com a raiz do repositório como **Root Directory**.
   Se a importação publicar uma versão inicial automaticamente, ela não passou
   por este pipeline; considere produção ativa somente após um workflow verde.
2. Selecione Vite e Node.js 24 nas configurações do projeto.
3. Confira as configurações de `vercel.json`:
   - Install: `bun install --frozen-lockfile`.
   - Build: `bun run build`.
   - Output: `dist`.
4. Configure o domínio estável desejado em **Settings → Domains**. O nome
   `antitrader.vercel.app` depende de disponibilidade e propriedade.
5. Salve token, Organization ID e Project ID no GitHub.
6. Mantenha deploys Git automáticos desativados. `git.deploymentEnabled: false`
   em `vercel.json` desativa esse caminho; o CLI do Actions continua publicando.
7. Para um site público, confira que Deployment Protection não está exigindo
   autenticação no domínio de produção; caso contrário, os smoke tests públicos
   falharão.

O workflow lê `RAILWAY_PUBLIC_URL` e ajusta o rewrite de `/api/(.*)` antes do build
do Vercel. O navegador continua chamando `/api/...` na mesma origem, e o Vercel
encaminha para o Railway; não é necessário expor tokens ao frontend nem habilitar
CORS amplo no backend. As demais rotas continuam usando o fallback de SPA.

`.vercelignore` impede a publicação da antiga função `api/index.ts`: neste modelo,
o backend executa no Railway, não em uma segunda função Vercel. O destino em
`vercel.json` é apenas um padrão; para deploy manual fora do workflow, ajuste-o
ao hostname real da API antes de publicar.

Nunca coloque chaves privadas, senha PostgreSQL ou chave `service_role` em
variáveis `VITE_*`: elas seriam incorporadas ao JavaScript público.

## 4. Supabase e Redis: preparação opcional

**A aplicação atual não usa Supabase, PostgreSQL ou Redis.** Não há schema, ORM,
migrations, autenticação Supabase ou cliente Redis implementados. Criar variáveis
não adiciona persistência: o tracker ainda usa `localStorage` no navegador e os
caches do backend são em memória. Este trabalho prepara CI/deploy, não uma
migração de banco.

Se quiser preparar o banco gerenciado para uma implementação futura:

1. Crie um projeto Supabase em <https://supabase.com/dashboard>, escolha a região
   próxima ao backend e guarde a senha do banco em um gerenciador de senhas.
2. Copie a conexão PostgreSQL indicada por **Connect**. Escolha conexão direta ou
   pooler conforme suporte IPv4/IPv6 e o futuro driver; configure TLS como
   recomendado pelo Supabase. Salve `DATABASE_URL` somente no Railway.
3. Se futuramente utilizar a API Supabase no servidor, configure `SUPABASE_URL` e
   a chave secreta apenas nas variáveis do backend. Nunca exponha a chave
   `service_role`.
4. Para acesso do browser, utilize somente a chave publishable/anon e configure
   **Row Level Security** e políticas restritivas em todas as tabelas expostas.
   Não desative RLS para resolver problemas de permissão.
5. Implemente schema/migrations e testes antes de depender desse banco. Nenhum
   workflow atual executa migrations nem acessa o banco de produção.
6. Redis de produção é opcional e separado do Supabase. Se implementado, crie um
   serviço gerenciado e salve `REDIS_URL` apenas no backend; prefira rede privada
   ou TLS e não exponha a porta publicamente.

O workflow de testes inicia **PostgreSQL 16 e Redis 7 efêmeros**, verifica `SELECT 1`
e `PING`, e disponibiliza `DATABASE_URL`/`REDIS_URL` aos testes, com autenticação PostgreSQL
separada em `PGUSER`/`PGPASSWORD` (para clientes que suportam essas variáveis). Isso verifica a
infraestrutura do CI, **não integração da aplicação com esses serviços**.
Credenciais de CI são fictícias, isoladas e não reutilizáveis em produção.

## 5. Verificações locais

Requisitos: Node.js 24 e Bun 1.4.3.

```sh
bun install --frozen-lockfile
bun run lint
bun run format:check
bun run test
bun run build
bun audit --audit-level=high
bun run build:server
NODE_ENV=production bun run start
```

- Jest inicia a API compilada em uma porta efêmera, verifica health, oportunidades
  e modo congelado, e encerra o processo.
- Vitest verifica cálculos usados pelo frontend, sem chamadas a APIs externas.
- `lint` mantém o verificador TypeScript já existente; não há ESLint configurado.
- Prettier verifica os novos testes, configurações e documentação de CI/CD, sem
  reformatar todo o código legado.
- A auditoria bloqueia vulnerabilidades de severidade alta/crítica nas
  dependências. CodeQL analisa JavaScript/TypeScript e publica os resultados em
  **Security → Code scanning**. Uma análise concluída não significa ausência de
  alertas; configure regras de proteção de code scanning se quiser bloquear
  merges por severidade.

## 6. Primeiro deploy e notificações

Depois de configurar os provedores e o GitHub:

1. Disponibilize estes arquivos em `main` pelo processo autorizado do repositório.
   Esta sessão de agente trabalha na branch atribuída, não altera `main`
   diretamente e não abre PR automaticamente.
2. Faça push em `main` ou selecione **Actions → Production CI/CD → Run workflow**
   na branch `main`.
3. Acompanhe os jobs. Falhas em testes, qualidade ou execução do scan impedem os
   jobs de publicação dependentes. Configuração ausente causa erro explícito.
4. Confira o resumo com os links e o commit da execução.
5. Verifique:
   - Página inicial e instalação do PWA pelo domínio Vercel.
   - `https://SEU-BACKEND/api/health` com `{"status":"ok"}`.
   - `https://SEU-FRONTEND/api/health` com a mesma resposta via proxy.
   - `https://SEU-FRONTEND/api/opportunities` com um array JSON.

Ative notificações de Actions em
<https://github.com/settings/notifications> e acompanhe o repositório conforme
suas preferências. O workflow marca falhas em vermelho, emite annotation e
registra um resumo. Entrega de e-mail/push depende das configurações da sua
conta; não há integração Slack/e-mail externo configurada.

Para **bloquear merges**, crie um ruleset/branch protection em `main`, exija PR e
adicione os checks de testes, qualidade e CodeQL exibidos após a primeira
execução. CI sozinho não impede um push direto já autorizado em `main`: apenas
bloqueia o deploy subsequente se houver falha.

## 7. Falhas e recuperação

| Sintoma                         | Conferir                                                               |
| ------------------------------- | ---------------------------------------------------------------------- |
| Deploy não iniciou              | Push em `main`, Actions habilitado e workflows presentes nessa branch  |
| Testes/lint/build falharam      | Logs do job; reproduza os comandos locais, corrija e envie novo commit |
| Auditoria bloqueou o pipeline   | Advisory exibido e atualização segura do pacote/lockfile               |
| CodeQL não conseguiu publicar   | Permissões `security-events: write`, Code security e licença do repo   |
| Railway não autorizou           | Project token correto, environment, IDs e cota/plano                   |
| Railway não passou health check | `NODE_ENV`, `PORT`, logs de build/runtime e `/api/health`              |
| Vercel não autorizou            | Token, Organization ID, Project ID e acesso à equipe                   |
| Página abre, mas `/api` falha   | `RAILWAY_PUBLIC_URL`, serviço saudável e rewrite no deployment Vercel  |
| Domínio responde 401/403        | Deployment Protection e domínio de produção escolhido                  |
| PWA mostra conteúdo antigo      | Atualização do service worker, recarregamento e cache do navegador     |

Não há transação entre os provedores nem rollback automático: se o Railway
publicar e o Vercel falhar, o backend novo pode continuar ativo. Os smoke tests
confirmam disponibilidade pública, não identificam por si só a revisão servida;
consulte também o status e os logs do deployment no Railway.

Para recuperação imediata, use **Rollback/Redeploy** do deployment saudável no
Railway e **Instant Rollback/Promote** no Vercel, conforme disponibilidade do
plano. Depois reverta o commit problemático pelo fluxo autorizado e publique a
correção, mantendo frontend e API compatíveis. Apenas executar novamente um
workflow antigo pode substituir produção por uma revisão antiga; confira sempre
o commit antes de reexecutar.

Não apague projetos/domínios para corrigir uma falha: mantenha os endereços de
produção e restaure deployments nesses mesmos projetos.
