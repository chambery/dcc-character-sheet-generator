import { Stats } from "../../types"
import decorate from "../../utils/decorate"
import ability_modifier from "../../utils/modifier"

export default {
  filename: 'DCC_GF_L0_4up_sketchy.pdf',
  orientation: 'landscape',
  four_up_offset: [{ x: 381, y: 253 }],
  font_size: 8,
  fields: {
    str: { x: 55, y: 290, calc: (scores: Stats) => scores['str'] },
    str_mod: { x: 72, y: 290, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
    agl: { x: 55, y: 258, calc: (scores: Stats) => scores['agl'] },
    agl_mod: { x: 72, y: 258, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
    sta: { x: 56, y: 226, calc: (scores: Stats) => scores['sta'] },
    sta_mod: { x: 72, y: 226, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
    per: { x: 111, y: 290, calc: (scores: Stats) => scores['per'] },
    per_mod: { x: 131, y: 290, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
     }
}