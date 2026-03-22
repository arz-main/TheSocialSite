import React, { createContext, useMemo, useEffect } from "react";
import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import paths from "../routes/paths";

export const AxiosContext = createContext<{ axiosInstance: AxiosInstance } | undefined>(undefined);

export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: "http://localhost:5000/api",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }, []);

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            navigate(paths.error.unauthorized);
                            break;
                        case 403:
                            navigate(paths.error.forbidden);
                            break;
                        case 500:
                            navigate(paths.error.internal_server_error);
                            break;
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosInstance, navigate]);

    return (
        <AxiosContext.Provider value={{ axiosInstance }}>
            {children}
        </AxiosContext.Provider>
    );
};