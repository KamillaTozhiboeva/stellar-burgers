import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@ui': path.resolve(__dirname, '../src/components/ui'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@utils-types': path.resolve(__dirname, '../src/utils/types'),
        '@api': path.resolve(__dirname, '../src/utils/burger-api'),
        '@services': path.resolve(__dirname, '../src/services'),
        '@slices': path.resolve(__dirname, '../src/services/slices'),
      };
    }
    return config;
  },
};

export default config;