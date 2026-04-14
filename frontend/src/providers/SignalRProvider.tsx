import React, { createContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface SignalRContextType {
    connection: signalR.HubConnection | null;
}

export const SignalRContext = createContext<SignalRContextType | null>(null);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Don't attempt connection without a token
        if (!token) return;
        
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7037/messages", {
                accessTokenFactory: () => token || "",
            })
            .withAutomaticReconnect()
            .build();

        // Start immediately after building
        newConnection
            .start()
            .then(() => {
                console.log("Connected to SignalR");
                setConnection(newConnection); // only expose once connected
            })
            .catch((err) => console.error("SignalR connection failed:", err));

        return () => {
            newConnection.stop();
        };
    }, []);

    return (
        <SignalRContext.Provider value={{ connection }}>
            {children}
        </SignalRContext.Provider>
    );
};