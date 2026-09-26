import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-process focus:ring-offset-2 focus:ring-offset-sun",
  {
    variants: {
      variant: {
        default: "bg-sun text-ink",
        secondary: "bg-white text-ink",
        destructive: "bg-signal text-white",
        outline: "bg-white text-ink",
        success: "bg-process text-white",
        warning: "bg-sun text-ink",
        stub: "bg-newsprint text-ink/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
