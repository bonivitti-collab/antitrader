# Guia de Configuração e Vendas da Kiwify • AntiTrader

Este guia foi elaborado para o seu **dia de configuração da Kiwify**, permitindo plugar o **AntiTrader**, o **CotaCasa** e o futuro **TikBlox** de forma rápida, segura e 100% automatizada.

---

## 1. O que já está pronto e automatizado no AntiTrader

* **Webhook de Ativação Instantânea:** Endpoint `/api/webhooks/kiwify` configurado e ativo para receber eventos de compras, renovações, cancelamentos e estornos.
* **Consulta de Status em Tempo Real:** Rota `/api/subscription/status` que informa ao aplicativo se o usuário é assinante ativo da Kiwify (`Pro Mensal` ou `Pro Anual`).
* **Degustação de 7 Dias Integrada:** Caso o usuário se cadastre pelo app antes de comprar, ele ganha 7 dias de acesso completo. Ao expirar ou ao assinar na Kiwify, o acesso Pro assume automaticamente.
* **Badges Visuais no Perfil:** O menu do usuário exibe badges institucionais (`★ Pro Anual`, `Pro Mensal`, `X dias teste grátis` ou `Expirado`).
* **Preenchimento Automático do Checkout:** Quando o usuário clica nos botões de plano na Landing Page, os dados de e-mail e nome são repassados ao checkout da Kiwify para evitar atrito na compra.

---

## 2. Passo a Passo para o seu Dia de Trabalho

### Passo 1: Executar o Script no Supabase
1. Acesse o painel do seu projeto no Supabase: [supabase.com](https://supabase.com).
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Abra o arquivo [`supabase_kiwify_setup.sql`](./supabase_kiwify_setup.sql) gerado no projeto, copie todo o conteúdo e cole no SQL Editor do Supabase.
4. Clique em **Run** (Executar).
5. Pronto! A tabela `subscriptions` e as regras de segurança estão criadas.

---

### Passo 2: Cadastrar o Produto na Kiwify
1. Acesse o painel da Kiwify: [dashboard.kiwify.com.br](https://dashboard.kiwify.com.br).
2. Vá em **Produtos** -> **Criar Produto**.
3. Preencha os dados:
   * **Nome do Produto:** `AntiTrader Pro • Terminal Fundamentalista com IA`
   * **Tipo de Pagamento:** Assinatura Recorrente
   * **Preço do Plano Mensal:** R$ 39,90 / mês (com 7 dias de garantia ou trial)
   * **Preço do Plano Anual:** R$ 299,00 / ano (com 7 dias de garantia)
4. Copie os links diretos de checkout gerados pela Kiwify para cada plano.

---

### Passo 3: Configurar o Webhook na Kiwify
1. No painel da Kiwify, vá no menu **Apps** ou **Configurações** -> **Webhooks**.
2. Clique em **Criar Webhook**.
3. Configure os campos:
   * **Nome:** `AntiTrader Produção`
   * **URL do Webhook:** `https://antitrader.vercel.app/api/webhooks/kiwify`
   * **Eventos para marcar:**
     * [x] Pedido aprovado
     * [x] Assinatura renovada
     * [x] Assinatura cancelada
     * [x] Reembolso / Estorno
     * [x] Chargeback
4. Copie o **Token do Webhook** gerado pela Kiwify.

---

### Passo 4: Adicionar as Variáveis de Ambiente na Vercel
No painel do projeto na [Vercel](https://vercel.com):
1. Vá em **Settings** -> **Environment Variables**.
2. Adicione as chaves abaixo:
   * `KIWIFY_WEBHOOK_TOKEN`: *(O token secreto do webhook copiado no Passo 3)*
   * `VITE_KIWIFY_CHECKOUT_MENSAL_URL`: `https://pay.kiwify.com.br/SEU_LINK_MENSAL`
   * `VITE_KIWIFY_CHECKOUT_ANUAL_URL`: `https://pay.kiwify.com.br/SEU_LINK_ANUAL`
3. Clique em **Save**.
4. Faça um **Redeploy** na Vercel para aplicar as variáveis.

---

## 3. Como Testar a Integração

1. Na Kiwify, na aba do Webhook que você criou, clique no botão **"Enviar teste de webhook"** selecionando o evento **"Pedido aprovado"**.
2. Verifique os logs da Vercel (Runtime Logs). Você verá a mensagem:
   `[Kiwify Webhook] Evento: order_id=..., status=paid, email=..., plano=...`
3. Consulte no Supabase (Table Editor -> `subscriptions`): a linha com o cliente de teste estará gravada com status `active`!
4. Acesse o AntiTrader com esse e-mail: o app exibirá imediatamente o status `★ Pro Anual` ou `Pro Mensal`.

---

## 4. Tabela de Variáveis de Ambiente de Referência

| Variável | Onde obter | Finalidade |
| :--- | :--- | :--- |
| `KIWIFY_WEBHOOK_TOKEN` | Kiwify -> Webhooks | Autentica as requisições enviadas pela Kiwify |
| `VITE_KIWIFY_CHECKOUT_MENSAL_URL` | Kiwify -> Links do Produto | Botão do plano mensal na Landing Page |
| `VITE_KIWIFY_CHECKOUT_ANUAL_URL` | Kiwify -> Links do Produto | Botão do plano anual na Landing Page |
| `VITE_SUPABASE_URL` | Supabase -> Settings -> API | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Supabase -> Settings -> API | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase -> Settings -> API | Chave de serviço interna para o backend (opcional) |
