import pluginJs from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,

  pluginJs.configs.recommended,

  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-useless-assignment": "off",
    },
  },

  ...tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^(props|_)",
          varsIgnorePattern: "^(props|_)",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  {
    ignores: ["node_modules", ".nuxt", ".output", "dist"],
  },

  prettier,

  {
    rules: {
      "prettier/prettier": ["warn", { singleQuote: false }],
    },
  },
]);
