'use client'

import Link from 'next/link'
import { Beat } from '@/types/data'

interface BeatLinkProps {
  beat: Beat
  children: React.ReactNode
  className?: string
}

export default function BeatLink({ beat, children, className = '' }: BeatLinkProps) {
  const beatUrl = `/beat/${beat.id}`
  
  return (
    <Link href={beatUrl} className={className}>
      {children}
    </Link>
  )
}