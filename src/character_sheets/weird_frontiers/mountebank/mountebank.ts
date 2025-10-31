import { merge } from "lodash/fp"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import decorate from "../../../utils/decorate"
import ability_modifier from "../../../utils/modifier"
import base_wf from "../index"

export default (() => {

  return merge(base_wf, {
    filename: 'mountebank_blank_v1.pdf',
    fields: {
      str: { x: 32, y: 638},
      str_mod: { x: 60, y: 638 },
      agl: { x: 32, y: 594},
      agl_mod: { x: 60, y: 594},
      sta: { x: 32, y: 550},
      sta_mod: { x: 60, y: 550},
      per: { x: 32, y: 505},
      per_mod: { x: 60, y: 505},
      int: { x: 32, y: 462},
      int_mod: { x: 60, y: 462},
      luck: { x: 32, y: 420},
      luck_mod: { x: 60, y: 420},
      ref: { x: 102, y: 595, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      fort: { x: 100, y: 550},
      will: { x: 102, y: 505, calc: (scores: Stats) => decorate(ability_modifier(scores['per'], 1), ['+']) },
      grit: {x: 94, y: 470,},
      level: { x: 30, y: 715},
      hp: { x: 200, y: 635, dice: (level: number) => '1d8' },
      crit: { x: 250, y: 635, dice: () => 'd6' },
      fumble: { x: 285, y: 635, dice: () => 'd12' },
      wealth: { x: 340, y: 695},
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
      },
      // birth_augur_description: {
      //   x: 80, y: 392,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 687 },
      occupation: { x: 220, y: 715 },
      weapon: { x: 150, y: 450, style: { size: 6, maxWidth: 50, lineHeight: 7 } },
      damage: { x: 205, y: 450, style: { size: 6 } },
      firearm: { x: 150, y: 585, style: { size: 6 } },

      max_active: {
        x: 555, y: 630,
        calc: (level: number) => 2
      },
      firebomb_damage: {
        x: 423, y: 455,
        calc: (level: number) => '1d6'
      },
      acidbomb_damage: {
        x: 556, y: 337,
        calc: (level: number) => '1d5'
      },
      adhesive_inches: {
        x: 430, y: 230,
        calc: (level: number) => '12"'
      },
      adhesive_max_lbs: {
        x: 467, y: 230,
        calc: (level: number) => '10 lbs'
      },
      hp_healed: {
        x: 555, y: 161,
        calc: (level: number) => '1d4'
      },
    }
  })
})()  