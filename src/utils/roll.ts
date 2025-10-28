import { NumericDiceNotation, roll as roll_dice } from "@randsum/dice"
import { isEmpty } from "lodash/fp"

export const roll = (dice?: NumericDiceNotation) => {
  if (isEmpty(dice)) { throw Error('Dice cannot be empty and must be in NumericDiceNotation') }
  return roll_dice(dice).result
}