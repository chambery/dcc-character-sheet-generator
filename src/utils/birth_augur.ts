import path from 'path'
import { Stats } from "../types"

const birth_augur = async (scores: Stats, excludeDescription?: boolean) => {

  const resolvedPath = path.resolve('src/data/' + system + '/birth_augurs.ts')
  const birth_augurs = (await import(resolvedPath)).default
  const score = scores['birth_augur'] > birth_augurs.length ? birth_augurs.length : scores['birth_augur']

  /* rolls start at 1 */
  const birth_augur = birth_augurs[score - 1]
  const text = scores['birth_augur'] + '. ' + birth_augur.name + (excludeDescription ? '' : " -  " + birth_augur.description)
  // consol.og(text, text.length)
  return text
}

export default birth_augur