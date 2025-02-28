import React, { useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useChatContext from "../ChatBox/ChatContext/useChatContext";

const ChatBox = () => {
  const { chatHistory, sendMessage } = useChatContext();

  useEffect(() => {
    console.log("🗂️ Chat history updated:", chatHistory);
  }, [chatHistory]);

  const handleSendMessage = (message) => {
    console.log("📤 Sending message:", message);
    sendMessage(message);
  };

  return (
    <div style={styles.chatContainer}>
      {chatHistory.map(({ conversation: { messages } }, index) => (
        <MessageList key={index} messages={messages} />
      ))}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

const styles = {
  chatContainer: {},
};

export default ChatBox;
