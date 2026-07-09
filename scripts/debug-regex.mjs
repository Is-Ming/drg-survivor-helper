import { readFileSync } from 'fs'
const content = readFileSync('src/data/overclocks.ts', 'utf8')
const target = '+25% 伤害，+25% 装填速度'
const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const re = new RegExp(`(effect:\\s*"${escaped}")`, 'g')
const result = content.replace(re, `$1, enEffect: "test"`)
console.log('Total matches:', (content.match(re) || []).length)
// Check first 200 chars of result
console.log('First result line:', result.split('\n').filter(l => l.includes('a-little-more-oomph'))[0])
