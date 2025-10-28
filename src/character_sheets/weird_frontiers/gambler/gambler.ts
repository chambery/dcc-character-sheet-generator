import { merge } from "lodash/fp"
import weapon from "../../../data/weird_frontiers/weapon"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import damage from "../../../utils/damage"
import decorate from "../../../utils/decorate"
import firearm from "../../../utils/firearm"
import ability_modifier from "../../../utils/modifier"
import base from "../index"

export default (() => {

  return merge(base, {
    filename: './gambler_blank_v1.pdf',
    fields: {
      str: { x: 32, y: 638 },
      str_mod: { x: 60, y: 638 },
      agl: { x: 32, y: 594 },
      agl_mod: { x: 60, y: 594 },
      sta: { x: 32, y: 550 },
      sta_mod: { x: 60, y: 550 },
      per: { x: 32, y: 505 },
      per_mod: { x: 60, y: 505 },
      int: { x: 32, y: 462 },
      int_mod: { x: 60, y: 462 },
      luck: { x: 32, y: 420 },
      luck_mod: { x: 60, y: 420 },
      ref: { x: 100, y: 591, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      fort: { x: 100, y: 546, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      will: { x: 100, y: 503 },
      grit: { x: 94, y: 470 },
      level: { x: 30, y: 715 },
      hp: { x: 200, y: 630, dice: (level: number) => '1d8' },
      crit: { x: 249, y: 634, dice: (level: number) => '1d10' },
      fumble: { x: 285, y: 634, dice: (level: number) => '1d12' },
      wealth: { x: 340, y: 695, dice: (level: number) => '1d12' },
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
        calc: async (scores: Stats) => await birth_augur(scores),
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
      },
      // birth_augur_description: {
      //   x: 145, y: 395,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 39, y: 687, calc: () => 20 },
      occupation: { x: 220, y: 715 },
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
      mojo_die: { x: 94, y: 292, calc: () => '+d3' },
    }

  })
})()  