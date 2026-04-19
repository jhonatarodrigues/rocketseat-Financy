# Financy Backend

API GraphQL para autenticacao, categorias e transacoes do projeto Financy.

## Tecnologias

- TypeScript
- GraphQL Yoga
- Prisma
- SQLite
- JWT
- bcryptjs
- Zod
- pnpm

## Setup local

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Instale as dependencias:

```bash
pnpm install
```

Crie o banco SQLite local e aplique as migrations:

```bash
pnpm run prisma:migrate
```

Opcionalmente, popule dados de demonstracao:

```bash
pnpm run db:seed
```

Usuario criado pelo seed:

```txt
Email: demo@financy.dev
Senha: 123456
```

Rode o servidor em desenvolvimento:

```bash
pnpm run dev
```

O GraphQL fica disponivel em:

```txt
http://localhost:3333/graphql
```

## Variaveis de ambiente

```env
JWT_SECRET=
DATABASE_URL="file:../dev.db"
PORT=3333
FRONTEND_URL=http://localhost:5173
```

Como o arquivo Prisma fica em `backend/prisma/schema.prisma`, o caminho `file:../dev.db` cria o SQLite na raiz de `backend`.

## Scripts

```bash
pnpm run dev              # inicia o servidor com watch
pnpm run build            # compila TypeScript
pnpm run start            # roda o build gerado
pnpm run prisma:migrate   # cria/aplica migrations
pnpm run prisma:generate  # gera Prisma Client
pnpm run prisma:studio    # abre Prisma Studio
pnpm run db:reset         # reseta o banco local e reaplica migrations
pnpm run db:seed          # cria usuario e dados demo
pnpm run test:smoke       # testa o fluxo GraphQL principal contra o servidor rodando
```

## Autenticacao

As operacoes protegidas exigem o header:

```txt
Authorization: Bearer <token>
```

O token e retornado por `register` e `login`.

## Operacoes GraphQL

### Auth

- `register(input: RegisterInput!): AuthPayload!`
- `login(input: LoginInput!): AuthPayload!`
- `me: User!`

### Categorias

- `categories: [Category!]!`
- `createCategory(input: CreateCategoryInput!): Category!`
- `updateCategory(input: UpdateCategoryInput!): Category!`
- `deleteCategory(input: DeleteCategoryInput!): Boolean!`

O tipo `Category` expoe `title` e `name`. Ambos carregam o mesmo valor para facilitar o consumo pelo front.

### Transacoes

- `transactions: [Transaction!]!`
- `createTransaction(input: CreateTransactionInput!): Transaction!`
- `updateTransaction(input: UpdateTransactionInput!): Transaction!`
- `deleteTransaction(input: DeleteTransactionInput!): Boolean!`

O tipo `Transaction` expoe `description` e `title`. Ambos carregam o mesmo valor para facilitar o consumo pelo front. O campo `categoryId` tambem e retornado para preencher formularios de edicao.

## Smoke test

Com o servidor rodando, execute:

```bash
pnpm run test:smoke
```

Esse script cria um usuario temporario, cria categoria, cria transacao, apaga a transacao e apaga a categoria. Ele usa `BACKEND_URL` se a variavel existir; caso contrario usa `http://localhost:3333/graphql`.

## Regras implementadas

- Senhas sao armazenadas com hash.
- JWT usa o id do usuario no `sub`.
- Categorias e transacoes pertencem sempre ao usuario autenticado.
- O usuario so lista, cria, edita e deleta os proprios dados.
- Transacoes so podem usar categorias do proprio usuario.
- Categoria com transacoes vinculadas nao pode ser excluida antes das transacoes.
- Valores monetarios sao salvos em centavos no campo `amount`.
