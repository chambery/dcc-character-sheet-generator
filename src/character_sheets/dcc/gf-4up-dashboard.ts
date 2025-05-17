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
  filename: 'DCC_L0_4up_dashboard.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 12 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  offset: [{ x: 374, y: 300 },],
  // offset: [{ x: 0, y: 293 }, { x: 377, y: 0 }, { x: 377, y: 293 },],
  fields: {
    str: { x: 212, y: 229, calc: (scores: Stats) => scores['str'], style: { size: 22 } },
    str_mod: { x: 235, y: 230, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    agl: { x: 220, y: 215, calc: (scores: Stats) => scores['agl'], style: { size: 22 } },
    agl_mod: { x: 238, y: 215, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 16 } },
    sta: { x: 230, y: 200, calc: (scores: Stats) => scores['sta'], style: { size: 22 } },
    sta_mod: { x: 248, y: 201, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 16 } },
    per: { x: 237, y: 185, calc: (scores: Stats) => scores['per'], style: { size: 22 } },
    per_mod: { x: 255, y: 185, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 16 } },
    luck: { x: 237, y: 170, calc: (scores: Stats) => scores['luck'], style: { size: 22 } },
    luck_mod: {
      x: 256, y: 172, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']), style: { size: 16 }
    },
    int: { x: 240, y: 155, calc: (scores: Stats) => scores['int'], style: { size: 22 } },
    int_mod: { x: 259, y: 157, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']), style: { size: 16 } },
    ref: { x: 312, y: 215, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    fort: { x: 312, y: 202, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 18 } },
    will: { x: 312, y: 187, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 18 } },
    hp: { x: 223, y: 135, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 24 } },
    init: { x: 350, y: 215, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 18 } },
    birth_augur: {
      x: 278, y: 120, // async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 65 : 65
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { size: 7, maxWidth: 40, lineHeight: 8 }, //  , maxWidth: 40, lineHeight: 10

    },
    occupation: {
      x: 220, y: 258, calc: async (scores: Stats) => await occupation(scores),
      style: async () => ({ size: 16 }), // rotate: degrees(10), 

    },

    // weapon_damage: {
    //   x: 147, y: 155, calc: (scores: Stats) => weapon(scores).damage,
    //   style: { size: 12 }
    // },
    melee_adj: { x: 340, y: 185, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']), style: { size: 16 } },
    melee_damage: {
      x: 360, y: 185,
      calc: (scores: Stats) => weapon(scores).melee_dmg ?? '',
      style: (scores: Stats) => shrink_text(weapon(scores).ranged_dmg, 4, 7)
    },
    range_adj: { x: 340, y: 142, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 16 } },
    range_damage: {
      x: 360, y: 142,
      calc: (scores: Stats) => weapon(scores).ranged_dmg ?? '',
      style: (scores: Stats) => shrink_text(weapon(scores).ranged_dmg, 4, 7)
    },
    equipment: { x: 215, y: 96, calc: async (scores: Stats) => await equipment(scores), style: { size: 14 } },
    weapon: {
      x: 205, y: 81, calc: (scores: Stats) => weapon(scores).name + ' ' + (weapon(scores).range ?? ''),
      style: { size: 12 }
    },
    ac: { x: 297, y: 155, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']), style: { size: 20 } },

    speed: {
      x: 60, y: 87, calc: async (scores: Stats) => {
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
