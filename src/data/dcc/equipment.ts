import { Stats } from "../../types"
import occupations from "./occupations"

const equipment = (scores: Stats) => {
  /* rolls start at 1 */
  return occupations[scores['occupation'] - 1].trade_good
}

export default equipment