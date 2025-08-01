import { useState, type KeyboardEvent } from "react";

const MessageInput = ({ onSend }: { onSend: (query: string) => void }) => {
  const [text, setText] = useState("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="message-input-container">
        <input
          placeholder="Type your message here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="message-input-body"
        />
        <button
          className="button"
          onClick={() => {
            if (text.trim()) {
              onSend(text);
              setText("");
            }
          }}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
    </div>
  );
};

export default MessageInput;
