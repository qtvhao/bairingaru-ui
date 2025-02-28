import { useContext } from "react";
import ChatContext from "./ChatContext";

const useChatContext = () => {
  return useContext(ChatContext);
};

export default useChatContext;
