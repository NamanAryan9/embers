import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateLetter } from '../utils/ai'
import { fadeAmbientDown, playWhoosh } from '../utils/audio'
import '../styles/letter.css'

export default function Letter() {
	const navigate = useNavigate()
	const [memory, setMemory] = useState(null)
	const [letterText, setLetterText] = useState('')
	const [displayedWords, setDisplayedWords] = useState([])
	const [showButton, setShowButton] = useState(false)
	const [isGenerating, setIsGenerating] = useState(true)

	// Load memory from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('embers_memory')
		if (saved) {
			setMemory(JSON.parse(saved))
		} else {
			navigate('/')
		}
	}, [navigate])

	// Fade audio volume down for quiet letter moment
	useEffect(() => {
		fadeAmbientDown()
	}, [])

	// Generate letter when memory loads
	useEffect(() => {
		if (!memory) return

		const fetchLetter = async () => {
			setIsGenerating(true)
			const letter = await generateLetter(memory)
			setLetterText(letter)
			setIsGenerating(false)
		}

		fetchLetter()
	}, [memory])

	// Typewriter effect - display words one by one with variable timing
	useEffect(() => {
		if (!letterText || isGenerating) return

		const words = letterText.split(' ')
		let currentIndex = 0

		const scheduleNext = () => {
			if (currentIndex >= words.length) {
				setTimeout(() => {
					setShowButton(true)
				}, 2000)
				return
			}

			const word = words[currentIndex]
			setDisplayedWords(prev => [...prev, word])
			currentIndex++

			// Variable timing: longer pauses after punctuation
			let delay = 80
			if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
				delay = 320
			} else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) {
				delay = 180
			} else if (word.endsWith('—') || word.endsWith('–') || word.endsWith('...')) {
				delay = 260
			}

			setTimeout(scheduleNext, delay)
		}

		scheduleNext()
	}, [letterText, isGenerating])

	const handleKeepMemory = () => {
		playWhoosh()
		const memory = JSON.parse(localStorage.getItem('embers_memory') || '{}')
		memory.kept = true
		memory.keptAt = new Date().toISOString()
		localStorage.setItem('embers_memory', JSON.stringify(memory))
		navigate('/')
	}

	if (!memory) return null

	return (
		<motion.main
			className="letter"
			layout={false}
			initial={{ opacity: 0, scale: 1.03 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.97 }}
			transition={{ duration: 2, ease: 'easeOut' }}
		>
			<div className="letter__vignette" />

			<svg className="letter__rose" viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">
				{/* Stem */}
				<path d="M25 38 C25 50, 24 65, 26 75" stroke="#6b8b5a" strokeWidth="1.5" fill="none" opacity="0.5" />
				{/* Leaves */}
				<ellipse cx="20" cy="55" rx="6" ry="3" fill="#6b8b5a" opacity="0.4" transform="rotate(-30 20 55)" />
				<ellipse cx="30" cy="48" rx="5" ry="2.5" fill="#6b8b5a" opacity="0.35" transform="rotate(25 30 48)" />
				{/* Outer petals */}
				<ellipse cx="25" cy="16" rx="7" ry="10" fill="#9b7b8a" opacity="0.55" />
				<ellipse cx="16" cy="23" rx="10" ry="7" fill="#9b7b8a" opacity="0.5" />
				<ellipse cx="34" cy="23" rx="10" ry="7" fill="#9b7b8a" opacity="0.5" />
				<ellipse cx="19" cy="31" rx="8" ry="6" fill="#9b7b8a" opacity="0.5" />
				<ellipse cx="31" cy="31" rx="8" ry="6" fill="#9b7b8a" opacity="0.5" />
				{/* Inner petals */}
				<ellipse cx="22" cy="21" rx="5" ry="7" fill="#a8879a" opacity="0.7" transform="rotate(-15 22 21)" />
				<ellipse cx="28" cy="21" rx="5" ry="7" fill="#a8879a" opacity="0.7" transform="rotate(15 28 21)" />
				<ellipse cx="25" cy="27" rx="5" ry="6" fill="#a8879a" opacity="0.65" />
				{/* Center */}
				<circle cx="25" cy="23" r="3.5" fill="#8a6b7a" opacity="0.8" />
			</svg>

			<motion.section
				className="letter__content"
				layout={false}
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
			>
				{isGenerating ? (
					<p className="letter__loading">Writing...</p>
				) : (
					<>
						<p className="letter__text">
							{displayedWords.join(' ')}
						</p>

						{!isGenerating && displayedWords.length > 0 && displayedWords.length === letterText.split(' ').length && (
							<motion.div
								className="letter__ember"
								layout={false}
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 1.5, ease: 'easeOut' }}
							/>
						)}

						{showButton && (
							<motion.div
								className="letter__actions"
								layout={false}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1 }}
							>
								<button className="letter__button" onClick={handleKeepMemory}>
									Keep this memory
								</button>
								<p className="letter__save-note">
									Right-click to save this page as a memory
								</p>
							</motion.div>
						)}
					</>
				)}
			</motion.section>

			<p className="letter__footer">Some things never leave us.</p>
		</motion.main>
	)
}