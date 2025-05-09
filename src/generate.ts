import { D100, D20, D6, roll } from '@randsum/dice'
import path from 'path'
import { RGB } from 'pdf-lib'
import process_pdf from './process_pdf'
import { PDF } from './types'

const generate = async ([classname, level = '1']: string[]) => {
  // consol.og(classname, level)
  const resolvedPath = path.resolve('src/character_sheets/' + classname + '.ts');
  const character_sheet = (await import(resolvedPath)).default as PDF
  console.log(character_sheet.filename)
  if (!character_sheet) { throw new Error('Invalid class name') }
  const filePath = 'src/assets/' + character_sheet.filename
  /* +1 for 0-level rolls */
  const scores = roll_dice(Number(level) + 1)
  const blob = Bun.file(filePath)
  const file = new File([blob], filePath)

  const texts: { x: number, y: number, text: string, style?: { size?: number, color?: RGB } }[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(character_sheet.fields).forEach(([key, field]) => {
    const value = String(field.calc(scores))
    // consol.og(key, value)
    if (value == undefined) return
    texts.push(
      {
        x: typeof field.x === 'function' ? field.x(scores) : field.x + (value.length == 1 ? 5 : 0),
        y: typeof field.y === 'function' ? field.y(scores) : field.y,
        text: value,
        style: field.style
      })
  })

  const filepath = await process_pdf(file, texts)
  // consol.og('PDF generated:', filepath)
  return filepath
}

const roll_dice = (level: number) => {
  const stats = {
    str: D6.roll(3),
    agl: D6.roll(3),
    sta: D6.roll(3),
    per: D6.roll(3),
    int: D6.roll(3),
    luck: D6.roll(3),
    occupation: D100.roll(),
    birth_augur: roll('1d30').total,
    level,
    familiar_type: D20.roll(),
    familiar_personality: D20.roll(),
  }

  return stats
}

export default generate