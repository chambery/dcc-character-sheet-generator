import { NumericDiceNotation, roll } from "@randsum/dice"
import { isEmpty, sum, times } from 'lodash/fp'
import { Stats } from "../types"
import ability_modifier from "./modifier"


const hp = (scores: Stats, hd: NumericDiceNotation) => {
  console.log('hp:  scores', scores, 'hd', hd)
  if (isEmpty(hd)) { throw Error('Hit dice cannot be empty and must be in NumericDiceNotation') }

  const sta_mod = ability_modifier(scores['sta'])
  const rolls_by_level = times(() => {
    const rolls = roll(hd)
    /* min hp is 1 per roll */
    return (rolls.total < 1 ? 1 : rolls.total) + sta_mod
  }, scores.level)
  console.log('rolls by level', rolls_by_level, scores.level)
  const total = sum(rolls_by_level)
  console.log('total', total)
  return total
}

export default hp
