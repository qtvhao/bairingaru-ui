import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    setMessages([...messages, { text, sender: "You" }]);
  };

  return (
    <div style={styles.chatContainer}>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

const styles = {
  chatContainer: {},
};

export default ChatBox;
