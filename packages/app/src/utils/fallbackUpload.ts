'use client'

export const fallbackUpload = {
  async uploadToLocalStorage(file: File, key: string): Promise<string> {
    const sizeMB = file.size / (1024 * 1024)
    
    // Check if file is too large for localStorage (>4MB base64 ≈ 5.3MB)
    if (sizeMB > 4) {
      throw new Error(`File too large for localStorage fallback (${sizeMB.toFixed(1)}MB). IPFS configuration required for files >4MB.`)
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const base64 = reader.result as string
          localStorage.setItem(key, base64)
          resolve(base64)
        } catch (storageError) {
          reject(new Error(`localStorage quota exceeded. File: ${sizeMB.toFixed(1)}MB. Configure IPFS for larger files.`))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  },
  
  clearOldFiles(prefix: string, keepCount: number = 3) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix))
    const sortedKeys = keys.sort((a, b) => {
      const aTime = localStorage.getItem(a + '_timestamp') || '0'
      const bTime = localStorage.getItem(b + '_timestamp') || '0'
      return parseInt(bTime) - parseInt(aTime)
    })
    
    // Remove old files beyond keepCount
    sortedKeys.slice(keepCount).forEach(key => {
      localStorage.removeItem(key)
      localStorage.removeItem(key + '_timestamp')
    })
  }
}