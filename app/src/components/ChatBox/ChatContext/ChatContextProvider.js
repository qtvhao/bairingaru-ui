import React, { createContext, useState, useEffect } from "react";
import { fetchCorrelationId, getPodcastByCorrelationId } from "../ChatContext/api/fetchCorrelationId";
import { getAll } from "./db/indexedDB";
import { pollPodcastResponse } from "./api/pollPodcastResponse";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadSavedPodcasts = async () => {
      console.log("📥 Loading saved podcasts from DB...");
      const dbEntries = await getAll();
      console.log("🔍 Retrieved entries from DB:", dbEntries);
      if (dbEntries) {
        for (const entry of dbEntries) {
          appendNewMessage(entry.correlationId, "Retrieving saved podcast response...");
          if (entry.podcastResponse) {
            console.log(`✅ Found podcast response for correlationId: ${entry.correlationId}`, entry);
            updateChatHistory(entry.correlationId, entry.podcastResponse);
          } else {
            console.log(`🔍 Checking podcast response for correlationId: ${entry.correlationId}`, entry);
            await getPodcastByCorrelationId(entry.correlationId);
          }
        }
      }
    };
    loadSavedPodcasts();
  }, []);

  const updateChatHistory = (correlationId, response) => {
    setChatHistory((prevChatHistory) => {
      const updatedChatHistory = prevChatHistory.map((chat) =>
        chat.correlationId === correlationId
          ? {
              ...chat,
              conversation: {
                messages: [
                  ...chat.conversation.messages,
                  ...response.choices[0].message.audio.trimmed.map(trim => {
                    return {
                      text: trim.original,
                      sender: "System",
                    }
                  })
                ]
              },
              response,
              trimmed: response.choices[0].message.audio.trimmed,
            }
          : chat
      );
      console.log("📝 Chat history updated:", updatedChatHistory);
      return updatedChatHistory;
    });
  };

  const appendNewMessage = (correlationId, text) => {
    setChatHistory((prevChatHistory) => {
      const newChatHistory = [
        ...prevChatHistory,
        {
          correlationId,
          conversation: {
            messages: [
              {
                text,
                sender: "You",
              },
            ],
          },
        },
      ];
      console.log("💬 Chat history updated after sending message:", newChatHistory);
      return newChatHistory;
    });
  };

  const fetchAndStoreCorrelationId = async (text) => {
    console.log(`✉️ Sending message: ${text}`);
    const correlationId = await fetchCorrelationId(text);
    if (correlationId) {
      console.log(`🆔 Received correlationId: ${correlationId}`);
      appendNewMessage(correlationId, text);
      return correlationId;
    } else {
      console.warn("⚠️ Failed to retrieve correlationId", { text });
      return null;
    }
  };

  const sendMessage = async (text) => {
    const correlationId = await fetchAndStoreCorrelationId(text);
    if (correlationId) {
      pollPodcastResponse(correlationId).then(response => {
        updateChatHistory(correlationId, response);
      });
    }
  };

  return (
    <ChatContext.Provider value={{ chatHistory, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
