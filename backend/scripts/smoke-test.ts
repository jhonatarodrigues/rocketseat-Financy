type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const endpoint = process.env.BACKEND_URL ?? 'http://localhost:3333/graphql';
const testPassword = '12345678';

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

async function requestWithErrors<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<GraphQLResponse<T>> {
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

  return response.json() as Promise<GraphQLResponse<T>>;
}

async function createUser(label: string) {
  const email = `smoke-${label}-${Date.now()}@financy.dev`;

  return request<{
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
        name: `Smoke Test ${label}`,
        email,
        password: testPassword,
      },
    },
  );
}

async function createCategory(token: string, title = 'Smoke Categoria') {
  return request<{
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
        title,
        description: 'Categoria criada pelo smoke test',
        icon: 'receipt-text',
        color: '#2563eb',
      },
    },
    token,
  );
}

async function createTransaction(token: string, categoryId: string) {
  return request<{
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
        categoryId,
      },
    },
    token,
  );
}

function assertGraphQLError(response: GraphQLResponse<unknown>, label: string) {
  if (!response.errors?.length) {
    throw new Error(`${label} should have returned a GraphQL error`);
  }
}

async function main() {
  const owner = await createUser('owner');
  const intruder = await createUser('intruder');
  const ownerToken = owner.register.token;
  const intruderToken = intruder.register.token;

  const category = await createCategory(ownerToken);
  const transaction = await createTransaction(ownerToken, category.createCategory.id);

  const intruderLists = await request<{
    categories: { id: string }[];
    transactions: { id: string }[];
  }>(
    /* GraphQL */ `
      query Lists {
        categories {
          id
        }
        transactions {
          id
        }
      }
    `,
    undefined,
    intruderToken,
  );

  if (intruderLists.categories.length !== 0 || intruderLists.transactions.length !== 0) {
    throw new Error('Data isolation failed: intruder listed owner data');
  }

  const intruderUsingOwnerCategory = await requestWithErrors(
    /* GraphQL */ `
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          id
        }
      }
    `,
    {
      input: {
        description: 'Tentativa proibida',
        amount: 1000,
        type: 'EXPENSE',
        date: new Date().toISOString(),
        categoryId: category.createCategory.id,
      },
    },
    intruderToken,
  );

  assertGraphQLError(intruderUsingOwnerCategory, 'Intruder using owner category');

  const intruderUpdatingOwnerTransaction = await requestWithErrors(
    /* GraphQL */ `
      mutation UpdateTransaction($input: UpdateTransactionInput!) {
        updateTransaction(input: $input) {
          id
        }
      }
    `,
    {
      input: {
        id: transaction.createTransaction.id,
        description: 'Tentativa proibida',
      },
    },
    intruderToken,
  );

  assertGraphQLError(intruderUpdatingOwnerTransaction, 'Intruder updating owner transaction');

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
    ownerToken,
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
    ownerToken,
  );

  console.log('Smoke test completed');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Owner: ${owner.register.user.email}`);
  console.log(`Intruder: ${intruder.register.user.email}`);
  console.log('Data isolation: ok');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
