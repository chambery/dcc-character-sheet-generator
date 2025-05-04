import { NumericDiceNotation, roll } from "@randsum/dice"
import _ from "lodash"
import { Stats } from "../types"
import ability_modifier from "./modifier"

const hp = (scores: Stats, hd: NumericDiceNotation) => {
  const sta_mod = ability_modifier(scores['sta'])
  const rolls_by_level = _.times(scores.level, () => {
    const rolls = roll(hd)
    // consol.og('rolls', rolls.result, rolls.total, '+', sta_mod, '=', rolls.total + sta_mod)
    return rolls.total + sta_mod
  })
  const total = _.sum(rolls_by_level)
  // consol.og('hp', rolls_by_level, total)
  return total
}

export default hp
