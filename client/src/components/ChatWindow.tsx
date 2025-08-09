import { useEffect, useRef } from "react";
import type { Messages } from "../types";
import MessageCard from "./MessageCard";

const ChatWindow = ({ messages }: { messages: Messages[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window-body" ref={messagesEndRef}>
      {messages.map((msg, idx) => (
        <MessageCard key={idx} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
