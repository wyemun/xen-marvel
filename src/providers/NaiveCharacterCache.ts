type EtagCharacters = {
  etag: string
  ids: number[]
}

export default class NaiveCharacterCache {
  private offsetToEtag: Map<number, EtagCharacters>
  private static instance: NaiveCharacterCache

  constructor() {
    this.offsetToEtag = new Map()
  }

  add(offset: number, etag: string, characterIds: number[]): void {
    const item = this.offsetToEtag.get(offset)
    if (item && item.etag === etag) {
        return
    }

    this.offsetToEtag.set(offset, {etag, ids: characterIds})
  }

  clear(): void {
    this.offsetToEtag.clear()
  }

  getCharacters(): number[] {
    const results: number[] = []

    this.offsetToEtag.forEach((value, key) => {
      const characterIds = value.ids
      if (characterIds) {
        characterIds.forEach((characterId, cIndex) => {
          results[key + cIndex] = characterId
        })
      }
    })

    return results
  }

  getEtagByOffset(offset: number): string | undefined {
    const item = this.offsetToEtag.get(offset)
    return item ? item.etag : undefined
  }

  getCharactersByOffset(offset: number): number[] | undefined {
    const item = this.offsetToEtag.get(offset)
    return item ? item.ids : undefined
  }

  public static getInstance(): NaiveCharacterCache {
    if (!NaiveCharacterCache.instance) {
      NaiveCharacterCache.instance = new NaiveCharacterCache()
    }

    return NaiveCharacterCache.instance
  }
}