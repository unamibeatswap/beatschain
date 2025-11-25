export const validateBeatData = (data: any) => {
  const errors: string[] = []
  
  if (!data.title?.trim()) errors.push('Title is required')
  if (data.title?.length > 100) errors.push('Title must be less than 100 characters')
  
  if (!data.genre?.trim()) errors.push('Genre is required')
  
  if (!data.bpm || data.bpm < 60 || data.bpm > 200) {
    errors.push('BPM must be between 60 and 200')
  }
  
  if (!data.price || data.price < 0) errors.push('Price must be positive')
  if (data.price > 10) errors.push('Price cannot exceed 10 ETH')
  
  if (!data.audioUrl?.trim()) errors.push('Audio file is required')
  
  return { isValid: errors.length === 0, errors }
}

export const validateFileUpload = (file: File, type: 'audio' | 'image') => {
  const errors: string[] = []
  
  if (type === 'audio') {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3']
    if (!validTypes.includes(file.type)) {
      errors.push('Audio must be MP3 or WAV format')
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB
      errors.push('Audio file must be less than 100MB')
    }
  }
  
  if (type === 'image') {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      errors.push('Image must be JPEG, PNG, or WebP format')
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      errors.push('Image file must be less than 5MB')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
}