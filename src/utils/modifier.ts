/**
 * Returns the modifier for a given ability score.
 * @param score ability score
 * @param addl_mod additional modifier to add to the modifier
 * @returns modifier
 */
const ability_modifier = (score: number, addl_mod?: number) => {
  const mods = [
    -3,
    -3,
    -3,
    -2,
    -2,
    -1,
    -1,
    -1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    2,
    2,
    3,
    3,
    3,
    4,
    4,
    5,
  ]
  return mods[score] + (addl_mod ?? 0)
}

export default ability_modifier