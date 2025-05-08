import path from 'path'
import { Stats } from "../types"


const occupation = async (scores: Stats) => {
  const resolvedPath = path.resolve('src/data/' + system + '/occupations.ts')
  const occupations = (await import(resolvedPath)).default

  /* rolls start at 1 */
  return occupations[scores['occupation'] - 1].name
}

export default occupation