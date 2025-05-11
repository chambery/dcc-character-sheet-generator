import _ from "lodash"


/**
 * Decorates a value based on the provided parameters.
 * @param val value to decorate
 * @param params array of decorater to apply to the value, in order
 * 
 * @description
 * '+': adds a '+' sign to the value if it is a number and greater than 0.
 * @returns decorated value
 */
const decorate = (val: string | number, params: string[]): string=> {
  if (params.length === 0) { return String(val) }

  const param = params.pop()
  if (!param) { return String(val) }

  return decorate(
    // @ts-expect-error this is me-ware
    {
      /* adds a '+' sign to the value if it is a number and greater than 0. */
      '+': (val: string | number) => (_.isNumber(Number(val)) && Number(val) > 0 ? '+' + val : val)

    }[param]?.(val) ?? val, params)
}



export default decorate