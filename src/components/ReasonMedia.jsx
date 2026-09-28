import { useEffect, useRef, useState } from 'react'

// Files live in public/media/ and are referenced by filename only.
export const mediaUrl = src => `${process.env.PUBLIC_URL}/media/${src}`

export default function ReasonMedia({ media, tilt = 0, onEnded, onFail }) {
    const videoRef = useRef(null)
    const [failed, setFailed] = useState(false)
    const [muted, setMuted] = useState(true)
    const isVideo = media.type === 'video'

    useEffect(() => {
        videoRef.current?.play().catch(() => {})
    }, [])

    // A missing or broken file shows nothing instead of a broken icon.
    if (failed) return null

    const fail = () => {
        setFailed(true)
        onFail?.()
    }

    const toggleSound = e => {
        e.stopPropagation() // don't count as a tap-to-advance
        const v = videoRef.current
        if (!v) return
        v.muted = !v.muted
        setMuted(v.muted)
    }

    return (
        <figure style={{ ...styles.frame, transform: `rotate(${tilt}deg)` }}>
            <div style={{ ...styles.box, aspectRatio: media.ratio || '4 / 5' }}>
                {isVideo ? (
                    <>
                        <video
                            ref={videoRef}
                            src={mediaUrl(media.src)}
                            style={styles.media}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            onEnded={onEnded}
                            onError={fail}
                        />
                        <button style={styles.sound} onClick={toggleSound} aria-label="Toggle sound">
                            {muted ? '🔇' : '🔊'}
                        </button>
                    </>
                ) : (
                    <img
                        src={mediaUrl(media.src)}
                        alt={media.caption || ''}
                        style={styles.media}
                        onError={fail}
                    />
                )}
            </div>
            {media.caption && <figcaption style={styles.caption}>{media.caption}</figcaption>}
        </figure>
    )
}

const styles = {
    frame: {
        background: '#fff',
        padding: '10px 10px 12px',
        borderRadius: '4px',
        boxShadow: '0 8px 24px rgba(74, 32, 48, 0.18)',
        width: 'min(300px, 66vw, 34vh)',
        margin: 0,
    },
    box: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: '#f6e3e9',
    },
    media: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    sound: {
        position: 'absolute',
        right: '8px',
        bottom: '8px',
        width: '34px',
        height: '34px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
    },
    caption: {
        marginTop: '10px',
        textAlign: 'center',
        fontFamily: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
        fontSize: '0.95rem',
        color: '#4a2030',
    },
}