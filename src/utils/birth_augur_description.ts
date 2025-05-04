import birth_augurs from "../data/birth_augurs"
import { Stats } from "../types"

const birth_augur_description = (scores: Stats) => {
  const birth_augur = birth_augurs[scores['birth_augur']] ?? birth_augurs[28]
  return birth_augur.description
}

export default birth_augur_description