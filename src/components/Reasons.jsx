import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { reasons, reasonSettings } from '../data/content'
import ReasonMedia, { mediaUrl } from './ReasonMedia'

// ---- Build the list of pages once -------------------------------------
// intro -> (one page per photo/video reason, text-only reasons paired up) -> closing
function buildPages() {
    const list = [{ kind: 'intro' }]
    reasons.forEach((r, i) => {
        const item = { ...(typeof r === 'string' ? { text: r } : r), n: i + 1 }
        if (item.media) {
            list.push({ kind: 'media', items: [item] })
            return
        }
        const last = list[list.length - 1]
        if (reasonSettings.pairTextPages && last.kind === 'text' && last.items.length < 2) {
            last.items.push(item)
        } else {
            list.push({ kind: 'text', items: [item] })
        }
    })
    list.push({ kind: 'closing' })
    return list
}

const pages = buildPages()
const lastIdx = pages.length - 1

const wordCount = page =>
    page.items.reduce((n, it) => n + it.text.split(/\s+/).length, 0)

// How long a page stays before moving on by itself.
function pageSeconds(page, mediaFailed, videoEnded) {
    const s = reasonSettings
    if (page.kind === 'intro') return 3.5
    if (page.kind === 'closing') return s.closingSeconds
    if (page.kind === 'media' && !mediaFailed) {
        const item = page.items[0]
        if (item.media.type === 'video') return videoEnded ? 1 : s.videoMaxSeconds
        return item.seconds || Math.max(s.photoSeconds, wordCount(page) * 0.3)
    }
    return Math.max(s.textMinSeconds, wordCount(page) * s.secondsPerWord)
}

