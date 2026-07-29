import assert from 'node:assert/strict'
import fs from 'node:fs'

const mermaid = fs.readFileSync('src/components/blog/Mermaid.tsx', 'utf8')

assert.match(
  mermaid,
  /addEventListener\(['"]wheel['"],\s*handleWheel,\s*\{\s*passive:\s*false\s*\}\)/,
  'Mermaid viewport registers a native non-passive wheel listener',
)
assert.match(
  mermaid,
  /if\s*\(!event\.ctrlKey\s*&&\s*!event\.metaKey\)\s*return/,
  'plain wheel events remain available for normal page scrolling',
)
assert.match(
  mermaid,
  /event\.preventDefault\(\)[\s\S]*event\.stopPropagation\(\)/,
  'modifier-wheel zoom blocks native page scrolling and propagation',
)
assert.match(
  mermaid,
  /removeEventListener\(['"]wheel['"],\s*handleWheel\)/,
  'native wheel listener is removed during cleanup',
)
assert.doesNotMatch(
  mermaid,
  /onWheel=\{/,
  'React delegated wheel handling is not used for cancellable zoom input',
)

console.log('Mermaid modifier-wheel scroll lock contract: ok')
