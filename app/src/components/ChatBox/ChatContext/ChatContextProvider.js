import React, { createContext, useState } from "react";
import { fetchCorrelationId } from "../api/fetchCorrelationId";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async (text) => {
    const correlationId = await fetchCorrelationId(text);
    if (correlationId) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text, sender: "You", correlationId },
      ]);
    }
  };

  return (
    <ChatContext.Provider value={{ chatHistory, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
