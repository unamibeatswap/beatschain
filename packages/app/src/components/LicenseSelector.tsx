'use client'

interface LicenseSelectorProps {
  selectedLicense: string
  onLicenseChange: (license: string) => void
  fileType?: string
}

const LICENSE_TYPES = {
  BASIC: { 
    name: 'Basic License', 
    credits: 1, 
    description: 'MP3 download, basic usage rights',
    features: ['MP3 Download', 'Non-exclusive', 'Basic Usage Rights', '2,000 max downloads']
  },
  PREMIUM: { 
    name: 'Premium License', 
    credits: 2, 
    description: 'WAV download, extended usage rights',
    features: ['WAV Download', 'Non-exclusive', 'Extended Usage Rights', 'Commercial Use', '10,000 max downloads']
  },
  EXCLUSIVE: { 
    name: 'Exclusive License', 
    credits: 3, 
    description: 'Full stems, exclusive ownership',
    features: ['Full Stems (ZIP)', 'Exclusive Rights', 'Commercial Use', 'Unlimited Distribution']
  }
}

export default function LicenseSelector({ selectedLicense, onLicenseChange, fileType }: LicenseSelectorProps) {
  // Auto-suggest based on file type
  const suggestedLicense = fileType === 'zip' ? 'EXCLUSIVE' : fileType === 'wav' ? 'PREMIUM' : 'BASIC'
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">License Type</h3>
        {fileType && (
          <span className="text-sm text-blue-600">
            Suggested: {LICENSE_TYPES[suggestedLicense as keyof typeof LICENSE_TYPES].name}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(LICENSE_TYPES).map(([key, license]) => (
          <label
            key={key}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedLicense === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="license"
              value={key}
              checked={selectedLicense === key}
              onChange={(e) => onLicenseChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{license.name}</h4>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                {license.credits} credit{license.credits > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{license.description}</p>
            <ul className="text-xs text-gray-500 space-y-1">
              {license.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-500 mr-1">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </label>
        ))}
      </div>
    </div>
  )
}