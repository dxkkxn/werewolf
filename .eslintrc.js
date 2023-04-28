module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["semistandard", "plugin:cypress/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
