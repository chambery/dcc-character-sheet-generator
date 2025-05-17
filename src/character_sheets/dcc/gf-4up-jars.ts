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

export default {
  filename: 'DCC_L0_4up_jars.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 12 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  offset: [{ x: 374, y: 291 },],
  // offset: [{ x: 0, y: 293 }, { x: 377, y: 0 }, { x: 377, y: 293 },],
  fields: {
    str: { x: 57, y: 200, calc: (scores: Stats) => scores['str'], style: { size: 22 } },
    str_mod: { x: 77, y: 201, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    agl: { x: 57, y: 185, calc: (scores: Stats) => scores['agl'], style: { size: 22 } },
    agl_mod: { x: 76, y: 186, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 16 } },
    sta: { x: 56, y: 170, calc: (scores: Stats) => scores['sta'], style: { size: 22 } },
    sta_mod: { x: 76, y: 171, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 16 } },
    per: { x: 56, y: 156, calc: (scores: Stats) => scores['per'], style: { size: 22 } },
    per_mod: { x: 75, y: 156, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 16 } },
    luck: { x: 55, y: 141, calc: (scores: Stats) => scores['luck'], style: { size: 22 } },
    luck_mod: {
      x: 74, y: 142, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']), style: { size: 16 }
    },
    int: { x: 55, y: 127, calc: (scores: Stats) => scores['int'], style: { size: 22 } },
    int_mod: { x: 75, y: 127, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']), style: { size: 16 } },
    fort: { x: 115, y: 172, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 18 } },
    ref: { x: 117, y: 187, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    will: { x: 115, y: 157, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 18 } },
    hp: { x: 240, y: 77, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 36 } },
    init: { x: 120, y: 143, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    birth_augur: {
      x: 82, y: 226, // async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 65 : 65
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { curve: { end: { x: 130, y: 232 }, curvature: .1 }, size: 7, rotate: degrees(5) }, //  , maxWidth: 40, lineHeight: 10

    },
    occupation: {
      x: 107, y: 237, calc: async (scores: Stats) => await occupation(scores),
      style: async () => ({ curve: { end: { x: 135, y: 243 }, curvature: .1 }, size: 8 }), // rotate: degrees(10), 

    },
    weapon: {
      x: 147, y: 155, calc: (scores: Stats) => weapon(scores),
      style: { size: 12 }
    },
    equipment: {
      x: 240, y: 250, calc: async (scores: Stats) => await equipment(scores),
      style: async () => ({ size: 14 })
    },

    ac: { x: 160, y: 205, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 20 } },

    speed: {
      x: 74, y: 111, calc: async (scores: Stats) => {
        const occ = await occupation(scores)
        return (occ.includes('warf') || occ.includes('alfing')) ? "20'" : "30'"
      }
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
