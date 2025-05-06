import occupations from "../data/weird_frontiers/occupations"
import { Stats } from "../types"

const occupation = (scores: Stats) => {
  // consol.og('occupation index', scores['occupation'])
  /* rolls start at 1 */
  return occupations[scores['occupation'] - 1].name
}

export default occupation