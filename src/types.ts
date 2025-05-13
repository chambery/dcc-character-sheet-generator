import { Degrees, RGB } from "pdf-lib"

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
  lineHeight?: number,
  rotate?: Degrees,
  curve?: {
    end: { x: number, y: number },
    curvature?: number
  },
}

export type Location = {
  x: number | ((scores: Stats) => Promise<number>),
  y: number | ((scores: Stats) => Promise<number>),
  calc: (scores: Stats) => string | number | undefined,
  style?: DrawTextStyle | ((scores: Stats) => Promise<DrawTextStyle>)
}

export type PDF = {
  filename: string
  system: string
  /* provide one Point to have the same offsets applied to all four cards, more to for specific offsets */
  offset?: Point[]
  style?: { font_size?: number }
  orientation?: 'portrait' | 'landscape'
  fields: {
    [key: string]: Location
  }
}

export type Point = {
  x: number,
  y: number
}
