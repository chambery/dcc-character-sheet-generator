import { degrees, PDFFont, PDFPage } from 'pdf-lib'

interface ShallowCurveParams {
  a: number; // Coefficient for the parabolic curve (controls shallowness)
  // Add other parameters for different curve types if needed
}

interface DrawTextAlongCurveOptions {
  font: PDFFont;
  fontSize: number;
  startX: number;
  startY: number;
  boxWidth: number; // The maximum horizontal width for the text
  lineHeight: number; // Approximate vertical space between lines after wrapping
  curveParams: ShallowCurveParams;
}

/**
 * Draws text along a shallow parabolic curve within a specified box width on a PDF page.
 * Implements basic manual wrapping.
 * @param page The PDFPage object to draw on.
 * @param text The string of text to draw.
 * @param options Options for drawing, including curve parameters and box width.
 */
async function curve_text (
  page: PDFPage,
  text: string,
  options: DrawTextAlongCurveOptions
): Promise<void> {
  const { font, fontSize, startX, startY, boxWidth, lineHeight, curveParams } = options;

  // let currentX = startX;
  let currentX = startX;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const currentY = startY;
  const currentY = startY;
  let currentLineStartX = startX;
  let currentLineStartY = startY;
  let currentLineBuffer = '';

  const words = text.split(' '); // Split text into words for wrapping

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Estimate the width of the current word
    const wordWidth = font.widthOfTextAtSize(word, fontSize);
    const spaceWidth = font.widthOfTextAtSize(' ', fontSize); // Width of a space

    // Check if adding the word exceeds the box width
    if (currentX + wordWidth - currentLineStartX > boxWidth && currentLineBuffer.length > 0) {
      // If it exceeds, draw the current line buffer and reset for a new line

      // Draw the accumulated text for the current line segment
      await drawLineSegmentAlongCurve(
        page,
        currentLineBuffer,
        font,
        fontSize,
        currentLineStartX,
        currentLineStartY,
        curveParams.a
      );

      // Calculate the starting point for the next line.
      // This is a simplified vertical offset. For accuracy on a curve with rotation,
      // this calculation would be much more complex.
      currentLineStartY -= lineHeight; // Move down by lineHeight

      // Reset X to the start of the box for the new line
      currentLineStartX = startX;
      currentX = startX;
      currentLineBuffer = '';
    }

    // Add the current word to the line buffer
    currentLineBuffer += (currentLineBuffer.length > 0 ? ' ' : '') + word;
    currentX += wordWidth + (currentLineBuffer.length > word.length ? spaceWidth : 0); // Update current X based on word width and space
  }

  // Draw any remaining text in the line buffer
  if (currentLineBuffer.length > 0) {
    await drawLineSegmentAlongCurve(
      page,
      currentLineBuffer,
      font,
      fontSize,
      currentLineStartX,
      currentLineStartY,
      curveParams.a
    );
  }
}

/**
 * Helper function to draw a single line segment of text along the parabolic curve.
 */
async function drawLineSegmentAlongCurve(
  page: PDFPage,
  textSegment: string,
  font: PDFFont,
  fontSize: number,
  startX: number,
  startY: number,
  curveCoefficientA: number
): Promise<void> {
  let currentX = startX;

  for (let i = 0; i < textSegment.length; i++) {
    const character = textSegment[i];
    const characterWidth = font.widthOfTextAtSize(character, fontSize);

    const charMidpointX = currentX + characterWidth / 2;

    // Calculate the corresponding Y position on the parabolic curve relative to the segment's startY
    // y = a * (x - startX)^2 + startY
    const charYOnCurve = curveCoefficientA * Math.pow(charMidpointX - startX, 2) + startY;

    // Calculate the tangent slope and rotation angle
    const tangentSlope = 2 * curveCoefficientA * (charMidpointX - startX);
    const rotationAngleInRadians = Math.atan(tangentSlope);
    const rotationAngleInDegrees = rotationAngleInRadians * (180 / Math.PI);

    page.drawText(character, {
      x: currentX,
      y: charYOnCurve,
      font,
      size: fontSize,
      rotate: degrees(rotationAngleInDegrees),
    });

    currentX += characterWidth;
  }
}

export default curve_text

// Example Usage (within an async function):
// async function createPdfWithCurvedWrappedText() {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//
//   const longText = "This is a longer piece of text that should wrap when it reaches the specified box width while still following the shallow curve.";
//   const startX = 50;
//   const startY = 600;
//   const fontSize = 20;
//   const boxWidth = 200; // Set the desired box width
//   const lineHeight = 25; // Set the approximate vertical space between wrapped lines
//   const curveParams: ShallowCurveParams = { a: 0.0003 }; // Adjust 'a' for curve shallowness
//
//   await drawTextAlongShallowParabolicCurveWithWrap(page, longText, {
//     font,
//     fontSize,
//     startX,
//     startY,
//     boxWidth,
//     lineHeight,
//     curveParams,
//   });
//
//   const pdfBytes = await pdfDoc.save();
//   // Do something with pdfBytes, e.g., save or display
// }