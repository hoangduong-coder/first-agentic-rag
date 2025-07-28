import type { Messages } from "../types";
import MessageCard from "./MessageCard";

const ChatWindow = ({ messages }: { messages: Messages[] }) => {
  return (
    <div className="chat-window-body">
      {messages.map((msg, idx) => (
        <MessageCard key={idx} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
