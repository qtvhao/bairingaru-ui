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
      const responsePodcast = data.choices ? data : null;
      await saveToDB(data.correlationId, text, responsePodcast);
      return data.correlationId;
    }
    return null;
  } catch (error) {
    console.error("Error fetching correlationId:", error);
    return null;
  }
};

export const getPodcastByCorrelationId = async (correlationId) => {
  try {
    const cachedPodcast = await getFromDB(correlationId);
    if (cachedPodcast) return cachedPodcast;

    const response = await fetch(`${API_URL}/${correlationId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch podcast: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.choices) {
      await saveToDB(correlationId, null, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching podcast by correlationId:", error);
    return null;
  }
};
