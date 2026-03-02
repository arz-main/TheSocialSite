import type { User } from "../types/UserTypes";

export const mockUsers: User[] = [
    {
        id: "1",
        email: "artist@test.com",
        password: "artist123",
        name: "Dan",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
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
    },
    {
        id: "2",
        email: "admin@test.com",
        password: "admin123",
        name: "Denis",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        bio: "Platform administrator and art enthusiast. Here to help the community grow!",
        location: "New York, NY",
        website: "https://denisadmin.com",
        socialLinks: {
            x: "https://x.com/denisadmin",
            youtube: "https://youtube.com/@denisadmin"
        },
        followers: ["1", "3", "4", "6", "8", "10"],
        following: ["1", "5", "7", "9"],
        postsCount: 89,
        joinedDate: "2023-11-20"
    },
    {
        id: "3",
        email: "sarah@test.com",
        password: "sarah123",
        name: "Sarah Chen",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Watercolor artist and nature lover. Capturing the beauty of the world one brushstroke at a time.",
        location: "Portland, OR",
        website: "https://sarahchen.art",
        socialLinks: {
            pinterest: "https://pinterest.com/sarahchen",
            deviantart: "https://deviantart.com/sarahchen"
        },
        followers: ["1", "2", "4", "5", "6"],
        following: ["1", "2", "7", "8", "9"],
        postsCount: 203,
        joinedDate: "2024-02-10"
    },
    {
        id: "4",
        email: "james@test.com",
        password: "james123",
        name: "James Wilson",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        bio: "3D artist and animator. Creating worlds and characters that tell stories.",
        location: "Los Angeles, CA",
        socialLinks: {
            youtube: "https://youtube.com/@jameswilson",
            x: "https://x.com/jameswilson3d",
            discord: "james3d#5678"
        },
        followers: ["2", "3", "5", "7"],
        following: ["1", "2", "3", "6", "8"],
        postsCount: 156,
        joinedDate: "2023-12-05"
    },
    {
        id: "5",
        email: "emily@test.com",
        password: "emily123",
        name: "Emily Rodriguez",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        bio: "Concept artist for games and film. Passionate about creating immersive environments.",
        location: "Austin, TX",
        website: "https://emilyrodriguez.art",
        socialLinks: {
            pinterest: "https://pinterest.com/emilyart",
            deviantart: "https://deviantart.com/emilyrodriguez",
            x: "https://x.com/emilyart"
        },
        followers: ["1", "3", "4", "6", "8", "9"],
        following: ["1", "2", "4", "7"],
        postsCount: 178,
        joinedDate: "2024-01-22"
    },
    {
        id: "6",
        email: "alex@test.com",
        password: "alex123",
        name: "Alex Kim",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexK",
        bio: "Manga and anime style illustrator. Bringing characters to life with emotion and detail.",
        location: "Seattle, WA",
        socialLinks: {
            deviantart: "https://deviantart.com/alexkim",
            youtube: "https://youtube.com/@alexkim",
            discord: "alexkim#9012"
        },
        followers: ["2", "3", "5", "7", "10"],
        following: ["1", "4", "5", "8", "9"],
        postsCount: 267,
        joinedDate: "2023-10-15"
    },
    {
        id: "7",
        email: "olivia@test.com",
        password: "olivia123",
        name: "Olivia Martinez",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
        bio: "Traditional and digital portrait artist. Every face tells a story.",
        location: "Miami, FL",
        website: "https://oliviamartinez.art",
        socialLinks: {
            pinterest: "https://pinterest.com/oliviaart",
            x: "https://x.com/oliviaartist"
        },
        followers: ["1", "4", "6", "8", "9"],
        following: ["1", "2", "3", "5", "10"],
        postsCount: 145,
        joinedDate: "2024-03-01"
    },
    {
        id: "8",
        email: "noah@test.com",
        password: "noah123",
        name: "Noah Brown",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
        bio: "Pixel artist and game designer. Retro aesthetics with modern techniques.",
        location: "Boston, MA",
        socialLinks: {
            x: "https://x.com/noahpixel",
            youtube: "https://youtube.com/@noahpixel",
            discord: "noahpixel#3456"
        },
        followers: ["1", "2", "5", "6", "7"],
        following: ["1", "3", "4", "6", "9"],
        postsCount: 198,
        joinedDate: "2023-09-18"
    },
    {
        id: "9",
        email: "sophia@test.com",
        password: "sophia123",
        name: "Sophia Lee",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
        bio: "Abstract and surreal digital artist. Exploring the boundaries of imagination.",
        location: "Chicago, IL",
        website: "https://sophialee.art",
        socialLinks: {
            pinterest: "https://pinterest.com/sophialee",
            deviantart: "https://deviantart.com/sophialee",
            youtube: "https://youtube.com/@sophialee"
        },
        followers: ["1", "3", "5", "7", "8", "10"],
        following: ["2", "4", "6", "8"],
        postsCount: 134,
        joinedDate: "2024-02-28"
    },
    {
        id: "10",
        email: "liam@test.com",
        password: "liam123",
        name: "Liam Taylor",
        role: "artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
        bio: "Comic book artist and storyteller. Creating adventures one panel at a time.",
        location: "Denver, CO",
        socialLinks: {
            deviantart: "https://deviantart.com/liamtaylor",
            x: "https://x.com/liamcomics",
            discord: "liamcomics#7890"
        },
        followers: ["2", "6", "9"],
        following: ["1", "3", "5", "7", "8"],
        postsCount: 167,
        joinedDate: "2023-11-30"
    }
];

export function findUser(email: string, password: string): User | null {
    return mockUsers.find(
        (u) => u.email === email && u.password === password
    ) ?? null;
}

export function getUserById(id: string): User | null {
    return mockUsers.find(u => u.id === id) ?? null;
}

export function toggleFollow(currentUserId: string, targetUserId: string): void {
    const currentUser = getUserById(currentUserId);
    const targetUser = getUserById(targetUserId);

    if (!currentUser || !targetUser) return;

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
    }
}