"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Toaster = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("fixed bottom-4 right-4 z-50 flex flex-col space-y-2", className)} {...props} />
));
Toaster.displayName = "Toaster";

export { Toaster };