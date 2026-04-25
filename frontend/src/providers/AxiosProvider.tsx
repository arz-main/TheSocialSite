import React, { createContext, useMemo, useEffect } from "react";
import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import paths from "../routes/paths";

export const AxiosContext = createContext<{ axiosInstance: AxiosInstance } | undefined>(undefined);
export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const navigateRef = React.useRef(navigate);

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: "http://localhost:5000/api",
            headers: {
                "Content-Type": "application/json",
            },
        });

        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            navigateRef.current(paths.error.unauthorized);
                            break;
                        case 403:
                            navigateRef.current(paths.error.forbidden);
                            break;
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, []);

    return (
        <AxiosContext.Provider value={{ axiosInstance }}>
            {children}
        </AxiosContext.Provider>
    );
};