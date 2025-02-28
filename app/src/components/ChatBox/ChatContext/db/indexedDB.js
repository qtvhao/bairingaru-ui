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

export const saveToDB = async (correlationId, prompt) => {
  const db = await initDB();
  await db.put(STORE_NAME, { correlationId, prompt });
};

export const getFromDB = async (prompt) => {
  const db = await initDB();
  const allEntries = await db.getAll(STORE_NAME);
  return allEntries.find((entry) => entry.prompt === prompt)?.correlationId || null;
};
