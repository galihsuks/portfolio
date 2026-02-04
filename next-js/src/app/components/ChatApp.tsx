"use client";

import { useEffect, useState } from "react";

export default function ChatApp() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS || "");
        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            console.log(event);
        };
    }, []);

    return <div>ini chat</div>;
}
