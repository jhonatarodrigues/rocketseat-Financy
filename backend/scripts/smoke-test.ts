type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const endpoint = process.env.BACKEND_URL ?? 'http://localhost:3333/graphql';
const testEmail = `smoke-${Date.now()}@financy.dev`;
const testPassword = '123456';

async function request<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.map((error) => error.message).join(', ') ?? response.statusText);
  }

  if (!json.data) {
    throw new Error('GraphQL response did not include data');
  }

  return json.data;
}

async function main() {
  const register = await request<{
    register: {
      token: string;
      user: {
        email: string;
      };
    };
  }>(
    /* GraphQL */ `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            email
          }
        }
      }
    `,
    {
      input: {
        name: 'Smoke Test',
        email: testEmail,
        password: testPassword,
      },
    },
  );

  const token = register.register.token;

  const category = await request<{
    createCategory: {
      id: string;
      name: string;
      title: string;
    };
  }>(
    /* GraphQL */ `
      mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
          id
          name
          title
        }
      }
    `,
    {
      input: {
        title: 'Smoke Categoria',
        description: 'Categoria criada pelo smoke test',
        icon: 'receipt-text',
        color: '#2563eb',
      },
    },
    token,
  );

  const transaction = await request<{
    createTransaction: {
      id: string;
      title: string;
      description: string;
      categoryId: string;
    };
  }>(
    /* GraphQL */ `
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          id
          title
          description
          categoryId
        }
      }
    `,
    {
      input: {
        description: 'Smoke transacao',
        amount: 1990,
        type: 'EXPENSE',
        date: new Date().toISOString(),
        categoryId: category.createCategory.id,
      },
    },
    token,
  );

  await request(
    /* GraphQL */ `
      mutation DeleteTransaction($input: DeleteTransactionInput!) {
        deleteTransaction(input: $input)
      }
    `,
    {
      input: {
        id: transaction.createTransaction.id,
      },
    },
    token,
  );

  await request(
    /* GraphQL */ `
      mutation DeleteCategory($input: DeleteCategoryInput!) {
        deleteCategory(input: $input)
      }
    `,
    {
      input: {
        id: category.createCategory.id,
      },
    },
    token,
  );

  console.log('Smoke test completed');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`User: ${register.register.user.email}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
