import React from 'react';
import { BookOpen, CheckCircle, Heart } from "lucide-react";

interface CardProps {
    image: string;
    title: string;
    description: string;
    progress: number;
    badgeText?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    chapters: number;
    lessons: number;
    badgeIcon?: React.ReactNode;
    isFavourite: boolean;
    onToggleFavourite?: () => void;
}

function CourseCard({ image, title, description, progress, badgeText, chapters, lessons, badgeIcon, difficulty, isFavourite, onToggleFavourite }: CardProps) {
    const isCompleted = progress === 100;

    return (
        <div className={`w-full rounded-lg shadow-lg overflow-hidden bg-card 
                transition-all duration-300 ease-in-out 
                hover:-translate-y-2 hover:shadow-2xl cursor-pointer
                ${isCompleted
                ? 'ring-2 ring-green-500 shadow-green-100'
                : 'hover:ring-2 hover:ring-primary'
            }`}>

            <div className="relative">
                <img src={image} alt={title} className="w-full h-40 object-cover" />

                {/* Favourite Heart */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavourite?.(); }}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                    <Heart
                        className={`w-4 h-4 transition-all duration-200 ${isFavourite
                            ? 'fill-red-500 text-red-500 drop-shadow-sm'
                            : 'text-gray-400 hover:text-red-400'
                            }`}
                    />
                </button>

                {/* Completed Icon */}
                {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Title and Difficulty Row */}
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold truncate">
                        {title}
                    </h3>

                    {difficulty && (
                        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors
                            ${isCompleted
                                ? 'bg-green-100 text-green-600 border border-green-300'
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}>
                            {difficulty}
                        </span>
                    )}
                </div>

                <p className="text-sm text-text/70 line-clamp-2">{description}</p>

                <div>
                    <div className={`inline-flex items-center gap-2 py-2 text-xs rounded-full ${isCompleted ? 'text-green-500/50' : 'text-primary/50'}`}>
                        <BookOpen className="w-4 h-4" />
                        <span>
                            {chapters} Chapter{chapters > 1 ? 's ' : ''} &bull; {lessons} Lesson{lessons > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className={`text-xs mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {isCompleted ? 'Completed!' : `${progress}% complete`}
                    </p>
                </div>

                {(badgeText || badgeIcon) && (
                    <div className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full font-medium transition-colors
                        ${isCompleted
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-primary/30 text-primary'
                        }`}>
                        {badgeIcon && <span>{badgeIcon}</span>}
                        {badgeText && <span>{badgeText}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseCard;