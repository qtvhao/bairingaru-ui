import React, { createContext, useState, useEffect } from "react";
import { fetchCorrelationId, getPodcastByCorrelationId } from "../ChatContext/api/fetchCorrelationId";
import { getFromDB, saveToDB } from "../db/indexedDB";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadStoredPodcasts = async () => {
      const dbEntries = await getFromDB();
      for (const entry of dbEntries) {
        if (!entry.podcastResponse) {
          await getPodcastByCorrelationId(entry.correlationId);
        }
      }
    };
    loadStoredPodcasts();
  }, []);

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
