import dayjs from 'dayjs'
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { DrawTextStyle } from './types'


const process_pdf = async (file?: File, sheets: { x: number, y: number, text: string, style?: DrawTextStyle }[][] = [], font_size: number = 12, offset?: { x: number, y: number }[]) => {
  // consol.og('processing pdf')
  if (!file) {
    // consol.og('Please select a PDF file first.')
    return
  }

  if (sheets.length === 0) {
    console.log('Please add some text positions first.')
    return
  }

  // consol.og('Processing PDF...')

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

    // Embed a font (optional, but good practice)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add text at specified positions
    sheets.forEach((sheet, i: number) => {
      console.log('sheet', i, sheet)


      const x_offset = i > 0 ?
        (offset) ?
          offset.length <= i ?
            /* reuse the pieces of a single offset */
            [0, offset?.[0].x, 0, offset?.[0].x][i]
            : offset[i - 1].x
          : 0 : 0
      const y_offset = i > 0 ?
        (offset) ?
          offset.length <= i ?
            /* reuse the pieces of a single offset */
            [0, 0, offset?.[0].y, offset?.[0].y][i]
            : offset[i - 1].y
          : 0 : 0
      sheet.forEach(({ text, x, y, style }) => {
        // console.log('position ', x + x_offset, y + y_offset, text, style)

        page.drawText(text, {
          x: x + x_offset,
          y: y + y_offset,
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

    const filePath = 'out/' + file.name.substring(file.name.lastIndexOf('/') + 1, file.name.indexOf('_')) + dayjs().format('YYMMDDHHmmss') + '.pdf'
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