/* eslint-disable no-invalid-this */
import { useCallback, useEffect, useReducer, useRef } from 'react'

const Actions = {
  playing: 'playing',
  muted: 'muted',
  autoplay: 'autoplay',
  loop: 'loop',
  duration: 'duration',
  seeking: 'seeking',
}

// Media player state reducer
function reducer(state, action) {
  switch (action.type) {
    case Actions.playing:
      return { ...state, playing: action.payload }
    case Actions.muted:
      return { ...state, muted: action.payload }
    case Actions.loop:
      return { ...state, loop: action.payload }
    case Actions.autoplay:
      return { ...state, autoplay: action.payload }
    case Actions.duration:
      return { ...state, duration: action.payload }
    case Actions.seeking:
      return { ...state, seeking: action.payload }
    default:
      return { ...state }
  }
}

// Initail state object
const initialState = {
  playing: false,
  muted: false,
  loop: false,
  autoplay: false,
  duration: null,
  seeking: false,
}

export function useMediaPlayer() {
  const media = useRef(null)
  const [state, dispatch] = useReducer(reducer, initialState)

  // Set ref via callback
  const ref = useCallback((node) => {
    if (media.current !== node) {
      media.current = node
    }
  }, [media])

  const play = useCallback(() => {
    if (media.current?.paused) {
      media.current?.play()
    }
  }, [media])

  const pause = useCallback(() => {
    if (!media.current?.paused) {
      media.current?.play()?.then(() => {
        media.current?.pause()
      })
    }
  }, [media])

  const stop = useCallback(() => {
    media.current?.play().then(() => {
      if (media.current) {
        media.current.pause()
        media.current.currentTime = 0
      }
    })
  }, [media])

  const restart = useCallback(() => {
    if (media.current) {
      media.current.currentTime = 0
    }
  }, [media])

  const mute = useCallback(() => {
    if (media.current) {
      media.current.muted = true
    }
  }, [media])

  const unmute = useCallback(() => {
    if (media.current) {
      media.current.muted = false
    }
  }, [media])

  const seek = useCallback((value) => {
    if (media.current) {
      const percent = typeof value === 'string' ? Number.parseFloat(value) : value
      if (percent >= 0 && percent <= 1) {
        media.current.currentTime = media.current.duration * Math.min(1, Math.max(0, percent))
      } else {
        throw new Error('Seek value must be within the range from 0 to 1.')
      }
    }
  }, [media])

  const setCurrentTime = useCallback((time) => {
    if (media.current) {
      media.current.currentTime = Math.min(media.current.duration, Math.max(0, time))
    }
  }, [media])

  const setFullscreen = useCallback((bool) => {
    if (bool) {
      if (media.current?.requestFullscreen) media.current?.requestFullscreen()
      else if (media.current?.mozRequestFullScreen) media.current?.mozRequestFullScreen()
      else if (media.current?.webkitRequestFullscreen) media.current?.webkitRequestFullscreen()
      else if (media.current?.msRequestFullscreen) media.current?.msRequestFullscreen()
    }
    else {
      if (document.exitFullscreen) document.exitFullscreen()
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    }
  }, [media])

  const setLooping = useCallback((bool) => {
    if (media.current) {
      media.current.loop = bool
      dispatch({ type: Actions.loop, payload: bool })
    }
  }, [media])

  const setVolume = useCallback((value) => {
    if (media.current) {
      const volume = typeof value === 'string' ? Number.parseFloat(value) : value
      const newVolume = Math.min(1, Math.max(0, volume))
      media.current.volume = newVolume
    }
  }, [media])

  const setPlaying = (bool) => (bool ? play() : pause())
  const togglePlaying = () => (media.current?.paused ? play() : pause())
  const setMuted = (bool) => (bool ? mute() : unmute())
  const toggleMute = () => (media.current?.muted ? unmute() : mute())

  useEffect(() => {
    let timeout
    let seeking = false

    function handleLoad() {
      dispatch({ type: Actions.autoplay, payload: this.autoplay })
      dispatch({ type: Actions.loop, payload: this.loop })
      dispatch({ type: Actions.duration, payload: this.duration })
    }

    function handleEnd() {
      dispatch({ type: Actions.playing, payload: false })
    }

    function handlePlay() {
      if (!seeking) {
        dispatch({ type: Actions.playing, payload: true })
      }
    }

    function handlePause() {
      if (!seeking) {
        dispatch({ type: Actions.playing, payload: false })
      }
    }

    function handleSeeking() {
      seeking = state.playing && this.currentTime !== 0
      if (seeking) {
        clearTimeout(timeout)
        dispatch({ type: Actions.seeking, payload: true })
      }
    }

    function handleSeeked() {
      seeking = state.playing
      if (seeking) {
        timeout = setTimeout(() => {
          dispatch({ type: Actions.seeking, payload: false })
          play()
          seeking = false
        }, 300)
      }
    }

    function handleVolume() {
      dispatch({ type: Actions.muted, payload: this.muted })
    }

    media.current?.addEventListener('loadedmetadata', handleLoad)
    media.current?.addEventListener('play', handlePlay)
    media.current?.addEventListener('pause', handlePause)
    media.current?.addEventListener('ended', handleEnd)
    media.current?.addEventListener('seeking', handleSeeking, true)
    media.current?.addEventListener('seeked', handleSeeked, true)
    media.current?.addEventListener('volumechange', handleVolume, true)

    return function cleanup() {
      clearTimeout(timeout)
      media.current?.removeEventListener('loadedmetadata', handleLoad)
      media.current?.removeEventListener('play', handlePlay)
      media.current?.removeEventListener('pause', handlePause)
      media.current?.removeEventListener('ended', handleEnd)
      media.current?.removeEventListener('seeking', handleSeeking, true)
      media.current?.removeEventListener('seeked', handleSeeked, true)
      media.current?.removeEventListener('volumechange', handleVolume, true)
    }

  }, [media, play, pause, state.playing])

  const controls = {
    play,
    pause,
    stop,
    restart,
    mute,
    unmute,
    seek,
    setPlaying,
    setVolume,
    setLooping,
    setMuted,
    setCurrentTime,
    setFullscreen,
    togglePlaying,
    toggleMute,
  }

  return { ref, ...controls, state, target: media.current }
}
