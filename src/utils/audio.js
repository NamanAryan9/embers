// Global audio utilities for Embers

let audio = null

function getAudio() {
  if (!audio) {
    audio = new Audio('./ambient.mp3')
    audio.loop = true
    audio.volume = 0.25
  }
  return audio
}

let audioCtx = null

function getAudioContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const startAmbient = () => {
  getAudio().play().catch(() => {})
}

export const fadeAmbientDown = () => {
  const a = getAudio()
  const fade = setInterval(() => {
    if (a.volume > 0.05) {
      a.volume = Math.max(0, a.volume - 0.01)
    } else {
      clearInterval(fade)
    }
  }, 150)
}

export const fadeAmbientUp = () => {
  const a = getAudio()
  const fade = setInterval(() => {
    if (a.volume < 0.25) {
      a.volume = Math.min(0.25, a.volume + 0.01)
    } else {
      clearInterval(fade)
    }
  }, 150)
}

export const toggleMute = () => {
  const a = getAudio()
  a.muted = !a.muted
  return a.muted
}

export const isMuted = () => audio ? audio.muted : false

// Page transition whoosh sound
export const playWhoosh = () => {
  const ctx = getAudioContext()
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 
              Math.pow(1 - i / data.length, 3) * 0.15
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.06, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(
    0.001, ctx.currentTime + 0.08)
  src.connect(gain)
  gain.connect(ctx.destination)
  src.start()
}

// Letter reveal chime sound
export const playChime = () => {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(528, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(
    396, ctx.currentTime + 2)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(
    0.001, ctx.currentTime + 2.5)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 2.5)
}
