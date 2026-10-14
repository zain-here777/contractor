import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
  {
    files: ["**/*.mjs", "scripts/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
