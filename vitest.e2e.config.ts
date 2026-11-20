import { defineConfig } from "vitest/config";

// Selenium browser tests. They expect the app to be running at E2E_BASE_URL (default http://localhost:3000)
// with a migrated and seeded database.
export default defineConfig({
  test: {
    include: ["e2e/**/*.e2e.ts"],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
});
