import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { toggleMute, isMuted } from './utils/audio'
import Welcome from './screens/Welcome'
const Memory = lazy(() => import('./screens/Memory'))
const Conversation = lazy(() => import('./screens/Conversation'))
const Letter = lazy(() => import('./screens/Letter'))
import './styles/global.css'

function CustomCursor() {
  const cursorRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const isHoveringRef = useRef(false)
  const hoverCheckRef = useRef(0)

  useEffect(() => {
    const handleMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }

      // Only check hover every 100ms, not every frame
      const now = Date.now()
      if (now - hoverCheckRef.current > 100) {
        hoverCheckRef.current = now
        const el = document.elementFromPoint(e.clientX, e.clientY)
        if (el) {
          const interactive = el.closest('button, a, input, textarea, select, label, [role="button"]')
          const hovering = !!interactive
          isHoveringRef.current = hovering
          setIsHovering(hovering)
        }
      }
    }
    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }
    const handleEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    let raf
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15)
      if (cursorRef.current) {
        const size = isHoveringRef.current ? 7 : 4
        cursorRef.current.style.transform = `translate(${pos.current.x - size}px, ${pos.current.y - size}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={cursorRef} className={`custom-cursor${isHovering ? ' custom-cursor--hovering' : ''}`} />
}

function MuteButton() {
  const [muted, setMuted] = useState(() => isMuted())

  const handleToggle = () => {
    const newMutedState = toggleMute()
    setMuted(newMutedState)
  }

  return (
    <motion.button
      layout={false}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={handleToggle}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        background: 'none',
        border: 'none',
        color: '#5a4a3a',
        fontSize: '20px',
        cursor: 'pointer',
        padding: 0,
        zIndex: 9999,
      }}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor" />
        </svg>
      )}
    </motion.button>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/memory" element={<Suspense fallback={null}><Memory /></Suspense>} />
        <Route path="/conversation" element={<Suspense fallback={null}><Conversation /></Suspense>} />
        <Route path="/letter" element={<Suspense fallback={null}><Letter /></Suspense>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
      <MuteButton />
      <CustomCursor />
    </HashRouter>
  )
}