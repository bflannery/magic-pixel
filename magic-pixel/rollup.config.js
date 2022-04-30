import path from 'path'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss-modules'
import inject from '@rollup/plugin-inject'
import json from '@rollup/plugin-json'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const env = process.env.NODE_ENV || 'local'

const config = {
  input: './src/index.ts',
  output: {
    dir: './build',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    inject({
      include: './src/*',
      config: path.resolve(`./src/config.${env}.js`),
    }), // creates a global var "config" and uses config.ENV.js for the value
    postcss({
      writeDefinitions: env === 'local',
      namedExports: true,
    }), // import css files in js and access classnames
    typescript(),
    nodeResolve(), // node like env
    commonjs(),
    json(),
    sizeSnapshot(), // print bundle sizes
    // terser(), // minified
  ],
}
export default config
