import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border-[3px] border-ink text-sm font-extrabold uppercase tracking-wide transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-process focus-visible:ring-offset-2 focus-visible:ring-offset-sun disabled:pointer-events-none disabled:border-ink/40 disabled:bg-newsprint disabled:text-ink/45 disabled:shadow-none",
  {
    variants: {
      variant: {
        default: "press bg-signal text-white shadow-hard-xs",
        destructive: "press bg-ink text-white shadow-hard-xs",
        outline: "press bg-white text-ink shadow-hard-xs",
        secondary: "press bg-sun text-ink shadow-hard-xs",
        ghost: "border-transparent bg-transparent text-ink hover:bg-newsprint",
        link: "border-transparent bg-transparent text-ink underline decoration-signal decoration-2 underline-offset-4",
      },
      size: {
        default: "h-10 rounded-md px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
