'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useTransitionStore } from '@/lib/store/transition.store'
import { cn } from '@/lib/utils'

const TEXT = "Nodewave";
const ANIMATION_DURATION = 1000; // Durasi total animasi type & bar (ms)
const FADE_OUT_DURATION = 500; // Durasi fade out utama (ms)
const ELEMENT_FADE_DURATION = 300; // Durasi fade in/out elemen teks & bar (ms)

export function LoginTransition() {
  const { isTransitioning } = useTransitionStore();
  const [isVisible, setIsVisible] = useState(false); // Kontrol mount/unmount & fade out utama
  const [startAnimation, setStartAnimation] = useState(false); // Trigger animasi internal
  const [displayedText, setDisplayedText] = useState('');
  const [underlineWidth, setUnderlineWidth] = useState(0); // Lebar garis bawah (0-100)

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Fungsi animasi menggunakan requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1); // Progress animasi (0 to 1)

    // Update teks
    const charsToShow = Math.floor(progress * TEXT.length);
    setDisplayedText(TEXT.slice(0, charsToShow));

    // Update garis bawah
    setUnderlineWidth(progress * 100);

    // Lanjutkan animasi jika belum selesai
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
       startTimeRef.current = null; // Reset start time
    }
  }, []);

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;

    if (isTransitioning) {
      setIsVisible(true); // Mulai tampilkan (fade in container)
      setStartAnimation(false); // Reset trigger animasi internal
      setDisplayedText('');
      setUnderlineWidth(0);

      // Beri sedikit delay sebelum memulai animasi internal agar fade in container terlihat
      const startDelay = setTimeout(() => {
          setStartAnimation(true); // Mulai fade in elemen + animasi typing/bar
          startTimeRef.current = null; // Reset start time
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = requestAnimationFrame(animate);
      }, 50); // Delay kecil (misal 50ms) setelah container mulai fade in

      return () => clearTimeout(startDelay); // Cleanup delay

    } else if (isVisible) {
      // Mulai fade out
      setStartAnimation(false); // Hentikan animasi internal & mulai fade out elemen
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
      }
      // Timer untuk fade out container utama
      fadeOutTimer = setTimeout(() => {
        setIsVisible(false); // Sembunyikan container setelah elemen fade out + durasi fade out container
        setDisplayedText('');
        setUnderlineWidth(0);
      }, ELEMENT_FADE_DURATION + FADE_OUT_DURATION); // Tunggu elemen fade out + container fade out
    }

    // Cleanup saat unmount atau isTransitioning berubah
    return () => {
      clearTimeout(fadeOutTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
      }
    };
  }, [isTransitioning, isVisible, animate]);


  // Jangan render jika tidak visible (setelah fade out selesai)
  if (!isVisible) return null;

  return (
    // Container utama dengan fade in/out
    <div
      className={cn(
        "fixed inset-0 bg-gray-100 z-[100] flex items-center justify-center transition-opacity ease-in-out",
        isTransitioning && startAnimation // Mulai fade in saat transisi dan animasi dimulai
          ? `opacity-100 duration-${FADE_OUT_DURATION}` // Fade in cepat
          : `opacity-0 duration-${FADE_OUT_DURATION}` // Fade out
      )}
    >
      {/* Kontainer untuk elemen teks dan bar dengan fade in/out sendiri */}
      <div className={cn(
          "relative transition-opacity ease-in-out",
          startAnimation
            ? `opacity-100 duration-${ELEMENT_FADE_DURATION}` // Fade in elemen
            : `opacity-0 duration-${ELEMENT_FADE_DURATION}` // Fade out elemen
      )}>
        {/* Teks */}
        <h1 className={cn(
          "text-5xl font-extrabold text-blue-600 h-14", // Tinggi tetap
        )}>
          <span style={{ whiteSpace: 'pre' }}>{displayedText}</span>
          <span className="opacity-0">{TEXT.slice(displayedText.length)}</span>
        </h1>
        {/* Garis bawah */}
        <div className="absolute -bottom-2 left-0 h-1 bg-blue-600"
             style={{
                 width: `${underlineWidth}%`,
                 // Transisi width bisa ditambahkan jika requestAnimationFrame dirasa kurang halus
                 // transition: `width ${ANIMATION_DURATION / 100}ms linear`
             }}
        />
      </div>
    </div>
  )
}