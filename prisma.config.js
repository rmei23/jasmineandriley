import { defineConfig } from "prisma";

export default defineConfig({
  datasources: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL, // Prisma reads your .env
    },
  },
  generators: {
    client: {
      provider: "prisma-client-js",
    },
  },
});
