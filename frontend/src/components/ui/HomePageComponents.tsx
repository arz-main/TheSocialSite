import type { HomeCardProp } from "../../types/HomePageTypes";

export function HomeCard({ icon: Icon, title, description }: HomeCardProp) {
    return (
        <div className="relative w-full rounded-xl bg-card p-5 overflow-hidden group">

            {/* Subtle corner dot-grid texture */}
            <svg
                className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06] text-primary pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="card-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#card-dots)" />
            </svg>

            {/* Top-left corner bracket */}
            <svg
                className="absolute top-3 left-3 w-5 h-5 text-primary opacity-20 group-hover:opacity-50 transition-opacity duration-300"
                viewBox="0 0 20 20" fill="none"
            >
                <path d="M2 10 L2 2 L10 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Bottom-right corner bracket */}
            <svg
                className="absolute bottom-3 right-3 w-5 h-5 text-primary opacity-20 group-hover:opacity-50 transition-opacity duration-300"
                viewBox="0 0 20 20" fill="none"
            >
                <path d="M18 10 L18 18 L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Icon with a slight tilt + hover animation */}
            <div className="relative inline-block mb-4">
                <Icon className="text-white bg-primary w-11 h-11 p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300 ease-out shadow-md" />
                {/* tiny orbit dot */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary opacity-60" />
            </div>

            {/* Thin ruled line above title */}
            <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-primary opacity-15" />
                <div className="w-1 h-1 rounded-full bg-primary opacity-30" />
            </div>

            <h2 className="text-base text-text font-bold leading-snug mb-3">
                {title}
            </h2>

            <p className="text-sm text-text-opaque leading-relaxed">
                {description}
            </p>
        </div>
    );
}