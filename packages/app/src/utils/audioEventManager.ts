'use client'

interface AudioEventState {
  element: HTMLAudioElement
  listeners: Map<string, EventListener>
  cleanup: () => void
}

class AudioEventManager {
  private audioElements = new WeakMap<HTMLAudioElement, AudioEventState>()
  
  register(audio: HTMLAudioElement): AudioEventState {
    if (this.audioElements.has(audio)) {
      return this.audioElements.get(audio)!
    }
    
    const listeners = new Map<string, EventListener>()
    
    const cleanup = () => {
      listeners.forEach((listener, event) => {
        audio.removeEventListener(event, listener)
      })
      listeners.clear()
      this.audioElements.delete(audio)
    }
    
    const state: AudioEventState = {
      element: audio,
      listeners,
      cleanup
    }
    
    this.audioElements.set(audio, state)
    return state
  }
  
  addListener(audio: HTMLAudioElement, event: string, listener: EventListener) {
    const state = this.register(audio)
    
    // Remove existing listener for this event
    if (state.listeners.has(event)) {
      audio.removeEventListener(event, state.listeners.get(event)!)
    }
    
    // Add new listener
    audio.addEventListener(event, listener)
    state.listeners.set(event, listener)
  }
  
  cleanup(audio: HTMLAudioElement) {
    const state = this.audioElements.get(audio)
    if (state) {
      state.cleanup()
    }
  }
  
  cleanupAll() {
    // Note: WeakMap doesn't have iteration, so we rely on individual cleanup calls
  }
}

export const audioEventManager = new AudioEventManager()