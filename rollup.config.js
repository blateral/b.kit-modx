import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import { DEFAULT_EXTENSIONS } from '@babel/core';

// import packageJson from './package.json';

export default {
    input: {
        index: './src/index.ts',
    },
    output: [
        {
            dir: 'cjs',
            format: 'cjs',
            name: 'bkit',
            sourcemap: true,
            plugins: [terser()],
        },
        {
            dir: 'esm',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        del({ targets: ['types', 'esm', 'cjs'] }),
        peerDepsExternal(),
        commonjs(),
        resolve(),
        typescript({
            typescript: ttypescript,
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                sourceRoot: '/types/',
            },
        }),
        babel({
            babelHelpers: 'bundled',
            extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
        }),
    ],
};
