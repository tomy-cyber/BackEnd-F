module.exports = {
    extends: ["next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
      // Disable the no-unused-vars rule
      "@typescript-eslint/no-unused-vars": "off",
  
      // Disable the no-require-imports rule
      "@typescript-eslint/no-require-imports": "off",
    },
  }
  
  