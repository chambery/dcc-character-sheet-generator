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

export default {
  filename: 'gunslinger_blank_v1.pdf',
  system: 'weird_frontiers',
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
    ref: { x: 105, y: 590, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
    fort: { x: 105, y: 545, calc: (scores: Stats) => decorate(ability_modifier(scores['sta'], 1), ['+']) },
    will: { x: 105, y: 500, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
    grit: {
      x: 94, y: 470, calc: (scores: Stats) => Math.floor((scores['per'] + scores['sta']) / 2),
      style: { size: 6, maxWidth: 20, lineHeight: 7 }
    },
    level: { x: 30, y: 715, calc: () => 1 },
    hp: { x: 200, y: 630, calc: (scores: Stats) => hp(scores, '1d10'), style: { size: 14 } },
    crit: { x: 249, y: 634, calc: () => 'd10' },
    fumble: { x: 285, y: 634, calc: () => 'd12' },
    wealth: { x: 340, y: 695, calc: () => '$' + D12.roll(), style: { size: 6 } },
    birth_augur: {
      x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
      calc: async (scores: Stats) => await birth_augur(scores),
      style: { size: 7, maxWidth: 223, lineHeight: 6 }
      // style: { size: 8, maxWidth: 200, lineHeight: 10 }
    },
    // birth_augur_description: {
    //   x: 145, y: 395,
    //   calc: (scores: Stats) => birth_augur_description(scores),
    //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
    // },
    action_die: { x: 37, y: 687, calc: () => 20 },
    occupation: { x: 220, y: 715, calc: (scores: Stats) => occupation(scores) },
    weapon: {
      x: 150, y: 457, calc: (scores: Stats) => weapon(scores),
      style: { size: 6 }
    },
    damage: {
      x: 205, y: 457, calc: (scores: Stats) => damage(scores),
      style: { size: 6 }
    },
    firearm: {
      x: 150, y: 585, calc: (scores: Stats) => firearm(scores),
      style: { size: 6 }
    },
    critical_threat_range: { x: 555, y: 755, calc: () => '19-20' },
    deadeye_die: { x: 565, y: 680, calc: () => 'd3' }

  }
}