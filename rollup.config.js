import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
export default {
    input: 'index.ts',
    output: {
        file: './dist/main.js',
        format: 'umd',
        name: 'parseHTML',
    },
    strict: false,
    plugins: [
        resolve(),
        typescript({
            downlevelIteration: true,
        }),
    ],
};
