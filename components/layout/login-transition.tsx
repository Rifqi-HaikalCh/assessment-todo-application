'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useTransitionStore } from '@/lib/store/transition.store'
import { cn } from '@/lib/utils'

const TEXT = "Nodewave";
const ANIMATION_DURATION = 1000;
const FADE_OUT_DURATION = 500;
const ELEMENT_FADE_DURATION = 300;

export function LoginTransition() {
  const { isTransitioning } = useTransitionStore();
  const [isVisible, setIsVisible] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [underlineWidth, setUnderlineWidth] = useState(0); 

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    const charsToShow = Math.floor(progress * TEXT.length);
    setDisplayedText(TEXT.slice(0, charsToShow));

    setUnderlineWidth(progress * 100);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
       startTimeRef.current = null; 
    }
  }, []);

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout;

    if (isTransitioning) {
      setIsVisible(true);
      setStartAnimation(false);
      setDisplayedText('');
      setUnderlineWidth(0);

      const startDelay = setTimeout(() => {
          setStartAnimation(true);
          startTimeRef.current = null;
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = requestAnimationFrame(animate);
      }, 50);

      return () => clearTimeout(startDelay);

    } else if (isVisible) {
      setStartAnimation(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
      }
      fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
        setUnderlineWidth(0);
      }, ELEMENT_FADE_DURATION + FADE_OUT_DURATION);
    }

    return () => {
      clearTimeout(fadeOutTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
      }
    };
  }, [isTransitioning, isVisible, animate]);


  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-gray-100 z-[100] flex items-center justify-center transition-opacity ease-in-out",
        isTransitioning && startAnimation
          ? `opacity-100 duration-${FADE_OUT_DURATION}`
          : `opacity-0 duration-${FADE_OUT_DURATION}`
      )}
    >
      <div className={cn(
          "relative transition-opacity ease-in-out",
          startAnimation
            ? `opacity-100 duration-${ELEMENT_FADE_DURATION}`
            : `opacity-0 duration-${ELEMENT_FADE_DURATION}`
      )}>
        <h1 className={cn(
          "text-5xl font-extrabold text-blue-600 h-14",
        )}>
          <span style={{ whiteSpace: 'pre' }}>{displayedText}</span>
          <span className="opacity-0">{TEXT.slice(displayedText.length)}</span>
        </h1>
        <div className="absolute -bottom-2 left-0 h-1 bg-blue-600"
             style={{
                 width: `${underlineWidth}%`,
             }}
        />
      </div>
    </div>
  )
}