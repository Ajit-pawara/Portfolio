import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

const hash = execSync('git rev-parse --short HEAD').toString().trim()

function versionPlugin(): Plugin {
  return {
    name: 'version-json',
    closeBundle() {
      writeFileSync('docs/version.json', JSON.stringify({ hash }))
    },
  }
}

export default defineConfig({
  plugins: [react(), versionPlugin()],
  base: './',
  build: {
    outDir: 'docs',
  },
  define: {
    __BUILD_HASH__: JSON.stringify(hash),
  },
})
