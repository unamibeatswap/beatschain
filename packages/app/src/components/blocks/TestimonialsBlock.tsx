'use client'

import { useState } from 'react'
import { urlFor } from '@/lib/sanity-client'

interface Testimonial {
  quote: string
  author: string
  role?: string
  avatar?: any
  rating?: number
}

interface TestimonialsBlockProps {
  title?: string
  testimonials: Testimonial[]
  display?: 'grid' | 'carousel' | 'list'
}

export default function TestimonialsBlock({ 
  title, 
  testimonials, 
  display = 'grid' 
}: TestimonialsBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!testimonials || testimonials.length === 0) return null

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  // Render testimonial card
  const renderTestimonial = (testimonial: Testimonial, index: number) => (
    <div 
      key={index}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      {/* Quote */}
      <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
      
      {/* Rating */}
      {testimonial.rating && (
        <div className="mb-4">
          {renderStars(testimonial.rating)}
        </div>
      )}
      
      {/* Author */}
      <div className="flex items-center">
        {testimonial.avatar && (
          <div className="mr-4">
            <img
              src={urlFor(testimonial.avatar).width(60).height(60).url()}
              alt={testimonial.author}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <p className="font-bold">{testimonial.author}</p>
          {testimonial.role && (
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="my-12">
      {/* Header */}
      {title && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
      )}
      
      {/* Testimonials Display */}
      {display === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
        </div>
      )}
      
      {display === 'carousel' && (
        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  {renderTestimonial(testimonial, index)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                onClick={() => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                onClick={() => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
      
      {display === 'list' && (
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
        </div>
      )}
    </div>
  )
}