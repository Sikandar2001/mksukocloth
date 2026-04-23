'use client';
import { useState, useEffect } from 'react';

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Disable scrolling when preloader is active
    document.body.style.overflow = 'hidden';

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount >= 100) {
          clearInterval(timer);
          // Small delay before hiding to let the user see 100%
          setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = 'auto';
          }, 500);
          return 100;
        }
        return prevCount + 1;
      });
    }, 20); // Adjust speed here (20ms * 100 = 2 seconds approx)

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${count === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-white md:text-8xl">
          MKSUKO
        </h1>
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-zinc-800">
          <div 
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${count}%` }}
          />
        </div>
        <span className="mt-4 font-mono text-xl font-light tracking-widest text-white/50">
          {count}%
        </span>
      </div>
    </div>
  );
}
