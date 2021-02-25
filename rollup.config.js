import resolve from 'rollup-plugin-node-resolve'
import commonjs from "rollup-plugin-commonjs"
import clear from "rollup-plugin-clear" // 清空文件夹插件

export default {
  input: 'lib/index.js',
  output: [
    {
      // dir: 'dist',
      file: 'dist/lib.comonjs.js',
      format: 'cjs',
    },
    {
      // dir: 'dist',
      file: 'dist/lib.esm.js',
      format: 'es',
    }
  ],
  plugins:[
    resolve(),
    commonjs(),
    clear({
      targets:['dist']
    })
  ]
};