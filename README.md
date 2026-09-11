# ClosetShare

Marketplace de aluguel de roupas e monetização de closets.

## Visão

O ClosetShare conecta quem tem roupas paradas a quem prefere acessar moda por aluguel. O marketplace suporta pessoas, lojas, marcas e criadores como fornecedores de peças.

## MVP — fundação implementada

- Catálogo responsivo e mobile-first
- Busca por texto e filtros por categoria
- Cards de peças com favoritos, avaliação, preço e duração
- Closet Income e Rental Score na experiência inicial
- Cliente Supabase preparado para conexão por ambiente
- Migration PostgreSQL com usuários, categorias, peças, fotos, disponibilidade, reservas, avaliações, favoritos e configurações
- RLS inicial para separar dados públicos, proprietários e locatários

## Stack

- React + TypeScript
- Vite
- CSS responsivo
- Supabase / PostgreSQL / Auth / Storage / RLS

A integração segue o padrão atual recomendado pelo Supabase: `@supabase/supabase-js`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. citeturn0search0turn0search9

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Supabase

1. Crie um projeto no Supabase.
2. Copie a URL e a publishable key para um `.env.local` a partir do `.env.example`.
3. Execute `supabase/migrations/20260911032000_closetshare_core.sql` no SQL Editor ou através do fluxo de migrations do Supabase.
4. Não coloque chaves secretas no browser ou no GitHub. A chave publicável só deve acessar dados protegidos por RLS. citeturn0search4turn0search8

## Próximas fases

1. Auth: cadastro, login, recuperação e perfil
2. Meu Closet: publicação e upload para Storage
3. Disponibilidade e motor de conflito de reservas
4. Checkout, comissão de 20% e proteção da locação
5. Avaliações, reputação e Rental Score calculado
6. Backoffice e métricas de marketplace
7. LGPD, termos e regras de aluguel

> Nunca colocar chaves reais no repositório. Use `.env.local` e as variáveis documentadas em `.env.example`.
