import type { Messages } from "../types";

const MessageCard = ({ message }: { message: Messages }) => {
  return (
    <div
      className={`${
        message.role === "human" ? "right" : "left"
      }-message-container`}
    >
      <div
        className={`${
          message.role === "human" ? "right" : "left"
        }-message-bubble`}
      >
        {typeof message.content === "string"
          ? message.content
          : "Unfortunately this answer format hasn't been supported! Please try again later!"}
      </div>
    </div>
  );
};

export default MessageCard;
