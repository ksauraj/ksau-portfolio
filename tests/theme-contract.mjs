import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const provider = read('src/components/ui/ThemeProvider.tsx')
const layout = read('src/app/layout.tsx')
const navbar = read('src/components/sections/Navbar.tsx')
const css = read('src/app/globals.css')
const tailwind = read('tailwind.config.ts')

assert.match(provider, /localStorage\.getItem\(['"]ksau-theme['"]\)/, 'restores saved theme')
assert.match(provider, /localStorage\.setItem\(['"]ksau-theme['"]/, 'persists selected theme')
assert.match(provider, /aria-hidden="true"/, 'transition decoration is hidden from assistive tech')
assert.match(provider, /Math\.random\(\).*['"]1['"].*['"]0['"]|['"]1['"].*['"]0['"].*Math\.random\(\)/s, 'generates random binary glyphs')
assert.match(layout, /data-theme="dark"/, 'dark is the first-visit default')
assert.match(layout, /ThemeProvider/, 'theme provider wraps the application')
assert.match(layout, /localStorage\.getItem\(['"]ksau-theme['"]\)/, 'inline bootstrap prevents theme flash')
assert.match(layout, /suppressHydrationWarning/, 'pre-paint theme mutation is hydration-safe')
assert.match(navbar, /aria-label=.*theme|aria-label=.*mode/i, 'toggle has an accessible name')
assert.match(navbar, /aria-pressed=/, 'toggle exposes its current state')
assert.match(navbar, /focus-visible:ring/, 'toggle has a visible keyboard focus style')
assert.match(navbar, /useTheme/, 'navbar exposes the theme control')
assert.match(provider, /meta\[name=["']theme-color["']\]/, 'browser chrome follows the active theme')
assert.match(css, /html\[data-theme=['"]light['"]\]/, 'light palette exists')
assert.match(css, /prefers-reduced-motion:\s*reduce/, 'transition respects reduced-motion')
assert.match(css, /theme-transition__(?:rain|glare)/, 'binary glare transition is styled')
assert.match(tailwind, /var\(--color-bg\)/, 'Tailwind colors use theme tokens')

console.log('theme contract: ok')
