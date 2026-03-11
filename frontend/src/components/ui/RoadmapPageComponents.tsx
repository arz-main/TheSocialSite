import React from 'react';

interface CardProps {
    image: string;
    title: string;
    description: string;
    progress: number;
    badgeText?: string;
    badgeIcon?: React.ReactNode;
}
function CourseCard({ image, title, description, progress, badgeText, badgeIcon }: CardProps) {
    return (
        <div className="w-full rounded-lg shadow-lg overflow-hidden bg-white 
                        transition-all duration-300 ease-in-out 
                        hover:ring-2 hover:ring-primary">

            <img src={image} alt={title} className="w-full h-40 object-cover" />

            <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600">{description}</p>

                <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
                </div>

                {(badgeText || badgeIcon) && (
                    <div className="inline-flex items-center gap-2 bg-primary/30 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {badgeIcon && <span>{badgeIcon}</span>}
                        {badgeText && <span>{badgeText}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
export default CourseCard;