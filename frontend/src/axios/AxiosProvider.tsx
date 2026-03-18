import React, { createContext, useMemo, useEffect } from "react";
import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Paths from "../routes/paths";

export const AxiosContext = createContext<{ axiosInstance: AxiosInstance } | undefined>(undefined);

export const AxiosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: "https://localhost:7037/api",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }, []);

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            navigate(Paths.error.unauthorized);
                            break;
                        case 403:
                            navigate(Paths.error.forbidden);
                            break;
                        case 500:
                            navigate(Paths.error.internal_server_error);
                            break;
                    }
                }
                return Promise.reject(error);
            }
        );

        // cleanup (VERY important)
        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [axiosInstance, navigate]);

    return (
        <AxiosContext.Provider value={{ axiosInstance }}>
            {children}
        </AxiosContext.Provider>
    );
};