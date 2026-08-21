'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface FlashDealTimerProps {
  targetDate?: string | Date | null;
}

export function FlashDealTimer({ targetDate }: FlashDealTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const end = targetDate ? new Date(targetDate).getTime() : Date.now() + 86400000 * 2;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
      <Clock className="h-4 w-4 animate-pulse text-amber-600 dark:text-amber-400" />
      <span>Deals End In:</span>
      <div className="flex items-center gap-1 font-mono text-xs font-black">
        <span className="rounded bg-amber-600 px-1.5 py-0.5 text-white">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span>:</span>
        <span className="rounded bg-amber-600 px-1.5 py-0.5 text-white">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span>:</span>
        <span className="rounded bg-amber-600 px-1.5 py-0.5 text-white">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}
