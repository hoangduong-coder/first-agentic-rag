import { useState } from "react";
import "./App.css";
import axios from "axios";
import type { Messages } from "./types";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

const BASE_URL = "http://localhost:3001";

function App() {
  const [messages, setMessages] = useState<Messages[]>([]);

  const handleSendQuery = async (query: string) => {
    setMessages(prevMessages => [...prevMessages, { role: "human", content: query }]);

    try {
      const replyMessage = await axios.post(`${BASE_URL}/api/chat`, { query });

      if (replyMessage.data["answer"]?.trim() !== "") {
        setMessages(prevMessages => [...prevMessages, { role: "ai", content: replyMessage.data["answer"] }]);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: "ai",
            content:
              "Some error with the server. Sorry for this inconvenience, we'll fix this as soon as possible!",
          },
        ]);
      }
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: "ai",
          content: "Sorry, there was an error connecting to the server. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="body">
      <Sidebar />
      <div className="chat-window">
        <ChatWindow messages={messages} />
        <MessageInput onSend={handleSendQuery} />
      </div>
    </div>
  );
}

export default App;
