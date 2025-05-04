import dayjs from 'dayjs'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { DrawTextStyle } from './types'


const process_pdf = async (file?: File, texts: { x: number, y: number, text: string, style?: DrawTextStyle }[] = []) => {
  // consol.og('processing pdf')
  if (!file) {
    // consol.og('Please select a PDF file first.')
    return
  }

  if (texts.length === 0) {
    // consol.og('Please add some text positions first.')
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
    const firstPage = pages[0]

    // Embed a font (optional, but good practice)
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add text at specified positions
    texts.forEach(({ text, x, y, style }) => {
      // consol.og('position ', x, y, text, style)
      firstPage.drawText(text, {
        x: x,
        y: y,
        font: font,
        size: style?.size ?? 12,
        color: style?.color ?? rgb(0, 0, 0),
        maxWidth: style?.maxWidth,
        lineHeight: style?.lineHeight

      })

    })

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save()

    // Create a Blob from the bytes
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })

    const filePath = 'out/' + file.name.substring(0, file.name.indexOf('_')) + dayjs().format('YYMMDDHHmmss') + '.pdf'
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