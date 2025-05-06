import firearms from "../data/weird_frontiers/firearms"
import occupations from "../data/weird_frontiers/occupations"
import { Stats } from "../types"

const weapon = (scores: Stats) => {
  /* rolls start at 1 */
  const weapon = occupations[scores['occupation'] - 1].weapon
  if (!firearms.includes(weapon)) {
    return weapon.substring(0, weapon.indexOf('(') - 1)
  }
  return ''
}

export default weapon