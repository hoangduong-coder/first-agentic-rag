import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Messages } from "../types";
import { ThreeDots } from "react-loading-icons";

const MessageCard = ({ message }: { message: Messages }) => {
  const [stopLoading, setStopLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof message.content !== "string") {
      const timer = setTimeout(() => {
        setStopLoading(true);
        setErrorMessage(
          "It tooks too long time to generating the response. Please try again later."
        );
      }, 15000);
      return () => clearTimeout(timer);
    } else if (typeof message.content === "string" && message.content.trim() !== "") {
      setStopLoading(true);
    }

    if (stopLoading && typeof message.content !== "string") {
      setErrorMessage(
        "Unfortunately this answer format hasn't been supported! Please try again later!"
      );
    }
  }, [message]);

  return (
    <div
      className={`${
        message.role === "human" ? "right" : "left"
      }-message-container`}
    >
      {message.role === "human" ? (
        <div className="right-message-bubble">{message.content as string}</div>
      ) : (
        <div className="left-message-bubble">
          {!stopLoading || (typeof message.content === "string" && message.content.trim() === "") ? (
            <ThreeDots fill="#181C23" height={15}/>
          ) : (
            <>
              <ReactMarkdown>
                {typeof message.content === "string"
                  ? message.content
                  : "No answer generated."}
              </ReactMarkdown>
              {errorMessage.trim() !== "" && (
                <div className="left-message-error">
                  <span className="material-symbols-outlined">chat_error</span>
                  <p>{errorMessage}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageCard;
