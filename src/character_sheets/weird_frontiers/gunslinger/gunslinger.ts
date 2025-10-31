import { merge } from "lodash/fp"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import birth_augur_description from "../../../utils/birth_augur_description"
import decorate from "../../../utils/decorate"
import ability_modifier from "../../../utils/modifier"
import base_wf from "../index"

export default (() => {

  return merge(base_wf, {
    filename: 'gunslinger_blank_v1.pdf',
    style: { font_size: 22 },
    fields: {
      str: { x: 32, y: 634 },
      str_mod: { x: 60, y: 634 },
      agl: { x: 32, y: 590 },
      agl_mod: { x: 60, y: 590 },
      sta: { x: 32, y: 546 },
      sta_mod: { x: 60, y: 546 },
      per: { x: 32, y: 500 },
      per_mod: { x: 60, y: 500 },
      int: { x: 32, y: 458 },
      int_mod: { x: 60, y: 458 },
      luck: { x: 32, y: 416 },
      luck_mod: { x: 60, y: 416 },
      ref: { x: 103, y: 590, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      fort: { x: 103, y: 545, calc: (scores: Stats) => decorate(ability_modifier(scores['sta'], 1), ['+']) },
      will: { x: 103, y: 500 },
      grit: { x: 94, y: 470 },
      level: { x: 30, y: 715, calc: () => 1 },
      hp: { x: 200, y: 630, dice: (level: number) => '1d10' },
      crit: { x: 245, y: 632, dice: (level: number) => '1d10' },
      fumble: { x: 285, y: 632, dice: (level: number) => '1d12' },
      wealth: { x: 340, y: 695, dice: (level: number) => '1d12' },
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
        // style: { size: 8, maxWidth: 200, lineHeight: 10 }
      },
      birth_augur_description: {
        x: 145, y: 395,
        calc: (scores: Stats) => birth_augur_description(scores),
        style: { size: 6, maxWidth: 200, lineHeight: 7 }
      },
      action_die: { x: 37, y: 687 },
      occupation: { x: 220, y: 715 },
      weapon: { x: 150, y: 457, style: { size: 12, maxWidth: 50, lineHeight: 9 } },
      damage: { x: 205, y: 457, style: { size: 12 } },
      firearm: { x: 150, y: 585, style: { size: 12, maxWidth: 50, lineHeight: 9 } },
      critical_threat_range: {
        x: 555, y: 755,
        calc: (level: number) => '19-20'
      },
      deadeye_die: {
        x: 565, y: 680,
        calc: (level: number) => 'd3'
      }

    }
  })
})()