import { Stats } from "../types"

const birth_augur = async (scores: Stats, excludeDescription?: boolean) => {
  // consol.og('birth augur', scores['birth_augur'])
  const score = scores['birth_augur'] > 29 ? 29 : scores['birth_augur']
  const file = Bun.file('../data/' + system + '/birth_augur.json')
  const birth_augurs = (await file.json()) as { name: string, description: string }[]

  /* rolls start at 1 */
  const birth_augur = birth_augurs[score - 1]
  const text = scores['birth_augur'] + '. ' + birth_augur.name + (excludeDescription ? '' : " -  " + birth_augur.description)
  // consol.og(text, text.length)
  return text
}

export default birth_augur