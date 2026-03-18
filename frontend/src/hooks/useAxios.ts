
import { type AxiosInstance } from "axios";
import { useContext } from "react";
import { AxiosContext } from "../axios/AxiosProvider";

export const useAxios = (): AxiosInstance => {

    const context = useContext(AxiosContext);
    if (!context) {
        throw new Error("useAxios must be used within an AxiosProvider");
    }
    return context.axiosInstance;
};