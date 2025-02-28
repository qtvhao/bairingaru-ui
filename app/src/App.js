import React from "react";
import { ChatContextWrapper } from "./components/ChatBox/ChatContext"
import ChatBox from "./components/ChatBox/ChatBox"

const App = () => {
  return (
    <ChatContextWrapper>
      <ChatBox />
    </ChatContextWrapper>
  );
};

export default App;
