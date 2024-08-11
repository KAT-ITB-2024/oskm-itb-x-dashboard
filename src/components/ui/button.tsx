import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
<<<<<<< HEAD
        // Custom Variants
        pink: "bg-pink-500 text-white hover:bg-pink-500/70 [box-shadow:4px_4px_20px_0px_rgba(255,_140,_217,_0.75)]",
        pinkoutline:
          "border border-pink-500 bg-transparent hover:bg-pink-500 hover:text-white text-pink-500 [box-shadow:4px_4px_20px_0px_rgba(255,_140,_217,_0.75)]",
        yellow:
          "bg-[#FFE429] text-[#470BBB] hover:bg-[#FFE429]/70 [box-shadow:4px_4px_10px_0px_rgba(255,_191,_81,_0.75)]",
=======
>>>>>>> a7d81178ac67015c43ddea5a0f3a5a0176b4528b
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
<<<<<<< HEAD
=======
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
>>>>>>> a7d81178ac67015c43ddea5a0f3a5a0176b4528b
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
