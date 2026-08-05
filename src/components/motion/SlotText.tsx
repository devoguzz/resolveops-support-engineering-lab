import { useEffect, useRef } from 'react';
import { slotText, SlotTextController, SlotOptions } from 'slot-text';

export interface SlotTextProps {
  text: string;
  options?: SlotOptions;
  className?: string;
}

export function SlotText({ text, options, className }: SlotTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const instance = useRef<SlotTextController | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    instance.current = slotText(ref.current, text, options);
    return () => instance.current?.destroy();
  }, []);

  useEffect(() => {
    if (instance.current && instance.current.value !== text) {
      instance.current.set(text, options);
    }
  }, [text, options]);

  return <span ref={ref} className={className} />;
}
