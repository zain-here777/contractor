import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    /** Avoid parallel `npm run build` in integration tests (dist/ race). */
    fileParallelism: false,
  },
});
