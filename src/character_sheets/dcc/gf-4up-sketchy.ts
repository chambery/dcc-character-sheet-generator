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
  filename: 'DCC_GF_L0_4up_sketchy-square.pdf',
  system: 'dcc',
  orientation: 'landscape',
  style: { font_size: 24 },
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  // offset: [{ x: 366, y: 267 },],
  offset: [{ x: 0, y: 267 }, { x: 366, y: 0 }, { x: 366, y: 267 },],
  fields: {
    str: { x: 59, y: 192, calc: (scores: Stats) => scores['str'] },
    str_mod: { x: 77, y: 192, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
    agl: { x: 59, y: 162, calc: (scores: Stats) => scores['agl'] },
    agl_mod: { x: 77, y: 162, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    sta: { x: 59, y: 131, calc: (scores: Stats) => scores['sta'] },
    sta_mod: { x: 76, y: 131, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
    per: { x: 114, y: 192, calc: (scores: Stats) => scores['per'] },
    per_mod: { x: 134, y: 193, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
    luck: { x: 116, y: 161, calc: (scores: Stats) => scores['luck'] },
    luck_mod: { x: 134, y: 162, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']) },
    int: { x: 114, y: 132, calc: (scores: Stats) => scores['int'] },
    int_mod: { x: 134, y: 132, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
    fort: { x: 53, y: 77, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']), style: { size: 14 } },
    ref: { x: 90, y: 77, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']), style: { size: 14 } },
    will: { x: 125, y: 77, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']), style: { size: 14 } },
    hp: { x: 194, y: 95, calc: (scores: Stats) => hp(scores, '1d4'), style: { size: 14 } },

    birth_augur: {
      x: 90, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 114 : 108,
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { size: 7, maxWidth: 200, lineHeight: 10 }
    },
    occupation: { x: 165, y: 260, calc: async (scores: Stats) => await occupation(scores) },
    weapon: {
      x: 185, y: 186, calc: (scores: Stats) => weapon(scores),
      style: { size: 12 }
    },
    equipment: { x: 275, y: 215, calc: async (scores: Stats) => await equipment(scores) },
    ac: { x: 179, y: 169, calc: async (scores: Stats) => 10 + ability_modifier(scores['agl']) },
    action_die: {
      x: 180, y: 127, calc: async () => 'd20',
      style: { size: 12 }
    },
    crit_table: { x: 217, y: 127, calc: async () => 'I (pg 82), 1d4',
      style: { size: 6 } },
  }
}