import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const emojis = ['🎈', '🎀', '✨', '💕', '🌸']

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

function Cake() {
    return (
        <motion.div
            style={styles.cakeWrapper}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
            {/* Candles */}


            {/* Cake layers */}
            <div style={styles.cakeTop}>
                <span style={styles.cakeEmoji}>🎂</span>
            </div>
        </motion.div>
    )
}

export default function Celebration({ onReplay }) {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            transition={{ duration: 1.5 }}
        >
            <Confetti />

            {/* Balloons */}
            <div style={styles.balloonRow}>
                {['🎈', '🎀', '🎈', '💕', '🎈'].map((b, i) => (
                    <motion.span
                        key={i}
                        style={{ fontSize: '2.5rem' }}
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 2 + i * 0.3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.2,
                        }}
                    >
                        {b}
                    </motion.span>
                ))}
            </div>

            <Cake />

            {/* Message */}
            <motion.div
                style={styles.messageWrapper}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1.2 }}
            >
                <p style={styles.wish}>May today be as beautiful</p>
                <p style={styles.wish}>as you are. 🌸</p>
                <motion.p
                    style={styles.sub}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1.5 }}
                >
                    Happy Birthday, my love 🤍
                </motion.p>
            </motion.div>

            <motion.button
                style={styles.replay}
                onClick={onReplay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 7, duration: 1.5 }}
            >
                watch again 🤍
            </motion.button>
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
    cakeWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
    },
    candleRow: {
        display: 'flex',
        gap: '1.2rem',
        marginBottom: '0.3rem',
        alignItems: 'flex-end',
    },
    candle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flame: {
        fontSize: '1.2rem',
        display: 'block',
        lineHeight: 1,
    },
    candleBody: {
        width: '10px',
        height: '28px',
        background: 'linear-gradient(to bottom, #f9d6e3, #f4a7c0)',
        borderRadius: '3px',
        marginTop: '2px',
    },
    cakeTop: {
        fontSize: 'clamp(4rem, 15vw, 6rem)',
        lineHeight: 1,
    },
    cakeEmoji: {
        fontSize: 'clamp(4.5rem, 18vw, 7rem)',
    },
    messageWrapper: {
        textAlign: 'center',
        zIndex: 1,
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