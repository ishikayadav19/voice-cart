"use client";

import * as React from "react";
import * as ResizablePrimitive from "@radix-ui/react-resizable";
import { cn } from "@/lib/utils";

const Resizable = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.Root ref={ref} className={cn("relative flex flex-1", className)} {...props} />
));
Resizable.displayName = "Resizable";

const ResizableHandle = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.Handle ref={ref} className={cn("absolute z-10 flex items-center justify-center bg-border", className)} {...props} />
));
ResizableHandle.displayName = "ResizableHandle";

const ResizablePanel = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.Panel ref={ref} className={cn("flex flex-1", className)} {...props} />
));
ResizablePanel.displayName = "ResizablePanel";

const ResizablePanelGroup = React.forwardRef(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup ref={ref} className={cn("flex w-full", className)} {...props} />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

export { Resizable, ResizableHandle, ResizablePanel, ResizablePanelGroup };