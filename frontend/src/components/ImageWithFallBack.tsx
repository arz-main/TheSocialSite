import React, { useState } from 'react'

const ERROR_IMG_SRC = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <rect x="12" y="12" width="64" height="64" rx="6"/>
  <path d="m12 58 16-18 32 32"/>
  <circle cx="53" cy="35" r="7"/>
</svg>
`);

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [didError, setDidError] = useState(false)
    const handleError = () => setDidError(true)
    const { src, alt, style, className, ...rest } = props

    return didError || !src ? (
        <div
            className={`inline-block text-center align-middle ${className ?? ''}`}
            style={style}
        >
            <div className="flex items-center justify-center w-full h-full">
                <img src={ERROR_IMG_SRC} alt="fallback" {...rest} data-original-url={src} />
            </div>
        </div>
    ) : (
        <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
    )
}