import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { demoProducts } from "../src/lib/products";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for seeding.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  try {
    for (const product of demoProducts) {
      // Re-running the seed must not reset stock or prices changed by an administrator.
      const saved = await db.product.upsert({ where: { id: product.id }, create: product, update: {} });
      if (saved.description === null || saved.specifications === null) {
        await db.product.update({
          where: { id: product.id },
          data: { description: saved.description ?? product.description, specifications: saved.specifications ?? product.specifications },
        });
      }
      await db.product.updateMany({
        where: { id: product.id, imageUrl: null },
        data: { imageUrl: product.imageUrl },
      });
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Seeding failed");
  process.exitCode = 1;
});
