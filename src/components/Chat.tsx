import { Button, Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import supabase from "../supabaseClient";

const Chat: React.FC<{ channel: any; username: string }> = ({
  channel,
  username,
}) => {
  const [messages, setMessages] = useState<
    Array<{ username: string; content: string }>
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const { error }: any = await supabase.channel("game-room").send({
      type: "broadcast",
      event: "new-message",
      payload: {
        username,
        content: newMessage,
      },
    });

    if (error) console.error("Errore nell'invio del messaggio:", error);

    setNewMessage("");
  };

  useEffect(() => {
    channel.on("broadcast", { event: "new-message" }, (payload: any) => {
      const { username, content } = payload.payload;
      setMessages((prevMessages) => [...prevMessages, { username, content }]);
    });
  }, []);

  return (
    <Draggable>
      <div style={{ position: "absolute", width: "25%" }}>
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            height: "300px",
            overflow: "scroll",
            overflowX: "hidden",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}</strong>: {msg.content}
            </div>
          ))}
        </div>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write message"
          sx={{ marginTop: "8px" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} sx={{ width: "100%", marginTop: "8px" }}>
          Send
        </Button>
      </div>
    </Draggable>
  );
};

export default Chat;
