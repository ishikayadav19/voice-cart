"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div className={cn(badgeVariants({ variant }), className)} ref={ref} {...props} />
));
Badge.displayName = "Badge";

export { Badge, badgeVariants };