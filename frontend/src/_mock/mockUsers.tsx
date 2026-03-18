import type { User } from "../types/UserTypes";

export const mockUsers: User[] = [
    {
        id: "1",
        email: "artist@test.com",
        name: "Dan",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dansy",
        bio: "Digital artist specializing in character design and illustration. Always learning and growing!",
        location: "San Francisco, CA",
        website: "https://danart.com",
        socialLinks: {
            pinterest: "https://pinterest.com/danartist",
            x: "https://x.com/danartist",
            deviantart: "https://deviantart.com/danartist",
            youtube: "https://youtube.com/@danartist",
            discord: "danartist#1234"
        },
        followers: ["2", "3", "5", "7", "9"],
        following: ["2", "4", "6", "8"],
        postsCount: 124,
        joinedDate: "2024-01-15"
    }
];