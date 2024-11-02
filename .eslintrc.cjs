/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client"],

  // Base config
  extends: ["eslint:recommended"],

  plugins: ["unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "warn",
    "tailwindcss/no-custom-classname": "off",
  },
  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y", "tailwindcss"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:tailwindcss/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
        tailwindcss: {
          callees: ["classnames", "clsx", "ctl", "cva", "tv", "cn"],
        },
      },
    },

    // Typescript
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx"],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
      rules: {
        "import/order": [
          "warn",
          {
            pathGroupsExcludedImportTypes: ["builtin"],
            groups: [
              "builtin",
              "external",
              "internal",
              "unknown",
              "parent",
              "sibling",
              "index",
              "object",
              "type",
            ],
            "newlines-between": "always",
            distinctGroup: true,
            named: true,
            pathGroups: [
              {
                group: "internal",
                pattern: "~/**",
              },
              {
                group: "builtin",
                pattern: "react",
                position: "before",
              },
              {
                group: "builtin",
                pattern: "@remix-run/*",
                position: "before",
              },
            ],
            alphabetize: {
              order:
                "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
              caseInsensitive: true /* ignore case. Options: [true, false] */,
            },
            warnOnUnassignedImports: false,
          },
        ],
      },
    },

    // Node
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
  ],
};
