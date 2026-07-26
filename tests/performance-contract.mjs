import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const css = read('src/app/globals.css')
const provider = read('src/components/ui/ThemeProvider.tsx')
const socials = read('src/components/ui/FloatingSocials.tsx')
const tech = read('src/components/ui/FloatingTechIcons.tsx')
const doodles = read('src/components/ui/FloatingDoodles.tsx')
const hero = read('src/components/sections/Hero.tsx')
const footer = read('src/components/sections/Footer.tsx')

assert.match(css, /binary-pixel-transition/, 'theme transition uses a full-screen pixel canvas')
assert.match(css, /content-visibility:\s*auto/, 'off-screen sections skip rendering work')
assert.match(css, /prefers-reduced-motion:\s*reduce/, 'reduced motion remains supported')
console.log('performance and matrix transition contract: ok')
