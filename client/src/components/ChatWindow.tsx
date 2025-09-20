import { useEffect, useRef, useState, useCallback } from "react";
import type { Messages } from "../types";
import MessageCard from "./MessageCard";

const ChatWindow = ({ messages }: { messages: Messages[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isOverflowing = container.scrollHeight > container.clientHeight;
      const notAtBottom = container.scrollTop + container.clientHeight < container.scrollHeight;
      setCanScrollDown(isOverflowing && notAtBottom);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(checkScrollPosition, 100);
  }, [checkScrollPosition]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition]);

  return (
    <div className="chat-window-body" ref={chatContainerRef}>
      {messages.map((msg, idx) => (
        <MessageCard key={idx} message={msg} onTextChange={checkScrollPosition} />
      ))}
      {canScrollDown && (
        <button
          className="button"
          onClick={scrollToBottom}
        >
          <span className="material-symbols-outlined">
            keyboard_double_arrow_down
          </span>
        </button>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
