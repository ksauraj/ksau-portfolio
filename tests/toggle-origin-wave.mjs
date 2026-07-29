import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const navbar = read('src/components/sections/Navbar.tsx')
const provider = read('src/components/ui/ThemeProvider.tsx')
const transition = read('src/components/ui/BinaryPixelTransition.tsx')
const css = read('src/app/globals.css')

assert.match(navbar, /toggleTheme\(\{\s*x:\s*event\.clientX,\s*y:\s*event\.clientY\s*\}\)/, 'toggle passes exact pointer coordinates as the ripple origin')
assert.match(provider, /origin:\s*\{\s*x:\s*number;\s*y:\s*number\s*\}/, 'provider stores a viewport-space ripple origin')
assert.match(provider, /pointerOrigin/, 'provider accepts a viewport-space ripple origin')
assert.match(transition, /Math\.hypot/, 'canvas renders by radial distance from the toggle')
assert.match(transition, /rippleRadius/, 'local binary glyphs form expanding circular rings')
assert.match(transition, /lowerBound\(ripple\.cells, Math\.max\(0, rippleRadius - ripple\.band\)\)[\s\S]*lowerBound\(ripple\.cells, rippleRadius\)/, 'local binary crest stays inside its randomized band')
assert.doesNotMatch(transition, /waveY|trailLengths|trailStart/, 'vertical rain geometry is removed')
assert.match(css, /circle\(0px at var\(--theme-origin-x\).*var\(--theme-origin-y\)/, 'new theme begins clipped at the toggle')
assert.match(css, /circle\(var\(--theme-reveal-radius\).*var\(--theme-origin-x\).*var\(--theme-origin-y\)/, 'new theme expands radially to cover the viewport')
assert.match(provider, /startViewTransition\(applyTheme\)/, 'background changes underneath before the ripple animation runs')
console.log('toggle-origin radial binary wave contract: ok')
