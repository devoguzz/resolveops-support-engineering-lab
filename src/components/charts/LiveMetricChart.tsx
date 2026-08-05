import { useEffect, useState } from 'react';
import { Liveline } from 'liveline';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';

export interface LiveMetricChartProps {
  title: string;
  description?: string;
  data: Array<{ date: string | Date; value: number }>;
  loading?: boolean;
  error?: string;
  height?: number;
}

export function LiveMetricChart({ 
  title, 
  description, 
  data, 
  loading, 
  error, 
  height = 300 
}: LiveMetricChartProps) {
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

  if (!mounted) return null;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-[200px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="w-full flex-1" style={{ height: `${height}px` }}>
            <Liveline 
              data={data.map(d => ({ time: Math.floor(new Date(d.date).getTime() / 1000), value: d.value }))}
              value={data[data.length - 1]?.value || 0}
              window={7 * 24 * 60 * 60}
              paused={reducedMotion}
              color="hsl(var(--primary))"
              fill={true}
              grid={true}
              pulse={true}
              badge={true}
              formatValue={(v) => `${(v/1000).toFixed(1)}k reqs`}
              className="w-full h-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
