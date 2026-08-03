module.exports = {
  // The lazy scope imports lucide icons one file at a time from
  // lucide-react/dist/esm/icons/*.js. Those are ESM-only -- lucide's CJS build
  // is a single bundled entry with no per-icon files -- so Jest has to run them
  // through Babel instead of skipping all of node_modules.
  transformIgnorePatterns: ['/node_modules/(?!lucide-react)'],
}
