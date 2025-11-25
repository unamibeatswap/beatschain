/**
 * One-time script to sync existing localStorage beats to Sanity
 * Run this in browser console on any page with Web3DataContext
 */

async function syncExistingBeats() {
  try {
    // Get existing beats from Web3DataContext
    const contextData = window.__WEB3_DATA_CONTEXT__
    if (!contextData || !contextData.beats || contextData.beats.length === 0) {
      console.log('❌ No beats found in Web3DataContext')
      return
    }

    console.log(`📊 Found ${contextData.beats.length} beats to sync`)

    // Import Sanity client
    const { client } = await import('/src/lib/sanity-client.js')

    let synced = 0
    let skipped = 0

    for (const beat of contextData.beats) {
      try {
        // Check if already synced
        const existing = await client.fetch(
          `*[_type == "web3Beat" && beatId == $id][0]`,
          { id: beat.id }
        )

        if (existing) {
          console.log(`⏭️ Beat ${beat.id} already synced`)
          skipped++
          continue
        }

        // Sync to Sanity
        await client.create({
          _type: 'web3Beat',
          beatId: beat.id,
          title: beat.title,
          stageName: beat.stageName,
          producerAddress: beat.producerId,
          genre: beat.genre,
          bpm: beat.bpm,
          key: beat.key,
          price: beat.price,
          coverImageUrl: beat.coverImageUrl,
          description: beat.description,
          isPrivate: true
        })

        console.log(`✅ Synced beat: ${beat.title}`)
        synced++

      } catch (error) {
        console.error(`❌ Failed to sync beat ${beat.id}:`, error)
      }
    }

    console.log(`🎯 Sync complete: ${synced} synced, ${skipped} skipped`)

  } catch (error) {
    console.error('❌ Sync failed:', error)
  }
}

// Run the sync
syncExistingBeats()