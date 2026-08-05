import { useEffect, useState } from 'react';
import { SlotText } from './SlotText';
import { cn } from '../../lib/utils';

export interface AnimatedMetricProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatNumber?: boolean; // If true, adds thousand separators
}

export function AnimatedMetric({ value, prefix = '', suffix = '', className, formatNumber = true }: AnimatedMetricProps) {
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

  const formatValue = (v: number | string) => {
    if (typeof v === 'number' && formatNumber) {
      return v.toLocaleString('en-US');
    }
    return v.toString();
  };

  const displayValue = formatValue(value);
  const text = `${prefix}${displayValue}${suffix}`;

  if (!mounted || reducedMotion) {
    return <span className={cn('inline-block font-mono tabular-nums', className)} aria-live="polite">{text}</span>;
  }

  return (
    <span className={cn('inline-block font-mono tabular-nums', className)} aria-live="polite">
      <SlotText text={text} />
    </span>
  );
}
