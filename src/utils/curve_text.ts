import { degrees, PDFFont, PDFPage, rgb } from 'pdf-lib'
import { Point } from '../types'


/**
 * Draws text along a shallow curved path between two points
 * @param page The PDF page to draw on
 * @param text The text to draw
 * @param font The font to use
 * @param fontSize Size of the font
 * @param startPoint Starting point coordinates {x, y}
 * @param endPoint Ending point coordinates {x, y}
 * @param curvature Controls the arc of the curve (default: 0.2)
 * @param color Text color (default: black)
 */
const curve_text = async (
  page: PDFPage,
  text: string,
  font: PDFFont,
  fontSize: number,
  startPoint: { x: number, y: number },
  endPoint: { x: number, y: number },
  curvature: number = 0.2,
  color = rgb(0, 0, 0)
) => {
  // Get text width to distribute characters
  const textWidth = font.widthOfTextAtSize(text, fontSize)
  const max_width = getDistance(startPoint, endPoint)
  const text_location_on_slope = getPointOnLineDefinedByTwoPointsAtLength(startPoint, endPoint, textWidth)

  console.log('text', text)
  console.log('textWidth', textWidth)
  console.log('current endpoint', endPoint)

  if (max_width - textWidth > 5) {
    endPoint = text_location_on_slope
  }

  console.log('"new" endpoint', endPoint)
  console.log('------======\n')



  // Calculate the midpoint and control point for the curve
  const midX = (startPoint.x + endPoint.x) / 2
  const midY = (startPoint.y + endPoint.y) / 2

  // Calculate the curve's control point (lowering the midpoint for convex curve)
  const controlX = midX
  const controlY = midY - (Math.abs(endPoint.x - startPoint.x) * curvature)


  // Iterate through each character
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const charWidth = font.widthOfTextAtSize(char, fontSize)

    // Calculate progress along the path (0 to 1)
    const t = i / (text.length - 1)

    // Quadratic Bezier curve interpolation
    const x =
      Math.pow(1 - t, 2) * startPoint.x +
      2 * (1 - t) * t * controlX +
      t * t * endPoint.x

    const y =
      Math.pow(1 - t, 2) * startPoint.y +
      2 * (1 - t) * t * controlY +
      t * t * endPoint.y

    // Calculate rotation based on curve tangent
    const nextT = Math.min(t + 0.01, 1)
    const nextX =
      Math.pow(1 - nextT, 2) * startPoint.x +
      2 * (1 - nextT) * nextT * controlX +
      nextT * nextT * endPoint.x

    const nextY =
      Math.pow(1 - nextT, 2) * startPoint.y +
      2 * (1 - nextT) * nextT * controlY +
      nextT * nextT * endPoint.y

    // Calculate angle
    const angle = Math.atan2(nextY - y, nextX - x)

    // Draw the character
    page.drawText(char, {
      x: x - charWidth / 2,
      y: y - fontSize / 2,
      size: fontSize,
      font: font,
      color: color,
      rotate: degrees(angle)
    })
  }
}


/**
 * Represents a 2D point.
 * The units are assumed to be consistent (e.g., PDF points if used with pdf-lib).
 */
interface Point2D {
  x: number
  y: number
}

/**
 * Calculates the coordinates of a point on a line (defined by a start point and a second point on the line)
 * at a specified distance (length) from the start point along the direction towards the second point.
 *
 * @param startPoint The starting point {x, y} from which the length is measured.
 * @param secondPointOnLine A second point {x, y} that lies on the line, defining the direction from startPoint.
 * @param length The distance along the line from startPoint.
 * A positive length moves from startPoint towards secondPointOnLine.
 * A negative length moves in the opposite direction.
 * If length is 0, startPoint is returned.
 * @returns A new Point2D representing the calculated point. If startPoint and secondPointOnLine are identical
 * and length is non-zero, startPoint is returned as the direction is undefined.
 */
