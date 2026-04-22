'use client';

import { useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  onEnd?: () => void;
}

export function CountdownTimer({ endTime, onEnd }: CountdownTimerProps) {
  const { timeRemaining, isEnded } = useCountdown(endTime);

  useEffect(() => {
    if (isEnded && onEnd) {
      onEnd();
    }
  }, [isEnded, onEnd]);

  return (
    <div className="flex items-center gap-2 text-orange-600">
      <Clock className="w-4 h-4" />
      <span className="font-mono font-semibold">{timeRemaining}</span>
    </div>
  );
}
