import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Heart } from 'lucide-react';

interface CardProps {
    id: number;
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

const DIFFICULTY_COLORS = {
    Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    Advanced: 'bg-red-100 text-red-700 border-red-200',
};

function CourseCard({ id, image, title, description, progress, badgeText, chapters, lessons, badgeIcon, difficulty, isFavourite, onToggleFavourite }: CardProps) {
    const isCompleted = progress === 100;

    return (
        <Link to={`/roadmap/course/${id}`}
            className={`block w-full rounded-2xl shadow-md overflow-hidden bg-card
                transition-all duration-300 ease-in-out
                hover:-translate-y-1.5 hover:shadow-xl
                ${isCompleted
                    ? 'ring-2 ring-green-500/60'
                    : 'hover:ring-2 hover:ring-primary/40'
                }`}
            style={{ textDecoration: 'none' }}
        >
            <div className="relative">
                <img src={image} alt={title} className="w-full h-44 object-cover" />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Favourite button */}
                <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFavourite?.(); }}
                    className="absolute top-3 left-3 p-1.5 rounded-full bg-white/85 hover:bg-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 z-10"
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                    <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                </button>

                {/* Completed badge */}
                {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow z-10">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                )}

                {/* Difficulty chip — on image bottom-left */}
                {difficulty && (
                    <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${DIFFICULTY_COLORS[difficulty]}`}>
                        {difficulty}
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-text text-base mb-1 truncate">{title}</h3>
                <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed">{description}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                        <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                        <span>{chapters} ch · {lessons} lessons</span>
                    </div>
                    {(badgeText || badgeIcon) && (
                        <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-semibold
                            ${isCompleted ? 'bg-green-500 text-white' : 'bg-primary/15 text-primary'}`}>
                            {badgeIcon}{badgeText}
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                <div>
                    <div className="w-full bg-border rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-muted'}`}>
                        {isCompleted ? '✓ Completed' : `${progress}% complete`}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default CourseCard;