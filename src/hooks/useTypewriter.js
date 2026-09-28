import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// Reveals `text` one character at a time.
// Returns { typed, rest, done, skip } so the caller can render `rest`
// invisibly and keep the layout stable while typing.
export function useTypewriter(text, options = {}) {
  const { speed = 45, humanize = true, startDelay = 600, onFinished } = options

  // Array.from splits by code point, so emoji are never cut in half.
  const chars = useMemo(() => Array.from(text), [text])

  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)
  const finishedRef = useRef(false)
  const onFinishedRef = useRef(onFinished)

  useEffect(() => {
    onFinishedRef.current = onFinished
  }, [onFinished])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearTimeout(timerRef.current)
    setCount(chars.length)
    setDone(true)
    onFinishedRef.current?.()
  }, [chars])

  useEffect(() => {
    finishedRef.current = false
    setCount(0)
    setDone(false)

    let i = 0
    const tick = () => {
      if (i >= chars.length) {
        finish()
        return
      }

      const char = chars[i]
      let delay = speed

      if (humanize) {
        if (char === '.' || char === '!' || char === '?') delay = speed * 6
        else if (char === ',') delay = speed * 3
        else if (char === '\n') delay = speed * 8
        else if (char === ' ') delay = speed * 0.8
        else delay = speed * (0.8 + Math.random() * 0.6)
      }

      i++
      setCount(i)
      timerRef.current = setTimeout(tick, delay)
    }

    timerRef.current = setTimeout(tick, startDelay)
    return () => clearTimeout(timerRef.current)
  }, [chars, speed, humanize, startDelay, finish])

  return {
    typed: chars.slice(0, count).join(''),
    rest: chars.slice(count).join(''),
    done,
    skip: finish,
  }
}