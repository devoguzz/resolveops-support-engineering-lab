import { useEffect, useState } from 'react';
import { SlotText } from './SlotText';
import { cn } from '../../lib/utils';

export interface AnimatedStatusProps {
  status: string;
  className?: string;
}

export function AnimatedStatus({ status, className }: AnimatedStatusProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    setMounted(true);
    
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (!mounted || reducedMotion) {
    return <span className={cn('inline-block transition-all', className)} aria-live="polite">{status}</span>;
  }

  return (
    <span className={cn('inline-block', className)} aria-live="polite">
      <SlotText text={status} />
    </span>
  );
}
