const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: hash,
      displayName: 'Student One',
      role: 'student',
      points: 120,
      currentStreak: 3
    }
  });

  await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      password: hash,
      displayName: 'Ms Teacher',
      role: 'teacher'
    }
  });

  console.log('Seed complete');
}
main().finally(() => prisma.$disconnect());
