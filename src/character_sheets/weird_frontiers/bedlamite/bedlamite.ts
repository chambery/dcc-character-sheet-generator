import { merge } from "lodash/fp"
import { Stats } from "../../../types"
import birth_augur from "../../../utils/birth_augur"
import decorate from "../../../utils/decorate"
import ability_modifier from "../../../utils/modifier"
import base from "../index"

export default (() => {

  return merge(base, {
    filename: 'bedlamite_blank_v1.pdf',
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
      ref: { x: 100, y: 595, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      fort: { x: 100, y: 550, },
      will: { x: 100, y: 505, calc: (scores: Stats) => decorate(ability_modifier(scores['per'], 1), ['+']) },
      grit: { x: 96, y: 469 },
      level: { x: 30, y: 715 },
      hp: { x: 200, y: 635, dice: (level: number) => '1d8' },
      crit: { x: 250, y: 635, dice: (level: number) => '1d6' },
      fumble: { x: 285, y: 635, dice: (level: number) => '1d12' },
      wealth: { x: 280, y: 685, dice: (level: number) => '1d12' },
      birth_augur: {
        x: 80, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 396 : 390,
        style: { size: 7, maxWidth: 200, lineHeight: 10 }
      },
      // birth_augur_description: {
      //   x: 80, y: 392,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 687 },
      occupation: { x: 220, y: 715 },
      weapon: {
        x: 150, y: 447,
        style: { size: 12, maxWidth: 50, lineHeight: 9 }
      },
      firearm: {
        x: 150, y: 582,
        style: { size: 6 }
      },
      damage: {
        x: 205, y: 447,
        style: { size: 12 }
      },
      // trade_good: [{
      //   x: 150, y: 450, calc: (scores: Stats) => {
      //     const trade_good = occupations[scores['occupation']].trade_good
      //     return trade_good.substring(0, trade_good.indexOf('(') - 1)
      //   }
      // }],

    }
  })
})()                