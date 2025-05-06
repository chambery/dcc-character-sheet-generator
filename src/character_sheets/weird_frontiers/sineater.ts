import { D12 } from "@randsum/dice"
import { Stats } from "../../types"
import birth_augur from "../../utils/birth_augur"
import damage from "../../utils/damage"
import decorate from "../../utils/decorate"
import firearm from "../../utils/firearm"
import hp from "../../utils/hp"
import ability_modifier from "../../utils/modifier"
import occupation from "../../utils/occupation"
import weapon from "../../utils/weapon"

export default  {
    filename: 'sineater_blank_v1.pdf',
    fields: {
      str: { x: 32, y: 638, calc: (scores: Stats) => scores['str'] },
      str_mod: { x: 60, y: 638, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
      agl: { x: 32, y: 594, calc: (scores: Stats) => scores['agl'] },
      agl_mod: { x: 60, y: 594, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
      sta: { x: 32, y: 550, calc: (scores: Stats) => scores['sta'] },
      sta_mod: { x: 60, y: 550, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
      per: { x: 32, y: 505, calc: (scores: Stats) => scores['per'] },
      per_mod: { x: 60, y: 505, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
      int: { x: 32, y: 462, calc: (scores: Stats) => scores['int'] },
      int_mod: { x: 60, y: 462, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
      luck: { x: 32, y: 420, calc: (scores: Stats) => scores['luck'] },
      luck_mod: { x: 60, y: 420, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']) },
      ref: { x: 100, y: 591, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
      fort: { x: 100, y: 546, calc: (scores: Stats) => decorate(ability_modifier(scores['sta'], 1), ['+']) },
      will: { x: 100, y: 503, calc: (scores: Stats) => decorate(ability_modifier(scores['per'], 2), ['+']) },
      grit: {
        x: 94, y: 470, calc: (scores: Stats) => Math.floor((scores['per'] + scores['sta']) / 2),
        style: { size: 6, maxWidth: 20, lineHeight: 7 }
      },

      level: { x: 30, y: 715, calc: () => 1 },
      hp: { x: 200, y: 630, calc: (scores: Stats) => hp(scores, '1d8'), style: { size: 14 } },
      crit: { x: 249, y: 634, calc: () => 'd8' },
      fumble: { x: 285, y: 634, calc: () => 'd12' },
      wealth: { x: 340, y: 695, calc: () => '$' + D12.roll(), style: { size: 6 } },
      birth_augur: {
        x: 80, y: (scores: Stats) => birth_augur(scores).length >= 78 ? 396 : 390,
        calc: (scores: Stats) => birth_augur(scores),
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
        // style: { size: 8, maxWidth: 200, lineHeight: 10 }
      },
      // birth_augur_description: {
      //   x: 145, y: 395,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 686, calc: () => 20 },
      occupation: { x: 220, y: 715, calc: (scores: Stats) => occupation(scores) },
      weapon: {
        x: 150, y: 445, calc: (scores: Stats) => weapon(scores),
        style: { size: 6, maxWidth: 50, lineHeight: 7 }
      },
      damage: {
        x: 210, y: 445, calc: (scores: Stats) => damage(scores),
        style: { size: 6 }
      },
      firearm: {
        x: 150, y: 582, calc: (scores: Stats) => firearm(scores),
        style: { size: 6 }
      },
    }
  } 