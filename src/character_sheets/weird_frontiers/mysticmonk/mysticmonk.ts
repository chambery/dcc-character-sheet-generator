import { merge } from "lodash/fp"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import decorate from "../../../utils/decorate"
import ability_modifier from "../../../utils/modifier"
import base_wf from "../index"

export default (() => {

  return merge(base_wf, {
    filename: 'mysticmonk_blank_v1.pdf',
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
      fort: { x: 100, y: 546 },
      will: { x: 100, y: 503, calc: (scores: Stats) => decorate(ability_modifier(scores['per'], 1), ['+']) },
      grit: {
        x: 94, y: 470,
        style: { size: 6, maxWidth: 20, lineHeight: 7 }
      },

      level: { x: 30, y: 715, calc: () => 1 },
      hp: { x: 200, y: 630, dice: (level: number) => '1d10' },
      crit: { x: 242, y: 634, dice: () => 'd10' },
      fumble: { x: 285, y: 634, dice: () => 'd12' },
      wealth: { x: 280, y: 685 },
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 47 ? 393 : 385,
        style: { size: 12, maxWidth: 223, lineHeight: 8 }
      },
      // birth_augur_description: {
      //   x: 145, y: 395,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 687 },
      occupation: { x: 220, y: 715 },
      weapon: { x: 150, y: 445, style: { size: 10, maxWidth: 50, lineHeight: 9 } },
      damage: { x: 210, y: 445, style: { size: 12 } },
      firearm: { x: 150, y: 582, style: { size: 12 } },
      chi_die: {
        x: 83, y: 305, style: { size: 26 },
        calc: (level: number) => '+d3'
      },
      living_weapon: {
        x: 157, y: 127, style: { size: 26 },
        calc: (level: number) => '1d5'
      },
    }


  })
})()  