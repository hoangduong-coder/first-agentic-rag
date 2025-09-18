import { useState } from "react";
import "./App.css";
import axios from "axios";
import type { Messages } from "./types";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import WelcomeCard from "./components/WelcomeCard";

const BASE_URL = "http://localhost:3001";

function App() {
  const [messages, setMessages] = useState<Messages[]>([]);

  const handleSendQuery = async (query: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "human", content: query },
      { role: "ai", content: "" },
    ]);

    try {
      const replyMessage = await axios.post(`${BASE_URL}/api/chat`, { query });

      if (replyMessage.data["answer"]?.trim() !== "") {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "ai",
            content: replyMessage.data["answer"],
          };
          return updatedMessages;
        });
      } else {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "ai",
            content:
              "Some error with the server. Sorry for this inconvenience, we'll fix this as soon as possible!",
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          role: "ai",
          content:
            "Sorry, there was an error connecting to the server. Please try again.",
        };
        return updatedMessages;
      });
    }
  };

  return (
    <div className="body">
      <Sidebar />
      <div className="chat-window">
        {messages.length === 0 ? (
          <WelcomeCard onSend={handleSendQuery} />
        ) : (
          <>
            <ChatWindow messages={messages} />
            <MessageInput onSend={handleSendQuery} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
