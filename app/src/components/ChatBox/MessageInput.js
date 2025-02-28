import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState("Hãy tạo một kịch bản chi tiết cho một tập podcast về công nghệ AI. Tôi có thể dùng nó làm cơ sở để thu âm và phát triển thành một series dài hơn.");

  const handleSend = () => {
    if (input.trim() !== "") {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div style={styles.inputContainer}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={styles.textarea}
      />
      <button onClick={handleSend} style={styles.button}>
        Send
      </button>
    </div>
  );
};

const styles = {
  inputContainer: {},
  textarea: {},
  button: {},
};

export default MessageInput;