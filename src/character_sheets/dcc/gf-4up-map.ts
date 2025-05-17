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
  filename: 'DCC_L0_4up_map.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 12 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  // offset: [{ x: 366, y: 267 },]f,
  offset: [{ x: 0, y: 293 }, { x: 377, y: 0 }, { x: 377, y: 293 },],
  fields: {
    str: { x: 70, y: 178, calc: (scores: Stats) => scores['str'], style: { size: 16 } },
    str_mod: { x: 85, y: 170, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    agl: { x: 60, y: 140, calc: (scores: Stats) => scores['agl'], style: { size: 18 } },
    agl_mod: { x: 75, y: 145, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 14 } },
    sta: { x: 90, y: 120, calc: (scores: Stats) => scores['sta'], style: { size: 18 } },
    sta_mod: { x: 110, y: 114, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 14 } },
    per: { x: 49, y: 95, calc: (scores: Stats) => scores['per'], style: { size: 18 } },
    per_mod: { x: 68, y: 93, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 8 } },
    luck: { x: 126, y: 70, calc: (scores: Stats) => scores['luck'], style: { size: 22 } },
    luck_mod: {
      x: 139, y: 70, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']), style: { size: 14 }
    },
    int: { x: 90, y: 85, calc: (scores: Stats) => scores['int'], style: { size: 16 } },
    int_mod: { x: 110, y: 93, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
    fort: { x: 358, y: 184, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 18 } },
    ref: { x: 355, y: 220, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    will: { x: 358, y: 150, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 18 } },
    hp: { x: 196, y: 95, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 20 } },
    init: { x: 111, y: 255, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    birth_augur: {
      x: 305, y: 140, // async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 65 : 65
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { size: 7, rotate: degrees(20) } // maxWidth: 40, lineHeight: 10
    },
    occupation: {
      x: 83, y: 203, calc: async (scores: Stats) => await occupation(scores),
      style: async (scores: Stats) => ({ rotate: degrees(20), ...shrink_text(await occupation(scores), 12, 8) })
    },
    weapon: {
      x: 230, y: 235, calc: (scores: Stats) => weapon(scores),
      style: { size: 12 }
    },
    equipment: {
      x: 160, y: 240, calc: async (scores: Stats) => await equipment(scores),
      style: async (scores: Stats) => shrink_text(await occupation(scores), 12, 8)
    },

    ac: { x: 321, y: 225, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 26 } },
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
