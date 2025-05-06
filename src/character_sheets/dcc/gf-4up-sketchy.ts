import { Stats } from "../../types"
import decorate from "../../utils/decorate"
import ability_modifier from "../../utils/modifier"

export default {
  filename: 'DCC_GF_L0_4up_sketchy.pdf',
  orientation: 'landscape',
  four_up_offset: [{ x: 380, y: 250 }],
  font_size: 8,
  fields: {
    str: { x: 49, y: 290, calc: (scores: Stats) => ability_modifier(scores['str']) },
    str_mod: { x: 75, y: 290, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
     }
}