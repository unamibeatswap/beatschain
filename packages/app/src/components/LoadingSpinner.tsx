'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = '#3b82f6',
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: '16px',
    md: '24px', 
    lg: '32px'
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '8px' 
    }}>
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `2px solid ${color}20`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <span style={{ 
          fontSize: '0.875rem', 
          color: '#6b7280' 
        }}>
          {text}
        </span>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}