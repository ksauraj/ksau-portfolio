import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const provider = read('src/components/ui/ThemeProvider.tsx')
const pixelTransition = read('src/components/ui/BinaryPixelTransition.tsx')
const css = read('src/app/globals.css')

assert.match(provider, /doc\.startViewTransition/, 'theme toggle uses the View Transitions API')
assert.match(provider, /startViewTransition\(applyTheme\)/, 'theme mutation is captured between old and new snapshots')
assert.match(provider, /prefers-reduced-motion/, 'unsupported/reduced-motion path switches immediately')
assert.match(provider, /viewTransition\.finished/, 'transition state cleans up when reveal completes')
assert.match(css, /::view-transition-old\(root\)/, 'old theme snapshot remains visible below the wave')
assert.match(css, /::view-transition-new\(root\)/, 'new theme is progressively revealed above the wave')
assert.match(css, /clip-path:\s*inset\(0 0 100% 0\)/, 'new theme begins fully clipped')
assert.match(css, /clip-path:\s*inset\(0 0 0 0\)/, 'new theme ends fully revealed')
assert.match(css, /::view-transition-old\(root\)\s*\{\s*animation-name:\s*none/, 'old theme stays visible below the wave')
assert.match(css, /html:active-view-transition[\s\S]*transition:\s*none/, 'normal color fades do not leak ahead of the wave')
assert.match(css, /animation-duration:\s*var\(--theme-transition-duration, 2750ms\)/, 'snapshot reveal uses progressive timing')
assert.match(pixelTransition, /MIN_DURATION\s*=\s*2500/, 'canvas wave starts at 2.5 seconds')
assert.match(pixelTransition, /MAX_DURATION\s*=\s*3000/, 'canvas wave caps at 3 seconds')
assert.match(css, /animation-timing-function:\s*linear/, 'theme boundary tracks the linear wave')
console.log('wave-synchronized theme reveal contract: ok')
