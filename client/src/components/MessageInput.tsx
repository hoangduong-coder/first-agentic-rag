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
      <div className="message-chat-area">
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
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=send"
          />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
