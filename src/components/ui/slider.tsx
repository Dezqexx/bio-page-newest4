
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    orientation?: "horizontal" | "vertical"
    trackClassName?: string
    rangeClassName?: string
    thumbClassName?: string
  }
>(({ 
  className, 
  orientation = "horizontal", 
  trackClassName, 
  rangeClassName, 
  thumbClassName, 
  ...props 
}, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none items-center",
      orientation === "vertical" ? "h-full flex-col" : "w-full",
      className
    )}
    {...props}
    orientation={orientation}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative overflow-hidden rounded-full bg-secondary",
        orientation === "vertical" ? "h-full w-2" : "h-2 w-full grow",
        trackClassName
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute bg-primary",
          orientation === "vertical" ? "w-full bottom-0" : "h-full left-0",
          rangeClassName
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        thumbClassName
      )} 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
