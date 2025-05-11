import { exec } from "child_process"
import { watch } from "fs"

const args = Bun.argv

const watcher = watch(import.meta.dir, { recursive: true }, (event, filename) => {
  console.log(`Detected ${event} in ${filename}`)
  if (!filename?.startsWith('out')) {
    exec(args.slice(2).join(' '), (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      } console.log(stdout)
    })
  }
},)

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...")
  watcher.close()

  process.exit(0)
})