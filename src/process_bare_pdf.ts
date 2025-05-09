import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { DrawTextStyle } from './types'


const process_bare_pdf = async (file: File, sheets: { x: number, y: number, text: string, style?: DrawTextStyle }[][] = [], font_size: number = 12) => {
  // consol.og('processing pdf')
  if (sheets.length === 0) {
    console.log('Please add some text positions first.')
    return
  }

  // consol.og('Processing PDF...')

  try {
    // Read the selected file as an ArrayBuffer
    // const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.create()

    const page = pdfDoc.addPage()
    page.setRotation(degrees(90))

    // Embed a font (optional, but good practice)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add text at specified positions
    sheets.forEach((sheet, i: number) => {
      console.log('sheet', i, sheet)

      sheet.forEach(({ text, x, y, style }) => {
        // console.log('position ', x + x_offset, y + y_offset, text, style)

        page.drawText(text, {
          x: x,
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

export default process_bare_pdf