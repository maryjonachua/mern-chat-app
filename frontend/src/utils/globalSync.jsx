// GlobalSync.tsx
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const GlobalSync = () => {
  const { fetchAllMessages, calculateUnreadCounter, subscribeToMessages, unsubscribeFromMessages, getUsers } = useChatStore();

  useEffect(() => {
    const initSync = async () => {
      await getUsers();
      await fetchAllMessages();
      calculateUnreadCounter();
      subscribeToMessages();
    };
    initSync();

    return () => unsubscribeFromMessages();
  }, []);

  return null;
};

export default GlobalSync;
