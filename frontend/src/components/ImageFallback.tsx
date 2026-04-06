import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export function ImageFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const { src, alt, style, className, ...rest } = props;
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative ${className ?? ""}`} style={style}>
            {/* Fallback — always visible until image loads */}
            {(!loaded || error) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/20 text-text">
                    <ImageOff className="w-8 h-8 opacity-40" />
                    <span className="text-xs opacity-40">
                        No image
                    </span>
                </div>
            )}

            {/* Real image — rendered immediately, just invisible until loaded */}
            {src && !error && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    {...rest}
                />
            )}
        </div>
    );
};