import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const markdown = read('src/components/blog/MarkdownContent.tsx')
const css = read('src/app/globals.css')
const codeBlock = read('src/components/blog/CodeBlock.tsx')

assert.match(markdown, /theme:\s*\{\s*dark:\s*['"]github-dark['"],\s*light:\s*['"]github-light['"]\s*\}/, 'syntax highlighting emits separate dark and light palettes')
assert.match(css, /html\[data-theme='light'\] \.prose-blog \[data-rehype-pretty-code-figure\] span[\s\S]*--shiki-light/, 'light mode selects Shiki light token colors')
assert.match(css, /html\[data-theme='light'\] \.prose-blog pre[\s\S]*#F6F8FA/i, 'light code blocks use a distinct accessible surface')
assert.match(css, /html\[data-theme='light'\] \.prose-blog code:not\(\[data-language\][\s\S]*#24292F/i, 'inline code has high-contrast text')
assert.match(css, /html\[data-theme='light'\] \.code-block button[\s\S]*#24292F/i, 'copy control remains visible in light mode')
assert.match(css, /\.prose-blog pre::-webkit-scrollbar-thumb[\s\S]*#8C959F/i, 'code scrollbar thumb is visible')
assert.match(codeBlock, /opacity-100/, 'copy action is visible on touch devices without hover')
console.log('light code contrast contract: ok')
