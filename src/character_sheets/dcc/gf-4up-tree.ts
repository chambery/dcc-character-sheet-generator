import { degrees } from "pdf-lib"
import { EXCLUDE_DESCRIPTION } from "../../constants"
import equipment from "../../data/dcc/equipment"
import weapon from "../../data/dcc/weapon"
import { Stats } from "../../types"
import birth_augur from "../../utils/birth_augur"
import decorate from "../../utils/decorate"
import hp from "../../utils/hp"
import ability_modifier from "../../utils/modifier"
import occupation from "../../utils/occupation"
import shrink_text from "../../utils/shrink_text"

export default {
  filename: 'DCC_L0_4up_tree.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 12 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  offset: [{ x: 374, y: 300 },],
  // offset: [{ x: 0, y: 293 }, { x: 377, y: 0 }, { x: 377, y: 293 },],

  fields: {
    str: { x: 63, y: 189, calc: (scores: Stats) => scores['str'], style: { size: 14 } },
    str_mod: { x: 75, y: 189, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 14 } },
    agl: { x: 61, y: 177, calc: (scores: Stats) => scores['agl'], style: { size: 14 } },
    agl_mod: { x: 75, y: 177, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 14 } },
    sta: { x: 61, y: 164, calc: (scores: Stats) => scores['sta'], style: { size: 14 } },
    sta_mod: { x: 74, y: 164, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 14 } },
    per: { x: 61, y: 152, calc: (scores: Stats) => scores['per'], style: { size: 14 } },
    per_mod: { x: 75, y: 152, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 14 } },
    int: { x: 61, y: 138, calc: (scores: Stats) => scores['int'], style: { size: 14 } },
    int_mod: { x: 75, y: 141, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']), style: { size: 14 } },
    luck: { x: 61, y: 125, calc: (scores: Stats) => scores['luck'], style: { size: 14 } },
    luck_mod: { x: 75, y: 125, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']), style: { size: 14 } },
    ref: { x: 41, y: 104, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    fort: { x: 41, y: 88, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 18 } },
    will: { x: 43, y: 72, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 18 } },
    hp: { x: 162, y: 186, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 24 } },
    // init: { x: 350, y: 215, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    init: { x: 344, y: 238, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 22 } },
    birth_augur: {
      x: 171, y: 214, calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: async (scores: Stats) => ({
        size: 10, ...shrink_text(await birth_augur(scores, EXCLUDE_DESCRIPTION), 14, 8)
      }) // { size: 10, maxWidth: 100, lineHeight: 13 }, //  , maxWidth: 40, lineHeight: 10
    },
    occupation: {
      x: 70, y: 222, calc: async (scores: Stats) => await occupation(scores),
      // style: async () => ({ size: 16 }), // rotate: degrees(10), 
      style: { curve: { end: { x: 129, y: 237 }, curvature: .25 }, size: 14, rotate: degrees(5) }, //  , maxWidth: 40, lineHeight: 10


    },

    // weapon_damage: {
    //   x: 147, y: 155, calc: (scores: Stats) => weapon(scores).damage,
    //   style: { size: 12 }
    // },
    melee_adj: { x: 349, y: 170, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    melee_dmg: {
      x: (scores: Stats) => {
        const dmg = weapon(scores).melee_dmg
        return dmg && dmg.length > 4 ? 347 : 352
      },
      y: 152,
      calc: (scores: Stats) => { console.log('¡¡¡melee_dmg', weapon(scores).melee_dmg); return weapon(scores).melee_dmg ?? '' },
      style: (scores: Stats) => {
        const dmg = weapon(scores).melee_dmg
        return { ...shrink_text(weapon(scores).melee_dmg, 4, 7), rotate: degrees(dmg && dmg.length > 4 ? 15 : 0) }
      }
    },
    range_adj: { x: 357, y: 128, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 16 } },
    range_dmg: { x: 343, y: 112, calc: (scores: Stats) => weapon(scores).ranged_dmg ?? '' },

    equipment: {
      x: 244, y: 200, calc: async (scores: Stats) => await equipment(scores),
      style: async (scores: Stats) => shrink_text(await equipment(scores), 11, 8)
    },
    // equipment: { x: 215, y: 96, calc: async (scores: Stats) => await equipment(scores), style: { size: 14 } },
    weapon: {
      x: 107, y: 146, calc: (scores: Stats) => weapon(scores).name + ' ' + (weapon(scores).range ?? ''),
      style: (scores: Stats) => shrink_text(weapon(scores).name + ' ' + (weapon(scores).range ?? ''), 11, 9)
    },
    ac: { x: 307, y: 224, calc: (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 24 } },
    // ac: { x: 297, y: 155, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 20 } },

    speed: {
      x: 64, y: 54, calc: async (scores: Stats) => {
        const occ = await occupation(scores)
        return (occ.includes('warf') || occ.includes('alfing')) ? "20'" : "30'"
      }, style: { size: 18 }

    }
    // action_die: {
    //   x: 180, y: 127, calc: async () => 'd20',
    //   style: { size: 12 }
    // },
    // crit_table: {
    //   x: 217, y: 127, calc: async () => 'I (pg 82), 1d4',
    //   style: { size: 6 }
    // },
  }
}

