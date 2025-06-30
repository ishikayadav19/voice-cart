"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props} />
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical"
        ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
        : "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollBar.displayName = "ScrollBar";

const ScrollAreaViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport ref={ref} className={cn("h-full w-full rounded-[inherit]", className)} {...props} />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

export { ScrollArea, ScrollBar, ScrollAreaViewport };