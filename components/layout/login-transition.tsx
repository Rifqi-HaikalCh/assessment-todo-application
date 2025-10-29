'use client'

import { useEffect, useState } from 'react'
import { useTransitionStore } from '@/lib/store/transition.store'
import { cn } from '@/lib/utils'

export function LoginTransition() {
  const { isTransitioning } = useTransitionStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;

    if (isTransitioning) {
      setIsVisible(true);
      setIsFadingOut(false);
    } else if (isVisible) {
      setIsFadingOut(true);
      fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
      }, 500); // Durasi fade-out (ms)
    }

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [isTransitioning, isVisible]);

  if (!isVisible && !isTransitioning) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-gray-100 z-[100] flex items-center justify-center transition-opacity duration-500 ease-in-out", // Durasi fade-out
        isFadingOut ? "opacity-0" : "opacity-100",
        !isVisible && "pointer-events-none"
      )}
    >
      {/* Tambahkan animasi pulse di sini */}
      <div className={cn(
          "relative",
          isTransitioning && !isFadingOut && "animate-pulse" // Tambahkan animasi pulse saat transisi masuk
      )}>
        <h1 className={cn(
          "text-5xl font-extrabold text-blue-600 transition-all duration-1000 ease-in-out",
          isTransitioning && !isFadingOut ? "opacity-100 scale-100" : "opacity-0 scale-125"
        )}>
          Nodewave
        </h1>
        <div className={cn(
          "absolute -bottom-2 left-0 w-full h-1 bg-blue-600 transition-all duration-1000 ease-in-out delay-500",
          isTransitioning && !isFadingOut ? "scale-x-100" : "scale-x-0"
        )} style={{ transformOrigin: 'left' }} />
      </div>
    </div>
  )
}