import _ from "lodash"
import { Stats } from "../../types"
import occupations from "./occupations"
import weapons from "./weapons"

const weapon = (scores: Stats) => {
  /* rolls start at 1 */
  const val = occupations[scores['occupation'] - 1].weapon
  const weapon_line = /^(.+)\s\(as\s(.+)\)|^(.+)(?:\s(\w+))?$/g.exec(val)
  // console.log('\n** weapon.ts **', val)
  const as_weapon = weapon_line?.[2]
  const weapon_name = weapon_line?.[1] ?? weapon_line?.[3] + (weapon_line?.[4] ? ' ' + weapon_line?.[4] : '')

  const stats = _.find(weapons, (w) => {
    // console.log('\t\t', w.name, as_weapon, weapon_name)
    // console.log('\t\t\t', '"' + as_weapon?.toLowerCase() + '"', ' == ', '"' + w.name.toLowerCase().substring(0, as_weapon?.length) + '"', (as_weapon?.toLowerCase() == w.name.toLowerCase().substring(0, as_weapon?.length)))
    // console.log('\t\t\t', '"' + weapon_name?.toLowerCase() + '"', ' == ', '"' + w.name.toLowerCase().substring(0, weapon_name?.length) + '"', weapon_name?.toLowerCase() == w.name.toLowerCase().substring(0, weapon_name?.length))
    // console.log('\t\t\t\t', 'match?', (as_weapon?.toLowerCase() == w.name.toLowerCase().substring(0, as_weapon?.length)) || weapon_name?.toLowerCase() == w.name.toLowerCase().substring(0, weapon_name?.length))
    return (as_weapon?.toLowerCase() == w.name.toLowerCase().substring(0, as_weapon?.length))
      || weapon_name?.toLowerCase() == w.name.toLowerCase().substring(0, weapon_name?.length)
  })
  // const stats = _.find(weapons, (w) => as_weapon?.toLowerCase() == w.name.toLowerCase().substring(0, as_weapon?.length))

  const damage_separator = stats?.damage.indexOf('/')
  const backstab = stats?.name.indexOf('†')
  const ranged_only = stats?.name.indexOf('º')
  const range = stats?.range == undefined || stats?.range === '-' ? undefined : stats?.range
  // console.log('stats', stats, 'damage_separator', damage_separator, 'backstab', backstab, 'range', range)
  const ranged_dmg = range ?
    // (damage_separator && damage_separator > -1) ?
    (backstab && backstab > -1) ?
      stats?.damage.substring(0, damage_separator)
      : stats?.damage
    : ''
  if (backstab && backstab > -1) {
    console.log(backstab, stats?.damage)
  }
  const melee_dmg = (ranged_only && ranged_only > -1) ? '' : stats?.damage 
  // console.log('melee_dmg', melee_dmg)
  return { name: weapon_name, ranged_dmg: ranged_dmg ?? '', melee_dmg: melee_dmg ?? '', range: range }
}


export default weapon