export default function Reasons({ onFinished }) {
    const reduceMotion = useReducedMotion()
    const [idx, setIdx] = useState(0)
    const [dir, setDir] = useState(1)
    const [failed, setFailed] = useState({})
    const [endedIdx, setEndedIdx] = useState(-1)
    const [paused, setPaused] = useState(document.hidden)

    const idxRef = useRef(0)
    const lastNavRef = useRef(0)
    const doneRef = useRef(false)
    const finishedRef = useRef(onFinished)
    const touchRef = useRef(null)
    const swipedRef = useRef(false)

    useEffect(() => {
        finishedRef.current = onFinished
    }, [onFinished])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Move by +1 / -1. `manual` taps are briefly locked so a double-tap can't skip a page.
    const go = useCallback((delta, manual = false) => {
        if (doneRef.current) return
        const now = Date.now()
        if (manual && now - lastNavRef.current < 450) return
        const next = idxRef.current + delta
        if (next < 0) return
        if (next > lastIdx) {
            doneRef.current = true
            finishedRef.current?.()
            return
        }
        lastNavRef.current = now
        idxRef.current = next
        setDir(delta > 0 ? 1 : -1)
        setIdx(next)
    }, [])

    // Pause the auto-advance while the tab/app is in the background.
    useEffect(() => {
        const onVis = () => setPaused(document.hidden)
        document.addEventListener('visibilitychange', onVis)
        return () => document.removeEventListener('visibilitychange', onVis)
    }, [])

    // Keyboard support for desktop.
    useEffect(() => {
        const onKey = e => {
            if (e.key === 'ArrowRight' || e.key === ' ') go(1, true)
            if (e.key === 'ArrowLeft') go(-1, true)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [go])

    const page = pages[idx]
    const mediaFailed = !!failed[idx]
    const isVideo = page.kind === 'media' && !mediaFailed && page.items[0].media.type === 'video'
    const duration = pageSeconds(page, mediaFailed, endedIdx === idx)

    // The auto-advance timer.
    useEffect(() => {
        if (paused) return
        const t = setTimeout(() => go(1), duration * 1000)
        return () => clearTimeout(t)
    }, [idx, duration, paused, go])

    // Warm up the next page's photo/video so it appears instantly.
    useEffect(() => {
        const media = pages[idx + 1]?.items?.[0]?.media
        if (!media) return
        if (media.type === 'video') {
            const v = document.createElement('video')
            v.preload = 'auto'
            v.src = mediaUrl(media.src)
        } else {
            new Image().src = mediaUrl(media.src)
        }
    }, [idx])

    // ---- Touch / click -----------------------------------------------
    const onTouchStart = e => {
        const t = e.touches[0]
        touchRef.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchEnd = e => {
        const start = touchRef.current
        touchRef.current = null
        if (!start) return
        const t = e.changedTouches[0]
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            swipedRef.current = true
            setTimeout(() => {
                swipedRef.current = false
            }, 400)
            go(dx < 0 ? 1 : -1, true)
        }
    }
    const onClick = () => {
        if (swipedRef.current) return
        go(1, true)
    }

    // ---- Page content ------------------------------------------------
    const renderBlock = item => (
        <div key={item.n} style={styles.block}>
            <span style={styles.num}>{String(item.n).padStart(2, '0')}</span>
            <p style={page.kind === 'media' ? styles.textMedia : styles.textBig}>{item.text}</p>
        </div>
    )

    let content
    if (page.kind === 'intro') {
        content = <p style={styles.heading}>And a few reasons why...</p>
    } else if (page.kind === 'closing') {
        // Collect only image media items for the photo grid
        const allMedia = reasons
            .map((r, i) => (r.media && r.media.type === 'image' ? { ...r.media, n: i } : null))
            .filter(Boolean)

        content = (
            <>
                <p style={styles.closingLine}>Enjoy your day my love 🤍</p>
                <div style={styles.photoGrid}>
                    {allMedia.map((media, i) => (
                        <motion.div
                            key={i}
                            style={styles.photoCard}
                            initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: (i % 2 === 0 ? 1 : -1) * (Math.random() * 8 + 2)
                            }}
                            transition={{
                                delay: 0.8 + i * 0.15,
                                duration: 0.5,
                                type: 'spring',
                                bounce: 0.3
                            }}
                        >
                            <img
                                src={mediaUrl(media.src)}
                                alt=""
                                style={styles.photoImg}
                                onError={(e) => {
                                    e.target.parentElement.style.display = 'none'
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </>
        )
    } else if (page.kind === 'media') {
        const item = page.items[0]
        content = (
            <>
                {!mediaFailed && (
                    <ReasonMedia
                        media={item.media}
                        tilt={item.n % 2 === 0 ? 2 : -2}
                        onEnded={() => setEndedIdx(idx)}
                        onFail={() => setFailed(f => ({ ...f, [idx]: true }))}
                    />
                )}
                {renderBlock(item)}
            </>
        )
    } else {
        content = page.items.map(renderBlock)
    }

    const shift = reduceMotion ? 0 : 40
    const variants = {
        enter: d => ({ opacity: 0, x: d * shift }),
        center: { opacity: 1, x: 0 },
        exit: d => ({ opacity: 0, x: -d * shift }),
    }
    const showBar = !isVideo

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            transition={{ duration: 1 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={onClick}
        >
            <div style={styles.stage}>
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                        key={idx}
                        custom={dir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45 }}
                        style={styles.page}
                    >
                        {content}
                    </motion.div>
                </AnimatePresence>
            </div>

            {idx > 0 && (
                <button
                    style={styles.back}
                    aria-label="Previous"
                    onClick={e => {
                        e.stopPropagation()
                        go(-1, true)
                    }}
                >
                    ‹
                </button>
            )}

            <div style={styles.dots}>
                {pages.map((_, i) => (
                    <span
                        key={i}
                        style={{
                            ...styles.dot,
                            width: i === idx ? '22px' : '6px',
                            background: i < idx ? '#c9728a' : 'rgba(201, 114, 138, 0.3)',
                        }}
                    >
                        {i === idx && !paused && (
                            <span
                                key={`${idx}-${duration}-${showBar}`}
                                style={{
                                    ...styles.fill,
                                    width: showBar ? 0 : '100%',
                                    animation: showBar ? `fillbar ${duration}s linear forwards` : 'none',
                                }}
                            />
                        )}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
    },
    stage: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 5vw, 2rem) 3.5rem',
    },
    page: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1rem, 3vh, 1.6rem)',
        width: '100%',
        maxWidth: '680px',
        textAlign: 'center',
    },
    block: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        margin: 'clamp(0.6rem, 2.5vh, 1.5rem) 0',
    },
    num: {
        fontSize: '0.8rem',
        letterSpacing: '0.25em',
        color: '#c9728a',
    },
    textBig: {
        fontSize: 'clamp(1.25rem, 5vw, 1.7rem)',
        lineHeight: 1.7,
        color: '#4a2030',
        fontStyle: 'italic',
    },
    textMedia: {
        fontSize: 'clamp(1.05rem, 4.2vw, 1.3rem)',
        lineHeight: 1.6,
        color: '#4a2030',
        fontStyle: 'italic',
    },
    heading: {
        fontSize: 'clamp(0.95rem, 3.8vw, 1.2rem)',
        letterSpacing: '0.1em',
        color: '#c9728a',
        textTransform: 'uppercase',
    },
    closingLine: {
        fontSize: 'clamp(1.3rem, 5.5vw, 1.8rem)',
        fontStyle: 'italic',
        color: '#4a2030',
        marginBottom: 'clamp(1rem, 3vh, 2rem)',
    },
    photoGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(0.8rem, 2vw, 1.2rem)',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '600px',
        padding: '0 1rem',
    },
    photoCard: {
        background: '#fff',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(74, 32, 48, 0.15)',
        width: 'clamp(70px, 18vw, 90px)',
        height: 'clamp(85px, 22vw, 110px)',
    },
    photoImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '2px',
    },
    back: {
        position: 'absolute',
        top: 'calc(0.6rem + env(safe-area-inset-top, 0px))',
        left: '0.6rem',
        width: '44px',
        height: '44px',
        background: 'none',
        border: 'none',
        color: '#c9728a',
        fontSize: '2rem',
        lineHeight: 1,
        cursor: 'pointer',
    },
    dots: {
        position: 'absolute',
        bottom: 'calc(1.2rem + env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
    },
    dot: {
        display: 'block',
        height: '6px',
        borderRadius: '3px',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
    },
    fill: {
        display: 'block',
        height: '100%',
        background: '#c9728a',
    },
}