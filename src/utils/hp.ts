import { NumericDiceNotation, roll } from "@randsum/dice"
import _ from "lodash"
import { Stats } from "../types"
import ability_modifier from "./modifier"

const hp = (scores: Stats, hd: NumericDiceNotation) => {
  const sta_mod = ability_modifier(scores['sta'])
  const rolls_by_level = _.times(scores.level, () => {
    const rolls = roll(hd) 
    /* min hp is 1 per roll */
    return (rolls.total < 1 ?  1 : rolls.total) + sta_mod
  })
  // console.log('rolls by level', rolls_by_level, scores.level)
  const total = _.sum(rolls_by_level)
  return total
}

export default hp
