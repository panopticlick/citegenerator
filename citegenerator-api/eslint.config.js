import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.*",
      "**/prettier.config.cjs",
      "**/*.cjs",
      "vitest.config.ts",
      "docker-compose.yml",
      "Dockerfile",
      "Makefile",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
  },
];
