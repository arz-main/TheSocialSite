import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AxiosProvider } from './axios/AxiosProvider.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { PostProvider } from './context/PostContext.tsx';
import { UsersProvider } from './context/UsersContext.tsx';
import App from './App.tsx';
import './index.css';
import { SignalRProvider } from './signalR/SignalRProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AxiosProvider>
                <SignalRProvider>
                    <AuthProvider>
                        <UsersProvider>
                            <PostProvider>
                                <App />
                            </PostProvider>
                        </UsersProvider>
                    </AuthProvider>
                </SignalRProvider>
            </AxiosProvider>
        </BrowserRouter>
    </StrictMode>
)