import { D100, D20, D6, roll } from '@randsum/dice'
import path from 'path'
import { RGB } from 'pdf-lib'
import process_pdf from './process_pdf'
import { DrawTextStyle, PDF, Point } from './types'


declare global {
  // eslint-disable-next-line no-var
  var system: string | undefined
}

const generate = async ([sheetname, level = '1']: string[]) => {

  const resolvedPath = path.resolve('src/character_sheets/' + sheetname + '.ts')
  const sheet = (await import(resolvedPath)).default as PDF
  globalThis.system = sheet.system as string
  console.log('system', globalThis.system)

  console.log(sheet.filename)
  if (!sheet) { throw new Error('Invalid class name') }
  const filePath = 'assets/' + sheet.filename
  /* +1 for 0-level rolls */
  const blob = Bun.file(filePath)
  const file = new File([blob], filePath)

  if (sheet.offset && sheet.offset.length === 1) {
    /* If there is only one offset, duplicate it for all four sheets */
    console.log('Duplicating offset for all four sheets')
    sheet.offset = [
      { x: 0, y: sheet.offset[0].y },
      { x: sheet.offset[0].x, y: 0 },
      { x: sheet.offset[0].x, y: sheet.offset[0].y }
    ]
  } else {
    console.log('Multiple/no offsets detected, using provided offsets.')
  }

  (sheet.offset = sheet.offset ?? []).push({ x: 0, y: 0 })

  console.log('sheet.offset(s)', sheet.offset)

  const sheets = await Promise.all(sheet.offset.map(async (offset: Point) => {
    const scores = roll_dice(Number(level) + 1)
    const texts: { x: number, y: number, text: string, style?: { size?: number, color?: RGB } }[] = []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await Promise.all(Object.entries(sheet.fields).map(async ([key, field]) => {
      const value = String(await field.calc(scores))
      if (value == undefined) return
      const offsetStyle = offset_style(offset, (typeof field.style === 'function') ? await field.style(scores) : field.style)
      // if (offsetStyle.curve) console.log('\n\noffsetStyle curvature', offsetStyle.curve.curvature, '\n=======\n')
      texts.push(
        {
          x: (typeof field.x === 'function' ? await field.x(scores) : field.x + (value.length == 1 ? 2 : 0)) + offset.x,
          y: (typeof field.y === 'function' ? await field.y(scores) : field.y) + offset.y,
          text: value,
          style: offsetStyle
        })
    }))
    return texts
  }))

  // console.log('sheets', sheets)
  const filepath = await process_pdf(file, sheets, sheet.style)
  // const filepath = await process_bare_pdf(file, sheets)
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

const offset_style = (offset: Point, style?: DrawTextStyle) => {
  if (!style) return {}
  if (!style.curve) return style
  return {
    ...style,
    curve: {
      ...style.curve,
      end: {
        x: style.curve.end.x + offset.x,
        y: style.curve.end.y + offset.y
      }
    }
  }

}




export default generate