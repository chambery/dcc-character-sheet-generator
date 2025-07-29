import fs from "fs/promises"
import generate from "./generate"

const args = Bun.argv

if (args[2] === '--help') {
  console.log('Usage: node main.js <class_name>')
  console.log('Example: node main.js dcc/gf-4up-dashboard')
  process.exit(0)
}

if (args.length < 3) {
  console.error('Please provide a class name as an argument.')
  process.exit(1)
}

const files = await fs.readdir('src/character_sheets/' + args[2])
console.log(files)
files.forEach(async (file) => {
  console.log('Files found:', file)
  const result = await generate(args[2] + '/' + file.split('.')[0], args[3])
  console.log(process.cwd() + '/' + result)
})

// const result = await generate(args.slice(2))
// console.log(process.cwd() + '/' + result)