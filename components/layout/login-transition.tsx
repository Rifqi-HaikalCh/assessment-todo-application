'use client'

import { useEffect, useState } from 'react'
import { useTransitionStore } from '@/lib/store/transition.store'
import { cn } from '@/lib/utils'

export function LoginTransition() {
  const { isTransitioning } = useTransitionStore();
  // State internal untuk mengontrol visibilitas aktual dan animasi fade-out
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;
    
    if (isTransitioning) {
      setIsVisible(true);
      setIsFadingOut(false); // Pastikan tidak sedang fade out saat mulai
    } else if (isVisible) {
      // Jika transisi berhenti DAN komponen masih visible, mulai fade out
      setIsFadingOut(true);
      fadeOutTimer = setTimeout(() => {
        setIsVisible(false); // Sembunyikan sepenuhnya setelah durasi fade-out
        setIsFadingOut(false); // Reset state fade out
      }, 500); // Sesuaikan durasi ini dengan durasi transisi CSS (misal: duration-500)
    }

    return () => {
      clearTimeout(fadeOutTimer); // Bersihkan timer jika komponen unmount atau state berubah
    };
  }, [isTransitioning, isVisible]);

  // Jangan render jika tidak visible dan tidak sedang transisi masuk
  if (!isVisible && !isTransitioning) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-gray-100 z-[100] flex items-center justify-center transition-opacity duration-500 ease-in-out",
        // Terapkan opacity berdasarkan state fade out atau transisi masuk
        isFadingOut ? "opacity-0" : "opacity-100",
        // Cegah interaksi saat tidak visible
        !isVisible && "pointer-events-none"
      )}
    >
      <div className="relative">
        <h1 className={cn(
          "text-5xl font-extrabold text-blue-600 transition-all duration-1000 ease-in-out",
          // Animasi saat transisi masuk
          isTransitioning && !isFadingOut ? "opacity-100 scale-100" : "opacity-0 scale-125"
        )}>
          Nodewave
        </h1>
        <div className={cn(
          "absolute -bottom-2 left-0 w-full h-1 bg-blue-600 transition-all duration-1000 ease-in-out delay-500",
           // Animasi saat transisi masuk
          isTransitioning && !isFadingOut ? "scale-x-100" : "scale-x-0"
        )} style={{ transformOrigin: 'left' }} />
      </div>
    </div>
  )
}