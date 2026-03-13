export interface LessonSection {
    type: 'text' | 'image' | 'tip' | 'callout' | 'example' | 'steps';
    heading?: string;
    body?: string;
    src?: string;
    caption?: string;
    steps?: string[];
    items?: string[];
}

export interface Lesson {
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'practice';
    completed: boolean;
    description: string;
    practiceRefs?: string[];

    content?: LessonSection[];
    videoUrl?: string;
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
                        ],
                        content: [
                            { type: 'text', heading: 'Overview', body: 'The eye is the most expressive feature on a human face. Before you can draw a convincing eye from imagination, you need to understand its real structure — not as a flat shape, but as a three-dimensional sphere partially covered by two fleshy lids.' },
                            { type: 'image', src: 'https://i.pinimg.com/1200x/3e/d7/7c/3ed77cc29615bd91da4acd63eb870076.jpg', caption: 'Study the way the upper lid casts a shadow over the iris.' },
                            { type: 'text', heading: 'The Eyeball Is a Sphere', body: 'Beginners draw the eye as a flat almond shape. The reality is that both lids wrap around a sphere. This is why the upper lid has a pronounced curve and the lower lid is flatter — they follow different parts of the sphere\'s surface.' },
                            { type: 'steps', heading: 'Key Structures to Know', steps: ['The iris — a coloured disk that sits on the front of the sphere', 'The pupil — a hole in the iris that dilates and contracts', 'The upper eyelid — thicker, more curved, casts a shadow on the iris', 'The lower eyelid — thinner, flatter, usually catches light', 'The tear duct — the inner corner, often pink and fleshy', 'The waterline — the inner wet rim of each lid'] },
                            { type: 'tip', body: 'Always draw the full circle of the iris first, then place the lids over it. This keeps the eye from looking flat.' },
                            { type: 'text', heading: 'Eyelid Thickness', body: 'Both lids have real thickness — roughly 3–5mm. The upper lid edge is what you see when you look at someone front-on. Draw it as a slightly rounded rectangle, not a sharp line. This single change makes eyes look three-dimensional instantly.' },
                            { type: 'callout', heading: 'Common mistake', body: 'Drawing the iris as a perfect circle. In most poses, part of the iris is hidden under the upper lid. A fully visible iris looks startled or unnatural.' },
                            { type: 'image', src: 'https://i.pinimg.com/736x/36/2f/9f/362f9f89fd8e49c0c7de1d4145d2f143.jpg', caption: 'Notice how the iris is partially covered by the upper lid in a relaxed expression.' },
                            { type: 'example', heading: 'What to study next', body: 'Before moving to angles, copy 10 eyes from photo reference. Focus only on the shapes — ignore shading for now. Pay attention to where the lids intersect the iris.' },
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
                    {
                        id: 1,
                        title: "Blocking in the palm",
                        duration: "10 min",
                        type: "reading",
                        completed: true,
                        description: "Simplify the hand as a flat box first. This foundational step prevents the most common mistakes.",
                        practiceRefs: ["https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg"],
                        content: [
                            { type: 'text', heading: 'Why Hands Are Hard', body: 'Hands are one of the most complex subjects in figure drawing. They have 27 bones, 29 joints, and can form thousands of distinct shapes. The key to drawing them well is aggressive simplification — treat them as simple forms first, details second.' },
                            { type: 'image', src: 'https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg', caption: 'Block the palm as a rectangular wedge before adding fingers.' },
                            { type: 'text', heading: 'The Palm as a Box', body: 'Start every hand drawing with a simple 3D box for the palm. This box should be slightly tapered — wider at the knuckles, narrower at the wrist. The depth of the box should be roughly half its width.' },
                            { type: 'steps', heading: 'The 3-Block Method', steps: ['Draw a flat trapezoid for the palm (wider at top)', 'Add a small wedge for the base of the thumb on the side', 'Attach 4 cylinders of varying lengths for the fingers', 'Add the thumb as a shorter, wider cylinder at an angle'] },
                            { type: 'tip', body: 'The middle finger is the longest and sets the angle of the knuckle line. All other fingers relate back to it.' },
                            { type: 'callout', heading: 'The biggest mistake', body: 'Starting with individual fingers instead of the palm. Without the palm block, fingers end up at wrong angles and wrong lengths every time.' },
                        ]
                    },
                    {
                        id: 2,
                        title: "Finger proportions",
                        duration: "7 min",
                        type: "reading",
                        completed: false,
                        description: "Each finger has three phalanges. Learn their relative lengths and how they taper.",
                        content: [
                            { type: 'text', heading: 'The Three Segments', body: 'Every finger (except the thumb) has three bones called phalanges: proximal (closest to palm), middle, and distal (the tip). They decrease in length as they go outward, following a ratio of roughly 3:2:1.5.' },
                            { type: 'steps', heading: 'Proportions to memorise', steps: ['Index finger: reaches just past the top of the middle finger\'s nail', 'Middle finger: the longest, sets the height of the knuckle arc', 'Ring finger: same height as the index finger, or slightly shorter', 'Pinky: its tip reaches the top crease of the ring finger'] },
                            { type: 'tip', body: 'The knuckles form a gentle arc, not a straight line. The middle knuckle is highest. When drawing a fist, this arc is the most important line to get right.' },
                            { type: 'text', heading: 'Tapering', body: 'Fingers are widest at the knuckle and taper toward the tip. Each segment is slightly narrower than the one before it. Ignoring this taper makes hands look like sausages.' },
                            { type: 'callout', heading: 'Observation exercise', body: 'Hold your own hand up and look at it sideways. Notice how dramatically the fingers taper — and how the nails sit on top of a rounded form, not a flat surface.' },
                        ]
                    },
                    { id: 3, title: "Practice: Relaxed open hand", duration: "20 min", type: "practice", completed: false, description: "Draw a relaxed open hand using the reference images provided.", practiceRefs: ["https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 2,
                title: "Gesture & Movement",
                lessons: [
                    {
                        id: 4,
                        title: "The flow line of a hand",
                        duration: "9 min",
                        type: "reading",
                        completed: false,
                        description: "Every gesture has a dominant curve running from wrist to fingertip. Learn to find and exaggerate it.",
                        content: [
                            { type: 'text', heading: 'What is a Flow Line?', body: 'A flow line is an imaginary curve that captures the overall direction and energy of a gesture. In the hand, it usually runs from the wrist, through the palm, and out through the longest finger. Finding this line first gives your drawing life before you add any structure.' },
                            { type: 'tip', body: 'Before drawing anything, ask: what is this hand doing? A reaching hand flows forward. A relaxed hand drops. A gripping hand curls inward. The flow line should answer that question.' },
                            { type: 'steps', heading: 'How to Use It', steps: ['Draw the flow line as a single curved stroke (2 seconds maximum)', 'Place the palm block along this line', 'Let the fingers continue the flow rather than interrupting it', 'Exaggerate the curve by 20–30% — it always reads as more natural'] },
                            { type: 'callout', heading: 'Why exaggeration works', body: 'The camera flattens curves. Our eye expects more movement than a photo shows. Exaggerating the flow line compensates for this and makes drawings feel alive.' },
                        ]
                    },
                    { id: 5, title: "Practice: 5 gesture hands", duration: "30 min", type: "practice", completed: false, description: "Draw 5 different hand gestures focusing purely on movement.", practiceRefs: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 3,
                title: "Foreshortening",
                lessons: [
                    {
                        id: 6,
                        title: "What is foreshortening?",
                        duration: "8 min",
                        type: "reading",
                        completed: false,
                        description: "When a hand points toward the viewer, perspective compresses it. Understand why.",
                        content: [
                            { type: 'text', heading: 'Perspective on a Small Scale', body: 'Foreshortening is what happens when a form points directly at the viewer. The far end appears smaller, the near end larger, and the whole form appears compressed. On a hand, this means a pointing finger can look shorter than the thumb.' },
                            { type: 'image', src: 'https://i.pinimg.com/736x/cf/bf/72/cfbf72e3e4a8cdefca0e943f22ff13e1.jpg', caption: 'The finger pointing at the viewer appears as overlapping ellipses rather than a long tube.' },
                            { type: 'steps', heading: 'Drawing Foreshortened Fingers', steps: ['Think of each finger segment as a short cylinder', 'A cylinder pointing at you looks like a circle (or ellipse)', 'Stack these overlapping ellipses to build the foreshortened finger', 'Add the nail as a flattened ellipse at the front'] },
                            { type: 'tip', body: 'Use overlap aggressively. When one knuckle overlaps the next, the viewer\'s brain reads depth. Without overlap, foreshortened hands look flat.' },
                        ]
                    },
                    { id: 7, title: "Practice: Pointing hand", duration: "25 min", type: "practice", completed: false, description: "Draw a hand pointing straight at the viewer.", practiceRefs: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"] }
                ]
            },
            {
                id: 4,
                title: "Final Project",
                lessons: [
                    {
                        id: 8,
                        title: "Hands holding objects",
                        duration: "12 min",
                        type: "reading",
                        completed: false,
                        description: "Gripping, pinching, cradling — real-world form follows function.",
                        content: [
                            { type: 'text', heading: 'Form Follows Function', body: 'When a hand holds something, every finger adapts to the object\'s shape. A hand gripping a cylinder curves around it. A hand pinching a thin object brings only the thumb and index together. Drawing hands in context is far easier than drawing them in isolation because the object tells you where each finger goes.' },
                            { type: 'steps', heading: 'Types of Grip', steps: ['Power grip: fingers wrap fully around an object (bat, handle)', 'Precision grip: only thumb and index/middle contact the object (pen, card)', 'Hook grip: fingers curl like hooks, thumb is uninvolved (bag handle)', 'Cradle: palm opens to support a flat object (phone, book)'] },
                            { type: 'tip', body: 'Always draw the object first, then wrap the hand around it. Never try to draw the hand and then fit the object in.' },
                            { type: 'callout', heading: 'The negative space trick', body: 'Look at the shapes between the fingers, not the fingers themselves. When those negative shapes look right, the hand usually does too.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "Eye level and the horizon",
                        duration: "10 min",
                        type: "reading",
                        completed: false,
                        description: "The horizon always sits at your eye level. The most important concept in perspective.",
                        content: [
                            { type: 'text', heading: 'The Most Important Line in Perspective', body: 'The horizon line is not just where the sky meets the earth — it is your eye level. Everything you see is organized above or below this line, and understanding it is the foundation of every perspective system ever invented.' },
                            { type: 'steps', heading: 'Rules of the Horizon', steps: ['Objects above your eye level have their bottoms visible (you look up at them)', 'Objects below your eye level have their tops visible (you look down at them)', 'Objects at your eye level show neither top nor bottom face', 'Moving your eye level up makes you feel tall; moving it down makes you feel small'] },
                            { type: 'image', src: 'https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg', caption: 'A low horizon line creates a dramatic, imposing sense of scale.' },
                            { type: 'tip', body: 'Always draw the horizon line first, before any objects. It sets the entire spatial relationship of your scene.' },
                            { type: 'callout', heading: 'Artistic choice', body: 'The position of your horizon line is one of the most powerful compositional decisions you make. A low horizon (worm\'s eye) is dramatic and heroic. A high horizon (bird\'s eye) is analytical and omniscient.' },
                        ]
                    },
                    { id: 2, title: "Practice: Simple room", duration: "20 min", type: "practice", completed: false, description: "Draw a simple room using a single horizon line.", practiceRefs: ["https://i.pinimg.com/736x/0b/03/f4/0b03f4bb9ab0211fddc4e5a78042b43a.jpg"] }
                ]
            },
            {
                id: 2,
                title: "One-Point Perspective",
                lessons: [
                    {
                        id: 3,
                        title: "One vanishing point",
                        duration: "12 min",
                        type: "reading",
                        completed: false,
                        description: "All parallel lines converge at a single point on the horizon.",
                        content: [
                            { type: 'text', heading: 'Convergence', body: 'In one-point perspective, all lines that go away from you converge to a single point on the horizon line. Lines that run left-right stay horizontal. Lines that run up-down stay vertical. This system works perfectly for scenes where you are looking straight ahead at the subject.' },
                            { type: 'steps', heading: 'Drawing in One-Point Perspective', steps: ['Place your vanishing point somewhere on the horizon line', 'Draw all "depth" edges as lines radiating from this point', 'Draw all "width" edges as horizontal lines', 'Draw all "height" edges as vertical lines', 'The vanishing point controls where the viewer is looking'] },
                            { type: 'tip', body: 'One-point perspective works best for corridors, roads, and rooms viewed head-on. For anything at an angle, you\'ll need two-point.' },
                            { type: 'example', heading: 'Classic uses', body: 'The classic uses of one-point perspective are hallways, train tracks, and city streets viewed from the middle. All share the quality of drawing the viewer\'s eye toward a central focal point — which is also why it\'s so useful for creating a sense of depth and mystery.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "What is a line of action?",
                        duration: "8 min",
                        type: "reading",
                        completed: true,
                        description: "The flow of energy through the whole body — the most important concept in gesture.",
                        content: [
                            { type: 'text', heading: 'Gesture vs. Anatomy', body: 'Most beginners learn anatomy first — muscles, bones, proportions. But the most expressive drawings aren\'t the most anatomically accurate ones. They\'re the ones with the strongest gesture. Gesture is the feeling of movement and energy in a pose. The line of action is how you capture it.' },
                            { type: 'image', src: 'https://i.pinimg.com/1200x/b8/f4/fb/b8f4fb0f394beb3e8747c7a74e94e1ee.jpg', caption: 'A strong diagonal line of action creates immediate energy.' },
                            { type: 'text', heading: 'What It Is', body: 'The line of action is a single curved or diagonal line that runs through the whole figure — from the top of the head down through the spine, hips, and into the legs. It captures the dominant direction of the pose in one stroke. A vertical line of action reads as static and stable. A diagonal line reads as dynamic and energetic.' },
                            { type: 'tip', body: 'Draw the line of action before anything else. It should take less than 2 seconds. If it takes longer, you\'re already thinking too much.' },
                            { type: 'steps', heading: 'How to Find It', steps: ['Look at the whole figure — don\'t focus on any one part', 'Find the spine\'s curve — that\'s usually the line', 'In extreme poses, the line may run from hand to foot through the torso', 'Simplify it to one clean curve or diagonal'] },
                            { type: 'callout', heading: 'The S-curve', body: 'The most expressive line of action is the S-curve. It appears in contrapposto poses, walking figures, and any pose with a weight shift. The S-curve creates rhythm and the feeling that the figure is alive.' },
                        ]
                    },
                    {
                        id: 2,
                        title: "Exaggerating the line",
                        duration: "6 min",
                        type: "reading",
                        completed: false,
                        description: "Animation artists exaggerate the line of action by 30% — learn why and how.",
                        content: [
                            { type: 'text', heading: 'Why Realism Falls Flat', body: 'When you copy a photo exactly, the result often looks stiff and lifeless. This is because photos freeze a moment in time — they capture the position of a pose, not the energy. The viewer\'s eye expects more movement than reality provides.' },
                            { type: 'tip', body: 'A common rule at animation studios: "If the reference looks good at 100%, draw it at 130%." This applies directly to gesture drawing.' },
                            { type: 'steps', heading: 'How to Exaggerate', steps: ['Find the dominant curve in your line of action', 'Push the curve further — make it 30% more curved than the reference', 'Tilt the hips and shoulders more than what you see', 'Let the head and feet be the extremes of a longer, more dramatic arc'] },
                            { type: 'callout', heading: 'Knowing when to stop', body: 'Exaggeration can tip into caricature. The goal is to amplify the feeling of the pose, not distort it beyond recognition. If the pose starts to look funny when you intended dramatic, pull back slightly.' },
                            { type: 'example', heading: 'Test your exaggeration', body: 'Show your drawing and the reference side by side to someone who hasn\'t seen them. Ask which one feels more energetic. If they say "the same," you haven\'t exaggerated enough.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "Types of light",
                        duration: "10 min",
                        type: "reading",
                        completed: true,
                        description: "Ambient, direct, rim, reflected — the 4 types of light that affect every subject.",
                        content: [
                            { type: 'text', heading: 'Light Makes Form', body: 'Drawing is really just communicating where the light is and where it isn\'t. Without shading, even a perfectly proportioned figure looks flat. With good shading, even a simple stick figure can feel three-dimensional.' },
                            { type: 'steps', heading: 'The 4 Types of Light', steps: ['Direct light: the main light source, creates the brightest highlight and most defined terminator', 'Ambient light: general environmental light with no specific direction, fills shadow areas softly', 'Rim/back light: comes from behind, creates a bright edge that separates subject from background', 'Reflected light: bounces off nearby surfaces into shadow areas, keeps shadows from going completely black'] },
                            { type: 'image', src: 'https://i.pinimg.com/736x/f8/fe/07/f8fe0719ca9a89e137b15eac43477bad.jpg', caption: 'Strong direct light with clear ambient fill gives maximum three-dimensionality.' },
                            { type: 'tip', body: 'The terminator is the edge between light and shadow. A sharp terminator suggests a hard light source (sun, spotlight). A soft terminator suggests a diffuse source (overcast sky, studio softbox). Getting this right is more important than any other shading detail.' },
                            { type: 'callout', heading: 'One light source first', body: 'Start every shading study with a single light source from one clear direction. Adding complexity before you understand the basics creates muddy, confusing shading.' },
                        ]
                    },
                    {
                        id: 2,
                        title: "Cast vs form shadows",
                        duration: "8 min",
                        type: "reading",
                        completed: true,
                        description: "Form shadows define shape; cast shadows define environment.",
                        content: [
                            { type: 'text', heading: 'Two Kinds of Dark', body: 'Every shadow in a drawing falls into one of two categories: form shadows and cast shadows. Confusing the two is one of the main reasons shading goes wrong. They have different shapes, different edges, and different purposes.' },
                            { type: 'steps', heading: 'Form Shadow vs Cast Shadow', steps: ['Form shadow: the shadow on the object itself where light doesn\'t reach. Its shape follows the contour of the form.', 'Cast shadow: the shadow an object throws onto another surface. Its shape is determined by the light source direction and the object\'s silhouette.'] },
                            { type: 'tip', body: 'Form shadows have soft edges. Cast shadows have hard edges closest to the object and soften as they move away. Using the wrong edge type is immediately noticeable.' },
                            { type: 'callout', heading: 'The contact shadow', body: 'The darkest part of a cast shadow is right at the base of the object, where it touches the surface. This is also called the contact shadow. It grounds objects and makes them feel like they are actually resting on a surface.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "7 types of folds",
                        duration: "15 min",
                        type: "reading",
                        completed: true,
                        description: "Every fold in cloth is one of 7 types. Learn to identify and reproduce each one.",
                        content: [
                            { type: 'text', heading: 'Cloth Follows Physics', body: 'Cloth is not random. Every fold happens for a physical reason — gravity pulling it down, a limb pushing it out, tension pulling it taut. Once you understand why folds form, you can invent them convincingly without reference.' },
                            { type: 'steps', heading: 'The 7 Fold Types', steps: ['Pipe fold: fabric hangs from a single point, creates parallel tubes', 'Diaper fold: fabric hangs from two points, creates a V-shape between them', 'Spiral fold: wraps around a cylindrical limb (sleeve around an arm)', 'Half-lock fold: appears at bent joints like knees and elbows', 'Falling fold: fabric falls over a ledge or edge', 'Inert fold: fabric is piled on a flat surface with no tension', 'Drop fold: hangs from multiple points, combines pipe and diaper elements'] },
                            { type: 'image', src: 'https://i.pinimg.com/736x/4a/c2/e3/4ac2e36e9145558243e4af967d5253e2.jpg', caption: 'The half-lock fold at the elbow is one of the most commonly misdrawn folds.' },
                            { type: 'tip', body: 'When in doubt, look for the tension points — where the fabric is being pulled or pinched. Folds always flow away from tension points.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "Skull and body proportions",
                        duration: "10 min",
                        type: "reading",
                        completed: true,
                        description: "Cats are mostly head and fluff. Learn the actual skeleton beneath.",
                        content: [
                            { type: 'text', heading: 'Cats are Deceptive', body: 'A cat looks much larger than it is because of fur. Beneath all that fluff, the skeleton is remarkably slender and compact. Understanding the real proportions — not the fluffy appearance — is key to drawing cats that look convincing even in unusual poses.' },
                            { type: 'steps', heading: 'Key Proportions', steps: ['The head is a nearly perfect sphere', 'The torso is roughly 2.5 head-lengths long', 'The legs are relatively short — cats are close to the ground', 'The neck is short and thick relative to the head size'] },
                            { type: 'image', src: 'https://i.pinimg.com/736x/d6/3e/e7/d63ee7a8d670c73f76074096b389176f.jpg', caption: 'Study the underlying structure — especially how the haunches connect to the spine.' },
                            { type: 'tip', body: 'Draw cats as simple forms: a circle for the head, an egg for the torso, cylinders for the legs. Only add fur texture at the very end.' },
                        ]
                    },
                    {
                        id: 2,
                        title: "The cat silhouette",
                        duration: "7 min",
                        type: "reading",
                        completed: true,
                        description: "A cat in silhouette is immediately recognizable. Learn the key shapes.",
                        content: [
                            { type: 'text', heading: 'Silhouette Readability', body: 'A well-drawn cat should be immediately recognizable as a cat in pure silhouette, with no interior details. This is the test of good character design and animal drawing alike. The key features that make a cat silhouette read correctly are the triangular ears, the high haunches, and the long tail.' },
                            { type: 'steps', heading: 'Critical Silhouette Features', steps: ['Triangular ears placed wide and slightly to the sides of the skull', 'Round, wide cranium — wider than the muzzle', 'The haunches (back legs) sit higher than the shoulders in a standing cat', 'Long tail, roughly the same length as the torso'] },
                            { type: 'tip', body: 'After drawing a cat, squint at your drawing until it blurs. If you can still tell it\'s a cat, the silhouette is working.' },
                        ]
                    },
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
                    {
                        id: 1,
                        title: "Hue, saturation, value",
                        duration: "12 min",
                        type: "reading",
                        completed: true,
                        description: "The three axes of all color. Master these and you can mix any color you can imagine.",
                        content: [
                            { type: 'text', heading: 'The Three Dimensions of Color', body: 'Every color that exists can be described using three values: hue, saturation, and value (HSV). Understanding each one separately — and how they interact — gives you complete control over your color choices.' },
                            { type: 'steps', heading: 'HSV Explained', steps: ['Hue: the color itself — red, yellow, green, blue, purple. Position on the color wheel.', 'Saturation: the intensity of the color. 100% saturation is pure color; 0% is grey.', 'Value: how light or dark the color is. 100% value is white; 0% is black.'] },
                            { type: 'tip', body: 'Most beginners think about color only in terms of hue. The most sophisticated color decisions are actually about saturation and value, which control mood and readability far more than hue does.' },
                            { type: 'callout', heading: 'Value does the heavy lifting', body: 'If you convert a great painting to greyscale, it usually still looks great. This is because strong value structure is the foundation of good color work. Hue is secondary.' },
                        ]
                    },
                    {
                        id: 2,
                        title: "Complementary colors",
                        duration: "8 min",
                        type: "reading",
                        completed: true,
                        description: "Colors opposite on the wheel create maximum contrast and visual vibration.",
                        content: [
                            { type: 'text', heading: 'Opposites Attract', body: 'Complementary colors are any two hues directly opposite each other on the color wheel. Red and green. Blue and orange. Purple and yellow. When placed next to each other, they create maximum visual contrast and a vibration effect where they seem to compete for attention.' },
                            { type: 'steps', heading: 'Practical Complementary Pairs', steps: ['Red / Cyan-green — common in Christmas palettes and stop signs', 'Blue / Orange — the most popular complementary scheme in cinema (sky and skin tones)', 'Purple / Yellow — dramatic, mysterious; think sunsets and fantasy art', 'Red-orange / Blue-green — warm/cool split, very common in illustration'] },
                            { type: 'image', src: 'https://i.pinimg.com/1200x/14/d3/06/14d3067491c3d8e38d8dd8d7667985b5.jpg', caption: 'Notice the warm/cool complementary split creating depth in this palette.' },
                            { type: 'tip', body: 'Don\'t use complementary colors at equal saturation and equal area — one should dominate, the other accent. A ratio of roughly 70/30 or 80/20 creates harmony rather than visual chaos.' },
                        ]
                    }
                ]
            }
        ]
    }
];