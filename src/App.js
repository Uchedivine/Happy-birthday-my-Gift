import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { preloadMedia } from './preloadMedia'
import SplashScreen from './components/SplashScreen'
import LoveLetter from './components/LoveLetter'
import Reasons from './components/Reasons'
import Celebration from './components/Celebration'

export default function App() {
  const [phase, setPhase] = useState('splash')

  useEffect(() => { preloadMedia() }, [])

  // Stable callbacks so child effects don't restart on re-render.
  const toLetter = useCallback(() => setPhase('letter'), [])
  const toReasons = useCallback(() => {
    setTimeout(() => setPhase('reasons'), 2000)
  }, [])
  const toCelebration = useCallback(() => {
    setTimeout(() => setPhase('celebration'), 500)
  }, [])
  const replay = useCallback(() => setPhase('splash'), [])

  return (
    <AnimatePresence mode="wait">
      {phase === 'splash' && <SplashScreen key="splash" onComplete={toLetter} />}
      {phase === 'letter' && <LoveLetter key="letter" onFinished={toReasons} />}
      {phase === 'reasons' && <Reasons key="reasons" onFinished={toCelebration} />}
      {phase === 'celebration' && <Celebration key="celebration" onReplay={replay} />}
    </AnimatePresence>
  )
}