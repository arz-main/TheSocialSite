import React from "react";

interface AvatarWithFallbackProps {
  src?: string;
  alt: string;
  size?: number; // width & height in px
  className?: string;
}

export function AvatarWithFallback({ src, alt, size = 48, className = "" }: AvatarWithFallbackProps) {
  const [hasError, setHasError] = React.useState(false);

  const fallbackLetter = alt.charAt(0).toUpperCase();

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-lg">{fallbackLetter}</span>
      )}
    </div>
  );
}