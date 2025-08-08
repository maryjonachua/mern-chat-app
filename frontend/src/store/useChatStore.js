import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  allMessages: [],
  unreadCounter: 0,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  fetchAllMessages: async () => {
    try {
      const { users } = get();
      const messageResponses = await Promise.all(users.map((user) => axiosInstance.get(`/message/${user._id}`)));

      const allMessages = messageResponses.flatMap((res) => res.data);

      set({ allMessages });
      get().calculateUnreadCounter();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  markMessagesAsRead: async (senderId) => {
    const { authUser } = useAuthStore.getState();
    try {
      await axiosInstance.patch(`/message/read-by-user/${senderId}`);

      // Optimistically update Zustand state
      const updatedMessages = get().allMessages.map((msg) =>
        msg.senderId === senderId && msg.receiverId === authUser._id ? { ...msg, isRead: true } : msg
      );

      set({ allMessages: updatedMessages });
      get().calculateUnreadCounter();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    }
  },

  calculateUnreadCounter: () => {
    const { allMessages } = get();
    const { authUser } = useAuthStore.getState();
    const count = allMessages.filter((msg) => msg.receiverId === authUser._id && !msg.isRead).length;
    set({ unreadCounter: count });
  },

  subscribeToMessages: () => {
    const { selectedUser, allMessages } = get();

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set({
        allMessages: [...get().allMessages, newMessage],
      });

      get().calculateUnreadCounter();

      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setUnreadCounter: (unreadCounter) => set({ unreadCounter }),
}));
