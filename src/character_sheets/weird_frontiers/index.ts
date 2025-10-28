import { NumericDiceNotation } from '@randsum/dice'
import weapon from '../../data/weird_frontiers/weapon'
import { Stats } from '../../types'
import birth_augur from '../../utils/birth_augur'
import damage from '../../utils/damage'
import decorate from '../../utils/decorate'
import firearm from '../../utils/firearm'
import hp from '../../utils/hp'
import ability_modifier from '../../utils/modifier'
import occupation from '../../utils/occupation'
import { roll } from '../../utils/roll'

export default {
  system: 'weird_frontiers',
  style: { font_size: 22 },
  fields: {
    str: { calc: (scores: Stats) => scores['str'] },
    str_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
    agl: { calc: (scores: Stats) => scores['agl'] },
    agl_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    sta: { calc: (scores: Stats) => scores['sta'] },
    sta_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
    per: { calc: (scores: Stats) => scores['per'] },
    per_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
    int: { calc: (scores: Stats) => scores['int'] },
    int_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
    luck: { calc: (scores: Stats) => scores['luck'] },
    luck_mod: { calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']) },
    ref: { calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    fort: { calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
    will: { calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
    grit: {
      calc: (scores: Stats) => Math.floor((scores['per'] + scores['sta']) / 2),
      style: { size: 16 }
    },
    level: { calc: () => 1 },
    hp: { calc: (scores: Stats, dice: NumericDiceNotation) => hp(scores, dice) },
    crit: { calc: (scores: Stats, dice: NumericDiceNotation) => roll(dice) },
    fumble: { calc: (scores: Stats, dice: NumericDiceNotation) => roll(dice) },
    wealth: { calc: (scores: Stats, dice: NumericDiceNotation) => '$' + roll(dice), style: { size: 18 } },
    birth_augur: { calc: async (scores: Stats) => await birth_augur(scores) },
    // birth_augur_description: {
    //   x: 80, y: 392,
    //   calc: (scores: Stats) => birth_augur_description(scores),
    //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
    // },
    action_die: { calc: () => 20, style: { size: 16 } },
    occupation: { calc: (scores: Stats) => occupation(scores) },
    weapon: {
      calc: (scores: Stats) => weapon(scores),
    },
    firearm: {
      calc: (scores: Stats) => firearm(scores),
    },
    damage: {
      calc: (scores: Stats) => damage(scores),
    },
  }
}