import React, { createContext, useState, useEffect } from "react";
import { fetchCorrelationId, getPodcastByCorrelationId } from "../ChatContext/api/fetchCorrelationId";
import { getFromDB } from "./db/indexedDB"

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadStoredPodcasts = async () => {
      console.log("📥 Loading stored podcasts from DB...");
      const dbEntries = await getFromDB();
      console.log("🔍 Retrieved entries from DB:", dbEntries);
      if (dbEntries) {
        for (const entry of dbEntries) {
          if (!entry.podcastResponse) {
            console.log(`🔍 Checking podcast response for correlationId: ${entry.correlationId}`, entry);
            await getPodcastByCorrelationId(entry.correlationId);
          }
        }
      }
    };
    loadStoredPodcasts();
  }, []);

  const checkPodcastResponse = async (correlationId) => {
    console.log(`⏳ Starting interval check for correlationId: ${correlationId}`);
    const interval = setInterval(async () => {
      const response = await getPodcastByCorrelationId(correlationId);
      console.log(`📩 Received response for correlationId ${correlationId}:`, response);
      if (response?.choices) {
        console.log(`✅ Stopping interval for correlationId: ${correlationId} as choices exist`, response);
        clearInterval(interval);
        setChatHistory((prevChatHistory) => {
          const updatedChatHistory = prevChatHistory.map((chat) =>
            chat.correlationId === correlationId
              ? { ...chat, response }
              : chat
          );
          console.log("📝 Updated chat history:", updatedChatHistory);
          return updatedChatHistory;
        });
      }
    }, 3000);
  };

  const sendMessage = async (text) => {
    console.log(`✉️ Sending message: ${text}`);
    const correlationId = await fetchCorrelationId(text);
    if (correlationId) {
      console.log(`🆔 Received correlationId: ${correlationId}`);
      setChatHistory((prevChatHistory) => {
        const newChatHistory = [
          ...prevChatHistory,
          { text, sender: "You", correlationId },
        ];
        console.log("💬 Updated chat history after sending message:", newChatHistory);
        return newChatHistory;
      });
      checkPodcastResponse(correlationId);
    } else {
      console.warn("⚠️ Failed to retrieve correlationId", { text });
    }
  };

  return (
    <ChatContext.Provider value={{ chatHistory, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
