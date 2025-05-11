import { Stats } from "../../types"
import firearms from "./firearms"
import occupations from "./occupations"

const weapon = (scores: Stats) => {
  /* rolls start at 1 */
  const weapon = occupations[scores['occupation'] - 1].weapon
  if (!firearms.includes(weapon)) {
    return weapon.substring(0, weapon.indexOf('(') - 1)
  }
  return ''
}

export default weapon