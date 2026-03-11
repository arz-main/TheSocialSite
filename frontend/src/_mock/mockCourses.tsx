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
}

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
        isFavourite: true
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
        lessons: 15,
        isFavourite: false
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg",
        title: "Perspective 101",
        description: "Understand vanishing points and horizons for deep backgrounds.",
        progress: 0,
        difficulty: "Advanced",
        badgeText: "Vanishing Point",
        chapters: 6,
        lessons: 25,
        isFavourite: false
    },
    {
        id: 4,
        image: "https://i.pinimg.com/1200x/b8/f4/fb/b8f4fb0f394beb3e8747c7a74e94e1ee.jpg",
        title: "Poses & Gestures",
        description: "Master visual story telling with expressive poses",
        progress: 15,
        difficulty: "Intermediate",
        badgeText: "The dramatic",
        chapters: 5,
        lessons: 18,
        isFavourite: true
    },
    {
        id: 5,
        image: "https://i.pinimg.com/736x/f8/fe/07/f8fe0719ca9a89e137b15eac43477bad.jpg",
        title: "Shading",
        description: "Understand how light works and make your drawings come to life",
        progress: 40,
        difficulty: "Advanced",
        badgeText: "Shadow Master",
        chapters: 4,
        lessons: 12,
        isFavourite: false
    },
    {
        id: 6,
        image: "https://i.pinimg.com/736x/4a/c2/e3/4ac2e36e9145558243e4af967d5253e2.jpg",
        title: "Cloth",
        description: "Do you hate your life? Try this.",
        progress: 5,
        difficulty: "Advanced",
        badgeText: "Wrincles",
        chapters: 3,
        lessons: 16,
        isFavourite: false
    },
    {
        id: 7,
        image: "https://i.pinimg.com/736x/d6/3e/e7/d63ee7a8d670c73f76074096b389176f.jpg",
        title: "Cats",
        description: "cats",
        progress: 90,
        difficulty: "Intermediate",
        badgeText: "Cats",
        chapters: 5,
        lessons: 25,
        isFavourite: true
    },
    {
        id: 8,
        image: "https://i.pinimg.com/1200x/14/d3/06/14d3067491c3d8e38d8dd8d7667985b5.jpg",
        title: "Color theory",
        description: "Learn how to combine colors to convey emotions",
        progress: 100,
        difficulty: "Intermediate",
        badgeText: "Definetely not colorblind",
        chapters: 7,
        lessons: 32,
        isFavourite: false
    }
];