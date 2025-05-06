import { D12 } from "@randsum/dice"
import { Stats } from "../../types"
import birth_augur from "../../utils/birth_augur"
import damage from "../../utils/damage"
import firearm from "../../utils/firearm"
import hp from "../../utils/hp"
import ability_modifier from "../../utils/modifier"
import occupation from "../../utils/occupation"
import weapon from "../../utils/weapon"
import decorate from "../../utils/decorate"

export default {
    filename: 'mountebank_blank_v1.pdf',
    fields: {
      str: { x: 32, y: 638, calc: (scores: Stats) => scores['str'] },
      str_mod: { x: 60, y: 638, calc: (scores: Stats) => decorate(ability_modifier(scores['str']), ['+']) },
      agl: { x: 32, y: 594, calc: (scores: Stats) => scores['agl'] },
      agl_mod: { x: 60, y: 594, calc: (scores: Stats) => decorate(ability_modifier(scores['agl']), ['+']) },
      sta: { x: 32, y: 550, calc: (scores: Stats) => scores['sta'] },
      sta_mod: { x: 60, y: 550, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
      per: { x: 32, y: 505, calc: (scores: Stats) => scores['per'] },
      per_mod: { x: 60, y: 505, calc: (scores: Stats) => decorate(ability_modifier(scores['per']), ['+']) },
      int: { x: 32, y: 462, calc: (scores: Stats) => scores['int'] },
      int_mod: { x: 60, y: 462, calc: (scores: Stats) => decorate(ability_modifier(scores['int']), ['+']) },
      luck: { x: 32, y: 420, calc: (scores: Stats) => scores['luck'] },
      luck_mod: { x: 60, y: 420, calc: (scores: Stats) => decorate(ability_modifier(scores['luck']), ['+']) },
      ref: { x: 102, y: 595, calc: (scores: Stats) => decorate(ability_modifier(scores['agl'], 1), ['+']) },
      fort: { x: 100, y: 550, calc: (scores: Stats) => decorate(ability_modifier(scores['sta']), ['+']) },
      will: { x: 102, y: 505, calc: (scores: Stats) => decorate(ability_modifier(scores['per'], 1), ['+']) },
      grit: {
        x: 94, y: 470, calc: (scores: Stats) => Math.floor((scores['per'] + scores['sta']) / 2),
        style: { size: 6, maxWidth: 20, lineHeight: 7 }
      },
      level: { x: 30, y: 715, calc: () => 1 },
      hp: { x: 200, y: 635, calc: (scores: Stats) => hp(scores, '1d8') },
      crit: { x: 250, y: 635, calc: () => 'd6' },
      fumble: { x: 285, y: 635, calc: () => 'd12' },
      wealth: { x: 340, y: 695, calc: () => '$' + D12.roll(2), style: { size: 6 } },
      birth_augur: {
        x: 80, y: (scores: Stats) => birth_augur(scores).length >= 78 ? 396 : 390,
        calc: (scores: Stats) => birth_augur(scores),
        style: { size: 7, maxWidth: 223, lineHeight: 6 }
      },
      // birth_augur_description: {
      //   x: 80, y: 392,
      //   calc: (scores: Stats) => birth_augur_description(scores),
      //   style: { size: 6, maxWidth: 200, lineHeight: 7 }
      // },
      action_die: { x: 37, y: 687, calc: () => 20 },
      occupation: { x: 220, y: 715, calc: (scores: Stats) => occupation(scores) },
      weapon: {

        x: 150, y: 450, calc: (scores: Stats) => weapon(scores),
        style: { size: 6, maxWidth: 50, lineHeight: 7 }
      },
      damage: {
        x: 205, y: 450, calc: (scores: Stats) => damage(scores),
        style: { size: 6 }
      },
      firearm: {
        x: 150, y: 585, calc: (scores: Stats) => firearm(scores),
        style: { size: 6 }
      },

      max_active: { x: 555, y: 630, calc: () => 2 },
      firebomb_damage: { x: 423, y: 455, calc: () => '1d6' },
      acidbomb_damage: { x: 556, y: 337, calc: () => '1d5' },
      adhesive_inches: { x: 430, y: 230, calc: () => '12"' },
      adhesive_max_lbs: { x: 467, y: 230, calc: () => '10 lbs' },
      hp_healed: { x: 555, y: 161, calc: () => '1d4' },

    }
  }