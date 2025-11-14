import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const getProgressColor = (value: number = 0) => {
  if (value < 30) return "bg-gradient-to-r from-red-500 to-orange-500";
  if (value < 60) return "bg-gradient-to-r from-orange-500 to-yellow-500";
  if (value < 90) return "bg-gradient-to-r from-yellow-500 to-green-500";
  return "bg-gradient-to-r from-green-500 to-emerald-500";
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-500 ease-out",
        getProgressColor(value)
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
