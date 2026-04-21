# Financy Frontend

Aplicacao React do projeto Financy para gerenciamento de categorias e transacoes financeiras.

## Tecnologias

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

## Setup local

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Configure a URL do backend:

```env
VITE_BACKEND_URL=http://localhost:3333/graphql
```

Instale as dependencias:

```bash
pnpm install
```

Rode o frontend:

```bash
pnpm run dev
```

Por padrao, o Vite usa:

```txt
http://localhost:5173
```

Se a porta estiver ocupada, ele sobe na proxima porta disponivel.

## Scripts

```bash
pnpm run dev      # inicia o Vite
pnpm run build    # compila TypeScript e gera build de producao
pnpm run lint     # executa ESLint
pnpm run preview  # previsualiza o build
```

## Fluxo implementado

- Cadastro de usuario.
- Login com JWT.
- Restauracao de sessao via `me`.
- Logout.
- Listagem, criacao, edicao e exclusao de categorias.
- Listagem, criacao, edicao e exclusao de transacoes.
- Dashboard com resumo calculado a partir de dados reais.
- Filtros de transacoes por busca, tipo, categoria e periodo.
- Loading e erros para chamadas de API.

## Contrato com o backend

O frontend usa `VITE_BACKEND_URL` para chamar a API GraphQL.

O token JWT e salvo localmente e enviado em:

```txt
Authorization: Bearer <token>
```

Os repositories normalizam o contrato:

- Backend `EXPENSE` e `INCOME` viram `expense` e `income` no frontend.
- Backend salva `amount` em centavos; frontend trabalha em reais.
- Backend `Category.title/name` vira `Category.name`.
- Backend `Transaction.description/title` vira `Transaction.title`.

## Observacoes

- `Lembrar-me` salva apenas o e-mail, nao a senha.
- Recuperacao de senha exibe aviso de indisponibilidade porque nao faz parte dos requisitos obrigatorios.
- O filtro de periodo usa dropdown com meses existentes nas transacoes para evitar problemas de popup nativo cortado.
