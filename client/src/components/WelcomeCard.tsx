import { useState, type KeyboardEvent } from "react";

const WelcomeCard = ({ onSend }: { onSend: (query: string) => void }) => {
  const [initialMessage, setInitialMessage] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && initialMessage.trim()) {
      onSend(initialMessage);
      setInitialMessage("");
    }
  };
  return (
    <div className="welcome-card">
      <h2>Welcome! What's on your mind today?</h2>
      <div className="welcome-card-message-container">
        <input
          placeholder="Type your message here"
          value={initialMessage}
          onChange={(e) => setInitialMessage(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="message-inputbox"
        />
        <div className="welcome-card-message-button">
          {initialMessage.trim() != "" && (
            <button
              className="button"
              onClick={() => {
                if (initialMessage.trim()) {
                  onSend(initialMessage);
                  setInitialMessage("");
                }
              }}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
