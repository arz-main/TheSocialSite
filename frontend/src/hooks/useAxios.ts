
import { type AxiosInstance } from "axios";
import { useContext } from "react";
import { AxiosContext } from "../axios/AxiosProvider";

function useAxios(): AxiosInstance {
    const context = useContext(AxiosContext);
    if (!context) {
        throw new Error("useAxios must be used within an AxiosProvider");
    }
    return context.axiosInstance;
};

export default useAxios;