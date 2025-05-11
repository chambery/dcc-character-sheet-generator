import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { DrawTextStyle } from './types'


const process_bare_pdf = async (file: File, sheets: { x: number, y: number, text: string, style?: DrawTextStyle }[][] = [], font_size: number = 4) => {
  // consol.og('processing pdf')
  if (sheets.length === 0) {
    console.log('Please add some text positions first.')
    return
  }

  // consol.og('Processing PDF...')

  try {
    // Read the selected file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document
    // const pdfDoc = await PDFDocument.create()
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // const page = pdfDoc.addPage()
    const pages = pdfDoc.getPages()
    if (pages.length === 0) {
      // consol.og('PDF has no pages.')
      return
    }
    const page = pages[0]

    page.setRotation(degrees(90))

    // Embed a font (optional, but good practice)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add text at specified positions
    sheets.forEach((sheet, i: number) => {
      console.log('sheet', i, sheet)

      sheet.forEach(({ text, x, y, style }) => {
        console.log('position ', x, y, text, style)
        page.drawLine({
          start: { x: x, y: 0 },
          end: { x: x, y: 300 },
          thickness: 1,
          color: rgb(0, 0, 0),
          opacity: 0.2,
        })
        console.log('after  vert drawLine')
        page.drawLine({
          start: { x: 0, y: y },
          end: { x: 380, y: y },
          thickness: 1,
          color: rgb(0, 0, 0),
          opacity: 0.2,
        })
        console.log('after  horisz drawLine')

        page.drawText(text, {
          x: x,
          y: y,
          font: font,
          size: style?.size ?? font_size,
          color: style?.color ?? rgb(0, 0, 0),
          maxWidth: style?.maxWidth,
          lineHeight: style?.lineHeight
        })

        page.drawText(text, {
          x: x,
          y: 40,
          font: font,
          size: style?.size ?? font_size,
          color: style?.color ?? rgb(0, 0, 0),
          maxWidth: style?.maxWidth,
          lineHeight: style?.lineHeight
        })
        page.drawText(text, {
          x: 380,
          y: y,
          font: font,
          size: style?.size ?? font_size,
          color: style?.color ?? rgb(0, 0, 0),
          maxWidth: style?.maxWidth,
          lineHeight: style?.lineHeight
        })
      })
    })
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save()

    // Create a Blob from the bytes 
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })

    const filePath = 'out/DCC-coord.pdf' // dayjs().format('YYMMDDHHmmss') + 
    console.log('filePath', filePath)
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

export default process_bare_pdf