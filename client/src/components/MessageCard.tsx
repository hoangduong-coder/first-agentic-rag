import ReactMarkdown from "react-markdown";
import type { Messages } from "../types";

const MessageCard = ({ message }: { message: Messages }) => {
  return (
    <div
      className={`${
        message.role === "human" ? "right" : "left"
      }-message-container`}
    >
      {message.role === "human" ? (
        <div className="right-message-bubble">
          {message.content as string}
        </div>
      ) : (
        <div className="left-message-bubble">
          <ReactMarkdown>
            {typeof message.content === "string"
              ? message.content
              : "Unfortunately this answer format hasn't been supported! Please try again later!"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MessageCard;
