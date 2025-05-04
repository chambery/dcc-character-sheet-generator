import generate from "./generate"
const args = Bun.argv
// consol.og(args)
if (args.length < 3) {
  console.error('Please provide a class name as an argument.')
  process.exit(1)
}
const result = await generate(args.slice(2))
console.log(process.cwd() + '/' + result)