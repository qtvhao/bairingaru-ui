import React, { createContext, useContext, useState } from "react";

const ChatContextProvider = createContext();

export const ChatContextWrapper = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = (text) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      [{ text, sender: "You" }],
    ]);
  };

  return (
    <ChatContextProvider.Provider value={{ chatHistory, sendMessage }}>
      {children}
    </ChatContextProvider.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContextProvider);
};
