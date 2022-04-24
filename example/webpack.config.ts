import 'webpack-dev-server';
import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import TSconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default function(env: Record<string, boolean | undefined>): webpack.Configuration {
  const production = env.production === true;
  const isWebpackServe = env.WEBPACK_SERVE === true;

  return {
    mode: production ? 'production' : 'development',
    // target: production ? 'web' : 'browserslist',
    devtool: production ? false : 'source-map',
    stats: {
      preset: 'minimal',
      chunks: true,
      timings: true,
      chunksSort: 'size',
    },
    entry: {
      // reactRefreshSetup: '@pmmmwh/react-refresh-webpack-plugin/client/ReactRefreshEntry.js',
      main: './src/main.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      filename: production ? '[name].[contenthash].js' : '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          use: [
            {
              loader: 'ts-loader',
            }
          ],
          exclude: /node_modules/,
        },
      ]
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './src/index.html',
        scriptLoading: 'module',
      }),
      new ForkTsCheckerWebpackPlugin(),
      isWebpackServe && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean) as any,
    resolve: {
      plugins: [
        new TSconfigPathsWebpackPlugin(),
      ],
      symlinks: false,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg', '...'],
    },
    // externals: {
    //   'react': 'React',
    //   'react-dom': 'ReactDOM',
    // },
    devServer: {
      hot: true,
      historyApiFallback: true,
    },
    optimization: {
      runtimeChunk: 'single',
      // Ensure `react-refresh/runtime` is hoisted and shared
      // Could be replicated via a vendors chunk
      // splitChunks: {
      //   chunks: 'all',
      //   name: (_: any, __: any, cacheGroupKey: any) => {
      //     return cacheGroupKey;
      //   },
      // },
    },
  }
};
