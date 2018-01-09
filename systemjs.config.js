System.config({
  transpiler: 'ts',
  typescriptOptions: {
    tsconfig: true
  },
  map: {
    ts: 'node_modules/plugin-typescript/lib/plugin.js',
    typescript: 'node_modules/typescript/lib'
  },
  packages: {
    app: {
      defaultExtension: 'ts'
    },
    spec: {
      main: 'main',
      defaultExtension: 'ts'
    },
    typescript: {
      main: 'typescript.js',
      meta: {
        'typescript.js': {
          exports: 'ts'
        }
      }
    }
  }
});