export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    earned?: boolean;
    earnedDate?: string;
}

export interface Drawing {
    id: string;
    category: string;
    duration: number;
    likes: number;
    createdAt: string;
}

export interface TabsPageProps {
    badges: Badge[];
    currentUserDrawings: Drawing[];
    userDrawingImages: Record<string, string>;

    // Add these for tab control and optional upload buttons
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
    renderUploadButtons?: (tab: string) => React.ReactNode;
}