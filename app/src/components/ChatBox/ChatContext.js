import React, { createContext, useContext, useState } from "react";

const ChatContextProvider = createContext();

const fetchCorrelationId = async (text) => {
  try {
    const response = await fetch("https://http-bairingaru-okane-production-80.schnworks.com/api/podcasts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await response.json();
    return data.correlationId;
  } catch (error) {
    console.error("Error fetching correlationId:", error);
    return null;
  }
};

export const ChatContextWrapper = ({ children }) => {
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
    <ChatContextProvider.Provider value={{ chatHistory, sendMessage }}>
      {children}
    </ChatContextProvider.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContextProvider);
};
