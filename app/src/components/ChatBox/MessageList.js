import React from "react";
import Base64AudioPlayer from "../Atoms/Base64AudioPlayer";

const MessageList = ({ messages }) => {
  return (
    <div style={styles.chatBox}>
      {messages.map((msg, index) => (
        <div key={index} style={styles.message}>
          <strong>{msg.sender}: </strong> {msg.text}
          {typeof msg.audioBase64 === "string" && (
            <Base64AudioPlayer base64String={msg.audioBase64} />
          )}
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
