import { build } from 'esbuild';
import chokidar from 'chokidar';
import pkg from 'five-server';

const { default: FiveServer } = pkg;

(async () => {
  const builder = await build({
    bundle: true,
    define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') },
    entryPoints: ['./src/index.ts'],
    incremental: true,
    sourcemap: true,
    outfile: './public/dist/build.js',
  });

  chokidar
    .watch(['./src/**/*.ts','./node_modules/bb-engine/**/*.ts'], {
      interval: 0, // No delay
    })
    .on('all', () => {
      builder.rebuild();
    });

  new FiveServer().start({
    open: true,
    port: +process.env.PORT || 5000,
    root: 'public',
  });
})();
