import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AxiosProvider } from './axios/AxiosProvider.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { PostProvider } from './context/PostContext.tsx';
import { UserProvider } from './context/UserContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AxiosProvider>
                <AuthProvider>
                    <UserProvider>
                        <PostProvider>
                            <App />
                        </PostProvider>
                    </UserProvider>
                </AuthProvider>
            </AxiosProvider>
        </BrowserRouter>
    </StrictMode>
)