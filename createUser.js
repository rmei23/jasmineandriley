// createUser.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Iloveyou0526<3', 10);
  const user = await prisma.user.create({
    data: {
      email: 'jasminewang6026@gmail.com',
      password: passwordHash,
    },
  });
  console.log('Created user:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
