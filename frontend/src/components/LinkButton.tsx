import * as React from "react";
import { Link } from "react-router-dom";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./BasicButton";
import { cn } from "../utils/ClassNameMergeUtil";

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
    const containerRef = React.useRef<HTMLAnchorElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 1.4;

        const ripple = document.createElement("span");
        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.28);
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      transform: scale(0);
      animation: lb-ripple 0.55s ease-out forwards;
      pointer-events: none;
    `;
        el.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());

        props.onMouseDown?.(e);
    };

    return (
        <>
            <style>{`
        @keyframes lb-ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .lb-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.18) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: none;
          pointer-events: none;
          border-radius: inherit;
        }
        .lb-shine:hover::after {
          transform: translateX(100%);
          transition: transform 0.45s ease;
        }
        .lb-shine:hover {
          transform: translateY(-2px);
        }
        .lb-shine:active {
          transform: scale(0.97) translateY(0);
        }
      `}</style>

            <Link
                ref={containerRef}
                to={to}
                data-slot="link-button"
                onMouseDown={handleMouseDown}
                className={cn(
                    buttonVariants({ variant, size, className }),
                    "lb-shine",
                    "relative overflow-hidden transition-transform duration-150",
                    "font-bold text-white"
                )}
                {...props}
            >
                <span className="relative z-10">{children}</span>
            </Link>
        </>
    );
}

export { LinkButton };