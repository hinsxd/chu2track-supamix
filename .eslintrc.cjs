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

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      parser: "@typescript-eslint/parser",
      plugins: [
        "@typescript-eslint",
        "import",
        "react",
        "jsx-a11y",
        "tailwindcss",
        "unused-imports",
        "prettier",
      ],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:tailwindcss/recommended",
        "plugin:prettier/recommended",
      ],
      settings: {
        "import/internal-regex": "^~/",
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
      rules: {
        "prettier/prettier": "warn",
        "tailwindcss/no-custom-classname": "off",
        "react/prop-types": "off",
        "jsx-a11y/anchor-has-content": "off",
        "jsx-a11y/heading-has-content": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
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
        "react/no-unknown-property": "off",
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
