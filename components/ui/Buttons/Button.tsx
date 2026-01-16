// components/mjolnir-ui/button.tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"; // optional, or pure Tailwind

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:brightness-110",
        outline: "border border-cyan-500 text-cyan-400 hover:bg-cyan-950/30",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function MjolnirButton({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}