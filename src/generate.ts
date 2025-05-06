import { D100, D20, D6, roll } from '@randsum/dice'
import _ from 'lodash'
import path from 'path'
import { RGB } from 'pdf-lib'
import process_pdf from './process_pdf'
import { PDF } from './types'

const generate = async ([sheetname, level = '1']: string[]) => {

  const resolvedPath = path.resolve('src/character_sheets/' + sheetname + '.ts')
  const sheet = (await import(resolvedPath)).default as PDF
  console.log(sheet.filename)
  if (!sheet) { throw new Error('Invalid class name') }
  const filePath = 'assets/' + sheet.filename
  /* +1 for 0-level rolls */
  const blob = Bun.file(filePath)
  const file = new File([blob], filePath)

  const sheets: { x: number, y: number, text: string, style?: { size?: number, color?: RGB } }[][] = []


  if (sheet.four_up_offset) {
    _.times(4, () => {
      const scores = roll_dice(Number(level) + 1)
      const texts: { x: number, y: number, text: string, style?: { size?: number, color?: RGB } }[] = []
      sheets.push(texts)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(sheet.fields).forEach(([key, field]) => {
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
    })
  }

  console.log('sheets', sheets)
  const filepath = await process_pdf(file, sheets, sheet.font_size, sheet.four_up_offset)
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