const getPointOnLineDefinedByTwoPointsAtLength = (
  startPoint: Point2D,
  secondPointOnLine: Point2D,
  length: number
) => {
  // If length is 0, the point is the startPoint itself.
  if (length === 0) {
    return { x: startPoint.x, y: startPoint.y }
  }

  const deltaX = secondPointOnLine.x - startPoint.x
  const deltaY = secondPointOnLine.y - startPoint.y

  const magnitudeOfDirectionVector = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // If startPoint and secondPointOnLine are the same, the direction is undefined.
  // In this case, if length is non-zero, we cannot determine a unique point.
  // We'll return the startPoint as a fallback.
  if (magnitudeOfDirectionVector === 0) {
    // This case is hit if length != 0 but points are the same.
    // If length was 0, it would have been caught by the first check.
    return { x: startPoint.x, y: startPoint.y }
  }

  // Calculate the unit vector components for the direction from startPoint to secondPointOnLine.
  const unitVectorX = deltaX / magnitudeOfDirectionVector
  const unitVectorY = deltaY / magnitudeOfDirectionVector

  // Calculate the new point's coordinates by moving 'length' units along the unit vector.
  const newX = startPoint.x + length * unitVectorX
  const newY = startPoint.y + length * unitVectorY

  return {
    x: newX,
    y: newY,
  }
}

// --- Example Usage ---
/*
const pA: Point2D = { x: 10, y: 20 };
const pB: Point2D = { x: 40, y: 60 }; // Defines a line from pA towards pB

// Distance from pA to pB is sqrt((40-10)^2 + (60-20)^2) = sqrt(30^2 + 40^2) = sqrt(900 + 1600) = sqrt(2500) = 50

// Point exactly at pB
const r1 = getPointOnLineDefinedByTwoPointsAtLength(pA, pB, 50);
console.log("Point at pB:", r1); // Expected: { x: 40, y: 60 }

// Point halfway between pA and pB
const r2 = getPointOnLineDefinedByTwoPointsAtLength(pA, pB, 25);
console.log("Halfway point:", r2); // Expected: { x: 25, y: 40 } (10 + 25*(30/50), 20 + 25*(40/50)) = (10+15, 20+20)

// Point beyond pB along the same line
const r3 = getPointOnLineDefinedByTwoPointsAtLength(pA, pB, 75);
console.log("Beyond pB:", r3); // Expected: { x: 55, y: 80 } (10 + 75*(0.6), 20 + 75*(0.8)) = (10+45, 20+60)

// Point in the opposite direction from pA (negative length)
const r4 = getPointOnLineDefinedByTwoPointsAtLength(pA, pB, -25);
console.log("Opposite direction:", r4); // Expected: { x: -5, y: 0 } (10 - 25*(0.6), 20 - 25*(0.8)) = (10-15, 20-20)

// Length is 0
const r5 = getPointOnLineDefinedByTwoPointsAtLength(pA, pB, 0);
console.log("Length 0:", r5); // Expected: { x: 10, y: 20 }

// Vertical line: pA=(10,20), pC=(10,50)
const pC: Point2D = { x: 10, y: 50 };
const r6 = getPointOnLineDefinedByTwoPointsAtLength(pA, pC, 15); // 15 units up from pA
console.log("Vertical up:", r6); // Expected: { x: 10, y: 35 }

// Horizontal line: pA=(10,20), pD=(40,20)
const pD: Point2D = { x: 40, y: 20 };
const r7 = getPointOnLineDefinedByTwoPointsAtLength(pA, pD, 10); // 10 units right from pA
console.log("Horizontal right:", r7); // Expected: { x: 20, y: 20 }

// startPoint and secondPointOnLine are the same
const pE: Point2D = { x: 10, y: 20 };
const r8 = getPointOnLineDefinedByTwoPointsAtLength(pA, pE, 100);
console.log("Identical points, non-zero length:", r8); // Expected: { x: 10, y: 20 } (returns startPoint)

const r9 = getPointOnLineDefinedByTwoPointsAtLength(pA, pE, 0);
console.log("Identical points, zero length:", r9); // Expected: { x: 10, y: 20 } (returns startPoint)
*/


/**
 * Calculates the Euclidean distance between two 2D points.
 * @param p1 - First point.
 * @param p2 - Second point.
 * @returns The distance between p1 and p2.
 */
function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}



export default curve_text
