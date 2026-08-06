import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

// @deriv-com/smartcharts-champion ships a UMD build that externalizes react/react-dom and
// resolves them from its OWN nested node_modules (React 18), so the chart must be mounted as
// an isolated React 18 island while the rest of the app stays on React 19.
//
// Strategy:
//  - The island (src/lib/charts) imports the nested React 18 copy via the `react-18` /
//    `react-dom-18` aliases below.
//  - Transitive deps of the chart (mobx-react-lite, react-transition-group,
//    use-sync-external-store) get hoisted by npm to the top level, where `require("react")`
//    would resolve to the app's React 19. The smartchartsReact18 plugin redirects every
//    react/react-dom import made from within the smartcharts subtree (champion + those three
//    packages + the island) to the nested React 18 copy, so the whole chart shares one React 18.
//  - The same plugin is registered under optimizeDeps.rolldownOptions so the optimizer
//    (Vite 8 / Rolldown) redirects these imports while pre-bundling the champion chart.
const smartchartsNodeModules = fileURLToPath(
  new URL('./node_modules/@deriv-com/smartcharts-champion/node_modules', import.meta.url)
).replace(/\\/g, '/')

const REACT_18 = `${smartchartsNodeModules}/react`
const REACT_DOM_18 = `${smartchartsNodeModules}/react-dom`

const REACT_18_RE = /^react(-dom)?(\/.*)?$/

function isSmartChartsSubtree(importer) {
  if (!importer) return false
  const n = String(importer).replace(/\\/g, '/')
  return (
    n.includes('/@deriv-com/smartcharts-champion/') ||
    n.includes('/mobx-react-lite/') ||
    n.includes('/react-transition-group/') ||
    n.includes('/use-sync-external-store/') ||
    n.includes('/src/lib/charts/')
  )
}

function isReact18File(id) {
  const n = String(id).replace(/\\/g, '/')
  return /@deriv-com\/smartcharts-champion\/node_modules\/react(-dom)?\//.test(n)
}

function idToPath(id) {
  return String(id).startsWith('file://') ? fileURLToPath(String(id)) : String(id)
}

function resolveReact18(spec) {
  switch (spec) {
    case 'react':
      return `${REACT_18}/index.js`
    case 'react/jsx-runtime':
      return `${REACT_18}/jsx-runtime.js`
    case 'react/jsx-dev-runtime':
      return `${REACT_18}/jsx-dev-runtime.js`
    case 'react-dom':
      return `${REACT_DOM_18}/index.js`
    case 'react-dom/client':
      return `${REACT_DOM_18}/client.js`
    case 'react-dom/server':
      return `${REACT_DOM_18}/server.js`
    default:
      return null
  }
}

const smartchartsReact18 = {
  name: 'smartcharts-react18',
  resolveId(source, importer) {
    if (REACT_18_RE.test(source) && isSmartChartsSubtree(importer)) {
      const target = resolveReact18(source)
      if (target) return target
    }
    // Relative requires from inside the React 18 copy (e.g. ./cjs/react.production.min.js).
    if (importer && isReact18File(importer) && source.startsWith('.')) {
      return resolve(dirname(idToPath(importer)), source)
    }
    return null
  },
  load(id) {
    if (isReact18File(id)) {
      return readFileSync(idToPath(id), 'utf8')
    }
    return null
  },
}

const pagesBase = process.env.VITE_BASE ? `${String(process.env.VITE_BASE).replace(/\/+$/, '')}/` : '/'

export default defineConfig({
  base: pagesBase,
  plugins: [react(), smartchartsReact18],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-18': `${REACT_18}`,
      'react-dom-18': `${REACT_DOM_18}`,
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      plugins: [smartchartsReact18],
    },
  },
})
