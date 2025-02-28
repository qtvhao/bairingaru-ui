import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatContext } from "../ChatBox/ChatContext"

const ChatBox = () => {
  const { chatHistory, sendMessage } = useChatContext();

  return (
    <div style={styles.chatContainer}>
      {chatHistory.map((messages, index) => (
        <MessageList key={index} messages={messages} />
      ))}
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

const styles = {
  chatContainer: {},
};

export default ChatBox;
