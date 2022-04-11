module.exports = {
  env: {
    commonjs: true,
    node: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["promise", "unicorn"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": 0,
  },
};
