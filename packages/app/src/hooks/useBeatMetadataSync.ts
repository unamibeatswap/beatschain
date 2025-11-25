import { useEffect } from 'react'
import { useWeb3Data } from '@/context/Web3DataContext'

export function useBeatMetadataSync() {
  const { beats, loading } = useWeb3Data()
  
  console.log('🎯 useBeatMetadataSync hook initialized')
  
  useEffect(() => {
    console.log('🔄 useBeatMetadataSync hook called', { loading, beatCount: beats.length, beats: beats.map(b => ({ id: b.id, title: b.title })) })
    
    if (loading) {
      console.log('⏳ Waiting for beats to load...')
      return
    }
    
    // Always check localStorage for existing beats to sync
    const directSync = async () => {
      let foundBeats = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('producer_beats_') || key?.startsWith('uploaded_beat_')) {
          const beatsStr = localStorage.getItem(key)
          if (beatsStr) {
            try {
              const beatData = JSON.parse(beatsStr)
              const beatsArray = Array.isArray(beatData) ? beatData : [beatData]
              
              for (const beat of beatsArray) {
                if (beat && beat.id && beat.title) {
                  foundBeats++
                  console.log(`📤 Syncing existing beat ${beat.id}:`, { title: beat.title })
                  try {
                    await fetch(`/api/beat-metadata/${beat.id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(beat)
                    })
                  } catch (error) {
                    console.error(`❌ Sync error:`, error)
                  }
                }
              }
            } catch (error) {
              console.error(`❌ Parse error for ${key}:`, error)
            }
          }
        }
      }
      console.log(`🔄 Found and synced ${foundBeats} existing beats`)
    }
    
    directSync()
    
    if (beats.length === 0) {
      console.log('⚠️ No beats in context, but checked localStorage directly')
      return
    }
    
    console.log('🔄 Starting context beat metadata sync...', { beatCount: beats.length })
    
    // Sync context beats to server cache
    const syncBeats = async () => {
      for (const beat of beats) {
        if (beat.id && beat.title) {
          try {
            console.log(`📤 Syncing context beat ${beat.id}:`, { title: beat.title })
            
            const response = await fetch(`/api/beat-metadata/${beat.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(beat)
            })
            
            if (response.ok) {
              console.log(`✅ Successfully synced context beat ${beat.id}`)
            }
          } catch (error) {
            console.error(`❌ Context sync error for beat ${beat.id}:`, error)
          }
        }
      }
      console.log('🏁 Context beat metadata sync completed')
    }
    
    syncBeats()
  }, [beats, loading])
}