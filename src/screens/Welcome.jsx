import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { startAmbient, playWhoosh } from '../utils/audio'
import '../styles/welcome.css'

export default function Welcome() {
  const navigate = useNavigate()
  const [keptName, setKeptName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('embers_memory')
    if (saved) {
      const memory = JSON.parse(saved)
      if (memory.kept && memory.name) {
        setKeptName(memory.name)
      }
    }
  }, [])

  const handleBegin = () => {
    localStorage.removeItem('embers_memory')
    startAmbient()
    playWhoosh()
    navigate('/memory')
  }

  return (
    <motion.main
      className="welcome"
      layout={false}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <div className="welcome__orb" aria-hidden="true" />

      {/* Floating ember particles */}
      <div className="welcome__embers" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`welcome__ember welcome__ember--${i}`} />
        ))}
      </div>

      <div className="welcome__content">
        <h1 className="welcome__title">
          EMBERS
        </h1>
        <p className="welcome__subtitle">Give your memories a place to live.</p>
        <button
          className="welcome__button"
          type="button"
          onClick={handleBegin}
        >
          Begin
        </button>
      </div>

      <p className="welcome__footer">Everything stays on your device. Always private.</p>
      {keptName && <p className="welcome__kept">{keptName} is still here.</p>}
    </motion.main>
  )
}