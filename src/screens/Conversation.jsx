import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateResponse } from '../utils/ai'
import { fadeAmbientUp } from '../utils/audio'
import '../styles/conversation.css'

const MessageCard = memo(({ msg, name }) => (
  <div className={`conversation__message conversation__message--${msg.role}`}>
    {msg.role === 'assistant' && (
      <span className="conversation__label">
        {name}:
      </span>
    )}
    <p className="conversation__text">{msg.content}</p>
  </div>
))

export default function Conversation() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [exchangesRemaining, setExchangesRemaining] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [memory, setMemory] = useState(null)
  const [showFinalButton, setShowFinalButton] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fadeAmbientUp()
    const storedMemory = localStorage.getItem('embers_memory')
    if (storedMemory) {
      const parsedMemory = JSON.parse(storedMemory)
      setMemory(parsedMemory)

      const greeting = `Hello. I'm so glad you're here. I've been waiting to talk with you again.`
      setMessages([{ role: 'assistant', content: greeting }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || exchangesRemaining <= 0 || !memory) {
      return
    }

    const userMessage = inputValue
    setInputValue('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await generateResponse(memory, messages, userMessage)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      
      const newCount = exchangesRemaining - 1
      setExchangesRemaining(newCount)
      
      if (newCount === 0) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: "I don't have much time left here. But I wrote you something — before I go. Please read it.",
            },
          ])
          setTimeout(() => {
            setShowFinalButton(true)
          }, 1000)
        }, 1500)
      }
    } catch (error) {
      console.error('Error getting response:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I am here with you. Always.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateToLetter = () => {
    navigate('/letter')
  }

  const progress = 1 - (exchangesRemaining / 10)

  // Interpolate parchment: warm hsl(38,55%,80%) → cool hsl(30,35%,72%)
  const panelHue = 38 - progress * 8
  const panelSat = 55 - progress * 20
  const panelLight = 80 - progress * 8
  const panelBg = `hsl(${panelHue}, ${panelSat}%, ${panelLight}%)`

  const counterColor = useMemo(() => {
    if (exchangesRemaining === 0) return '#5a4a3a'
    if (exchangesRemaining <= 3) return '#8b3a3a'
    if (exchangesRemaining <= 6) return '#c8882a'
    return '#9b7b8a'
  }, [exchangesRemaining])

  return (
    <motion.div
      className="conversation"
      layout={false}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* LEFT PANEL: Room Scene */}
      <aside className="conversation__left">
        <div className="room">
          {/* Window */}
          <div className="room__window">
            <div className="room__moonlight" />
          </div>

          {/* Curtains */}
          <div className="room__curtain room__curtain--left" />
          <div className="room__curtain room__curtain--right" />

          {/* Armchair */}
          <div className="room__chair">
            <div className="room__chair-armrest room__chair-armrest--left" />
            <div className="room__chair-armrest room__chair-armrest--right" />
          </div>

          {/* Bookshelf */}
          <div className="room__bookshelf">
            <div className="room__book room__book--1" />
            <div className="room__book room__book--2" />
            <div className="room__book room__book--3" />
            <div className="room__book room__book--4" />
          </div>

          {/* Cat on windowsill */}
          <div className="room__cat">
            <div className="room__cat-body" />
            <div className="room__cat-head" />
            <div className="room__cat-ear room__cat-ear--left" />
            <div className="room__cat-ear room__cat-ear--right" />
            <div className="room__cat-tail" />
          </div>

          {/* Floor lamp glow */}
          <div className="room__lamp-glow" />
        </div>

        <button
          className="conversation__back"
          type="button"
          onClick={() => navigate('/memory')}
        >
          &larr; back
        </button>
      </aside>

      {/* RIGHT PANEL: Conversation */}
      <section
        className="conversation__right"
        style={{ background: `radial-gradient(ellipse at 100% 100%, rgba(200, 136, 42, 0.15) 0%, transparent 50%), ${panelBg}`, transition: 'background 2s ease' }}
      >
        <div className="conversation__header">
          <p className="conversation__counter" style={{ color: counterColor, transition: 'color 1s ease' }}>
            {exchangesRemaining} exchanges remaining
          </p>
        </div>

        <div className="conversation__messages">
          {messages.map((msg, idx) => (
            <MessageCard
              key={idx}
              msg={msg}
              name={memory?.name || 'Memory Keeper'}
            />
          ))}
          {isLoading && (
            <motion.div
              className="conversation__message conversation__message--assistant conversation__loading"
              layout={false}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="conversation__label">
                {memory?.name || 'Memory Keeper'}:
              </span>
              <div className="conversation__typing-dots">
                <span className="conversation__typing-dot" />
                <span className="conversation__typing-dot" />
                <span className="conversation__typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!showFinalButton ? (
          <div className="conversation__input-area">
            <input
              className="conversation__input"
              type="text"
              placeholder="Tell me what you remember..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button
              className="conversation__send"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              type="button"
            >
              send &rarr;
            </button>
          </div>
        ) : (
          <button
            className="conversation__final-button"
            onClick={handleNavigateToLetter}
            type="button"
          >
            Read their final letter
          </button>
        )}

        {/* Candle flame */}
        <svg
          className="conversation__candle"
          viewBox="0 0 24 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 8c0-2 1-4 2-4s2 2 2 4c0 1.5-0.5 3-1 4 0.5-1 1-2.5 1-4 0-1.5-0.5-3-1-3s-1 1.5-1 3zm2 6c-3 2-4 5-4 8 0 4 2 8 4 8s4-4 4-8c0-3-1-6-4-8z"
            fill="currentColor"
          />
        </svg>
      </section>
    </motion.div>
  )
}
