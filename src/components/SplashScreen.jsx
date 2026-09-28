import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
    useEffect(() => {
        const t = setTimeout(onComplete, 4000)
        return () => clearTimeout(t)
    }, [onComplete])

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
        >
            <motion.p
                style={styles.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
            >
                Happy Birthday, my Bright Sunshine🌞🤍
            </motion.p>
        </motion.div>
    )
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 'clamp(1.5rem, 6vw, 2rem)',
        letterSpacing: '0.05em',
        color: '#4a2030',
        fontStyle: 'italic',
        padding: '0 1rem',
        textAlign: 'center',
    }
}