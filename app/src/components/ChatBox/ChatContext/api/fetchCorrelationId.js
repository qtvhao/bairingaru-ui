import { getFromDB, saveToDB } from "../db/indexedDB";

const API_URL = "https://http-bairingaru-okane-production-80.schnworks.com/api/podcasts";

export const fetchCorrelationId = async (text) => {
  try {
    const existingCorrelationId = await getFromDB(text);
    if (existingCorrelationId) return existingCorrelationId;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text, language: "vi" }),
    });

    const data = await response.json();
    if (data.correlationId) {
      await saveToDB(data.correlationId, text);
    }
    return data.correlationId;
  } catch (error) {
    console.error("Error fetching correlationId:", error);
    return null;
  }
};
