'use client';

import { useRef, useEffect, useState } from 'react';

interface AudioWaveformProps {
  audioUrl: string;
  currentTime: number;
  duration: number;
  previewDuration?: number;
  onSeek: (time: number) => void;
  className?: string;
}

export default function AudioWaveform({
  audioUrl,
  currentTime,
  duration,
  previewDuration = -1,
  onSeek,
  className = ''
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate waveform data from audio file
  useEffect(() => {
    if (!audioUrl) return;
    
    setIsLoading(true);
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let analyser: AnalyserNode;
    
    fetch(audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        // Get the audio data
        const channelData = audioBuffer.getChannelData(0);
        const samples = 100; // Number of samples to take
        const blockSize = Math.floor(channelData.length / samples);
        const dataPoints: number[] = [];
        
        // Calculate the amplitude for each block
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[i * blockSize + j]);
          }
          dataPoints.push(sum / blockSize);
        }
        
        // Normalize the data to values between 0 and 1
        const maxValue = Math.max(...dataPoints);
        const normalizedData = dataPoints.map(value => value / maxValue);
        
        setWaveformData(normalizedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error generating waveform:', error);
        // Generate fake waveform data if there's an error
        const fakeData = Array(100).fill(0).map(() => Math.random() * 0.8 + 0.2);
        setWaveformData(fakeData);
        setIsLoading(false);
      });
      
    return () => {
      if (analyser) {
        analyser.disconnect();
      }
      audioContext.close();
    };
  }, [audioUrl]);

  // Draw the waveform
  useEffect(() => {
    if (!canvasRef.current || waveformData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear the canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    const barWidth = rect.width / waveformData.length;
    const barGap = 2;
    const barWidthWithGap = barWidth - barGap;
    
    // Calculate progress percentage
    const progress = duration > 0 ? currentTime / duration : 0;
    const progressX = rect.width * progress;
    
    // Calculate preview marker position if applicable
    const previewX = previewDuration > 0 && duration > 0 
      ? rect.width * (previewDuration / duration) 
      : -1;
    
    // Draw each bar
    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * (rect.height * 0.8);
      const y = (rect.height - barHeight) / 2;
      
      // Determine if this bar is before or after the current playback position
      const isPlayed = x < progressX;
      
      // Set color based on position
      if (isPlayed) {
        ctx.fillStyle = '#3b82f6'; // Blue for played portion
      } else {
        ctx.fillStyle = '#d1d5db'; // Gray for unplayed portion
      }
      
      // Draw the bar
      ctx.fillRect(x, y, barWidthWithGap, barHeight);
    });
    
    // Draw preview duration marker if applicable
    if (previewX > 0) {
      ctx.beginPath();
      ctx.moveTo(previewX, 0);
      ctx.lineTo(previewX, rect.height);
      ctx.strokeStyle = '#ef4444'; // Red for preview marker
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add preview label
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.fillText('Preview Limit', previewX + 4, 12);
    }
    
  }, [waveformData, currentTime, duration, previewDuration]);

  // Handle click to seek
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekPercentage = clickX / rect.width;
    const seekTime = seekPercentage * duration;
    
    onSeek(seekTime);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative h-12 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      )}
    </div>
  );
}