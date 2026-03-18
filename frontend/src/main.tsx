import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './auth/AuthContext.tsx';
import { AxiosProvider } from './axios/AxiosProvider.tsx';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AxiosProvider>
                    <App />
                </AxiosProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
