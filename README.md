# Financy

Projeto full stack para gerenciamento de financas pessoais, com backend GraphQL e frontend React.

Repositorio estruturado conforme o desafio:

```txt
.
├── backend
└── frontend
```

## Tecnologias

Backend:

- TypeScript
- GraphQL Yoga
- Prisma
- SQLite
- JWT
- bcryptjs
- Zod
- pnpm

Frontend:

- React
- TypeScript
- Vite
- GraphQL
- Apollo Client
- React Query
- React Hook Form
- Zod
- TailwindCSS
- lucide-react
- pnpm

## Requisitos Atendidos

- Usuario pode criar conta.
- Usuario pode fazer login.
- Usuario autenticado ve e gerencia apenas os proprios dados.
- CRUD de categorias.
- CRUD de transacoes.
- GraphQL no frontend e backend.
- Prisma com SQLite.
- CORS habilitado no backend.
- `.env.example` no backend e no frontend.

## Como Rodar

### Backend

```bash
cd backend
cp .env.example .env
pnpm install
pnpm run prisma:migrate
pnpm run db:seed
pnpm run dev
```

Backend:

```txt
http://localhost:3333/graphql
```

Usuario demo criado pelo seed:

```txt
Email: demo@financy.dev
Senha: 12345678
```

### Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm run dev
```

Configure em `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3333/graphql
```

Frontend:

```txt
http://localhost:5173
```

Se a porta estiver ocupada, o Vite usa a proxima porta disponivel.

## Validacoes

Backend:

```bash
cd backend
pnpm run build
pnpm run test:smoke
```

Frontend:

```bash
cd frontend
pnpm run lint
pnpm run build
```

## Documentacao Especifica

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

## Observacoes

- O banco SQLite local fica em `backend/dev.db` e nao deve ser commitado.
- Os valores monetarios sao salvos no backend em centavos.
- O frontend exibe e edita valores em reais.
- Funcionalidades extras devem ser implementadas em outra branch para preservar a entrega obrigatoria.
