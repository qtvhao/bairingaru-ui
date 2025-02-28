import React, { useEffect, useState } from "react";

const Base64AudioPlayer = ({ base64String }) => {
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    if (!base64String) return;

    // Function to convert Base64 to Blob URL
    const base64ToBlobUrl = (base64, mimeType) => {
      const byteCharacters = atob(base64.split(",")[1] || base64); // Handle Data URL and pure Base64
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteNumbers], { type: mimeType });
      return URL.createObjectURL(blob);
    };

    // Convert Base64 AAC to playable Blob URL
    const mimeType = "audio/aac"; // AAC MIME type
    const blobUrl = base64ToBlobUrl(base64String, mimeType);
    setAudioSrc(blobUrl);

    // Cleanup Blob URL when component unmounts
    return () => URL.revokeObjectURL(blobUrl);
  }, [base64String]);

  return (
    <div>
      {audioSrc ? (
        <audio controls src={audioSrc} />
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default Base64AudioPlayer;
