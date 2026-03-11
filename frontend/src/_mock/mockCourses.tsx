export interface Course {
    id: number;
    image: string;
    title: string;
    description: string;
    progress: number;
    badgeText?: string;
}

export const MOCK_COURSES: Course[] = [
    {
        id: 1,
        image: "https://i.pinimg.com/1200x/3e/d7/7c/3ed77cc29615bd91da4acd63eb870076.jpg",
        title: "Eyes from any angle",
        description: "Learn to draw expressive eyes from any angle, master shapes and expression",
        progress: 65,
        badgeText: "Side Eye",
    },
    {
        id: 2,
        image: "https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg",
        title: "Mastering Hands",
        description: "The ultimate guide to drawing fingers, palms, and gestures.",
        progress: 10,
        badgeText: "Broken Fingers",
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg",
        title: "Perspective 101",
        description: "Understand vanishing points and horizons for deep backgrounds.",
        progress: 0,
        badgeText: "Vanishing Point",
    },
    {
        id: 3,
        image: "https://i.pinimg.com/1200x/b8/f4/fb/b8f4fb0f394beb3e8747c7a74e94e1ee.jpg",
        title: "Poses & Gestures",
        description: "Master visual story telling with expressive poses",
        progress: 15,
        badgeText: "The dramatic",
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/f8/fe/07/f8fe0719ca9a89e137b15eac43477bad.jpg",
        title: "Shading",
        description: "Understand how light works and make your drawings come to life",
        progress: 40,
    }
];