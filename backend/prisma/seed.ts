import { hash } from 'bcryptjs';

import { prisma } from '../src/lib/prisma.js';

const demoUser = {
  name: 'Demo Financy',
  email: 'demo@financy.dev',
  password: '123456',
};

async function main() {
  await prisma.user.deleteMany({
    where: {
      email: demoUser.email,
    },
  });

  const passwordHash = await hash(demoUser.password, 10);

  const user = await prisma.user.create({
    data: {
      name: demoUser.name,
      email: demoUser.email,
      passwordHash,
    },
  });

  const salary = await prisma.category.create({
    data: {
      title: 'Salario',
      description: 'Receitas fixas do mes',
      icon: 'briefcase',
      color: '#16a34a',
      userId: user.id,
    },
  });

  const food = await prisma.category.create({
    data: {
      title: 'Alimentacao',
      description: 'Mercado, restaurantes e lanches',
      icon: 'utensils',
      color: '#2563eb',
      userId: user.id,
    },
  });

  const transport = await prisma.category.create({
    data: {
      title: 'Transporte',
      description: 'Combustivel, app e transporte publico',
      icon: 'car',
      color: '#ea580c',
      userId: user.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        description: 'Salario mensal',
        amount: 850000,
        type: 'INCOME',
        date: new Date('2026-04-01T12:00:00.000Z'),
        categoryId: salary.id,
        userId: user.id,
      },
      {
        description: 'Almoco no restaurante',
        amount: 4590,
        type: 'EXPENSE',
        date: new Date('2026-04-10T12:00:00.000Z'),
        categoryId: food.id,
        userId: user.id,
      },
      {
        description: 'Aplicativo de transporte',
        amount: 2830,
        type: 'EXPENSE',
        date: new Date('2026-04-12T12:00:00.000Z'),
        categoryId: transport.id,
        userId: user.id,
      },
    ],
  });

  console.log('Seed completed');
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
