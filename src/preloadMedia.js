import { reasons } from './data/content'

// Downloads every photo/video while she is still reading the letter
// (which takes ~2 minutes), then serves them from memory so each page
// starts instantly instead of waiting on the network.

const base = `${process.env.PUBLIC_URL}/media/`
const ready = new Map()   // filename -> blob URL, once downloaded
const started = new Set() // filenames we've already begun fetching

// Use this everywhere instead of building /media/... paths by hand.
// Falls back to the normal URL if the download hasn't finished (or failed).
export const mediaUrl = src => ready.get(src) || `${base}${src}`

export function preloadMedia() {
  reasons.forEach(({ media }) => {
    if (!media || started.has(media.src)) return
    started.add(media.src)

    if (media.type === 'image') {
      new Image().src = `${base}${media.src}`
      return
    }

    fetch(`${base}${media.src}`)
      .then(res => (res.ok ? res.blob() : Promise.reject(new Error(res.status))))
      .then(blob => ready.set(media.src, URL.createObjectURL(blob)))
      .catch(() => started.delete(media.src)) // fine: falls back to normal loading
  })
}
