import { terser } from 'rollup-plugin-terser';

let file = 'gumdrop.js';
let plugins = [];

if (process.env.BUILD === 'production') {
  file = 'gumdrop.min.js';

  plugins.push(terser());
}

console.log(file);

export default {
  input: 'src/index.js',
  output: {
    file,
    dir: 'build',
    format: 'iife',
    sourcemap: true
  },
  plugins
};
