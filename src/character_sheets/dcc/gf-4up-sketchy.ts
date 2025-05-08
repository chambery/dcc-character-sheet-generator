import { EXCLUDE_DESCRIPTION } from "../../constants"
import { Stats } from "../../types"
import birth_augur from "../../utils/birth_augur"
import decorate from "../../utils/decorate"
import ability_modifier from "../../utils/modifier"
import occupation from "../../utils/occupation"

export default {
  filename: 'DCC_GF_L0_4up_sketchy+.5.pdf',
  system: 'dcc',
  orientation: 'landscape',
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  offset: [{ x: 379, y: 0 }, { x: -1, y: 253 }, { x: 381, y: 253 }],
  font_size: 8,
  fields: {
    str: { x: 55, y: 290, calc: (scores: Stats) => scores['str'] },
    str_mod: { x: 72, y: 290, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
    agl: { x: 56, y: 258, calc: (scores: Stats) => scores['agl'] },
    agl_mod: { x: 72, y: 258, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    sta: { x: 56, y: 226, calc: (scores: Stats) => scores['sta'] },
    sta_mod: { x: 72, y: 226, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
    per: { x: 112, y: 290, calc: (scores: Stats) => scores['per'] },
    per_mod: { x: 132, y: 290, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
    birth_augur: {
      x: 85, y: async (scores: Stats) => (await birth_augur(scores)).length >= 78 ? 206 : 200,
      calc: async (scores: Stats) => await birth_augur(scores, EXCLUDE_DESCRIPTION),
      style: { size: 7, maxWidth: 200, lineHeight: 10 }
    },
    occupation: { x:168, y: 360, calc: async (scores: Stats) => await occupation(scores) }
  }
}