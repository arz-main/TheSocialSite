import * as React from "react";
import { Link } from "react-router-dom";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "./BasicButton";
import { cn } from "../../utils/ClassNameMergeUtil";

interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  to: string;
  className?: string;
}

function LinkButton({
  to,
  variant,
  size,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      data-slot="link-button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}

export { LinkButton };