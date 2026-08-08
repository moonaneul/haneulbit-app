const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Expo SDK 57이 제공하는 React Native, React Hooks, TypeScript 권장 규칙을 사용합니다.
module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
