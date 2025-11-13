import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  barCount?: number;
}

export const WaveformVisualizer = ({ isActive, barCount = 5 }: WaveformVisualizerProps) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isActive) {
      barsRef.current.forEach(bar => {
        if (bar) bar.style.height = '4px';
      });
      return;
    }

    const intervals: NodeJS.Timeout[] = [];

    barsRef.current.forEach((bar, index) => {
      if (!bar) return;

      const interval = setInterval(() => {
        const height = 4 + Math.random() * 20;
        bar.style.height = `${height}px`;
      }, 100 + index * 50);

      intervals.push(interval);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          ref={el => barsRef.current[i] = el}
          className="w-1 bg-primary rounded-full transition-all duration-100"
          style={{ height: '4px' }}
        />
      ))}
    </div>
  );
};
