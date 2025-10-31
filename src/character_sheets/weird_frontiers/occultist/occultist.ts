import { merge } from "lodash/fp"
import familiar_personalities from "../../../data/weird_frontiers/familiar_personalities"
import familiar_types from "../../../data/weird_frontiers/familiar_types"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import decorate from "../../../utils/decorate"
import ability_modifier from "../../../utils/modifier"
import base_wf from "../index"

export default (() => {

  return merge(base_wf, {
    filename: 'occultist_blank_v1.pdf',
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
      
      grit: { x: 94, y: 470 },
      level: { x: 30, y: 715 },
      hp: { x: 200, y: 630, dice: (level: number) => '1d6' },
      crit: { x: 249, y: 634, dice: () => '1d6' },
      fumble: { x: 285, y: 634, dice: () => '1d12' },
      wealth: { x: 340, y: 695, dice: (level: number) => '1d12' },
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
      },
      // birth_augur_description: {
      //   x: 145, y: 395,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 685 },
      occupation: { x: 220, y: 715 },
      weapon: { x: 150, y: 445, style: { size: 6, maxWidth: 50, lineHeight: 7 } },
      damage: { x: 210, y: 445, style: { size: 6 } },
      firearm: { x: 150, y: 582, style: { size: 6 } },

      familiar_type: {
        x: 135, y: 220,
        calc: (scores: Stats) => familiar_types[scores['familiar_type']].name
      },
      familiar_personality: {
        x: 25, y: 185,
        calc: (scores: Stats) => familiar_personalities[scores['familiar_personality']]
      },
      innate_trait: {
        x: 25, y: 110, 
        calc: (scores: Stats) => familiar_types[scores['familiar_type']].trait,
        style: { size: 10, maxWidth: 175, lineHeight: 11 }
      },
    },
  })
})()  