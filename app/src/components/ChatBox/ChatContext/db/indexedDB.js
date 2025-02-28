import { openDB } from "idb";

const DB_NAME = "chatDB";
const STORE_NAME = "chatHistory";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "correlationId" });
      }
    },
  });
};

export const saveToDB = async (correlationId, prompt, podcastResponse = null) => {
  const db = await initDB();
  const existingEntry = await db.get(STORE_NAME, correlationId);
  await db.put(STORE_NAME, {
    correlationId,
    prompt: prompt || existingEntry?.prompt || null, // Keep the previous prompt if available
    podcastResponse,
  });
};

export const getFromDB = async (prompt) => {
  const db = await initDB();
  const allEntries = await db.getAll(STORE_NAME);
  return allEntries.find((entry) => entry.prompt === prompt)?.correlationId || null;
};

export const getAll = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
