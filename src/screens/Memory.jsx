import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { playWhoosh } from '../utils/audio'
import '../styles/memory.css'

export default function Memory() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [notes, setNotes] = useState('')
  const [isWriting, setIsWriting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem(
      'embers_memory',
      JSON.stringify({ name, relationship, notes })
    )
    playWhoosh()
    navigate('/conversation')
  }

  const handleBack = () => {
    playWhoosh()
    navigate('/')
  }

  return (
    <motion.main
      className="memory"
      layout={false}
      initial={{ opacity: 0, y: 20, scale: 1.03 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <section className="memory__page" aria-label="Memory journal">
        <h1 className="memory__title">Begin the memory</h1>
        <p className="memory__subtitle">A quiet place for what you hold close.</p>

        <form className="memory__form" onSubmit={handleSubmit}>
          <label className="memory__field">
            <span className="memory__label">Who are you remembering?</span>
            <input
              className="memory__input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onFocus={() => setIsWriting(true)}
              onBlur={() => setIsWriting(false)}
              maxLength={50}
              required
            />
            <span className="memory__ink-line" />
          </label>

          <label className="memory__field">
            <span className="memory__label">Your relationship to them?</span>
            <input
              className="memory__input"
              type="text"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              onFocus={() => setIsWriting(true)}
              onBlur={() => setIsWriting(false)}
              maxLength={50}
              required
            />
            <span className="memory__ink-line" />
          </label>

          <label className="memory__field">
            <span className="memory__label">Things they used to say or do...</span>
            <textarea
              className="memory__textarea"
              rows="4"
              placeholder="They always said..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onFocus={() => setIsWriting(true)}
              onBlur={() => setIsWriting(false)}
              maxLength={500}
              required
            />
            <span className="memory__ink-line" />
          </label>

          <div className="memory__actions">
            <button className="memory__button" type="submit">
              Save Memory
            </button>
          </div>
        </form>

        <svg
          className={`memory__quill ${isWriting ? 'memory__quill--writing' : ''}`}
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M50 10c-7 3-14 9-20 17-3 4-6 9-9 14-4 6-7 11-11 13 6 0 11-2 16-5 6-3 11-7 16-11 8-6 13-13 16-20-3-4-5-6-8-8z"
            fill="currentColor"
          />
          <path
            d="M13 53c5-3 10-6 15-9l-8 11-7 2c-1 0-2-1-2-2l2-2z"
            fill="currentColor"
          />
        </svg>
      </section>

      <button
        className="memory__back"
        type="button"
        onClick={handleBack}
      >
        &larr; back
      </button>
    </motion.main>
  )
}