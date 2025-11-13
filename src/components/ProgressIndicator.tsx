import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  className?: string;
}

export const ProgressIndicator = ({ steps, className }: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  step.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.current
                    ? "border-primary bg-primary/10 text-primary animate-pulse-slow"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center font-medium whitespace-nowrap",
                  step.completed || step.current
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all -mt-8",
                  step.completed
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
