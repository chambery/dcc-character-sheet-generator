import * as fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import path from 'path'
import { degrees, PDFDocument, rgb } from 'pdf-lib'
import { DrawTextStyle } from './types'
import curve_text from './utils/curve_text'

const process_pdf = async (file?: File, sheets: { x: number, y: number, text: string, style?: DrawTextStyle }[][] = [], page_style: { font_size?: number } = { font_size: 12 }) => {
  // consol.og('processing pdf')
  if (!file) {
    // consol.og('Please select a PDF file first.')
    return
  }

  if (sheets.length === 0) {
    console.log('Please add some text positions first.')
    return
  }

  // console.log('Processing PDF...')

  try {
    // Read the selected file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // Get the first page (you can iterate through pages if needed)
    const pages = pdfDoc.getPages()
    if (pages.length === 0) {
      // consol.og('PDF has no pages.')
      return
    }
    const page = pages[0]
    page.setRotation(degrees(90))



    // 2. Register fontkit
    pdfDoc.registerFontkit(fontkit)

    // 3. Read the font file

    /* have to download from Google Github font repo  */
    const fontPath = path.join(__dirname, '../assets/ReenieBeanie.ttf') // Replace with the actual path
    const fontBytes = fs.readFileSync(fontPath)

    // 4. Embed the custom font
    const font = await pdfDoc.embedFont(fontBytes, { subset: true })

    // Embed a font (optional, but good practice)
    // const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add text at specified positions
    sheets.forEach((sheet) => { // , i: number
      // console.log('sheet', sheet)

      sheet.forEach(({ text, x, y, style }) => {
        if (text.startsWith('1d4/')) {
          console.log('printing melee_dmg', text)

        }
        if (style?.curve) {
          // console.log('÷÷÷ about to curve_text()', style.curve.curvature )

          curve_text(page, text, font, (style?.size ?? page_style.font_size ?? 12), { x, y }, { x: style.curve.end.x, y: style.curve.end.y }, style.curve.curvature)
        } else {
          if (text.startsWith('1d4/')) {
            console.log('printing melee_dmg', text)

          }
          page.drawText(text, {
            x: x,
            y: y,
            font: font,
            size: style?.size ?? page_style.font_size,
            color: style?.color ?? rgb(0, 0, 0),
            maxWidth: style?.maxWidth,
            lineHeight: style?.lineHeight,
            rotate: style?.rotate
          })
        }
      })
    })
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save()

    // Create a Blob from the bytes
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })

    const filePath = 'out/' + file.name.substring(file.name.lastIndexOf('/') + 1, file.name.indexOf('_')) + '.pdf' // dayjs().format('YYMMDDHHmmss') + 
    await Bun.write(filePath, blob)
    // consol.og(`Blob successfully written to ${filePath}`)

    // Create a download link
    // const url = URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = `modified_${file.name}` // Suggest a filename
    // document.body.appendChild(link)
    // link.click()

    // // Clean up the URL object
    // document.body.removeChild(link)
    // URL.revokeObjectURL(url)

    // consol.og('PDF processed and downloaded successfully.')
    // settexts([]); // Clear positions after processing
    // consol.og(' about to return filePath')
    return filePath
  } catch (error: unknown) {
    console.error('Error processing PDF:', error)
    // consol.og(`Error processing PDF: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
  }
}



export default process_pdf