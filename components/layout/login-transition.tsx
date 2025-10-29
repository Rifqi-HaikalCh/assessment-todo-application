'use client'

import { useEffect, useState } from 'react'
import { useTransitionStore } from '@/lib/store/transition.store'
import { cn } from '@/lib/utils'

export function LoginTransition() {
  const { isTransitioning } = useTransitionStore();
  const [isVisible, setIsVisible] = useState(false); // Internal state to control actual visibility

  useEffect(() => {
    if (isTransitioning) {
      setIsVisible(true); // Show immediately when transitioning starts
    } else {
      // When transitioning ends, start fade-out, then hide completely after CSS duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Match CSS transition duration (duration-500)
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Only render the component if it's visible or actively transitioning
  if (!isVisible && !isTransitioning) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-gray-100 z-[100] flex items-center justify-center transition-opacity duration-500 ease-in-out",
      isTransitioning ? "opacity-100" : "opacity-0", // Control opacity based on isTransitioning
      !isVisible && "pointer-events-none" // Apply pointer-events-none only when fully hidden
    )}>
      <div className="relative">
        <h1 className={cn(
          "text-5xl font-extrabold text-blue-600 transition-all duration-1000 ease-in-out",
          isTransitioning ? "opacity-100 scale-100" : "opacity-0 scale-125"
        )}>
          Nodewave
        </h1>
        <div className={cn(
          "absolute -bottom-2 left-0 w-full h-1 bg-blue-600 transition-all duration-1000 ease-in-out delay-500",
          isTransitioning ? "scale-x-100" : "scale-x-0"
        )} style={{ transformOrigin: 'left' }} />
      </div>
    </div>
  )
}
