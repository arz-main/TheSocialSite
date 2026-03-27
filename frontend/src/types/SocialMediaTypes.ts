export interface SocialMediaContextType {
    loading: boolean;
    error: string | null;
    getSocialMedia: (userId: string) => Promise<SocialMediaDto | null>;
    createSocialMedia: (payload: SocialMediaDto) => Promise<SocialMediaDto | null>;
    updateSocialMedia: (payload: SocialMediaDto) => Promise<SocialMediaDto | null>;
    deleteSocialMedia: (userId: string) => Promise<{message:string} | null>;
}

export interface SocialMediaDto {
    userId: string;
    twitter?:    string;
    pinterest?:  string;
    deviantArt?: string;  // was deviantart
    youTube?:    string;  // was youtube
    discord?:    string;
}