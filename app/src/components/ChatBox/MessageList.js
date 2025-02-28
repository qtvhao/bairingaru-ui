import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div style={styles.chatBox}>
      {messages.map((msg, index) => (
        <div key={index} style={styles.message}>
          <strong>{msg.sender}: </strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

const styles = {
  chatBox: {},
  message: {},
};

export default MessageList;
