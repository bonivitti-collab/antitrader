-- =========================================================================
-- AntiTrader - Script de Criação e Configuração da Tabela de Assinaturas (Kiwify)
-- Execute este script no SQL Editor do seu projeto Supabase
-- =========================================================================

-- 1. Criação da Tabela de Assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  kiwify_order_id TEXT UNIQUE,
  kiwify_subscription_id TEXT,
  product_id TEXT,
  product_name TEXT DEFAULT 'AntiTrader Pro',
  plan_type TEXT DEFAULT 'mensal', -- 'mensal' | 'anual'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'canceled' | 'refunded' | 'chargeback' | 'pending' | 'expired'
  price_paid NUMERIC(10, 2),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 2. Índices de Alta Velocidade para Consulta Instantânea
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id ON public.subscriptions(kiwify_order_id);

-- 3. Habilitação de Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Leitura e Escrita
-- Permite que usuários autenticados consultem seus próprios dados de assinatura
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'Usuários podem visualizar sua própria assinatura'
  ) THEN
    CREATE POLICY "Usuários podem visualizar sua própria assinatura"
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (auth.jwt()->>'email' = email OR auth.uid() = user_id);
  END IF;
END $$;

-- Permite que a API do backend (Service Role e Anon para Webhooks) insira e atualize assinaturas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'API Backend pode gerenciar assinaturas'
  ) THEN
    CREATE POLICY "API Backend pode gerenciar assinaturas"
      ON public.subscriptions
      FOR ALL
      TO anon, service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Comentário explicativo na tabela
COMMENT ON TABLE public.subscriptions IS 'Tabela que armazena os clientes pagantes e o status de acesso do AntiTrader integrado com a Kiwify';
