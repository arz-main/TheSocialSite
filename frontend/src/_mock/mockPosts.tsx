
export interface Drawing {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  referenceUrl?: string;
  category: string;
  duration: number;
  createdAt: string;
  likes: number;
  showWithReference: boolean;
}
export const currentUserDrawings: Drawing[] = [
  {
    id: "1",
    userId: "current",
    username: "You",
    imageUrl: "figure-sketch-practice",
    referenceUrl: "figure-reference-pose",
    category: "Figure Drawing",
    duration: 300,
    createdAt: "2026-02-09T10:30:00",
    likes: 24,
    showWithReference: true,
  },
  {
    id: "2",
    userId: "current",
    username: "You",
    imageUrl: "hand-study-sketch",
    category: "Hands",
    duration: 120,
    createdAt: "2026-02-09T09:15:00",
    likes: 18,
    showWithReference: false,
  },
  {
    id: "3",
    userId: "current",
    username: "You",
    imageUrl: "still-life-drawing",
    referenceUrl: "still-life-objects",
    category: "Still Life",
    duration: 600,
    createdAt: "2026-02-08T14:20:00",
    likes: 31,
    showWithReference: true,
  },
];

export const exploreDrawings: Drawing[] = [
  {
    id: "e1",
    userId: "user1",
    username: "ArtistSarah",
    imageUrl: "portrait-sketch-woman",
    referenceUrl: "portrait-reference-woman",
    category: "Portraits",
    duration: 900,
    createdAt: "2026-02-09T08:00:00",
    likes: 156,
    showWithReference: true,
  },
  {
    id: "e2",
    userId: "user2",
    username: "DrawMaster99",
    imageUrl: "dynamic-fight-pose",
    category: "Fights",
    duration: 420,
    createdAt: "2026-02-09T07:30:00",
    likes: 203,
    showWithReference: false,
  },
  {
    id: "e3",
    userId: "user3",
    username: "SketchyAlex",
    imageUrl: "hand-gesture-study",
    referenceUrl: "hand-gesture-reference",
    category: "Hands",
    duration: 180,
    createdAt: "2026-02-08T16:45:00",
    likes: 89,
    showWithReference: true,
  },
  {
    id: "e4",
    userId: "user4",
    username: "PencilPro",
    imageUrl: "figure-gesture-drawing",
    category: "Figure Drawing",
    duration: 240,
    createdAt: "2026-02-08T15:20:00",
    likes: 142,
    showWithReference: false,
  },
  {
    id: "e5",
    userId: "user5",
    username: "ArtByEmma",
    imageUrl: "detailed-still-life",
    referenceUrl: "still-life-setup",
    category: "Still Life",
    duration: 1200,
    createdAt: "2026-02-08T12:00:00",
    likes: 267,
    showWithReference: true,
  },
  {
    id: "e6",
    userId: "user6",
    username: "QuickSketch",
    imageUrl: "action-pose-sketch",
    category: "Fights",
    duration: 300,
    createdAt: "2026-02-08T10:30:00",
    likes: 178,
    showWithReference: false,
  },
];

export const referenceCategories = [
  { id: "figure", name: "Figure Drawing", icon: "👤" },
  { id: "hands", name: "Hands", icon: "✋" },
  { id: "still-life", name: "Still Life", icon: "🏺" },
  { id: "fights", name: "Fights", icon: "🥊" },
  { id: "portraits", name: "Portraits", icon: "👨" },
  { id: "animals", name: "Animals", icon: "🦁" },
];
