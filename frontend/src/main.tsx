import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AxiosProvider } from './providers/AxiosProvider.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { PostProvider } from './context/PostContext.tsx';
import { UsersProvider } from './context/UsersContext.tsx';
import App from './App.tsx';
import './index.css';
import { SignalRProvider } from './providers/SignalRProvider.tsx';

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