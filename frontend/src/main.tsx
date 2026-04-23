import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AxiosProvider } from './providers/AxiosProvider.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { PostsProvider } from './providers/PostsProvider.tsx';
import { UsersProvider } from './providers/UsersProvider.tsx';
import { SocialMediaProvider } from './providers/SocialMediaProvider.tsx';
import { ThemeProvider } from "next-themes";
import { CommentsProvider } from './providers/CommentsProvider.tsx';
import { BadgeTemplatesProvider } from './providers/BadgeTemplatesProvider.tsx';
import { AwardedBadgesProvider } from './providers/AwardedBadgesProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BrowserRouter>
                <AxiosProvider>
                    <AuthProvider>
                        <CommentsProvider>
                            <UsersProvider>
                                <PostsProvider>
                                    <SocialMediaProvider>
                                        <AwardedBadgesProvider>
                                            <BadgeTemplatesProvider>
                                                <App />
                                            </BadgeTemplatesProvider>
                                        </AwardedBadgesProvider>
                                    </SocialMediaProvider>
                                </PostsProvider>
                            </UsersProvider>
                        </CommentsProvider>
                    </AuthProvider>
                </AxiosProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
)