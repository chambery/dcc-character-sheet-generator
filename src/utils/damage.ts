import occupations from "../data/occupations"
import { Stats } from "../types"

const damage = (scores: Stats) => {
  /* rolls start at 1 */
  const weapon = occupations[scores['occupation'] - 1].weapon
  return weapon.substring(weapon.indexOf('(') + 1, weapon.indexOf(')'))
}

export default damage