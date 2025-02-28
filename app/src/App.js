import React from "react";
import { ChatContextProvider } from "./components/ChatBox/ChatContext/ChatContextProvider";
import { ChatBox } from "./components/ChatBox";

function App() {
  return (
    <ChatContextProvider>
      <ChatBox />
    </ChatContextProvider>
  );
}

export default App;
