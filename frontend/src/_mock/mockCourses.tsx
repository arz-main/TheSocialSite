// ─────────────────────────────────────────────────────────────────────────────
// Made by Claude
// ─────────────────────────────────────────────────────────────────────────────

export interface Lesson {
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'practice';
    completed: boolean;
    description: string;
    practiceRefs?: string[];
}

export interface Chapter {
    id: number;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    image: string;
    title: string;
    description: string;
    progress: number;
    chapters: number;
    lessons: number;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    badgeText?: string;
    isFavourite: boolean;
    chapterData?: Chapter[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Made by Claude
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
    {
        id: 1,
        image: "https://i.pinimg.com/1200x/3e/d7/7c/3ed77cc29615bd91da4acd63eb870076.jpg",
        title: "Eyes from any angle",
        description: "Learn to draw expressive eyes from any angle, master shapes and expression",
        progress: 100,
        difficulty: "Beginner",
        badgeText: "Side Eye",
        chapters: 1,
        lessons: 1,
        isFavourite: true,
        chapterData: [
            {
                id: 1,
                title: "Eye Fundamentals",
                lessons: [
                    {
                        id: 1,
                        title: "The anatomy of an eye",
                        duration: "8 min",
                        type: "reading",
                        completed: true,
                        description: "Learn the basic structural parts of the eye — lids, iris, pupil, and how they relate in 2D space.",
                        practiceRefs: [
                            "https://i.pinimg.com/1200x/3e/d7/7c/3ed77cc29615bd91da4acd63eb870076.jpg",
                            "https://i.pinimg.com/736x/36/2f/9f/362f9f89fd8e49c0c7de1d4145d2f143.jpg",
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        image: "https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg",
        title: "Mastering Hands",
        description: "The ultimate guide to drawing fingers, palms, and gestures.",
        progress: 10,
        difficulty: "Intermediate",
        badgeText: "Broken Fingers",
        chapters: 4,
        lessons: 9,
        isFavourite: false,
        chapterData: [
            {
                id: 1,
                title: "Understanding Hand Structure",
                lessons: [
                    { id: 1, title: "Blocking in the palm", duration: "10 min", type: "reading", completed: true, description: "Simplify the hand as a flat box first. This foundational step prevents the most common mistakes.", practiceRefs: ["https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg"] },
                    { id: 2, title: "Finger proportions", duration: "7 min", type: "reading", completed: false, description: "Each finger has three phalanges. Learn their relative lengths and how they taper.", practiceRefs: [] },
                    { id: 3, title: "Practice: Relaxed open hand", duration: "20 min", type: "practice", completed: false, description: "Draw a relaxed open hand using the reference images provided.", practiceRefs: ["https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 2,
                title: "Gesture & Movement",
                lessons: [
                    { id: 4, title: "The flow line of a hand", duration: "9 min", type: "reading", completed: false, description: "Every gesture has a dominant curve running from wrist to fingertip. Learn to find and exaggerate it.", practiceRefs: [] },
                    { id: 5, title: "Practice: 5 gesture hands", duration: "30 min", type: "practice", completed: false, description: "Draw 5 different hand gestures focusing purely on movement.", practiceRefs: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 3,
                title: "Foreshortening",
                lessons: [
                    { id: 6, title: "What is foreshortening?", duration: "8 min", type: "reading", completed: false, description: "When a hand points toward the viewer, perspective compresses it. Understand why.", practiceRefs: [] },
                    { id: 7, title: "Practice: Pointing hand", duration: "25 min", type: "practice", completed: false, description: "Draw a hand pointing straight at the viewer.", practiceRefs: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 4,
                title: "Final Project",
                lessons: [
                    { id: 8, title: "Hands holding objects", duration: "12 min", type: "reading", completed: false, description: "Gripping, pinching, cradling — real-world form follows function.", practiceRefs: [] },
                    { id: 9, title: "Final: Character hand studies", duration: "45 min", type: "practice", completed: false, description: "Draw a fist, a gentle grip, and an open gesture.", practiceRefs: ["https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg", "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800"] }
                ]
            }
        ]
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg",
        title: "Perspective 101",
        description: "Understand vanishing points and horizons for deep backgrounds.",
        progress: 0,
        difficulty: "Advanced",
        badgeText: "Vanishing Point",
        chapters: 2,
        lessons: 4,
        isFavourite: false,
        chapterData: [
            {
                id: 1,
                title: "The Horizon Line",
                lessons: [
                    { id: 1, title: "Eye level and the horizon", duration: "10 min", type: "reading", completed: false, description: "The horizon always sits at your eye level. The most important concept in perspective.", practiceRefs: [] },
                    { id: 2, title: "Practice: Simple room", duration: "20 min", type: "practice", completed: false, description: "Draw a simple room using a single horizon line.", practiceRefs: ["https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg"] }
                ]
            },
            {
                id: 2,
                title: "One-Point Perspective",
                lessons: [
                    { id: 3, title: "One vanishing point", duration: "12 min", type: "reading", completed: false, description: "All parallel lines converge at a single point on the horizon.", practiceRefs: [] },
                    { id: 4, title: "Practice: A corridor", duration: "25 min", type: "practice", completed: false, description: "Draw a straight corridor disappearing into the distance.", practiceRefs: ["https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg"] }
                ]
            }
        ]
    },
    {
        id: 4,
        image: "https://i.pinimg.com/1200x/b8/f4/fb/b8f4fb0f394beb3e8747c7a74e94e1ee.jpg",
        title: "Poses & Gestures",
        description: "Master visual story telling with expressive poses",
        progress: 15,
        difficulty: "Intermediate",
        badgeText: "The dramatic",
        chapters: 1,
        lessons: 3,
        isFavourite: true,
        chapterData: [
            {
                id: 1,
                title: "The Line of Action",
                lessons: [
                    { id: 1, title: "What is a line of action?", duration: "8 min", type: "reading", completed: true, description: "The flow of energy through the whole body — the most important concept in gesture.", practiceRefs: [] },
                    { id: 2, title: "Exaggerating the line", duration: "6 min", type: "reading", completed: false, description: "Animation artists exaggerate the line of action by 30% — learn why and how.", practiceRefs: [] },
                    { id: 3, title: "Practice: Action poses", duration: "30 min", type: "practice", completed: false, description: "Draw 5 action poses focusing only on gesture, not anatomy.", practiceRefs: ["https://i.pinimg.com/1200x/b8/f4/fb/b8f4fb0f394beb3e8747c7a74e94e1ee.jpg", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"] }
                ]
            }
        ]
    },
    {
        id: 5,
        image: "https://i.pinimg.com/736x/f8/fe/07/f8fe0719ca9a89e137b15eac43477bad.jpg",
        title: "Shading",
        description: "Understand how light works and make your drawings come to life",
        progress: 40,
        difficulty: "Advanced",
        badgeText: "Shadow Master",
        chapters: 1,
        lessons: 3,
        isFavourite: false,
        chapterData: [
            {
                id: 1,
                title: "Light Sources",
                lessons: [
                    { id: 1, title: "Types of light", duration: "10 min", type: "reading", completed: true, description: "Ambient, direct, rim, reflected — the 4 types of light that affect every subject.", practiceRefs: [] },
                    { id: 2, title: "Cast vs form shadows", duration: "8 min", type: "reading", completed: true, description: "Form shadows define shape; cast shadows define environment.", practiceRefs: [] },
                    { id: 3, title: "Practice: Sphere shading", duration: "20 min", type: "practice", completed: false, description: "Shade a sphere from three different light positions.", practiceRefs: ["https://i.pinimg.com/736x/f8/fe/07/f8fe0719ca9a89e137b15eac43477bad.jpg"] }
                ]
            }
        ]
    },
    {
        id: 6,
        image: "https://i.pinimg.com/736x/4a/c2/e3/4ac2e36e9145558243e4af967d5253e2.jpg",
        title: "Cloth",
        description: "Do you hate your life? Try this.",
        progress: 5,
        difficulty: "Advanced",
        badgeText: "Wrinkles",
        chapters: 1,
        lessons: 2,
        isFavourite: false,
        chapterData: [
            {
                id: 1,
                title: "Why Cloth Folds",
                lessons: [
                    { id: 1, title: "7 types of folds", duration: "15 min", type: "reading", completed: true, description: "Every fold in cloth is one of 7 types. Learn to identify and reproduce each one.", practiceRefs: [] },
                    { id: 2, title: "Practice: Draped cloth", duration: "25 min", type: "practice", completed: false, description: "Draw a cloth draped over a simple box shape.", practiceRefs: ["https://i.pinimg.com/736x/4a/c2/e3/4ac2e36e9145558243e4af967d5253e2.jpg"] }
                ]
            }
        ]
    },
    {
        id: 7,
        image: "https://i.pinimg.com/736x/d6/3e/e7/d63ee7a8d670c73f76074096b389176f.jpg",
        title: "Cats",
        description: "cats",
        progress: 90,
        difficulty: "Intermediate",
        badgeText: "Cats",
        chapters: 1,
        lessons: 3,
        isFavourite: true,
        chapterData: [
            {
                id: 1,
                title: "Cat Anatomy",
                lessons: [
                    { id: 1, title: "Skull and body proportions", duration: "10 min", type: "reading", completed: true, description: "Cats are mostly head and fluff. Learn the actual skeleton beneath.", practiceRefs: [] },
                    { id: 2, title: "The cat silhouette", duration: "7 min", type: "reading", completed: true, description: "A cat in silhouette is immediately recognizable. Learn the key shapes.", practiceRefs: [] },
                    { id: 3, title: "Practice: Cat poses", duration: "20 min", type: "practice", completed: false, description: "Draw 3 cats in different resting poses.", practiceRefs: ["https://i.pinimg.com/736x/d6/3e/e7/d63ee7a8d670c73f76074096b389176f.jpg"] }
                ]
            }
        ]
    },
    {
        id: 8,
        image: "https://i.pinimg.com/1200x/14/d3/06/14d3067491c3d8e38d8dd8d7667985b5.jpg",
        title: "Color theory",
        description: "Learn how to combine colors to convey emotions",
        progress: 100,
        difficulty: "Intermediate",
        badgeText: "Definitely not colorblind",
        chapters: 1,
        lessons: 2,
        isFavourite: false,
        chapterData: [
            {
                id: 1,
                title: "The Color Wheel",
                lessons: [
                    { id: 1, title: "Hue, saturation, value", duration: "12 min", type: "reading", completed: true, description: "The three axes of all color. Master these and you can mix any color you can imagine.", practiceRefs: [] },
                    { id: 2, title: "Complementary colors", duration: "8 min", type: "reading", completed: true, description: "Colors opposite on the wheel create maximum contrast and visual vibration.", practiceRefs: [] }
                ]
            }
        ]
    }
];