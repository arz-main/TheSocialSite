import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AxiosProvider } from './providers/AxiosProvider.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { PostsProvider } from './providers/PostsProvider.tsx';
import { UsersProvider } from './providers/UsersProvider.tsx';
import { SignalRProvider } from './providers/SignalRProvider.tsx';
import { SocialMediaProvider } from './providers/SocialMediaProvider.tsx';
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <AxiosProvider>
                    <SignalRProvider>
                        <AuthProvider>
                            <UsersProvider>
                                <PostsProvider>
                                    <SocialMediaProvider>
                                        <App />
                                    </SocialMediaProvider>
                                </PostsProvider>
                            </UsersProvider>
                        </AuthProvider>
                    </SignalRProvider>
                </AxiosProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
)