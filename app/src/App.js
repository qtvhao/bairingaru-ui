import React from "react";
import { ChatContextProvider } from "./components/ChatBox/ChatContext/ChatContextProvider";
import { ChatBox } from "./components/ChatBox";
import AppFooter from "./components/AppFooter"

function App() {
  return (
    <ChatContextProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <ChatBox />
        </div>
        <AppFooter />
      </div>
    </ChatContextProvider>
  );
}

export default App;
