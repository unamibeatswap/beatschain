'use client'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'toast' | 'audio' | 'memory' | 'user'
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private readonly MAX_METRICS = 1000
  
  track(name: string, value: number, type: PerformanceMetric['type'] = 'user') {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      type
    })
    
    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS)
    }
  }
  
  getMetrics(type?: PerformanceMetric['type'], hours: number = 1) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000)
    return this.metrics.filter(m => 
      m.timestamp > cutoff && 
      (!type || m.type === type)
    )
  }
  
  getStats(type?: PerformanceMetric['type']) {
    const metrics = this.getMetrics(type)
    if (metrics.length === 0) return null
    
    const values = metrics.map(m => m.value)
    return {
      count: metrics.length,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: metrics[metrics.length - 1]?.value || 0
    }
  }
  
  clear() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()