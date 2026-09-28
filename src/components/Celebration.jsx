import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const emojis = ['🎈', '🎀', '✨', '💕', '🌸']
const CANDLE_COUNT = 5

function Confetti() {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        const items = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 4,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            spin: Math.random() > 0.5 ? 1 : -1,
            size: 14 + Math.random() * 18,
        }))
        setPieces(items)
    }, [])

    return (
        <div style={styles.confettiContainer}>
            {pieces.map(p => (
                <motion.span
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: '-40px',
                        fontSize: `${p.size}px`,
                        pointerEvents: 'none',
                    }}
                    animate={{
                        y: ['0vh', '110vh'],
                        rotate: [0, 360 * p.spin],
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        delay: p.delay,
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {p.emoji}
                </motion.span>
            ))}
        </div>
    )
}

// A small cake drawn with CSS, with candles you can blow out by tapping.
function Cake({ blown, onBlow }) {
    return (
        <motion.button
            type="button"
            style={styles.cakeButton}
            onClick={onBlow}
            disabled={blown}
            aria-label="Blow out the candles"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
            <div style={styles.candleRow}>
                {Array.from({ length: CANDLE_COUNT }, (_, i) => (
                    <div key={i} style={styles.candle}>
                        <div style={styles.flameSlot}>
                            <AnimatePresence>
                                {!blown ? (
                                    <motion.div
                                        key="flame"
                                        style={styles.flame}
                                        animate={{
                                            scale: [1, 1.15, 0.95, 1.1, 1],
                                            rotate: [-3, 3, -2, 2, -3],
                                        }}
                                        transition={{
                                            duration: 1.2 + i * 0.15,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        // Each flame goes out a beat after the last.
                                        exit={{
                                            opacity: 0,
                                            scale: 0.2,
                                            transition: { duration: 0.25, delay: i * 0.12 },
                                        }}
                                    />
                                ) : (
                                    <motion.div
                                        key="smoke"
                                        style={styles.smoke}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 0.7, 0], y: -38, scale: 1.8 }}
                                        transition={{ duration: 1.6, delay: 0.15 + i * 0.12 }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={styles.candleBody} />
                    </div>
                ))}
            </div>
            <div style={styles.layerTop} />
            <div style={styles.layerBottom} />
        </motion.button>
    )
}

export default function Celebration({ onReplay }) {
    const [blown, setBlown] = useState(false)
    const [party, setParty] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // The party starts a moment after the last flame goes out.
    useEffect(() => {
        if (!blown) return
        const t = setTimeout(() => setParty(true), 1400)
        return () => clearTimeout(t)
    }, [blown])

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            transition={{ duration: 1.5 }}
        >
            {party && <Confetti />}

            {/* Balloons */}
            <div style={styles.balloonRow}>
                {['🎈', '🎀', '🎈', '💕', '🎈'].map((b, i) => (
                    <motion.span
                        key={i}
                        style={{ fontSize: '2.5rem' }}
                        initial={{ opacity: 0 }}
                        animate={party ? { opacity: 1, y: [0, -12, 0] } : { opacity: 0 }}
                        transition={
                            party
                                ? {
                                      opacity: { duration: 0.8 },
                                      y: {
                                          duration: 2 + i * 0.3,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                          delay: i * 0.2,
                                      },
                                  }
                                : { duration: 0.3 }
                        }
                    >
                        {b}
                    </motion.span>
                ))}
            </div>

            <Cake blown={blown} onBlow={() => setBlown(true)} />

            {/* Prompt, then the message once the candles are out */}
            <div style={styles.messageArea}>
                <AnimatePresence mode="wait">
                    {!blown && (
                        <motion.div
                            key="prompt"
                            style={styles.messageWrapper}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            transition={{ delay: 1.6, duration: 1 }}
                        >
                            <p style={styles.wish}>Make a wish… 🤍</p>
                            <motion.p
                                style={styles.sub}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2.2, repeat: Infinity }}
                            >
                                tap the cake to blow out the candles
                            </motion.p>
                        </motion.div>
                    )}

                    {party && (
                        <motion.div
                            key="message"
                            style={styles.messageWrapper}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <p style={styles.wish}>May today be as beautiful</p>
                            <p style={styles.wish}>as you are. 🌸</p>
                            <motion.p
                                style={styles.sub}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1.5 }}
                            >
                                Happy Birthday, my love 🤍
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {party && (
                <motion.button
                    style={styles.replay}
                    onClick={onReplay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 5, duration: 1.5 }}
                >
                    watch again 🤍
                </motion.button>
            )}
        </motion.div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(1rem, 5vw, 2rem)',
        gap: 'clamp(1rem, 4vw, 2rem)',
    },
    confettiContainer: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
    },
    balloonRow: {
        display: 'flex',
        gap: '1.5rem',
        zIndex: 1,
    },

    // ---- Cake ----
    cakeButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        zIndex: 1,
        WebkitTapHighlightColor: 'transparent',
    },
    candleRow: {
        display: 'flex',
        gap: 'clamp(0.7rem, 3vw, 1.1rem)',
        alignItems: 'flex-end',
        marginBottom: '-2px',
        zIndex: 1,
    },
    candle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flameSlot: {
        position: 'relative',
        width: '14px',
        height: '26px',
    },
    flame: {
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        width: '10px',
        height: '18px',
        borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
        background: 'radial-gradient(circle at 50% 70%, #fff3b0 10%, #ffb347 55%, #ff7a45 100%)',
        boxShadow: '0 0 12px 4px rgba(255, 190, 90, 0.55)',
        transformOrigin: 'bottom center',
    },
    smoke: {
        position: 'absolute',
        bottom: '4px',
        left: '3px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(120, 100, 110, 0.5)',
        filter: 'blur(3px)',
    },
    candleBody: {
        width: '8px',
        height: '26px',
        background: 'linear-gradient(to bottom, #fff, #f4a7c0)',
        borderRadius: '3px',
    },
    layerTop: {
        width: 'clamp(150px, 46vw, 210px)',
        height: '44px',
        background: '#f9d6e3',
        borderRadius: '14px 14px 4px 4px',
        boxShadow: 'inset 0 -6px 0 #f4a7c0',
    },
    layerBottom: {
        width: 'clamp(190px, 58vw, 260px)',
        height: '56px',
        background: '#f4a7c0',
        borderRadius: '6px 6px 14px 14px',
        marginTop: '-2px',
        boxShadow: '0 8px 20px rgba(74, 32, 48, 0.15)',
    },

    // ---- Text ----
    messageArea: {
        minHeight: '9rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1,
    },
    messageWrapper: {
        textAlign: 'center',
        marginTop: '1rem',
    },
    wish: {
        fontSize: 'clamp(1.4rem, 6vw, 1.8rem)',
        fontStyle: 'italic',
        color: '#4a2030',
        lineHeight: 1.8,
    },
    replay: {
        zIndex: 1,
        background: 'none',
        border: '1px solid rgba(201, 114, 138, 0.5)',
        borderRadius: '999px',
        color: '#c9728a',
        fontFamily: 'inherit',
        fontStyle: 'italic',
        fontSize: '0.95rem',
        padding: '0.5rem 1.2rem',
        cursor: 'pointer',
    },
    sub: {
        marginTop: '1.5rem',
        fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
        color: '#c9728a',
        letterSpacing: '0.08em',
    },
}