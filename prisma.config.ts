import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env then .env.local (Next.js convention, .env.local takes priority)
config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // PRISMA_DATABASE_URL = pooled connection (Vercel Postgres)
    url: process.env["PRISMA_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
