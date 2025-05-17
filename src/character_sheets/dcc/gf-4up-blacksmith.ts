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
  filename: 'DCC_L0_4up_blacksmith.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 12 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  // offset: [{ x: 366, y: 267 },]f,
  // offset: [{ x: 0, y: 293 }, { x: 377, y: 0 }, { x: 377, y: 293 },],
  fields: {
    str: { x: 55, y: 200, calc: (scores: Stats) => scores['str'], style: { size: 16 } },
    str_mod: { x: 74, y: 202, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    agl: { x: 55, y: 185, calc: (scores: Stats) => scores['agl'], style: { size: 18 } },
    agl_mod: { x: 74, y: 187, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 16   } },
    sta: { x: 55, y: 170, calc: (scores: Stats) => scores['sta'], style: { size: 18 } },
    sta_mod: { x: 74, y: 172, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 16 } },
    per: { x: 55, y: 157, calc: (scores: Stats) => scores['per'], style: { size: 18 } },
    per_mod: { x: 78, y: 159, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 16 } },
    int: { x: 55, y: 142, calc: (scores: Stats) => scores['int'], style: { size: 18 } },
    int_mod: { x: 73, y: 142, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
    luck: { x: 57, y: 127, calc: (scores: Stats) => scores['luck'], style: { size: 18 } },
    luck_mod: {
      x: 72, y: 127, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']), style: { size: 14 }
    },
    will: { x: 130, y: 200, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 18 } },
    fort: { x: 110, y: 190, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 18 } },
    ref: { x: 100, y: 170, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    hp: { x: 240, y: 77, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 32 } },
    init: { x: 120, y: 143, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    birth_augur: {
      x: 80, y: 220, // async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 65 : 65
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { size: 7, rotate: degrees(10) }, // maxWidth: 40, lineHeight: 10

    },
    occupation: {
      x: 105, y: 230, calc: async (scores: Stats) => await occupation(scores),
      style: async (scores: Stats) => ({ rotate: degrees(10), ...shrink_text(await occupation(scores), 8, 8) }),

    },
    weapon: {
      x: 147, y: 155, calc: (scores: Stats) => `${weapon(scores).name} (${weapon(scores).melee_dmg ?? weapon(scores).ranged_dmg}) ${weapon(scores).range ? `(${weapon(scores).range})` : ''}`,
      style: { size: 12 }
    },
    equipment: {
      x: 240, y: 250, calc: async (scores: Stats) => await equipment(scores),
      style: async () => ({ size: 14 })
    },

    ac: { x: 153, y: 195, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 26 } },
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

const shrink_text = (text: string, threshold: number, size: number) => text.length > threshold ? { size } : {}
