import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // Business logic only. Database adapters and route wiring are exercised by the Selenium suite.
      include: ["src/lib/cart.ts", "src/lib/checkout/**/*.ts"],
      exclude: ["**/*.test.ts", "src/lib/checkout/index.ts", "src/lib/checkout/prisma-checkout-repository.ts"],
      reporter: ["text", "html", "lcov", "json-summary"],
    },
  },
});
