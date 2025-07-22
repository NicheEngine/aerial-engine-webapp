declare module 'bem-util' {
  export type BemMod = string | { [key: string]: any }
  export type BemMods = BemMod | BemMod[]
}
