import { getPodcastByCorrelationId } from "../api/fetchCorrelationId"

export const pollPodcastResponse = async (correlationId) => {
  console.log(`⏳ Polling for correlationId: ${correlationId}`);
  const response = await retrievePodcastResponse(correlationId);
  if (response) return response;
  await new Promise(resolve => setTimeout(resolve, 30000));
  return pollPodcastResponse(correlationId);
};

const retrievePodcastResponse = async (correlationId) => {
  console.log(`🔄 Retrieving podcast response for correlationId: ${correlationId}`);
  const response = await getPodcastByCorrelationId(correlationId);
  if (response?.choices) {
    console.log(`✅ Response received for correlationId: ${correlationId}`, response);
    return response;
  }
  return null;
};
