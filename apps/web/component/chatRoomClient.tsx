"use client";
import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log("parsed Data", parsedData);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <>
      <div>
        {chats.map((m, i) => (
          <div key={i}>{m.message}</div>
        ))}

        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        ></input>
        <button
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              })
            );
            setCurrentMessage("");
          }}
        >
          Send Message
        </button>
      </div>
    </>
  );
}
