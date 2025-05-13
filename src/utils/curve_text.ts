import _ from 'lodash'
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
  const curve_width = getArcLengthWithCurvature(startPoint, endPoint, curvature)
  console.log('text', text)
  console.log('textWidth', textWidth)
  console.log('curve_width', curve_width)
  console.log('current endpoint', endPoint)
  if (_.isNumber(curve_width) && textWidth < curve_width) {
    const result = getPointAtLengthOnCurve(startPoint, endPoint, curvature, textWidth)
    console.log('\tresult', result)
    if (result.point) {
      endPoint = result.point
    }
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

/**
 * Calculates the length of a circular arc between two points given a constant curvature.
 *
 * @param p1 - The first point on the arc.
 * @param p2 - The second point on the arc.
 * @param curvature - The constant curvature 'k' of the arc (k = 1/R).
 * If curvature is 0, a straight line is assumed.
 * @returns The length of the arc, or an object with an error message if the arc cannot be formed.
 */
const getArcLengthWithCurvature = (
  p1: Point,
  p2: Point,
  curvature: number
): number | { error: string } => {
  const chordLength = getDistance(p1, p2)

  // Handle identical points
  if (chordLength === 0) {
    return 0
  }

  // Case 1: Zero curvature (straight line)
  // Use a small epsilon for floating point comparison
  const epsilon = 1e-9 // A small tolerance for zero
  if (Math.abs(curvature) < epsilon) {
    return chordLength
  }

  // Case 2: Non-zero curvature (circular arc)
  const radius = 1 / Math.abs(curvature)

  // Validate if the arc is possible
  if (chordLength > 2 * radius + epsilon) { // Add epsilon for float precision
    return {
      error: `Chord length (${chordLength}) exceeds diameter (${2 * radius}); points cannot be connected by an arc with this curvature.`,
    }
  }

  // The value for Math.asin must be between -1 and 1.
  // Handle potential floating point inaccuracies where chordLength / (2 * radius) is slightly > 1
  let ratio = chordLength / (2 * radius)
  if (ratio > 1.0 && ratio < 1.0 + epsilon) {
    ratio = 1.0 // Clamp to 1 if it's very slightly larger due to precision
  } else if (ratio > 1.0) {
    // This should ideally be caught by the chordLength > 2 * radius check,
    // but as a safeguard for asin.
    return { error: `Invalid ratio (${ratio}) for arcsin calculation. Chord might be too long relative to radius.` }
  }


  const theta = 2 * Math.asin(ratio)
  const arcLength = radius * theta

  return arcLength
}

// --- Example Usage ---

// const pointA: Point = { x: 0, y: 0 };
// const pointB: Point = { x: 10, y: 0 };

// // Example 1: Zero curvature (straight line)
// const length1 = getArcLengthWithCurvature(pointA, pointB, 0);
// console.log("Length with zero curvature:", length1); // Expected: 10

// // Example 2: Positive curvature (e.g., radius of 10, so curvature = 0.1)
// // Chord = 10, Radius = 10. This means chord = diameter * sin(theta/2) => 10 = 2*10*sin(theta/2) => sin(theta/2) = 0.5 => theta/2 = PI/6 => theta = PI/3
// // Arc length = R * theta = 10 * PI/3
// const length2 = getArcLengthWithCurvature(pointA, pointB, 0.1);
// console.log("Length with curvature 0.1 (Radius 10):", length2); // Expected: ~10 * Math.PI / 3  (approx 10.47)

// // Example 3: Higher curvature (e.g., radius of 5, so curvature = 0.2)
// // Chord = 10, Radius = 5. Here, chord = diameter. So, it's a semi-circle.
// // theta = PI. Arc length = R * theta = 5 * PI
// const length3 = getArcLengthWithCurvature(pointA, pointB, 0.2);
// console.log("Length with curvature 0.2 (Radius 5):", length3); // Expected: 5 * Math.PI (approx 15.707)

// // Example 4: Points are the same
// const pointC: Point = { x: 5, y: 5 };
// const length4 = getArcLengthWithCurvature(pointC, pointC, 0.1);
// console.log("Length with same points:", length4); // Expected: 0

// // Example 5: Curvature too high (radius too small) for points to connect
// // Radius = 4, Curvature = 0.25. Diameter = 8. Chord = 10. Not possible.
// const length5 = getArcLengthWithCurvature(pointA, pointB, 0.25);
// console.log("Length with curvature 0.25 (Radius 4):", length5);
// // Expected: { error: "Chord length (10) exceeds diameter (8); points cannot be connected by an arc with this curvature." }

// // Example with points that form a chord length close to diameter
// const pointD: Point = { x: 0, y: 0 };
// const pointE: Point = { x: 19.99999999, y: 0 };
// const curvatureForAlmostDiameter = 1/10; // Radius 10, Diameter 20
// const length6 = getArcLengthWithCurvature(pointD, pointE, curvatureForAlmostDiameter);
// console.log("Length for chord close to diameter:", length6);


interface ArcPointResult {
  point?: Point
  error?: string
}

const EPSILON = 1e-9 // Small value for floating point comparisons

/**
 * Gets the point at a specific arc length along a curve defined by two points and curvature.
 *
 * @param p1 Start point of the curve.
 * @param p2 End point of the curve.
 * @param curvature The constant curvature 'k' of the curve (k = 1/R).
 * @param targetLength The distance along the curve from p1 to find the point.
 * @returns An ArcPointResult object with the point or an error message.
 */
function getPointAtLengthOnCurve(
  p1: Point,
  p2: Point,
  curvature: number,
  targetLength: number
): ArcPointResult {
  if (targetLength < -EPSILON) {
    return { error: "Target length must be non-negative." }
  }

  const chordLength = getDistance(p1, p2)
  console.log('\tchordLength', chordLength)
  // Handle identical points
  if (chordLength < EPSILON) {
    if (Math.abs(targetLength) < EPSILON) {
      return { point: { ...p1 } }
    } else {
      return { error: "Target length must be 0 if p1 and p2 are the same point." }
    }
  }

  // Case 1: Straight line (curvature is effectively zero)
  if (Math.abs(curvature) < EPSILON) {
    if (targetLength > chordLength + EPSILON) {
      return {
        error: `Target length (${targetLength}) exceeds total line length (${chordLength}).`,
      }
    }
    // Handle targetLength === 0 explicitly to avoid division by zero if chordLength is also 0 (already handled)
    if (Math.abs(targetLength) < EPSILON) {
      return { point: { ...p1 } }
    }
    const ratio = targetLength / chordLength
    return {
      point: {
        x: p1.x + ratio * (p2.x - p1.x),
        y: p1.y + ratio * (p2.y - p1.y),
      },
    }
  }

  // Case 2: Circular Arc
  const radius = 1 / Math.abs(curvature)

  // Validate if arc is possible
  if (chordLength > 2 * radius + EPSILON) {
    return {
      error: `Chord length (${chordLength}) exceeds diameter (${2 * radius}); points cannot be connected by an arc with this curvature.`,
    }
  }

  // Clamp value for arcsin to avoid NaN due to precision issues
  const valForArcsin = Math.max(-1, Math.min(1, chordLength / (2 * radius)))
  const totalAngleTheta = 2 * Math.asin(valForArcsin)
  const totalArcLength = radius * totalAngleTheta

  if (targetLength > totalArcLength + EPSILON) {
    return {
      error: `Target length (${targetLength}) exceeds total arc length (${totalArcLength}).`,
    }
  }
  if (Math.abs(targetLength) < EPSILON) {
    return { point: { ...p1 } }
  }


  const M: Point = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }

  const hSquared = radius * radius - (chordLength / 2) * (chordLength / 2)
  const h = Math.sqrt(Math.max(0, hSquared)) // Ensure non-negative for sqrt

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  // sgn(curvature) determines the side of the center and thus CCW/CW direction
  // This convention places center to the "left" of p1->p2 for positive curvature (CCW arc)
  const sgnCurvature = Math.sign(curvature) // -1, 0, or 1. 0 already handled.

  const Pc: Point = {
    x: M.x - sgnCurvature * h * dy / chordLength, // Note: chordLength cannot be 0 here
    y: M.y + sgnCurvature * h * dx / chordLength,
  }

  const startAnglePhi1 = Math.atan2(p1.y - Pc.y, p1.x - Pc.x)
  const angularDisplacementDeltaPhi = targetLength / radius

  const finalAngle = startAnglePhi1 + sgnCurvature * angularDisplacementDeltaPhi

  return {
    point: {
      x: Pc.x + radius * Math.cos(finalAngle),
      y: Pc.y + radius * Math.sin(finalAngle),
    },
  }
}

export default curve_text

