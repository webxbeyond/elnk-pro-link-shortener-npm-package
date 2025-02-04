import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    minify: 'terser',
    terserOptions: {
        mangle: {
            toplevel: true,
        },
        compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 2,
        },
        output: {
            comments: false,
        },
    },
});
