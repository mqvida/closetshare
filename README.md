# ClosetShare

Marketplace de aluguel de roupas e monetização de closets.

## Visão

O ClosetShare conecta quem tem roupas paradas a quem prefere acessar moda por aluguel. O marketplace suporta pessoas, lojas, marcas e criadores como fornecedores de peças.

## MVP — fase 1

- Catálogo responsivo e mobile-first
- Busca por texto
- Filtros por categoria
- Cards de peças com preço, tamanho, avaliação e disponibilidade
- Favoritos locais
- Área de monetização do closet
- Rental Score e Closet Income como diferenciais de produto
- Estrutura preparada para autenticação, Supabase e reservas

## Stack

- React + TypeScript
- Vite
- CSS responsivo sem dependência visual pesada
- Supabase planejado para dados, autenticação, storage e RLS

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Próximas fases

1. Persistência Supabase + autenticação
2. Publicação de peças e upload de fotos
3. Calendário de disponibilidade e reservas
4. Checkout, comissão da plataforma e proteção da locação
5. Avaliações, reputação e Rental Score calculado
6. Backoffice e métricas de marketplace
7. LGPD, termos e regras de aluguel

> Nunca colocar chaves reais no repositório. Use `.env` local e as variáveis documentadas em `.env.example`.
