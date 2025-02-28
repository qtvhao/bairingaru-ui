import React, { createContext, useState, useEffect } from "react";
import { fetchCorrelationId, getPodcastByCorrelationId } from "../ChatContext/api/fetchCorrelationId";
import { getAll } from "./db/indexedDB"

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadStoredPodcasts = async () => {
      console.log("📥 Loading stored podcasts from DB...");
      const dbEntries = await getAll();
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

  const startPollingPodcastResponse = (correlationId) => {
    console.log(`⏳ Starting polling for correlationId: ${correlationId}`);
    const interval = setInterval(async () => {
      const response = await fetchPodcastResponse(correlationId);
      if (response) {
        clearInterval(interval);
        updateChatHistory(correlationId, response);
      }
    }, 30_000);
  };

  const fetchPodcastResponse = async (correlationId) => {
    console.log(`🔄 Fetching podcast response for correlationId: ${correlationId}`);
    const response = await getPodcastByCorrelationId(correlationId);
    if (response?.choices) {
      console.log(`✅ Response received for correlationId: ${correlationId}`, response);
      return response;
    }
    return null;
  };

  const updateChatHistory = (correlationId, response) => {
    setChatHistory((prevChatHistory) => {
      const updatedChatHistory = prevChatHistory.map((chat) =>
        chat.correlationId === correlationId
          ? {
              ...chat,
              response,
              trimmed: response.choices[0].message.audio.trimmed,
            }
          : chat
      );
      console.log("📝 Updated chat history:", updatedChatHistory);
      return updatedChatHistory;
    });
  };

  const sendMessage = async (text) => {
    console.log(`✉️ Sending message: ${text}`);
    const correlationId = await fetchCorrelationId(text);
    if (correlationId) {
      console.log(`🆔 Received correlationId: ${correlationId}`);
      setChatHistory((prevChatHistory) => {
        const newChatHistory = [
          ...prevChatHistory,
          {
            correlationId, conversation: {
              messages: [
                {
                  text, sender: "You",
                }
              ]
            }
          },
        ];
        console.log("💬 Updated chat history after sending message:", newChatHistory);
        return newChatHistory;
      });
      startPollingPodcastResponse(correlationId);
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
