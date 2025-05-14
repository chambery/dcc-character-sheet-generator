import { Stats } from "../../types"
import occupations from "./occupations"
import weapons from "./weapons"

const weapon = (scores: Stats) => {
  /* rolls start at 1 */
  const val = occupations[scores['occupation'] - 1].weapon
  const weapon_line = /^(.+)\s\(as\s(.+)\)|^(.+)(?:\s(\w+))?$/g.exec(val)

  const as_weapon = weapon_line?.[2]
  const weapon_name = weapon_line?.[1] ?? weapon_line?.[3] + ' ' +  (weapon_line?.[4] ? weapon_line?.[4] : '')

  const stats = weapons.find((w) =>
    (as_weapon && as_weapon.toLowerCase() == w.name.toLowerCase().substring(0, as_weapon.length))
    || weapon_name?.toLowerCase() == w.name.toLowerCase().substring(0, weapon_name?.length)
  )
  const damage = stats?.damage ?? '1d4'
  const range = stats?.range == undefined || stats?.range === '-' ? undefined : stats?.range
  
  return { name: weapon_name, damage, range }
}


export default weapon