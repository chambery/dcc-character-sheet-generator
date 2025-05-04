import firearms from "../data/firearms"
import occupations from "../data/occupations"
import { Stats } from "../types"

const firearm = (scores: Stats) => {
  /* rolls start at 1 */
  const firearm = occupations[scores['occupation'] - 1].weapon
  if (firearms.includes(firearm)) {
    return firearm
  }
  return ''
}

export default firearm