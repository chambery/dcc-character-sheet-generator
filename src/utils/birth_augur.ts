import birth_augurs from "../data/weird_frontiers/birth_augurs"
import { Stats } from "../types"

const birth_augur = (scores: Stats) => {
  // consol.og('birth augur', scores['birth_augur'])
  const score = scores['birth_augur'] > 29 ? 29 : scores['birth_augur']
  /* rolls start at 1 */
  const birth_augur = birth_augurs[score - 1]
  const text = scores['birth_augur'] + '. ' + birth_augur.name + " -  " + birth_augur.description
  // consol.og(text, text.length)
  return text
}

export default birth_augur