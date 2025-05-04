import { RGB } from "pdf-lib"

export type Stats = {
  str: number
  agl: number
  sta: number
  per: number
  int: number
  luck: number
} & {
  [key: string]: number
}
export type DrawTextStyle = {
  size?: number,
  color?: RGB,
  maxWidth?: number,
  lineHeight?: number
}

export type Location = {
  x: number | ((scores: Stats) => number),
  y: number | ((scores: Stats) => number),
  calc: (scores: Stats) => string | number | undefined,
  style?: DrawTextStyle
}
export type PDF = {
  filename: string
  fields: {
    [key: string]: Location
  }
}