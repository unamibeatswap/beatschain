import { db } from './firebase'
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore'

export class RealtimeService {
  private static listeners: Map<string, () => void> = new Map()

  static subscribeToUserNotifications(userId: string, callback: (notifications: any[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))
      callback(notifications)
    })

    this.listeners.set(`notifications_${userId}`, unsubscribe)
    return unsubscribe
  }

  static subscribeToProducerStats(producerId: string, callback: (stats: any) => void) {
    const unsubscribe = onSnapshot(
      collection(db, 'producer-stats').doc(producerId),
      (doc) => {
        if (doc.exists()) {
          callback(doc.data())
        }
      }
    )

    this.listeners.set(`producer_stats_${producerId}`, unsubscribe)
    return unsubscribe
  }

  static subscribeToBeats(callback: (beats: any[]) => void, filters?: any) {
    let q = query(collection(db, 'beats'), orderBy('createdAt', 'desc'))
    
    if (filters?.genre) {
      q = query(q, where('genre', '==', filters.genre))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const beats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }))
      callback(beats)
    })

    this.listeners.set('beats', unsubscribe)
    return unsubscribe
  }

  static unsubscribe(key: string) {
    const unsubscribe = this.listeners.get(key)
    if (unsubscribe) {
      unsubscribe()
      this.listeners.delete(key)
    }
  }

  static unsubscribeAll() {
    this.listeners.forEach(unsubscribe => unsubscribe())
    this.listeners.clear()
  }
}